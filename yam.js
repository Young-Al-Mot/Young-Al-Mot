var http = require('http');
var template = require('./lib/template.js');
var express = require('express');
var fs = require('fs');
var login = require('./login');
var member = require('./member');
var create = require('./user_create');
var main = require('./main');
var app = express();

app.get('/', login.login);
app.get('/member', member.member);
app.post('/user_create', create.create);
app.post('/main', main.main);
app.listen(3000);