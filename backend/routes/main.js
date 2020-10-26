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

exports.main = app.post('/loginchk', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM user WHERE user_id=?`;
    let id = req.body.userid;
    let password = req.body.password;
    let list = [id];
    db.query(sql, list, (err, rows, fields) => {
        if(err) throw err;

        if(!rows[0]){
           return res.status(400).json({
               error: "id doesn't exist."
            });
        }
        else{
            if(password != rows[0].password){
                return res.status(400).json({
                    error: "the password is incorrect."
                 });
            }
            else{
                res.json({
                    success: true,
                    nickname: rows[0].user_name
                });
            }
        }
    })
});