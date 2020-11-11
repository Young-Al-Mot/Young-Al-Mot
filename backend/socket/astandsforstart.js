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
var timer = require('./astandsfortimer');

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

var astandsforstart = function (roomno) {
    //게임시작하면 roomlist에 안보이게
    let sql = `UPDATE roomlist SET state=1 WHERE room_no=?`;
    db.query(sql, roomno, (err) => {
        if (err) throw err;
    })

    //유저별 단어 초기화
    sql = `DELETE FROM userword WHERE room_no=?`;
    db.query(sql, roomno, (err) => {
        if (err) throw err;
    })

    //게임시작하면 방인원들 레디 없애고 방에 업데이트된거 던져줌
    db.query('UPDATE roomuser SET ready=0, score=0 WHERE room_no=?', roomno, (err) => {
        if (err) throw err;
        let sql2 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
        db.query(sql2, roomno, (err, row, field) => {
            if (err) throw err;

            //io.to.emit
            yam.io.to(roomno).emit('join', row);
        })
    })

    //시작 알파벳 랜덤, a ~ z 26개
    var num = Math.floor(Math.random() * 26);
    yam.round[roomno] = 1;
    yam.nowword[roomno] = alphabet[num];
    //gamestart -> 시작 알파벳, 라운드
    yam.io.to(roomno).emit('standstart', alphabet[num], yam.round[roomno]);
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
}
exports.astandsforstart = astandsforstart;