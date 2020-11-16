const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var yam = require('../yam');
var timer = require('./astandsfortimer');
const multer = require('multer');
const upload = multer({ dest: './upload' });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const request = require('request');
const { resolve } = require('path');
const { compileFunction } = require('vm');

const mysql = require('mysql');
const { SSL_OP_EPHEMERAL_RSA } = require('constants');
const _secret = fs.readFileSync('./secret.txt', 'utf8').split(" ");
const db = mysql.createConnection({
    host: _secret[2],
    user: _secret[0],
    password: _secret[1],
    database: 'yam'
});
db.connect();

var standdictionary = function (roomno, word, username) {//방 번호, 단어, 닉네임
    //api 주소로 마지막 ko부분을 바꾸면 다른 언어로 호환 가능

    let link = "https://api.dictionaryapi.dev/api/v2/entries/en/";
    let result = false; //정답여부

    //get방식으로 결과를 받고 2초이상 서버의 응답이 없을 경우 타임아웃 에러
    const options = {
        uri: link + word,
        method: "GET",
        timeout: 2000,
        followrRedirect: true,
        maxRedirects: 10,
    };

    function f() {
        return new Promise(resolve => {
            let sqlwordfind = `SELECT * FROM dict WHERE word=?`;//dict에 word가 있는지 우선 참조

            db.query(sqlwordfind, word, (errword, dict, fields) => {
                if (errword) throw errword;

                if (dict[0]) {//있을경우 바로 true를 리턴
                    console.log("db reference")
                    console.log("word is exist");
                    result = true;
                    resolve(result);
                }
                else {//없을경우 인터넷 참조
                    console.log("internet reference")
                    request(options, function (err, response, resultset) {
                        //에러 발생시
                        if (err != null) {

                        }

                        //meanings가 없으면 단어가 없는 것이므로 meanings를 찾는다
                        let wexist = resultset.indexOf('meanings');
                        if (wexist != -1) {
                            console.log("word is exist");
                            result = true;
                            //db에 없는 단어 추가
                            let sqlwordinsert = 'INSERT INTO dict(word) VALUES(?)';
                            db.query(sqlwordinsert, word, (errwin, wresult, fields) => {
                                if (errwin) {
                                    resolve(false);
                                }
                            })
                        }
                        else {//단어가없음
                            console.log("word is not exist");
                            result = false;
                        }
                        resolve(result);
                    });
                }
            })
        })
    }

    f().then(function (result) {
        console.log(result);
        if (result) { //사전에 있는 단어, 성공
            //중복단어 테이블에 insert
            let sql = `INSERT INTO userword VALUES(?,?,?)`;
            let li = [username, word, roomno];
            db.query(sql, li, (err) => {
                if (err) throw err;
            })

            sql = `UPDATE roomuser SET score=score+? WHERE user_name=?`;
            li = [word.length * 5, username];
            db.query(sql, li, (err) => {
                if (err) throw err;

                sql = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
                db.query(sql, roomno, (err, row, f) => {
                    if (err) throw err;

                    yam.io.to(roomno).emit('join', row);
                })

                sql = `SELECT * FROM roomuser  WHERE room_no=? ORDER BY intime ASC`;
                db.query(sql, roomno, (err, row, f) => {
                    if (err) throw err;

                    //맞춘 단어, 다음순서, 1(성공), 유저정보
                    yam.io.to(roomno).emit('standanswer', word, 1, username);
                    yam.io.to(roomno).emit('join', row);
                })
            })
        }
        else { //사전에 없는 단어, 실패 -> 닉네임, 단어, 0(실패)
            yam.io.to(roomno).emit('standanswer', word, 0, username);
        }
    });
}
exports.standdictionary = standdictionary;