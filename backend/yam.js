const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
var login = require('./login');
var member = require('./member');
var create = require('./user_create');
var main = require('./main');
const socketio = require('socket.io');
const io = socketio.listen(server);
const server = require('http').createServer(app);
server.listen(portNo, () => {
  console.log('서버 실행 완료:', 'http://localhost:' + port);
});

app.use('/public', express.static('./public'))
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

app.get('/member', member.member);
app.post('/user_create', create.create);
app.post('/loginchk', main.main);
app.get('/', (req, res) => { // 루트에 접근하면 /public로 리다이렉트
    res.redirect(302, '/public');
});
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

app.listen(port, () => console.log(`Listening on port ${port}`));