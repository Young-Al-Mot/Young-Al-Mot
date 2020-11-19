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
const { json } = require('express');
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
    let sql = `UPDATE user SET login=0 WHERE user_id=?`;
    let id = req.body.userid;
    let list = [id];
    db.query(sql, list, (err) => {
        if(err) throw err;

        return res.json({ success: true });
    })
});