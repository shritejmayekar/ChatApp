/**
@author shritej
@since 22-09-2017
*/
//Deaclaration
var express = require('express');
var clients = 0;
var sessName;
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var session = require('express-session')
app.use(express.static('public'));
//session userArea
app.use(session({
  secret: 'phantom'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//declaring variable sess for session save as temporary.
var sess;

app.get('/', function(req, res) {
  sess = req.session;
  sessName = req.session.name;
  if (sess.name) {
    //if exists the session
    console.log(sess.name);

    res.send({
      status: 'logged in'
    })
  } else {

    res.send({
      status: 'not logged in'
    })
  }

});


app.post('/login', function(req, res) {
  sess = req.session;
  sess.name = req.body.name;
  if (sess.name == null || sess.name == '' || sess.name == undefined) {
    res.send({
      status: 'not logged in'

    })
  } else {
    res.send({
      status: 'logged in',
      name: sess.name
    })
  }

});
app.get('/admin', function(req, res) {
  sess = req.session;
  console.log(sess);
  if (sess.name) {
    res.write('<h1>Hello ' + sess.name + '</h1>');
    res.end('<a href="/logout">Logout</a>');
  } else {
    res.write('<h1>Please Login first.</h1>');
    res.end('<a href="/">Login</a>');
  }

});
app.get('/checkSession', function(req, res) {
  var result = {
    status: true,
    message: "You are authorized",
    name: req.session.name
  }
  if (req.session && req.session.name) {
    result.data = {
      isLogin: true
    }
  } else {
    result.data = {
      isLogin: false
    }
  }

  res.send(result);

});
app.get('/user', function(req, res) {
  var result;
  if (req.session && req.session.name) {

    result = req.session.name

    res.send(result);
  } else {
    result = null;
    res.send(result);
  }

});

app.get('/logout', function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
    }
  });
});
//Declare socket
var users = [];
var socketId = [];

//create socket
io.on('connection', function(socket) {
  clients++;
  console.log('Clients connected:' + clients);
  console.log(socket.id);
  // send message
  socketId.push(socket.id);
  socket.on('chat message', function(data) {
    // broadcast message to clients/users
    io.emit('new message', data);
  });
  //Disconnect
  socket.on('disconnect', function(socket) {
    clients--;

    users.splice(users.indexOf(socket), 1);
    console.log(socket.newUser);
    console.log("user is disconnected");
    console.log('Clients connected:' + clients);
    updateUsernames();
  });
  //new user
  socket.on('new user', function(data, callback) {
    callback(true);
    socket.newUser = data;
    if (users.indexOf(socket.newUser) < 0)
      users.push(socket.newUser);
    updateUsernames();
  });
  // updates user name based on connected and disconnected
  function updateUsernames() {
    //broadcast the username to all
    io.emit('get users', users);
  }


});

// listen port
http.listen(3000, function(err) {
  if (err) throw err;
  console.log('listening on *:3000');

});
