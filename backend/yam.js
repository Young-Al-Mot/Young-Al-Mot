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
const socketio = require('socket.io');
const { DH_UNABLE_TO_CHECK_GENERATOR, SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG } = require('constants');
const server = require('http').createServer(app);
const io = socketio.listen(server);

exports.io=io;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

const mysql = require('mysql');
const _secret = fs.readFileSync('./secret.txt','utf8').split(" ");
const db = mysql.createConnection({
    host:'localhost',
    user:_secret[0],
    password:_secret[1],
    database:'yam'
});
db.connect();

app.post('/user_create', create.create);
app.post('/loginchk', main.main);
app.post('/roomnumber', roomnumber.roomnumber);
app.post('/roomlist', roomlist.roomlist);
app.post('/roominchk', roominchk.roominchk);
app.post('/roomout', roomout.roomout);
app.post('/ready', ready.ready)

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    // 메시지를 받으면

    socket.on('join', (msg) => {
        console.log('join success');
        socket.join(msg.roomno, () => {
            console.log(msg.name+' join a '+msg.roomno);
            // let sql = `SELECT * FROM roomuser WHERE room_no=?`
            // db.query(sql, msg.roomno, (err, row, field) => {
            //     if(err) throw err;

            //     //여기에 row를 io로 보낼수 있을까
            // })
            
            //io.to.emit
            //io.to(msg.roomno).emit('join', {name: msg.name});
            
            //이건 그냥 메시지, 나중에 to.emit 되면 지움
            io.emit(msg.roomno,{name:'System',message: msg.name+'님이 방에 들어왔습니다.'});
        });
    });

    socket.on('msg', (msg) => {
        var chk = false;
        console.log(msg);
        for(var i = 0; i < msg.message.length; i++){
            if(msg.message[i]!=' '){
                chk=true;
                break;
            }
        }
        // 모든 클라이언트에게 전송
        if(chk) io.emit(msg.roomno, msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));