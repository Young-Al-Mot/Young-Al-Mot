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

const _secret = fs.readFileSync('./secret.txt','utf8').split(" ");

const db = mysql.createConnection({
    host:_secret[2],
    user:_secret[0],
    password:_secret[1],
    database:'yam'
});
db.connect();

exports.create = app.post('/user_create', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM user WHERE user_id=?`;
    let id = req.body.userid;
    let password = req.body.password;
    let name = req.body.nickname;
    let list = [id];
    db.query(sql, list, (err, idrows, fields) => {
        if(err) throw err;

        if(idrows[0]){
           return res.status(400).json({
               error: 0//이미 존재하는 아이디입니다
            });
        }
        else{
            sql = `SELECT * FROM user WHERE user_name=?`;
            list = [name];
            db.query(sql, list, (err2, namerows, fields) => {
                if(err2) throw err2;

                if(namerows[0]){
                    return res.status(400).json({
                        error: 1//이미 존재하는 닉네임입니다
                    });
                }
                else{
                    sql = `INSERT INTO user(user_id, password, user_name) VALUES(?,?,?)`;
                    list = [id, password, name];

                    db.query(sql, list, (err4) => {
                        if(err4) throw err4;

                        res.json({success: true});
                    }) //sign up
                }
            }) //namerows end
        }
    }) //idrows end
});