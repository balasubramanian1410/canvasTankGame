var socket = io();
var $window = $(window);
//var $usernameInput = $('.usernameInput');

function setUsername () {
    username = cleanInput($('.usernameInput').val().trim());
	$('.form').hide();
    // If the username is valid
    if (username) {
      //socket.emit('add user', username);
	  createNewComponent(username);
    }
  }
  
/* socket.on('login', function (data) {
    
}); */

socket.on('user joined', function (data) {    
	
	/* data.userInstances.forEach(function(key,index){
		if(key.username != username){
			updateExistingComponent(key);
		}
	}); */
	
	
});


socket.on('updateUsers', function (userInstances) { 
    //alert('hi');
	//globalUsers = [];
    if(typeof username === 'undefined'){
		return
	}
	userInstances.forEach(function(key,index){		
			updateExistingComponent(key);		
		$('.ulUsers').append("<li class=active_"+key.name+">"+key.name+"</li>");
		
	})
	
	console.log('updateUsers',userInstances);
	$('body > canvas').focus();
});

socket.on('moveRightServer', function (data) {    
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data.username){
			searchIndex = index;
		}
	});
	console.log(searchIndex);
	if(searchIndex != null)globalUsers[searchIndex].speedX = data.speedX;
});

socket.on('moveLeftServer', function (data) {    
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data.username){
			searchIndex = index;
		}
	});
	//if(searchIndex != null)globalUsers[searchIndex].speedX = data.speedX;
	if(searchIndex != null)globalUsers[searchIndex].rotateTo = data.rotateAngle;
});

socket.on('moveDownServer', function (data) {   
	console.log('globalUsers',globalUsers);
	console.log('moveDownServer',data);
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data.username){
			searchIndex = index;
		}
	});
	if(searchIndex != null){
		globalUsers[searchIndex].speedX = data.speedX;
		globalUsers[searchIndex].speedY = data.speedY;
		
		if(data.hasOwnProperty('bulletX')){
			globalUsers[searchIndex].bulletX = data.bulletX;
			globalUsers[searchIndex].bulletY = data.bulletY;
		}
	}

});

socket.on('removeUser', function (data) {   
	console.log('removeUser:',data);
	removeUser(data);
	
});

function removeUser(data){
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data){
			searchIndex = index;
		}
	});
	globalUsers.splice(searchIndex,1);
	$('.active_'+data+'').remove();
}

socket.on('showAllInstances', function (data) {  
	if(typeof username === 'undefined'){
		return
	}
	if(!data.length){
		return
	}
	data.forEach(function(key,index){
		if(key.username != username){
			updateExistingComponent(key);
		}
	})
});

socket.on('fireInitServer', function (data) { 
	console.log('fireInitServer',data);
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data.username){
			searchIndex = index;
		}
	});
	if(searchIndex != null){
		globalUsers[searchIndex].fireInitiate = data.fireInitiate;
	}
	console.log('globalUsers',globalUsers);
});

socket.on('missileControlServer', function (data) { 
	console.log('missileControlServer',data);
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data.username){
			searchIndex = index;
		}
	});
	if(searchIndex != null){
		globalUsers[searchIndex].missileRotateTo = data.missileRotateTo;
	}
	console.log('globalUsers',globalUsers);
});

socket.on('explodeServer', function (data) {    
	 var index2 = globalUsers.findIndex(function(key){
		 return key.name == data.explodeUserName;
	 }); 
	 globalUsers[index2].explode = true;
	 
	 var index3 = globalUsers.findIndex(function(key){
		 return key.name == data.fireInitUserName;
	 }); 
	 globalUsers[index3].fireInitiate = 0;
	 globalUsers[index3].bulletY =  globalUsers[index3].y;
	 globalUsers[index3].bulletX =  globalUsers[index3].x;	 
});

socket.on('accelerateServer', function (data) {    
	var searchIndex = null;
	globalUsers.forEach(function(key,index){
		if(key.name == data.username){
			searchIndex = index;
		}
	});
	if(searchIndex != null){
		globalUsers[searchIndex].accelerate = data.accelerate;
	}
});

$window.keydown(function (event) {
   
    if (event.which === 13) {      
        setUsername();
		
    }
});
function cleanInput (input) {
	return $('<div/>').text(input).text();
}