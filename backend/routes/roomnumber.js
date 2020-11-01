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

exports.roomnumber = app.post('/roomnumber', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM roomlist WHERE nowplayer=0`;
    let roomname = req.body.title;
    let password = req.body.password;
    let gamename = req.body.gametype;
    let maxplayer = req.body.peoplemaxnum;
    //let user_name = req.body.username; 프론트에서 닉네임 넘어와야함
    let user_name = 'ysys';
    if(password == "") password=null;
    
    db.query(sql, [], (err, rows, fields) => {
        if(err) throw err;
        
        if(rows[0]){
            let sql2 = `UPDATE roomlist SET room_name=?, password=?, game_name=?, nowplayer=1, maxplayer=?, createtime=now() WHERE room_no=?`;
            let list = [roomname, password, gamename, maxplayer, rows[0].room_no];
            db.query(sql2, list, (err2, rows2, fields2) => {
                if(err2) throw err2;
                
                let sql3 = `SELECT * FROM user WHERE user_name=?`;
                db.query(sql3, user_name, (err3, row, field) => {
                    if(err3) throw err3;

                    let sql4 = `INSERT INTO roomuser VALUES (?,?)`;
                    db.query(sql4, [row[0].user_no, rows[0].room_no], (err4, r, f) => {
                        if(err4) throw err4;
                    })
                })

                return res.json({
                    success: true,
                    roomnum: rows[0].room_no
                });
            })
        } 
    })
});