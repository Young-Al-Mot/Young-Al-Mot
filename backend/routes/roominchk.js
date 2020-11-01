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
    //let user_name = req.body.username; 프론트에서 닉네임 넘어와야함
    let user_name = 'aa';
    
    db.query(sql, roomno, (err, rows, fields) => {
        if(err) throw err;

        if(rows[0].password == null || password == rows[0].password){
            if(rows[0].nowplayer == rows[0].maxplayer){
                return res.status(400).json({
                    error: 4//방이 가득찼습니다
                 });
            }
            else{
                let sql2 = `UPDATE roomlist SET nowplayer=nowplayer+1 WHERE room_no=?`;

                db.query(sql2, roomno, (err2, rows2, fields2) =>{
                    if(err2) throw err2;
                })

                let sql3 = `SELECT * FROM user WHERE user_name=?`;
                db.query(sql3, user_name, (err3, row, field) => {
                    if(err3) throw err3;

                    let sql4 = `INSERT INTO roomuser VALUES (?,?)`;
                    db.query(sql4, [row[0].user_no, roomno], (err4, r, f) => {
                        if(err4) throw err4;
                    })
                })
                return res.json({ success: true });
            }
        }
        else return res.status(400).json({
            error: 5//방 비밀번호가 일치하지 않습니다
         });
    })
});