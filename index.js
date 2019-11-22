const express = require('express');
const mysql= require('mysql');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// conexion database

var connection=mysql.createConnection({
  //propiedades
  host:'localhost',
  user:'root',
  password:'',
  database:'usuarios'
});

connection.connect(function(error){
  if(!!error){
    console.log('Error');
  }else{
    console.log('Connected to DataBase');
  }

});

//-----------------------------------------------------------------------




app.use(express.static('public'));

app.get('/', function(req, res){
  res.sendFile(`${__dirname}/public/index.html`, (e) => {
 
      //res.send(JSON.stringify(e));
  });
});

app.get('/chatroom/:username', function(req, res){
  const username = req.param('username');
  res.sendFile(`${__dirname}/public/chatroom.html`, (e) => {
      //res.send(JSON.stringify(e));
  });
});

 
require('./sockets')(io,connection);

http.listen(3000, function(){
  console.log('listening on *:3000');
});