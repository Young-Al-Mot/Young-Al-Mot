const fs = require('fs');
const mysql = require('mysql');
const { deepEqual } = require('assert');
const { start } = require('repl');
const _secret = fs.readFileSync('./secret.txt', 'utf8').split(" ");
const db = mysql.createConnection({
    host: 'localhost',
    user: _secret[0],
    password: _secret[1],
    database: 'yam'
});
db.connect();

var yam = require('../yam');
var timer = require('./endwordtimer');

var endwordstart = function (roomno) {
    //게임시작하면 roomlist에 안보이게
    yam.roomuserlist[roomno].splice(0, yam.roomuserlist[roomno].length);
    yam.roomuseridx[roomno] = 0;
    yam.round[roomno] = 0;
    let sql = `UPDATE roomlist SET state=1 WHERE room_no=?`;
    db.query(sql, roomno, (err) => {
        if (err) throw err;
    })

    sql = `DELETE FROM chatting WHERE room_no=?`;
    db.query(sql, roomno, (err) => {
        if (err) throw err;
    })

    //게임시작하면 방인원들 레디 없애고 방에 업데이트된거 던져줌
    db.query('UPDATE roomuser SET ready=0, score=0 WHERE room_no=?', roomno, (err) => {
        if (err) throw err;
        let sql2 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
        db.query(sql2, roomno, (err, row, field) => {
            if (err) throw err;

            for (var i = 0; i < row.length; i++) {
                yam.roomuserlist[roomno].push(row[i].user_name);
                console.log(yam.roomuserlist[roomno][i]);
            }

            //io.to.emit
            yam.io.to(roomno).emit('join', row);
        })
    })

    let sql2 = `SELECT * FROM roomuser WHERE room_no=? and master=1`;
    db.query(sql2, roomno, (err, row, f) => {
        if (err) throw err;

        //시작단어 랜덤, 현재 10개
        var num = Math.floor(Math.random() * 4);
        let sql3 = `SELECT * FROM words WHERE length=?`;
        db.query(sql3, yam.maxround[roomno], (err2, row2, f2) => {
            if (err2) throw err2;
            yam.startword[roomno] = row2[num].word;
            yam.nowword[roomno] = row2[num].word[yam.round[roomno]];

            let sql4 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
            db.query(sql4, roomno, (err4, row4, f4) => {
                if (err4) throw err4;

                //시작하는사람닉네임, 시작단어(전체라운드 단어), 시작단어 인덱스(라운드), 유저정보
                yam.io.to(roomno).emit('gamestart', row[0].user_name, row2[num].word, yam.round[roomno], row4);
            })

            //4초 후에 라운드 시작
            var nexttime = 0;
            var nextwait = setInterval(() => {
                nexttime++;
                console.log(nexttime);
                if (nexttime == 4) {
                    clearInterval(nextwait);
                    yam.W[roomno].shift();
                    timer.T(roomno);
                }
            }, 1000);
            yam.W[roomno].push(nextwait);
        })
    })
}
exports.endwordstart = endwordstart;