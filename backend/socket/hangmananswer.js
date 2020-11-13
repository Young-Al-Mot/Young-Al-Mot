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

var hangmananswer = function (roomno, msg, username) {
    //알파벳 하나 or 단어 채팅으로 입력 -> answer로 받음
    //중복 or 없는 알파벳 or 단어 틀림 -> 목숨 차감
    //목숨 == max목숨 -> 게임 끝(실패)
    //단어 맞추면 -> 게임 끝(성공)

    //다음 순서
    let len = yam.roomuserlist[roomno].length;
    yam.roomuseridx[roomno] = (yam.roomuseridx[roomno] + 1) % len;

    if (msg.length > 1) { //단어 입력 시
        if (yam.nowword[roomno] == msg) { //정답(+20)
            let sql = `UPDATE roomuser SET score=score+20 WHERE user_name=?`;
            db.query(sql, username, (err) => {
                if (err) throw err;
            })

            if (yam.round[roomno] == yam.maxround[roomno]) {
                //게임 끝, roomuser 정보를 점수 순으로 gameend 이벤트 보냄
                let sql2 = `UPDATE roomlist SET state=0 WHERE room_no=?`;
                db.query(sql2, roomno, (err2) => {
                    if (err2) throw err2;
                })

                sql2 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY score DESC`;
                db.query(sql2, roomno, (err2, row, f) => {
                    if (err2) throw err2;

                    yam.io.to(roomno).emit('hangend', row);
                    let sql3 = `UPDATE roomuser SET score=0 WHERE room_no=?`;
                    db.query(sql3, roomno, (err3) => {
                        if (err3) throw err3;
                    });
                })
            }
            else { //다음 라운드
                //라운드 끝, 다음 차례, 다음 인덱스
                yam.round[roomno]++;
                
                //시작단어 랜덤, 현재 12개
                var num = Math.floor(Math.random() * 12);
                let sql2 = `SELECT * FROM words`;
                db.query(sql2, yam.maxround[roomno], (err2, row, f2) => {
                    if (err2) throw err2;
                    yam.nowword[roomno] = row[num].word; //라운드 단어

                    //시작하는사람닉네임, 라운드 단어, 라운드
                    yam.io.to(roomno).emit('hangstart', yam.roomuserlist[roomno][yam.roomuseridx[roomno]], row[num].word, yam.round[roomno]);
                })
            }
        }
        else { //오답
            yam.nowlife[roomno]--; //목숨 차감

            if (!yam.nowlife[roomno]) { //목숨0, 라운드 끝
                if (yam.round[roomno] == yam.maxround[roomno]) {
                    //게임 끝, roomuser 정보를 점수 순으로 gameend 이벤트 보냄
                    let sql = `UPDATE roomlist SET state=0 WHERE room_no=?`;
                    db.query(sql, roomno, (err) => {
                        if (err) throw err;
                    })

                    sql = `SELECT * FROM roomuser WHERE room_no=? ORDER BY score DESC`;
                    db.query(sql, roomno, (err, row, f) => {
                        if (err) throw err;

                        yam.io.to(roomno).emit('hangend', row);
                        let sql2 = `UPDATE roomuser SET score=0 WHERE room_no=?`;
                        db.query(sql2, roomno, (err2) => {
                            if (err2) throw err2;
                        });
                    })
                }
                else { //다음 라운드
                    //라운드 끝, 다음 차례, 다음 인덱스
                    yam.round[roomno]++;
                    
                    //시작단어 랜덤, 현재 12개
                    var num = Math.floor(Math.random() * 12);
                    let sql2 = `SELECT * FROM words`;
                    db.query(sql2, yam.maxround[roomno], (err2, row, f2) => {
                        if (err2) throw err2;
                        yam.nowword[roomno] = row[num].word; //라운드 단어

                        //시작하는사람닉네임, 라운드 단어, 라운드
                        yam.io.to(roomno).emit('hangstart', yam.roomuserlist[roomno][yam.roomuseridx[roomno]], row[num].word, yam.round[roomno]);
                    })
                }
            }
        }
    }
    else { //알파벳 입력 시
        var wordindex = new Array();
        for (var i = 0; i < yam.nowword[roomno].length; i++) {
            if (msg == yam.nowword[roomno][i]) {
                wordindex.push(i);
            }
        }

        if (wordindex.length) { //해당 알파벳이 있으면(길이 당 +5)
            let sql = `UPDATE roomuser SET score=score+? WHERE user_name=?`;
            let list = [wordindex.length * 5, username];
            db.query(sql, list, (err) => {
                if (err) throw err;
            })
        }
        else { //해당 알파벳이 없으면
            yam.nowlife[roomno]--; //목숨 차감

            if (!yam.nowlife[roomno]) { //목숨0, 라운드 끝
                if (yam.round[roomno] == yam.maxround[roomno]) {
                    //게임 끝, roomuser 정보를 점수 순으로 gameend 이벤트 보냄
                    let sql = `UPDATE roomlist SET state=0 WHERE room_no=?`;
                    db.query(sql, roomno, (err) => {
                        if (err) throw err;
                    })

                    sql = `SELECT * FROM roomuser WHERE room_no=? ORDER BY score DESC`;
                    db.query(sql, roomno, (err, row, f) => {
                        if (err) throw err;

                        yam.io.to(roomno).emit('hangend', row);
                        let sql2 = `UPDATE roomuser SET score=0 WHERE room_no=?`;
                        db.query(sql2, roomno, (err2) => {
                            if (err2) throw err2;
                        });
                    })
                }
                else { //다음 라운드
                    //라운드 끝, 다음 차례, 다음 인덱스
                    yam.round[roomno]++;
                    
                    //시작단어 랜덤, 현재 12개
                    var num = Math.floor(Math.random() * 12);
                    let sql2 = `SELECT * FROM words`;
                    db.query(sql2, yam.maxround[roomno], (err2, row, f2) => {
                        if (err2) throw err2;
                        yam.nowword[roomno] = row[num].word; //라운드 단어

                        //시작하는사람닉네임, 라운드 단어, 라운드
                        yam.io.to(roomno).emit('hangstart', yam.roomuserlist[roomno][yam.roomuseridx[roomno]], row[num].word, yam.round[roomno]);
                    })
                }
            }
        }
    }
}
exports.hangmananswer = hangmananswer;