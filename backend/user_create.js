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

var db = mysql.createConnection({
    host:'localhost',
    user:'nodejs',
    password:'0000',
    database:'yam'
});
db.connect();

exports.create = app.post('/user_create', upload.single(), (req, res) =>{
    let sql = `SELECT * FROM user WHERE user_id=?`;
    let id = req.body.userid;
    let password = req.body.password;
    let name = req.body.nickname;
    let email = req.body.email;
    let list = [id];
    db.query(sql, list, (err, idrows, fields) => {
        if(err) throw err;

        if(idrows[0]){
           return res.status(400).json({
               error: "id already exists."
            });
        }
        else{
            sql = `SELECT * FROM user WHERE user_name=?`;
            list = [name];
            db.query(sql, list, (err2, namerows, fields) => {
                if(err2) throw err2;

                if(namerows[0]){
                    return res.status(400).json({
                        error: "name already exists."
                    });
                }
                else{
                    sql = `SELECT * FROM user WHERE email=?`;
                    list = [email];
                    db.query(sql, list, (err3, emailrows, fields) => {
                        if(err3) throw err3;

                        if(emailrows[0]){
                            return res.status(400).json({
                                error: "email already exists."
                            });
                        }
                        else{
                            sql = `INSERT INTO user(user_id, password, user_name, email) VALUES(?,?,?,?)`;
                            list = [id, password, name, email];

                            db.query(sql, list, (err4, result, fields) => {
                                if(err4) throw err4;

                                res.json({success: true});
                            }) //sign up
                        }
                    }) //emailrows end
                }
            }) //namerows end
        }
    }) //idrows end
});