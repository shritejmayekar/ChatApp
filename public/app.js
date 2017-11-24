var app = angular.module('myChatApp',[]);
app.controller('myController',['$scope',function($scope){
var socket = io.connect();

$scope.send = function() {
  var dt=new Date();
  var ntime=dt.getHours()+":"+dt.getMinutes();
  console.log('k'+dt.getTime());
  $scope.messages=$scope.messages+" "+ntime;
  $scope.time=ntime;
  socket.emit('chat message',$scope.messages);
  $scope.messages='';

}

  socket.on('chat message',function(msg) {
      var li=document.createElement('li');
      li.appendChild(document.createTextNode(msg));
      document.getElementById('message').appendChild(li);
  });

}]);
