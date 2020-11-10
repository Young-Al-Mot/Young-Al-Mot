const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
var yam = require('../yam');
const multer = require('multer');
const upload = multer({ dest: './upload' });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var roommessage = function (msg) {
    var chk = false;
    console.log('yam msg' + msg.message.length);

    for (var i = 0; i < msg.message.length; i++) {
        if (msg.message[i] != ' ') {
            chk = true;
            break;
        }
        console.log(chk);
        //모든 클라이언트에게 메시지 전송
    }

    if (chk) yam.io.to(msg.roomno).emit('msg', msg);
}
exports.roommessage = roommessage;