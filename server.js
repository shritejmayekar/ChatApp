var express = require('express');
//var app = require('express')();
var clients=0;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'));
app.get('/', function(request, response) {

  //response.sendFile('/home/bridgelabz/shritej/chatApp/public/index.html');
 	//app.use(express('public'));
  response.redirect("index.html");

});

io.on('connection', function(socket) {
  clients++;
  socket.on('chat message', function(msg) {
    console.log('message:' + msg);
    io.emit('chat message', msg);

  });

  socket.on('disconnect', function(socket) {
    clients--;
    console.log("user is disconnected");
  });
});

http.listen(3000, function(err) {
  if (err) throw err;
  console.log('listening on *:3000');

});
