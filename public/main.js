var myGamePiece;

 var COLORS = [
    '#e21400', '#91580f', '#f8a700', '#f78b00',
    '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
    '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
  ];

var globalUsers = [];
var rotateButtonPressed = false;
function createNewComponent(name){
	//var myGamePiece = new component(30, 30, "red", 10, 120,name);
	//globalUsers.push(myGamePiece);
	var randomX = randomIntFromInterval(0,350);
	var randomY = randomIntFromInterval(0,270)
	socket.emit('addUserInstances', {width: 30,height: 30,color: getUsernameColor(name), speedX: randomX, speedY: randomY,accelerate: 2,rotateAngle:0, name:name, bulletX: randomX,bulletY: randomY, missileRotateTo: 0,fireInitiate: 0,explode: false});
	console.log('local',globalUsers);
	//myGameArea.start();
	
}
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}
function getUsernameColor (username) {
    // Compute hash code
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
       hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    // Calculate color
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
}
function updateExistingComponent(data){
	console.log('New user Data:',data);
	var myGamePiece = new component(data.width, data.height, data.color, data.speedX, data.speedY,data.accelerate,data.rotateAngle,data.name,data.bulletX,data.bulletY,data.missileRotateTo);
	globalUsers.push(myGamePiece);
	console.log('totalUsers:',globalUsers);
	myGameArea.start();
}

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
	stop : function() {
        clearInterval(this.interval);
    }
}

var animationFrames = [1,2,3,4,5,6,7,8];
var frameIndex = 0;


/* setTimeout(function(){
	explode = true;
},5000) */

var ticksPerFrame = 8;
var tickCount = 0;
var frameIndex = 0;
var numberOfFrames = 17;
function component(width, height, color, x, y,accelerate,rotateAngle,name,bulletX,bulletY,missileRotateTo) {
    this.width = width;
    this.height = height;
    this.speedX = x;
    this.speedY = y;
    this.x = x;
    this.y = y;   
	this.fireInitiate = 0;
	this.bulletX = bulletX;
	this.bulletY = bulletY;
	this.accelerate = accelerate;
	this.rotateTo = rotateAngle;
	this.missileRotateTo = rotateAngle;
	this.name = name;
	this.explode = false;
	var imageObj = new Image();			
	var explodeGif = new Image();	
	explodeGif.src = 'explode.gif'
	imageObj.src = 'tank2.png';
	var bulletImage = new Image();	
	bulletImage.src = 'bullet.png';	
	//this.rotateAngle = rotateAngle;
	coinImage = new Image();
	coinImage.src = "explodeSheet.png";
	this.updateFrames = function(){
		
		tickCount += 1;

		if (tickCount > ticksPerFrame) {

			tickCount = 0;
			
			// If the current frame index is in range
			if (frameIndex < numberOfFrames - 1) {	
				// Go to the next frame
				frameIndex += 1;
			} else {
				//console.log('this.userHitName',this.userHitName);
				removeUser(this.name);
				if(username == this.name){
					location.reload();
				}
				
			//	socket.emit('removeUserFromArray', {name:this.name});
				
			}
		}
	},
    this.update = function() {
		//myGameArea.clear();
        ctx = myGameArea.context;
		//ctx.fillRect(this.x, this.y, 30, 30);
		//ctx.fillStyle = "white";
		
		ctx.save();
		
		ctx.translate(this.x, this.y);
	//	ctx.setTransform(1,0,0,1,0,0)
		ctx.translate(30 * 0.5, 30 * 0.5);
		ctx.rotate(this.rotateTo * 0.01745);
		ctx.translate(-(30 * 0.5), -(30 * 0.5));
		if(this.explode){
		//	myGameArea.clear();			
			this.fireInitiate = 0;
			ctx.drawImage(
				coinImage,
				frameIndex * 850 / numberOfFrames,
				0,
				850/numberOfFrames,
				66,
				0,
				0,
				850/numberOfFrames,
				66
			)
		}else{
			ctx.drawImage(imageObj, 0, 0, 30,30);
		}
		
		//ctx.fillRect(0,0, 30, 30);
		//ctx.drawImage(imageObj, sourceX, sourceY,32,32,16,16,32,32);
		ctx.restore();		
		if(this.bulletX <= 450 && this.bulletY <= 250 && this.bulletX >= -20 && this.bulletY >= -20 && !this.explode){
			ctx.save();	
			ctx.translate(this.bulletX, this.bulletY);	
			ctx.translate(30 * 0.5, 30 * 0.5);
			if(!this.fireInitiate){
				ctx.rotate((this.rotateTo+90) * 0.01745);
			 }else{
				ctx.rotate((this.missileRotateTo+90) * 0.01745);
			}
			ctx.translate(-(30 * 0.5), -(30 * 0.5));
			ctx.drawImage(bulletImage, 0, 0, 30,30);	
			ctx.restore();	
		}else{
			this.fireInitiate = 0;
			this.bulletY = this.y;
			this.bulletX = this.x;
		}
		
    }
    this.newPos = function() {
        this.x = this.speedX ;
        this.y = this.speedY ;
		if(this.fireInitiate){
			console.log('checkifAnyTankIsHit',this.name,this.fireInitiate);
			this.bulletY +=  this.accelerate * Math.sin((this.missileRotateTo-90) *  0.01745);
			this.bulletX +=  this.accelerate * Math.cos((this.missileRotateTo-90) *  0.01745);
		//	var userHitName = ;
			if(username == this.name){
				checkifAnyTankIsHit(this.bulletX,this.bulletY);
			}
			
			
		}else{
			this.missileRotateTo = this.rotateTo;
		}					
    }	
	
	 
    
}

