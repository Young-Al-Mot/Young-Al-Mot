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
const io= require('../yam');

const db = mysql.createConnection({
    host:_secret[2],
    user:_secret[0],
    password:_secret[1],
    database:'yam'
});
db.connect();

exports.ready = app.post('/ready', upload.single(), (req, res) =>{
    let sql = `UPDATE roomuser SET ready=1-ready WHERE user_name=?`;
    let username = req.body.nickname;
    db.query(sql, username, (err, row, field) => {
        if(err) throw err;

        let sql2 = `SELECT * FROM roomuser WHERE user_name=?`;

        db.query(sql2, username, (err2, row2, field2) => {
            if(err2) throw err2;

            let sql3 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
            db.query(sql3,row2[0].room_no,(err3,row3,field3)=>{
                if(err3)throw err3;
                
                io.io.to(row2[0].room_no).emit('join',row3);
                console.log("ready roomno",row2[0].room_no);
                console.log("ready username",username);
                console.log("");
            })
            
            
            return res.json({
                success: true,
                ready: row2[0].ready
            });
        })
    }) 
});