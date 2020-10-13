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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);

app.get('/', login.login);
app.get('/member', member.member);
app.post('/user_create', create.create);
app.post('/loginchk', main.main);

app.listen(port, () => console.log(`Listening on port ${port}`));