function updateGameArea() {
    myGameArea.clear();
    updateAllComp();
}
function updateAllComp(){
	globalUsers.forEach(function(key,index){
		key.newPos();
		if(key.explode){
			key.updateFrames();
		}
		
		key.update();
	})
}
function checkifAnyTankIsHit(x,y){
	console.log('firedUser',username,getCurrentUserObj().fireInitiate);
	var myleft = x;
	var myright = x + (30);
	var mytop = y;
	var mybottom = y + (30);
	globalUsers.forEach(function(key,index){
		
		if(username != key.name){
			var otherleft = key.x;
			var otherright = key.x + (key.width);
			var othertop = key.y;
			var otherbottom = key.y + (key.height);
			var crash = true;
			if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
			   crash = false;
			}
			if(crash){
				//console.log('');
			//	removeUser(key.name);
				explodeUser(index);
				return true;
			}
		}
		
	});	
	
	
	
}

function explodeUser(index){
	
	var searchIndex = globalUsers.findIndex(function(key,index){
		return key.name == username;
	});
	
	socket.emit('explode', {explodeUserName: globalUsers[index].name, fireInitUserName: globalUsers[searchIndex].name});
	
	globalUsers[index].explode = true;
	globalUsers[searchIndex].fireInitiate = 0;
	globalUsers[searchIndex].bulletY = globalUsers[searchIndex].y;
	globalUsers[searchIndex].bulletX = globalUsers[searchIndex].x;
	
	console.log('explode',globalUsers[index].name,globalUsers[searchIndex].name);
	
	
}

function getCurrentUserObj(){
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	return obj;
}
function moveup() {
   
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	
	obj.speedY += obj.accelerate * Math.sin((obj.rotateTo-90) *  0.01745);
	obj.speedX += obj.accelerate * Math.cos((obj.rotateTo-90) *  0.01745);	
	if(!obj.fireInitiate){
		obj.bulletX = obj.speedX;
		obj.bulletY = obj.speedY;
		//socket.emit('moveDown', {username: username, speedY: obj.speedY, speedX: obj.speedX});
		//return;
	}
	if(!obj.fireInitiate){
		socket.emit('moveDown', {username: username, speedY: obj.speedY, speedX: obj.speedX, bulletX:obj.bulletX,bulletY:obj.bulletY});
	}else{
		socket.emit('moveDown', {username: username, speedY: obj.speedY, speedX: obj.speedX});
	}
	console.log('currentUserPos',obj.speedX,obj.speedY,username);
	
}


