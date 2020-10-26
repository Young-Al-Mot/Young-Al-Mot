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
const socketio = require('socket.io');
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

// 클라이언트가 접속했을 때의 이벤트 설정 --- (※4)
io.on('connection', (socket) => {
    console.log('사용자 접속:', socket.client.id);
    // 메시지를 받으면 --- (※5)
    socket.on('chat-msg', (msg) => {
        console.log('message:', msg);
        // 모든 클라이언트에게 전송 --- (※6)
        io.emit('chat-msg', msg);
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));