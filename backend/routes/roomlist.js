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
    user:'nodejs',
    password:'0000',
    database:'yam'
});
db.connect();

exports.roomlist = app.post('/roomlist', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM roomlist WHERE nowplayer > 0`;

    db.query(sql, [], (err, rows, fields) => {
        if(err) throw err;
        
        return res.json({
            success: true,
            list: rows
        });
    })
});