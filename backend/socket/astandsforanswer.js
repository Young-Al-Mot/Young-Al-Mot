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
var standdictionary = require('./astandsfordictionary');

var standanswer = function (roomno, message, username) {
    let sql = `SELECT * FROM chatting WHERE chat=?`;
    let list = [message];
    db.query(sql, list, (err, row, f) => {
        if (err) throw err;

        if (!row[0]) {
            //중복아님, 성공
            if (yam.nowword[roomno][0] == message[0]) { //끝말 일치
                //끝말 일치, 설공
                standdictionary.standdictionary(roomno, message, username);
            }
            else {
                //끝말 불일치, 실패 -> 틀린 단어, 0(실패), 닉네임
                yam.io.to(roomno).emit('standanswer', message, 0, username);
            }
        }
        else {
            //중복, 실패 -> 틀린 단어, 0(실패), 닉네임
            yam.io.to(roomno).emit('standanswer', message, 0, username);
        }
    })
}
exports.standanswer = standanswer;