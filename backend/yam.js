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
app.post('/ready', ready.ready);

var timelist = new Array(100); //시간발생 저장
var roomuserlist = new Array(100); //방에 있는 유저닉네임
var roomuseridx = new Array(100); //방에 있는 유저닉네임 인덱스
for(var i=0; i<timelist.length; i++) {
    timelist[i] = new Array();
    roomuserlist[i] = new Array();
    roomuseridx[i] = 0;
}
var startword = new Array(100); //시작단어
var startwordidx = new Array(100); //시작단어 인덱스(라운드)
var nowword = new Array(100); //현재단어
console.log(startword);
const timer=(roomno)=>{
    var t = -1;
    //경과시간 메시지 (나중에 emit는 지울거)
    t++;
    io.to(roomno).emit('gametime', 5-t);
    console.log("timer",5-t);
    var ontime = setInterval(() => {
        t++;
        io.to(roomno).emit('gametime', 5-t);
        console.log("timer",5-t);
    }, 1000);
    timelist[roomno].push(ontime);

    setTimeout(() => {
        //시간초과 이벤트 발생, 발생 할때마다 chatting 테이블 초기화
        let sql = `DELETE FROM chatting WHERE room_no=?`;
        db.query(sql, roomno, (err) => {
            if(err) throw err;
        })

        console.log('listsize: '+timelist[roomno].length);
        if(timelist[roomno][0] == ontime) { //시간발생 변수가 같으면 시간초과
            io.to(roomno).emit('gametime', 0);
            //startwordidx[roomno] == startword[roomno].length - 1이면 게임 끝, 아니면 다음 라운드
            if(startwordidx[roomno] == startword[roomno].length - 1){
                //게임 끝, 점수 줘야함
                //io.io(roomno).emit('gameend');
            }
            else{
                //라운드 끝, 차례는 그대로, 다음 인덱스
                startwordidx[roomno]++;
                nowword[roomno] = startword[roomno][startwordidx[roomno]];
                //gamestart이벤트 -> 시작하는 사람 닉네임, 시작 단어, 라운드
                io.to(roomno).emit('gamestart', roomuserlist[roomno][roomuseridx[roomno]], startword[roomno], startwordidx[roomno]);
            }

            clearInterval(ontime);
            timelist[roomno].shift();
        }
    }, 5010);
}
exports.T = timer;
exports.L = timelist;
exports.startword = startword;
exports.nowword = nowword;
exports.roomuserlist = roomuserlist;
exports.roomuseridx = roomuseridx;

// 클라이언트가 접속했을 때의 이벤트 설정
io.on('connection', (socket) => {
    // 메시지를 받으면
    console.log("connect",socket.id);
    socket.on("disconnect",(reason)=>{
        console.log("disconnect",socket.id);
    })
    
    socket.on('gamestart',(roomno,gametype)=>{//방번호, 무슨게임인지 받음
        //게임시작하면 roomlist에 안보이게
        roomuserlist[roomno].splice(0, roomuserlist[roomno].length);
        roomuseridx[roomno] = 0;
        startwordidx[roomno] = 0;
        let sql = `UPDATE roomlist SET state=1 WHERE room_no=?`;
        db.query(sql, roomno, (err) => {
            if(err) throw err;
        })
        
        //게임시작하면 방인원들 레디 없애고 방에 업데이트된거 던져줌
        db.query('UPDATE roomuser SET ready=0 WHERE room_no=?',roomno, (err)=>{
            if(err) throw err;
            let sql2 = `SELECT * FROM roomuser WHERE room_no=? ORDER BY intime ASC`;
            db.query(sql2, roomno, (err, row, field) => {
                if(err) throw err;

                for(var i=0; i<row.length; i++){
                    roomuserlist[roomno].push(row[i].user_name);
                    console.log(roomuserlist[roomno][i]);
                }
                //처음엔 방장을 첫번째 턴을 할당
                let sql3 = `UPDATE roomuser SET turn=1 WHERE master=1`;
                db.query(sql3, [], (err2) => {
                    if(err2) throw err2;
                })
                //io.to.emit
                io.to(roomno).emit('join', row);
            })
        })

        if(gametype == '십자말풀이'){

        }
        else if(gametype == '끝말잇기'){
            let sql2 = `SELECT * FROM roomuser WHERE room_no=? and master=1`;
            db.query(sql2, roomno, (err, row, f) => {
                if(err) throw err;
                
                //시작단어 랜덤, 현재 10개
                var num = Math.floor(Math.random()*10) + 1;
                let sql3 = `SELECT * FROM words WHERE no=?`;
                db.query(sql3, num, (err2, row2, f2) => {
                    if(err2) throw err2;
                    startword[roomno] = row2[0].word;
                    nowword[roomno] = row2[0].word[startwordidx[roomno]];
                    //시작하는사람닉네임, 시작단어(전체라운드 단어), 시작단어 인덱스(라운드)
                    io.to(roomno).emit('gamestart', row[0].user_name, row2[0].word, startwordidx[roomno]);
                    yam.T(roomno);
                })
            })
        }
        else{

        }
    })//'gamestart' event end

    socket.on('gameanswer', (roomno, message, order) => {
        let sql = `SELECT * FROM chatting WHERE room_no=? and chat=?`;
        let list = [roomno, message];
        db.query(sql, list, (err, row, f) => {
            if(err) throw err;

            if(!row[0]){
                //중복아님, 성공
                console.log(nowword[roomno][nowword[roomno].length - 1]);
                console.log(message[0]);
                if(nowword[roomno][nowword[roomno].length - 1] == message[0]){ //끝말 일치
                    //끝말 일치, 설공
                    dictionary.dictionary(roomno, message, order);
                }
                else{
                    //끝말 불일치, 실패 -> 현재 단어 그대로, 진행중인 사람, 0(실패), 틀린 단어
                    yam.io.to(roomno).emit('gameanswer', nowword[roomno], order, 0, message);
                    yam.io.to(roomno).emit('msg',{name:'System',message: '끝말 불일치'});
                }
            }
            else{
                //중복, 실패 -> 현재 단어 그대로, 진행중인 사람, 0(실패), 틀린 단어
                yam.io.to(roomno).emit('gameanswer', nowword[roomno], order, 0, message);
                yam.io.to(roomno).emit('msg',{name:'System',message: '중복단어'});
            }
        })
        
        console.log("gameanswer");
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
    });
});

server.listen(port, () => console.log(`Listening on port ${port}`));