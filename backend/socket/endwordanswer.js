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
var endworddictionary = require('./endworddictionary');

var endwordanswer = function (roomno, message, order) {
    let sql = `SELECT * FROM chatting WHERE room_no=? and chat=?`;
    let list = [roomno, message];
    db.query(sql, list, (err, row, f) => {
        if (err) throw err;

        if (!row[0]) {
            //중복아님, 성공
            console.log(yam.nowword[roomno]);
            console.log(yam.nowword[roomno][yam.nowword[roomno].length - 1]);
            console.log(message[0]);
            if (yam.nowword[roomno][yam.nowword[roomno].length - 1] == message[0]) { //끝말 일치
                //끝말 일치, 설공
                endworddictionary.endworddictionary(roomno, message, order);
            }
            else {
                //끝말 불일치, 실패 -> 현재 단어 그대로, 진행중인 사람, 0(실패), 틀린 단어
                yam.io.to(roomno).emit('gameanswer', yam.nowword[roomno], order, 0, message);
            }
        }
        else {
            //중복, 실패 -> 현재 단어 그대로, 진행중인 사람, 0(실패), 틀린 단어
            yam.io.to(roomno).emit('gameanswer', yam.nowword[roomno], order, 0, message);
        }
    })
}
exports.endwordanswer = endwordanswer;