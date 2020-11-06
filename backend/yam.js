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
const { deepEqual } = require('assert');
const { start } = require('repl');
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
app.post('/dictionary', dictionary.dictionary)

var list = new Array();

const timer=(roomno)=>{

    var t = 0;
    //경과시간 메시지 (나중에 emit는 지울거)
    var ontime = setInterval(() => {
        t++; 
        io.to(roomno).emit('gametime', 5-t);
        console.log("timer",5-t);
    }, 1000);
    list.push(ontime);

    setTimeout(() => {
        //시간초과 이벤트 발생
        console.log('listsize: '+list.length);
        if(list[0] == ontime) { //시간발생 변수가 같으면 시간초과
            io.to(roomno).emit('msg', {name:'System', message: '시간초과'});
            /*
            io.to(msg.roomno).emit('timeout', {t: 1});
            */
            clearInterval(ontime);
            list.shift();
        }
    }, 5010);
}
exports.T = timer;
exports.L = list;

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    // 메시지를 받으면
    console.log("connect",socket.id);
    socket.on("disconnect",(reason)=>{
        console.log("disconnect",socket.id);
    })
    
    socket.on('gamestart',(roomno,gametype)=>{//방번호, 무슨게임인지 받음
        //게임시작하면 방인원들 레디 없애고 방에 업데이트된거 던져줌
        db.query('UPDATE roomuser SET ready=0 WHERE room_no=?',roomno, (err)=>{
            if(err) throw err;
            let sql = `SELECT * FROM roomuser WHERE room_no=?`
            db.query(sql, roomno, (err, row, field) => {
                if(err) throw err;
                //io.to.emit
                io.to(roomno).emit('join', row);
            })
        })

        //게임 시작했을때 정보 던져주는거 없어서 일단 테스트용으로 만듬 알아서 수정해주세요(헌국)
        //일단 끝말잇기의 경우 시작하는사람닉네임, 시작단어, 라운드
        io.to(roomno).emit('gamestart','qwerqwer',"apple",0);

        yam.T(roomno);
        
    })

    socket.on('join', (data) => {
        console.log('join success');
        socket.join(data.roomno, () => {
            console.log(data.name+' join a '+data.roomno);
            console.log("");
            let sql = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
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
        
        //일단 msg이벤트에 작성했는데 다른 이벤트로 옮길 예정
        //정답 시 돌아가는 시간 중단
        if(list.length != 0){
            clearInterval(list[0]);
            list.shift();
        }
        

    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));