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
const upload = multer({dest: './upload'});

//파일에서 문자열 받아와서 스페이스로나눔
const _secret = fs.readFileSync('./secret.txt','utf8').split(" ");

const db = mysql.createConnection({
    host:_secret[2],
    user:_secret[0],
    password:_secret[1],
    database:'yam'
});
db.connect();

exports.main = app.post('/loginchk', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM user WHERE user_id=?`;
    let id = req.body.userid;
    let password = req.body.password;
    let list = [id];
    db.query(sql, list, (err, rows, fields) => {
        if(err) throw err;

        if(!rows[0]){
           return res.status(400).json({
               error: 3//존재하지않는 아이디입니다
            });
        }
        else{
            if(password != rows[0].password){
                return res.status(400).json({
                    error: 3//패스워드가 틀렸습니다
                });
            }
            else{
                if(rows[0].login==1){
                    return res.status(400).json({
                        error: 6//이미 접속 중인 아이디입니다
                    });
                }
                else{
                    let sql2 = `UPDATE user SET login=1 WHERE user_id=?`;
                    db.query(sql2, list, (err2) => {
                        if(err2) throw err2;
                    })

                    res.json({
                        success: true,
                        nickname: rows[0].user_name
                    });
                }
            }
        }
    })
});