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
    host:'localhost',
    user:_secret[0],
    password:_secret[1],
    database:'yam'
});
db.connect();

exports.ready = app.post('/ready', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM roomuser WHERE user_name=?`;
    let sql2 = `UPDATE roomuser SET ready=1 WHERE user_name=?`;
    let sql3 = `UPDATE roomuser SET ready=0 WHERE user_name=?`;
    let username = req.body.username;
    let roomno = req.body.roomno;
    db.query(sql, list, (err, ready, fields) => {
        if(err) throw err;

        if(ready[0].ready == 0){
            db.query(sql2, username, (err2, row2, field2) => {
                if(err2) throw err2;
            })
            return res.json({
                ready: true
            });
        }
        else{
            db.query(sql3, username, (err3, row3, field3) => {
                if(err3) throw err3;
            })
            return res.json({
                ready: false
            });
        }

    }) 
});