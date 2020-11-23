const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

const multer = require('multer');
const upload = multer({ dest: './upload' });

const _secret = fs.readFileSync('./secret.txt', 'utf8').split(" ");

const db = mysql.createConnection({
    host: _secret[2],
    user: _secret[0],
    password: _secret[1],
    database: 'yam'
});
db.connect();

var yam = require('../yam');

exports.roomnumber = app.post('/roomnumber', upload.single(), (req, res) => {
    let sql = `SELECT * FROM user WHERE user_id=?`;
    let roomname = req.body.title;
    let password = req.body.password;
    let gamename = req.body.gametype;
    let maxplayer = req.body.peoplemaxnum;
    let round = req.body.maxround;
    let userid = req.body.userid;
    let count = req.body.count;
    if (password == "") password = null;

    db.query(sql, userid, (err, r, f) => {
        if(err) throw err;

        let sql2 = `SELECT * FROM roomuser WHERE user_name=?`;
        db.query(sql2, r[0].user_name, (err2, r2, f2) => {
            if(err2) throw err2;

            if(r2[0]){
                return res.status(400).json({
                    error: 6//이미 게임중인 아이디입니다
                });
            }
            else{
                let sql3 = `SELECT * FROM roomlist WHERE nowplayer=0`;
                db.query(sql3, [], (err3, rows, fields) => {
                    if (err3) throw err3;

                    if (rows[0]) {
                        let sql4 = `UPDATE roomlist SET room_name=?, password=?, game_name=?, nowplayer=1, maxplayer=?, round=?, createtime=now(), state=0 WHERE room_no=?`;
                        let list = [roomname, password, gamename, maxplayer, round, rows[0].room_no];
                        db.query(sql4, list, (err4) => {
                            if (err4) throw err4;

                            let sql5 = `SELECT * FROM user WHERE user_id=?`;
                            db.query(sql5, userid, (err5, row, field) => {
                                if (err5) throw err5;

                                let sql6 = `INSERT INTO roomuser VALUES (?,?,?,?,?,?,now())`;
                                db.query(sql6, [row[0].user_no, row[0].user_name, rows[0].room_no, 1, 0, 0], (err6) => {
                                    if (err6) throw err6;

                                    yam.maxround[rows[0].room_no] = round;
                                    if(gamename == '끝말잇기'){
                                        yam.MT[rows[0].room_no] = count;
                                    }
        
                                    return res.json({
                                        success: true,
                                        roomnum: rows[0].room_no
                                    });
                                })
                            })
                        })
                    }
                })
            }
        })
    })
});