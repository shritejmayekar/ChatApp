var app = angular.module('myChatApp', []);
app.controller('myController', ['$scope', '$http', function($scope, $http) {
  var socket = io.connect();
  var username;
  var password;
  var status;
  //login loginArea
  $scope.login = function() {
    if ($scope.name == "" || $scope.name == null || $scope.password == '' || $scope.password == null) {
      document.getElementById('flag').innerHTML = "<p style='color:red'>*Fields are blanks</p>"
      return false;
    }
    console.log($scope.name);
    username = $scope.name;
    password = $scope.password;
    $http({
      method: 'POST',
      url: '/login',
      data: {
        name: $scope.name,
        password: $scope.password
      }
    }).then(function(res) {
      if (res.data.status == 'logged in') {
        $('#loginArea').hide();
        $('#messageArea').show();
        $('#showhide').show();
        document.getElementById('userLogin').innerHTML = "Welcome," + res.data.name;

        //new userArea
        username = res.data.name;
        console.log(username);
        socket.emit('new user', $scope.name, function() {

        });

      } else {
        document.getElementById('flag').innerHTML = "<p style='color:red'>name or password is wrong</p>"
      }

    }, function(err) {

    })

  }





  //new userArea

  $scope.sendUser = function() {
    if ($scope.newUser == "" || $scope.newUser == null) {
      return false;
    }
    socket.emit('new user', $scope.newUser, function() {

    });
    $scope.newUser = '';
  }

  //send messageArea
  $scope.send = function() {
    if ($scope.messages == '' || $scope.messages == null) {
      return false;
    }

    // get current time
    var dt = new Date();
    var ntime = dt.getHours() + ":" + dt.getMinutes();
    // append message with time
    $scope.messages = $scope.messages + " " + ntime;
    $scope.time = ntime;
    console.log(username);
    username = (username == undefined) ? sessioname : username;
    // call event chat message socket io
    socket.emit('chat message', {
      username: username,
      msg: $scope.messages
    });
    $scope.messages = '';

  }
  // get new message display
  socket.on('new message', function(data) {
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(data.username + ': ' + data.msg));
    document.getElementById('message').appendChild(li);
  });

  //get user names and display
  socket.on('get users', function(data) {
    document.getElementById('activeUser').innerHTML = "";
    for (var i = 0; i < data.length; i++) {
      var li = document.createElement('li');
      li.appendChild(document.createTextNode(data[i]));
      document.getElementById('activeUser').appendChild(li);
    }
  });

}]);
