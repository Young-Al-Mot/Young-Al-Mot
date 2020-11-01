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
const socketio = require('socket.io');
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
const server = require('http').createServer(app);
const io = socketio.listen(server);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

app.post('/user_create', create.create);
app.post('/loginchk', main.main);
app.post('/roomnumber', roomnumber.roomnumber);
app.post('/roomlist', roomlist.roomlist);
app.post('/roominchk', roominchk.roominchk);
app.post('/roomout', roomout.roomout);

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    // 메시지를 받으면
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