const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');

var create = require('./routes/user_create');
var main = require('./routes/main');
var roomnumber = require('./routes/roomnumber');
var roomlist = require('./routes/roomlist');
var roominchk = require('./routes/roominchk');
var roomout = require('./routes/roomout');
var ready = require('./routes/ready');

var roommessage = require('./socket/message');
var roomjoin = require('./socket/roomjoin');
var endwordstart = require('./socket/endwordstart');
var endwordanswer = require('./socket/endwordanswer');
var standstart = require('./socket/astandsforstart');
var standanswer = require('./socket/astandsforanswer');
var hangmanstart = require('./socket/hangmanstart');
var hangmananswer = require('./socket/hangmananswer');

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
    host: _secret[2],
    user: _secret[0],
    password: _secret[1],
    database: 'yam'
});
db.connect();

var timelist = new Array(100); //시간발생 저장
var waitlist = new Array(100); //대기시간 저장
var roomuserlist = new Array(100); //방에 있는 유저닉네임
var roomuseridx = new Array(100); //방에 있는 유저닉네임 인덱스
for (var i = 0; i < timelist.length; i++) {
    timelist[i] = new Array();
    waitlist[i] = new Array();
    roomuserlist[i] = new Array();
    roomuseridx[i] = 0;
}
var startword = new Array(100); //시작단어
var round = new Array(100); //시작단어 인덱스(라운드)
var maxround = new Array(100); //선택한 라운드
var nowword = new Array(100); //현재단어
var life = 7;
var nowlife = new Array(100, life);
var truealphabet = new Array(100, 0);

exports.L = timelist;
exports.W = waitlist;
exports.startword = startword;
exports.round = round;
exports.maxround = maxround;
exports.nowword = nowword;
exports.roomuserlist = roomuserlist;
exports.roomuseridx = roomuseridx;
exports.nowlife = nowlife;
exports.life = life;
exports.TA = truealphabet;

app.post('/user_create', create.create);
app.post('/loginchk', main.main);
app.post('/roomnumber', roomnumber.roomnumber);
app.post('/roomlist', roomlist.roomlist);
app.post('/roominchk', roominchk.roominchk);
app.post('/roomout', roomout.roomout);
app.post('/ready', ready.ready);

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    console.log("conection",socket.id);

    //서버가 클라이언트 접속을 확인하면 신호를 보냄
    socket.emit("socketConection",1);

    //소켓 접속하면 소켓아이디랑 닉네임 테이블에 저장
    socket.on('socketin',(userid)=>{
        console.log('socketin',userid,socket.id);
        if(userid!=undefined){
            let sql=`SELECT * FROM socketid WHERE user_id=?`;
            db.query(sql,userid,(err,row)=>{
                if (err) throw err;

                if(row.length==0){//아무것도없으면 insert
                    let sql2 = `INSERT INTO socketid VALUES (?,?)`;
                    db.query(sql2, [socket.id,userid], (err2) => {
                        if (err2) throw err2;
                    });
                }else{
                    //이미 있으면 업데이트
                    let sql2 = `UPDATE socketid SET socket_id=? WHERE user_id=?`;
                    db.query(sql2, [socket.id,userid], (err2) => {
                        if (err2) throw err2;
                    });
                }
            })

            
        }
    });

    
    //소켓이 끊어지면 방에서 나가게함
    socket.on("disconnect", (reason) => {
        console.log("disconnect", socket.id);
        let sql = `SELECT * FROM socketid WHERE socket_id=?`;
        db.query(sql, socket.id, (err,row) => {
            if (err) throw err;
            if(row[0]!=undefined){
                let sql2='DELETE FROM socketid WHERE socket_id=?';
                db.query(sql2,socket.id,(err2)=>{
                    if(err2) throw err2;
                    roomout.room_out({body:{userid:row[0].user_id}});

                })
            }
        });
    })

    socket.on('gamestart', (roomno, gametype) => {//방번호, 무슨게임인지 받음\
        if (gametype == '끝말잇기') {
            endwordstart.endwordstart(roomno);
        }
        else if (gametype == 'A Stands For') {
            standstart.standstart(roomno);
        }
        else {
            hangmanstart.hangmanstart(roomno);
        }
    })//'gamestart' event end

    socket.on('gameanswer', (roomno, message, order) => {
        endwordanswer.endwordanswer(roomno, message, order);
        console.log('gameanswer');
    })

    socket.on('standanswer', (roomno, message, username) => {
        standanswer.standanswer(roomno, message, username);
        console.log('standanswer');
    })

    socket.on('hanganswer', (roomno, msg, username) => {
        hangmananswer.hangmananswer(roomno, msg, username);
        console.log('hanganswer');
    })

    socket.on('join', (data) => {
        roomjoin.roomjoin(socket, data);
    });

    socket.on('msg', (msg) => {
        roommessage.roommessage(msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));