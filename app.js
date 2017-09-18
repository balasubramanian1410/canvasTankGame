// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
//var io = require('../..')(server);-subbu
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

var numUsers = 0;
var userNames = [];
var userInstances = [];
io.on('connection', function (socket) {
	
	
	var addedUser = false;
	//socket.broadcast.emit('showAllInstances', userInstances);
	//socket.emit('showAllInstances', userInstances);
	
	socket.on('add user', function (username) {
    if (addedUser) return;
	userNames.push(username);
    // we store the username in the socket session for this client
    socket.username = username;
    ++numUsers;
    addedUser = true;
    
    // echo globally (all clients) that a person has connected
    
	
	//socket.emit('updateUsers', userInstances);
	console.log('users:',userNames);
  });
  
  socket.on('addUserInstances', function (myGamePiece) {
	    //console.log('before',userInstances);
		
		var beforeJoiningInstances = userInstances;
		var result = userInstances.find(function(key){
			return key.name == myGamePiece.name;
		});
		console.log('result::',result);
		if(typeof result === 'undefined'){
			socket.username = myGamePiece.name;
			userInstances.push(myGamePiece);
			
		}
		console.log('after',userInstances);
		
		if(typeof result === 'undefined'){
			socket.broadcast.emit('updateUsers', [myGamePiece]);
			socket.emit('updateUsers', beforeJoiningInstances);
			console.log('addUserInstances',userInstances);
		}
		
		
		
	  /* socket.broadcast.emit('user joined', {
		  username: username,
		  userInstances: userInstances
	  }); */
  });
  socket.on('moveRight', function (data) {
	 var index2 = null; 
	 userInstances.forEach(function(key,index){
		 if(key.name == data.username){
			 index2 =  index;
		 }
	 })
	  userInstances[index2].speedX = data.speedX;
	//  console.log('moveRightServer',userInstances);
	  socket.broadcast.emit('moveRightServer', data);
  });
  socket.on('missileControl', function (data) {
	 var index2 = null; 
	 userInstances.forEach(function(key,index){
		 if(key.name == data.username){
			 index2 =  index;
		 }
	 })
	  userInstances[index2].missileRotateTo = data.missileRotateTo;
	//  console.log('moveRightServer',userInstances);
	  socket.broadcast.emit('missileControlServer', data);
  });
  socket.on('explode', function (data) {
	
	 var index2 = userInstances.findIndex(function(key1){
		 return key1.name == data.explodeUserName;
	 }); 
	 userInstances[index2].explode = true;
	 
	 var index3 = userInstances.findIndex(function(key2){
		 return key2.name == data.fireInitUserName;
	 }); 
	 userInstances[index3].fireInitiate = 0;
	 userInstances[index3].bulletY =  userInstances[index3].y;
	 userInstances[index3].bulletX =  userInstances[index3].x;	 
	 console.log('explode',index2,index3,data);
	 socket.broadcast.emit('explodeServer', data);
  });
  socket.on('moveLeft', function (data) {
	 var index2 = null; 
	 userInstances.forEach(function(key,index){
		 if(key.name == data.username){
			 index2 =  index;
		 }
	 })
	 
	  userInstances[index2].rotateAngle = data.rotateAngle;
	//  console.log('moveLeftServer',userInstances);
	  socket.broadcast.emit('moveLeftServer', data);
  });
  socket.on('moveDown', function (data) {
	 var index2 = null; 
	 userInstances.forEach(function(key,index){
		 if(key.name == data.username){
			 index2 =  index;
		 }
	 })
	   userInstances[index2].speedY = data.speedY;
	   userInstances[index2].speedX = data.speedX;
	   if(data.hasOwnProperty('bulletX')){
			userInstances[index2].bulletX = data.bulletX;
			userInstances[index2].bulletY = data.bulletY;
		}
	//  console.log('moveDownServer',userInstances);
	  socket.broadcast.emit('moveDownServer', data);
  });
   
   
   socket.on('fireInit', function (data) {
	 var index2 = null; 
	 userInstances.forEach(function(key,index){
		 if(key.name == data.username){
			 index2 =  index;
		 }
	 })
	 
	  userInstances[index2].fireInitiate = data.fireInitiate;
	  console.log('fireInit',userInstances);
	  socket.broadcast.emit('fireInitServer', data);
  });
  socket.on('accelerate', function (data) {
	 var index2 = null; 
	 userInstances.forEach(function(key,index){
		 if(key.name == data.username){
			 index2 =  index;
		 }
	 })
	 
	  userInstances[index2].accelerate = data.accelerate;
	  socket.broadcast.emit('accelerateServer', data);
  });
   socket.on('disconnect', function () {
	   var index2 = null; 
	   
	   console.log('socket.username',socket.username);
	   
	   
	   userInstances.forEach(function(key,index){
		 if(key.name == socket.username){
			 index2 =  index;
		 }
	   })
       if(index2 != null)userInstances.splice(index2,1);
	   
	   if(typeof socket.username === 'undefined'){
		  return;
	   }
	   socket.broadcast.emit('removeUser', socket.username);
  });
  socket.on('removeUserFromArray', function (data) {
	   var index2 = null; 
	   
	   
	   
	   
	   userInstances.forEach(function(key,index){
		 if(key.name == data.name){
			 index2 =  index;
		 }
	   })
       if(index2 != null)userInstances.splice(index2,1);
	   
	   if(typeof socket.username === 'undefined'){
		  return;
	   }
	   
  });

});
