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
    let userid = req.body.userid;
    console.log("roominchk userid",userid);
    console.log("roominchk roomno",roomno);
    console.log("");
    
    
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

                let sql3 = `SELECT * FROM user WHERE user_id=?`;
                db.query(sql3, userid, (err3, row, field) => {
                    if(err3) throw err3;

                    let sql4 = `INSERT INTO roomuser VALUES (?,?,?,?,?,?,now())`;
                    db.query(sql4, [row[0].user_no, row[0].user_name, rows[0].room_no, 0, 0, 0], (err4, r, f) => {
                        if(err4) throw err4;
                    })

                    if(rows[0].game_name == '십자말풀이'){

                    }
                    else if(rows[0].game_name == '끝말잇기'){
                        let sql5 = `INSERT INTO endword VALUES (?,?,0)`;
                        let list = [row[0].user_name, roomno];
                        db.query(sql5, list, (err5, r, f) => {
                            if(err5) throw err5;
                        })
                    }
                    else{

                    }

                    return res.json({ success: true, roominfo:rows[0] });
                })
            }
        }
        else return res.status(400).json({
            error: 5//방 비밀번호가 일치하지 않습니다
         });
    })
});