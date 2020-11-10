const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

var yam = require('./yam');
var create = require('./routes/user_create');
var main = require('./routes/main');
var roomnumber = require('./routes/roomnumber');
var roomlist = require('./routes/roomlist');
var roominchk = require('./routes/roominchk');
var roomout = require('./routes/roomout');
var ready = require('./routes/ready');
var dictionary = require('./routes/dictionary');

var roommessage = require('./socket/message');
var timer = require('./socket/gametimer');
var roomjoin = require('./socket/roomjoin');
var endwordstart = require('./socket/endwordstart');
var gameanswer = require('./socket/gameanswer');

const socketio = require('socket.io');
const { DH_UNABLE_TO_CHECK_GENERATOR, SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } = require('constants');
const server = require('http').createServer(app);
const io = socketio.listen(server);

exports.io = io;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

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

var timelist = new Array(100); //시간발생 저장
var roomuserlist = new Array(100); //방에 있는 유저닉네임
var roomuseridx = new Array(100); //방에 있는 유저닉네임 인덱스
for (var i = 0; i < timelist.length; i++) {
    timelist[i] = new Array();
    roomuserlist[i] = new Array();
    roomuseridx[i] = 0;
}
var startword = new Array(100); //시작단어
var startwordidx = new Array(100); //시작단어 인덱스(라운드)
var nowword = new Array(100); //현재단어
console.log(startword);

exports.L = timelist;
exports.startword = startword;
exports.startwordidx = startwordidx;
exports.nowword = nowword;
exports.roomuserlist = roomuserlist;
exports.roomuseridx = roomuseridx;

app.post('/user_create', create.create);
app.post('/loginchk', main.main);
app.post('/roomnumber', roomnumber.roomnumber);
app.post('/roomlist', roomlist.roomlist);
app.post('/roominchk', roominchk.roominchk);
app.post('/roomout', roomout.roomout);
app.post('/ready', ready.ready);

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    // 메시지를 받으면
    console.log("connect", socket.id);
    socket.on("disconnect", (reason) => {
        console.log("disconnect", socket.id);
    })

    socket.on('gamestart', (roomno, gametype) => {//방번호, 무슨게임인지 받음\
        if (gametype == '끝말잇기') {
            endwordstart.endwordstart(roomno);
        }
        else {
    
        }
    })//'gamestart' event end

    socket.on('gameanswer', (roomno, message, order) => {
        gameanswer.gameanswer(roomno, message, order);
        console.log("gameanswer");
    })

    socket.on('join', (data) => {
        roomjoin.roomjoin(socket, data);
    });

    socket.on('msg', (msg) => {
        roommessage.roommessage(msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));