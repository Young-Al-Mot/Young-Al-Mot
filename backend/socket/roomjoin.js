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

var roomjoin = function (socket, data) {
    console.log('join success');
    socket.join(data.roomno, () => {
        console.log(data.name + ' join a ' + data.roomno);
        console.log("");
        let sql = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
        db.query(sql, data.roomno, (err, row, field) => {
            if (err) throw err;
            //io.to.emit
            yam.io.to(data.roomno).emit('join', row);
        })

        //입장 시 메시지 (일단 to잘되는거 보여줄려고 'msg'로 해둠)
        yam.io.to(data.roomno).emit('msg', { name: 'System', message: data.name + '님이 방에 들어왔습니다.' });
    });
}
exports.roomjoin = roomjoin;