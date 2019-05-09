let express = require('express'),
    url = require('url'),
    path = require('path'),
    fs = require('fs');
const _port = 3000
var app = express();
app.use(express.static('.'))
app.get('/', function(req, res) {
    res.sendFile('./q.html',{root: '.'});
});
app.listen(_port, function() { console.log('listening port '+_port+"\n__dirname : "+__dirname)});
