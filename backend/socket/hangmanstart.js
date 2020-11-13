const fs = require('fs');
const mysql = require('mysql');
const { deepEqual } = require('assert');
const { start } = require('repl');
const _secret = fs.readFileSync('./secret.txt', 'utf8').split(" ");
const db = mysql.createConnection({
    host: _secret[2],
    user: _secret[0],
    password: _secret[1],
    database: 'yam'
});
db.connect();

var yam = require('../yam');

var hangmanstart = function (roomno) {
    //게임시작하면 roomlist에 안보이게
    yam.roomuserlist[roomno].splice(0, yam.roomuserlist[roomno].length);
    yam.roomuseridx[roomno] = 0;
    yam.round[roomno] = 1;
    let sql = `UPDATE roomlist SET state=1 WHERE room_no=?`;
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

        //시작단어 랜덤, 현재 12개
        var num = Math.floor(Math.random() * 12);
        let sql3 = `SELECT * FROM words`;
        db.query(sql3, yam.maxround[roomno], (err2, row2, f2) => {
            if (err2) throw err2;
            yam.nowword[roomno] = row2[num].word; //라운드 단어

            let sql4 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
            db.query(sql4, roomno, (err4, row4, f4) => {
                if (err4) throw err4;

                //시작하는사람닉네임, 라운드 단어, 라운드
                yam.io.to(roomno).emit('hangstart', row[0].user_name, row2[num].word, yam.round[roomno]);
            })
        })
    })
}
exports.hangmanstart = hangmanstart;