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

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
var yam = require('../yam');

const timer = (roomno) => {
    var t = -1;
    //경과시간 메시지 (나중에 emit는 지울거)
    t++;
    yam.io.to(roomno).emit('standtime', 20 - t);
    console.log("timer", 20 - t);
    var ontime = setInterval(() => {
        t++;
        yam.io.to(roomno).emit('standtime', 20 - t);
        console.log("timer", 20 - t);

        if (t == 20) {
            //시간초과 이벤트 발생, 발생 할때마다 chatting 테이블 초기화
            let sql = `DELETE FROM chatting WHERE room_no=?`;
            db.query(sql, roomno, (err) => {
                if (err) throw err;
            })

            yam.io.to(roomno).emit('standtime', 0);
            //yam.round[roomno] == yam.maxround[roomno]이면 게임 끝, 아니면 다음 라운드
            if (yam.round[roomno] == yam.maxround[roomno]) {
                //게임 끝, roomuser 정보를 점수 순으로 gameend 이벤트 보냄
                let sql2 = `UPDATE roomlist SET state=0 WHERE room_no=?`;
                db.query(sql2, roomno, (err2) => {
                    if (err2) throw err2;
                })

                sql2 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY score DESC`;
                db.query(sql2, roomno, (err2, row, f) => {
                    if (err2) throw err2;

                    yam.io.to(roomno).emit('standend', row);
                    let sql3 = `UPDATE roomuser SET score=0 WHERE room_no=?`;
                    db.query(sql3, roomno, (err3) => {
                        if (err3) throw err3;
                    });
                })
            }
            else {
                //라운드 끝, 다음 알파벳
                yam.round[roomno]++;

                var num = 0;
                while (1) {
                    num = Math.floor(Math.random() * 26);
                    if (yam.nowword[roomno] != alphabet[num]) {
                        break;
                    }
                }
                yam.nowword[roomno] = alphabet[num];
                console.log('이번알파벳: ' + alphabet[num]);

                //gamestart -> 시작 알파벳, 라운드
                yam.io.to(roomno).emit('standstart', alphabet[num], yam.round[roomno]);

                var nexttime = 0;
                var nextwait = setInterval(() => {
                    nexttime++;
                    if (nexttime == 4) {
                        clearInterval(nextwait);
                        yam.W[roomno].shift();
                        timer(roomno);
                    }
                }, 1000);
                yam.W[roomno].push(nextwait);
            }

            clearInterval(ontime);
            yam.L[roomno].shift();
        }
    }, 1000);
    yam.L[roomno].push(ontime);
}
exports.T = timer;