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

const db = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'emost22',
    database:'yam'
});
db.connect();

exports.roomnumber = app.post('/roomnumber', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM roomlist WHERE nowplayer=0`;
    // 프론트에서 와야함
    // let roomname = req.body.roomname;
    // let gamename = req.body.gamename;
    // let maxplayer = req.body.maxplayer;

    db.query(sql, [], (err, rows, fields) => {
        if(err) throw err;
        
        if(rows[0]){
            let sql2 = `UPDATE roomlist SET room_name=?, game_name=?, nowplayer=1, maxplayer=?, createtime=now() WHERE room_no=?`;
            //프론트에서 room_name, game_name, maxplayer 주면 수정
            let list = ['rr', 'game', 8, rows[0].room_no];
            db.query(sql2, list, (err2, rows2, fields2) => {
                if(err2) throw err2;
                
                console.log(rows[0].room_no);
                return res.json({
                    success: true,
                    roomnum: rows[0].room_no
                });
            })
        } 
    })
});