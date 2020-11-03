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

const io= require('../yam');


exports.roomout = app.post('/roomout', upload.single(), (req, res) =>{
    let roomno = req.body.roomid;
    let username = req.body.userid;
    let sql = `SELECT * FROM user WHERE user_id=?`;
    
    console.log("roomno",roomno);
    console.log("username",username);
    
    if(username==""){
        return res.status(400).json();
    }

    db.query(sql, username, (err, row, field) => {
        if(err) throw err;
        
        let sql1 = `SELECT * FROM roomuser WHERE user_no=?`;
        db.query(sql1, row[0].user_no, (err2, row2, field2) => {
            if(err2) throw err2;
            if(!row2[0])//아무것도안들엇으면 그냥 리턴해
                return res.status(400).json();
            console.log("row2",row2[0].room_no);
            //이제 클라이언트에서 방번호 안주니까 여기서 꺼내옴
            roomno=row2[0].room_no;

            let sql2 = `DELETE FROM roomuser WHERE user_no=?`;
            db.query(sql2, row[0].user_no, (err2, row2, field2) => {
                if(err2) throw err2;
            })
            console.log("roomno",roomno);
            let sql3 = `SELECT * FROM roomlist WHERE room_no=?`;
            db.query(sql3, roomno, (err2, row2, field2) => {
                if(err2) throw err2;

                if(!row2[0])//아무것도 안들어잇으면 리턴해
                    return res.status(400).json();

                if(row2[0].nowplayer > 1){//다음방장 할당해주는 소스
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
                else{//사람 다나가면 다시 디폴트로 만듬
                    let sql4 = `UPDATE roomlist SET room_name='default', password=null, game_name='default', nowplayer=0, maxplayer=0, state=1 WHERE room_no=?`;
                    db.query(sql4, roomno, (err3, row3, field3) => {
                        if(err3) throw err3;
                    })
                }
            })
        })
        io.io.emit(1,{name:'System',message: username+'님이 방을 나갔습니다'});
        return res.json({ success: true });
    })
});