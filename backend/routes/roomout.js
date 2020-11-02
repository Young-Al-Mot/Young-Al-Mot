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

exports.roomout = app.post('/roomout', upload.single(), (req, res) =>{
    let roomno = req.body.roomid;
    let username = req.body.userid;
    let sql = `SELECT * FROM user WHERE user_id=?`;
    
    db.query(sql, username, (err, row, field) => {
        if(err) throw err;
        
        let sql2 = `DELETE FROM roomuser WHERE user_no=?`;

        db.query(sql2, row[0].user_no, (err2, row2, field2) => {
            if(err2) throw err2;
        })

        let sql3 = `SELECT * FROM roomlist WHERE room_no=?`;
        db.query(sql3, roomno, (err2, row2, field2) => {
            if(err2) throw err2;

            if(row2[0].nowplayer > 1){
                let sql4 = `UPDATE roomlist SET nowplayer=nowplayer-1 WHERE room_no=?`;
                db.query(sql4, roomno, (err3, row3, field3) => {
                    if(err3) throw err3;
                })

                let sql5 = `SELECT * FROM roomuser WHERE room_no=?`;
                db.query(sql5, roomno, (err4, row4, field4) => {
                    if(err4) throw err4;

                    let sql6 = `UPDATE roomuser SET master=1 WHERE user_no=?`;
                    db.query(sql6, row4[0].user_no, (err5, row5, field5) => {
                        if(err5) throw err5;
                    })
                })
            }
            else{
                let sql4 = `UPDATE roomlist SET room_name='default', password=null, game_name='default', nowplayer=0, maxplayer=0, state=1 WHERE room_no=?`;
                db.query(sql4, roomno, (err3, row3, field3) => {
                    if(err3) throw err3;
                })
            }
        })
        return res.json({ success: true });
    })
});