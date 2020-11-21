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
const upload = multer({ dest: './upload' });

const _secret = fs.readFileSync('./secret.txt', 'utf8').split(" ");

const db = mysql.createConnection({
    host: _secret[2],
    user: _secret[0],
    password: _secret[1],
    database: 'yam'
});
db.connect();

const yam = require('../yam');
var timer = require('../socket/endwordtimer');

const room_out=(req, res) => {
    let roomno;
    let userid = req.body.userid;
    let sql = `SELECT * FROM user WHERE user_id=?`;
    let ismaster = 0;

    console.log("roomout userid", userid);
    console.log("")

    if (userid == "") {
        return;
        // return res.status(400).json();
    }

    db.query(sql, userid, (err, row, field) => {
        if (err) throw err;

        let sql1 = `SELECT * FROM roomuser WHERE user_no=?`;
        db.query(sql1, row[0].user_no, (err2, row2, field2) => {
            if (err2) throw err2;
            if (!row2[0])//아무것도안들엇으면 그냥 리턴해
                return;
                // return res.status(400).json();
            //이제 클라이언트에서 방번호 안주니까 여기서 꺼내옴
            roomno = row2[0].room_no;

            let sql2 = `DELETE FROM roomuser WHERE user_no=?`;
            db.query(sql2, row[0].user_no, (err2, del, field2) => {
                if (err2) throw err2;

                let sql3 = `SELECT * FROM roomlist WHERE room_no=?`;
                db.query(sql3, roomno, (err2, row3, field2) => {
                    if (err2) throw err2;

                    if (!row3[0])//아무것도 안들어잇으면 리턴해
                        return;
                        // return res.status(400).json();
                    console.log(row2[0].master);

                    if (row3[0].nowplayer > 1) {//사람 한명 나갔으니 nowplayer-1
                        if (row3[0].nowplayer == 2 && row3[0].state == 1) { //나갔을 때 혼자있는 경우
                            //게임 끝
                            if (yam.L[roomno].length != 0) {
                                clearInterval(yam.L[roomno][0]);
                                yam.L[roomno].shift();
                            }
                            if (yam.W[roomno].length != 0) {
                                clearInterval(yam.W[roomno][0]);
                                yam.W[roomno].shift();
                            }
                            let sql31 = `UPDATE roomlist SET state=0 WHERE room_no=?`;
                            db.query(sql31, roomno, (err31) => {
                                if (err31) throw err31;
                            })

                            sql31 = `SELECT * FROM roomuser WHERE room_no=? and user_name!=?`;
                            db.query(sql31, [roomno, row2[0].user_name], (err31, row31, f31) => {
                                if (err31) throw err31;

                                if(row3[0].game_name == '끝말잇기') yam.io.to(roomno).emit('gameend', row31);
                                else if(row3[0].game_name == 'A Stands For') yam.io.to(roomno).emit('standend', row31);
                                else yam.io.to(roomno).emit('hangend', row31);
                                let sql32 = `UPDATE roomuser SET score=0 WHERE room_no=?`;
                                db.query(sql32, roomno, (err32) => {
                                    if (err32) throw err32;
                                });
                            })
                        }
                        else if (row3[0].game_name != 'A Stands For' && row3[0].state == 1 && row2[0].user_name == yam.roomuserlist[roomno][yam.roomuseridx[roomno]]) {
                            //방이 시작중이고 본인 턴이라면 다음사람으로 턴 넘겨야함
                            yam.roomuserlist[roomno].splice(yam.roomuseridx[roomno], 1); //나간사람 삭제
                            yam.roomuseridx[roomno] = yam.roomuseridx[roomno] % yam.roomuserlist[roomno].length; //다음사람으로 인덱스 조정

                            if (row3[0].game_name == '끝말잇기') {
                                //시간 다시
                                if (yam.L[roomno].length != 0) {
                                    clearInterval(yam.L[roomno][0]);
                                    yam.L[roomno].shift();
                                }
                                if (yam.W[roomno].length != 0) {
                                    clearInterval(yam.W[roomno][0]);
                                    yam.W[roomno].shift();
                                }
                                console.log(yam.roomuserlist[roomno][yam.roomuseridx[roomno]]);
                                //endwordanswer -> 현재 단어, 다음 사람
                                yam.io.to(roomno).emit('endwordanswer', yam.nowword[roomno], yam.roomuserlist[roomno][yam.roomuseridx[roomno]], 1);

                                //4초 후에 게임 재시작
                                var nexttime = 0;
                                var nextwait = setInterval(() => {
                                    nexttime++;
                                    if (nexttime == 4) {
                                        clearInterval(nextwait);
                                        yam.W[roomno].shift();
                                        timer.T(roomno);
                                    }
                                }, 1000);
                                yam.W[roomno].push(nextwait);
                            }
                            else {
                                //-1(나감), '', 다음 사람
                                yam.io.to(roomno).emit('hanganswer', -1, '', yam.roomuserlist[roomno][yam.roomuseridx[roomno]]);
                            }
                        }

                        let sql4 = `UPDATE roomlist SET nowplayer=nowplayer-1 WHERE room_no=?`;
                        db.query(sql4, roomno, (err3, upd, field3) => {
                            if (err3) throw err3;
                        })

                        let sql5 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
                        db.query(sql5, roomno, (err4, row4, field4) => {
                            if (err4) throw err4;

                            if (row2[0].master) {//만약 나간사람이 방장이라면
                                let sql6 = `UPDATE roomuser SET master=1, ready=0 WHERE user_no=?`;
                                db.query(sql6, row4[0].user_no, (err5, row5, field5) => {
                                    if (err5) throw err5;

                                    let sql7 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
                                    db.query(sql7, roomno, (err6, row6, field6) => {
                                        if (err6) throw err6;

                                        yam.io.to(roomno).emit('join', row6);
                                        ismaster = 1;
                                    })

                                })

                            }

                            //방 나갓으니까 다시 갱신하기위해 유저정보 던져줌
                            if (!ismaster)
                                yam.io.to(roomno).emit('join', row4);
                        })

                    }
                    else {//사람 다나가면 다시 디폴트로 만듬
                        let sql4 = `UPDATE roomlist SET room_name='default', password=null, game_name='default', nowplayer=0, maxplayer=0, round=0, state=1 WHERE room_no=?`;
                        db.query(sql4, roomno, (err6, row6, field6) => {
                            if (err6) throw err6;
                        })

                        //방 터질때 시간 돌아가면 정지
                        if (yam.L[roomno].length != 0) {
                            clearInterval(yam.L[roomno][0]);
                            yam.L[roomno].shift();
                        }
                        if (yam.W[roomno].length != 0) {
                            clearInterval(yam.W[roomno][0]);
                            yam.W[roomno].shift();
                        }
                    }
                })
                yam.io.to(roomno).emit('msg', { name: 'System', message: row[0].user_name + '님이 방을 나갔습니다.' });
                if(res==undefined)
                    return;
                else
                    return res.json({ success: true });
            })
        })
    })
}

exports.roomout = app.post('/roomout', upload.single(), room_out);
exports.room_out=room_out;