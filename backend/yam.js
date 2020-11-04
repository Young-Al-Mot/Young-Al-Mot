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
    console.log("connect",socket.id);
    socket.on("disconnect",(reason)=>{
        console.log("disconnect",socket.id);
    })
    
    socket.on('join', (data) => {
        console.log('join success');
        socket.join(data.roomno, () => {
            console.log(data.name+' join a '+data.roomno);
            console.log("");
            let sql = `SELECT * FROM roomuser WHERE room_no=?`
            db.query(sql, data.roomno, (err, row, field) => {
                if(err) throw err;
                //io.to.emit
                io.to(data.roomno).emit('join', row);
            })
            
            //입장 시 메시지 (일단 to잘되는거 보여줄려고 'msg'로 해둠)
            io.to(data.roomno).emit('msg',{name:'System',message: data.name+'님이 방에 들어왔습니다.'});
        });
    });

    socket.on('msg', (msg) => {
        var chk = false;
        console.log("yam msg",msg);
        for(var i = 0; i < msg.message.length; i++){
            if(msg.message[i]!=' '){
                chk=true;
                break;
            }
        }
        // 모든 클라이언트에게 전송
        if(chk) io.to(msg.roomno).emit('msg', msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));