function movedown() {
    
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	
	
	console.log("obj.rotateTo:",obj.rotateTo);
	obj.speedY -= obj.accelerate * Math.sin((obj.rotateTo-90) *  0.01745);
	obj.speedX -= obj.accelerate * Math.cos((obj.rotateTo-90) *  0.01745);	
	
	if(!obj.fireInitiate){
		obj.bulletX = obj.speedX;
		obj.bulletY = obj.speedY;
		//socket.emit('moveDown', {username: username, speedY: obj.speedY, speedX: obj.speedX});
		//return;
	}
	if(!obj.fireInitiate){
		socket.emit('moveDown', {username: username, speedY: obj.speedY, speedX: obj.speedX, bulletX:obj.bulletX,bulletY:obj.bulletY});
	}else{
		socket.emit('moveDown', {username: username, speedY: obj.speedY, speedX: obj.speedX});
	}

	//console.log("obj position:",obj.speedX,obj.speedY,obj.rotateTo);
}

function moveleft() {
	
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	//obj.speedX -= accelerate;
	if(obj.rotateTo == 0 ){
		obj.rotateTo = 360;
	}else if(obj.rotateTo == 360 ){
		obj.rotateTo = 0;
	}	
	
	obj.rotateTo -= 22.5; 
	//socket.emit('moveDown', {username: username, rotateAngle: obj.rotateTo});
//	socket.emit('moveLeft', {username: username, speedX: obj.speedX});
	//console.log("RotateAngle:moveleft",obj.rotateTo);
	socket.emit('moveLeft', {username: username, rotateAngle: obj.rotateTo});
}

function moveright() {
   
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	//obj.speedX += accelerate; 
	if(obj.rotateTo == 337.5 ){
		obj.rotateTo = -22.5;
	}
	obj.rotateTo += 22.5; 
	//console.log("RotateAngle",obj.rotateTo);
	socket.emit('moveLeft', {username: username, rotateAngle: obj.rotateTo});
}
function accelerate(op,val){
	
	var obj = getCurrentUserObj();
	if(op == 'add'){
		obj.accelerate += val;
	}else{
		obj.accelerate -= val;
	}
	socket.emit('accelerate', {username: username, accelerate: obj.accelerate});
	
}
function rotate(){
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	obj.rotateTo += 45;
	
}
function missileRight(){
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	obj.missileRotateTo += 45;
	socket.emit('missileControl', {username: username, missileRotateTo: obj.missileRotateTo});
}
function missileLeft(){
	var obj = globalUsers.find(function(key){
		return key.name == username;
	});
	obj.missileRotateTo -= 45;
	socket.emit('missileControl', {username: username, missileRotateTo: obj.missileRotateTo});
}
function fire(){
	//alert('fire');
	var obj = getCurrentUserObj();
	obj.fireInitiate = 1;
    socket.emit('fireInit', {username: username, fireInitiate: obj.fireInitiate});
}

document.body.onkeypress = function (event){
	
	if(!globalUsers.length){
		return
	}
	//console.log(event.keyCode,accelerate);             
    switch(event.keyCode){
    	case 97: moveleft(); break; // a
        case 119: moveup(); break; // w
        case 100: moveright(); break;// d
        case 115: movedown(); break; //s
        case 46: accelerate('add',2); break; //>
        case 44: accelerate('minus',1); break; // <
        case 114: rotate(); break; // <
        case 32: fire(); break; // bullet - space
		
    }
};
document.body.onkeyup = function (event){
	console.log('onkeyup:',event.keyCode);  
	if(!globalUsers.length){
		return
	}
//	console.log(event.keyCode,accelerate);             
    switch(event.keyCode){    	
        case 82: rotateButtonPressed = false; break; // <
		case 39: missileRight(); break;
		case 37: missileLeft(); break;
    }
};

