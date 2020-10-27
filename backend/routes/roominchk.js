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

exports.roominchk = app.post('/roominchk', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM roomlist WHERE room_no=?`;
    let roomno = req.body.roomid;
    let password = req.body.password;
    
    db.query(sql, roomno, (err, rows, fields) => {
        if(err) throw err;

        if(rows[0].password == null || password == rows[0].password){
            return res.json({ success: true });
        }
        else return res.status(400).json({
            error: "the password is incorrect."
         });
    })
});