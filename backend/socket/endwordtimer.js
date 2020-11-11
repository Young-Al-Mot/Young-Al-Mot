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

const timer = (roomno) => {
    var t = -1;
    //경과시간 메시지 (나중에 emit는 지울거)
    t++;
    yam.io.to(roomno).emit('gametime', 5 - t);
    console.log("timer", 5 - t);
    var ontime = setInterval(() => {
        t++;
        yam.io.to(roomno).emit('gametime', 5 - t);
        console.log("timer", 5 - t);

        if (t == 5) {
            //시간초과 이벤트 발생, 발생 할때마다 chatting 테이블 초기화
            let sql = `DELETE FROM chatting WHERE room_no=?`;
            db.query(sql, roomno, (err) => {
                if (err) throw err;
            })

            console.log('listsize: ' + yam.L[roomno].length);
            if (yam.L[roomno].length > 0 && yam.L[roomno][0] == ontime) { //돌아가는 시간이 있고, 시간발생 변수가 같으면 시간초과
                yam.io.to(roomno).emit('gametime', 0);
                //yam.round[roomno] == yam.startword[roomno].length - 1이면 게임 끝, 아니면 다음 라운드
                if (yam.round[roomno] == yam.startword[roomno].length - 1) {
                    //게임 끝, roomuser 정보를 점수 순으로 gameend 이벤트 보냄
                    let sql2 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY score DESC`;
                    db.query(sql2, roomno, (err2, row, f) => {
                        if (err2) throw err2;

                        yam.io.to(roomno).emit('gameend', row);
                    })
                }
                else {
                    //라운드 끝, 차례는 그대로, 다음 인덱스
                    yam.round[roomno]++;
                    yam.nowword[roomno] = yam.startword[roomno][yam.round[roomno]];
                    //gamestart이벤트 -> 시작하는 사람 닉네임, 시작 단어, 라운드
                    yam.io.to(roomno).emit('gamestart', yam.roomuserlist[roomno][yam.roomuseridx[roomno]], yam.startword[roomno], yam.round[roomno]);
                    
                    var nexttime = 0;
                    var nextwait = setInterval(() => {
                        nexttime++;
                        if(nexttime == 4){
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
        }
    }, 1000);
    yam.L[roomno].push(ontime);
}
exports.T = timer;