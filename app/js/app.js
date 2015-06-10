$(document).ready(function(){
	chat.preventDefault($('#chat'));
	chat.addLisnters();
	user.connectedAs();
	chat.loadFirst();
	chat.setInterval(chat.refresh);
	myAud=document.getElementById("notify");
	myAud.play();
});

var interval;
var chat = {};
var user = {};
var util = {};
var offset = 10;
var autoSend = false;

chat.preventDefault = function(e){
	e.submit(function(evt){
		evt.preventDefault();
		chat.write();
	});

	e.click(function(evt){
		evt.preventDefault();
	});
};

chat.successWrite = function(data){
	if(data == "false"){
		// custome alert box
		alert("An error occured\nPlease choose a name or send something");
	}
	else{
		user.initSession();
		$('#message').val("");
		$('#message').focus();
	}
};

chat.successLoad = function(data){
	 // console.log(data);
	 if(typeof($(data)[0]) == 'undefined'){
	 	return;
	 }
	 var a = $(data)[0].innerHTML;
	 var b = $('.post:last').html();
	if(a == b){}
	else{
		$('#messages').append(data);
		$('.post').addClass('animated bounceInLeft');
		user.userMessage();
		var objDiv = document.getElementById("messages");
		objDiv.scrollTop = objDiv.scrollHeight;
	}
};

chat.successRead = function(data){
	 // console.log(data);
	 if(typeof($(data)[0]) == 'undefined'){
	 	return;
	 }
	 var a = $(data)[0].innerHTML;
	 var b = $('.post:last').html();
	if(a == b){}
	else{
		$('#messages').append(data);
		$('.post').addClass('animated bounceInLeft');
		user.userMessage();

		if($('.post:last')[0].childNodes[1].innerHTML != user.getUser())
			chat.notify($('.post:last'));
		var objDiv = document.getElementById("messages");
		objDiv.scrollTop = objDiv.scrollHeight;
	}
};

chat.successLazy = function(data){
	// console.log(data);
	 if(typeof($(data)[0]) == 'undefined'){
	 	return;
	 }
	 var a = $(data)[0].innerHTML;
	 var b = $('.post:last').html();

	if(a == b){}
	else{
		$('#messages').prepend(data);
		user.userMessage();
		var objDiv = document.getElementById("messages");
		objDiv.scrollTop = 50;
	}
};

chat.addLisnters = function(){
	if(!util.isNodeWebkit()){
		$('#btn-close').css('display', 'none');
		$('#btn-minimize').css('display', 'none');
		$('.header-bar').css('display', 'none');
	}
	else{
		var gui = require('nw.gui');
		var win = gui.Window.get();
		$('#btn-minimize').click(function(e){
			win.minimize();
		});
		$('#btn-close').click(function(){
			chat.exit();
		});
	}

	$('#btn-send').click(function(){
		chat.write();
	});

	$('#messages').scroll(function(){
		if($(this).scrollTop() == 0){
			offset = offset+10;
			chat.lazyLoad(offset);
		}
	});
	$('#message').click(function(e){
		$(this).animate({
			height: 94,
		}, 250 );
	 	e.stopPropagation();
	});

	$('html').click(function(e){
		$('#message').animate({
			height: 21,
		}, 250 );
	});

	$('#auto-send').click(function(){
		autoSend = document.getElementById('auto-send').checked;
	});

	$('#message').keypress(function(e){
		if(autoSend){
			if(e.keyCode == 13){
				chat.write();
			}
		}
	});
}

chat.write = function(){
	var message = {};
	message.write = {
		user:$('#pseudo').val(),
		msg:$('#message').val()
	};
	Sophwork.AJAX(message, chat.successWrite, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
	// Sophwork.AJAX(message, chat.successWrite, "http://127.0.0.1/chat/ajax.php", 'text');
	chat.refresh();
};
chat.loadFirst = function(){
	var message = {};
	message.load = {
		startLine:10,
		limit:0,
	};
	Sophwork.AJAX(message, chat.successLoad, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
	// Sophwork.AJAX(message, chat.successLoad, "http://127.0.0.1/chat/ajax.php", 'text');
}
chat.refresh = function(){
	var message = {};
	message.read = {
		startLine:0,
		limit:0,
	};
	Sophwork.AJAX(message, chat.successRead, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
	// Sophwork.AJAX(message, chat.successRead, "http://127.0.0.1/chat/ajax.php", 'text');
}

chat.lazyLoad = function(offset){
	var message = {};
	message.lazy = {
		startLine:offset,
		limit:Math.abs(offset-10),
	};
	Sophwork.AJAX(message, chat.successLazy, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
	// Sophwork.AJAX(message, chat.successLazy, "http/127.0.0.1/chat/ajax.php", 'text');
};

chat.setInterval = function(){
	interval = setInterval(chat.refresh, 5000);
}



chat.exit = function(){
	var gui = require('nw.gui');
	// console.log(gui.App.argv);
	gui.App.quit();
};

user.initSession = function(){
	window.localStorage =  {};
	var session = window.localStorage;
	if(session.length == 0)
		session.user = $('#pseudo').val();
}

user.connectedAs = function(){
	var session = window.localStorage;
	if(session.length > 0)
		$('#pseudo').val(session.user);
};

user.getUser = function(){
	var session = window.localStorage;
	return session.user;
};

user.userMessage = function(){
	var userMsgs = document.querySelectorAll('.post');
	[].forEach.call(userMsgs, function(userMsg) {
		if(userMsg.children[1].innerHTML == user.getUser()){
			userMsg.classList.remove('msg-get');
			userMsg.classList.add('msg-send');
		}
	});
};

chat.notify = function(data){
	// console.log(data);
	// var [date, pseudo, plop, message] = data[0].childNodes; //not  ECMAScript6
	var date, pseudo, message;
	date = data[0].childNodes[0].innerHTML;
	pseudo = data[0].childNodes[1].innerHTML;
	message = data[0].childNodes[3].innerHTML;

	var options = {
		icon: "img/SplitChat.png",
		body: pseudo + " : " + message
	};

	if(chat.notifyGrant){
		var notification = new Notification("New message",options);
		notification.onclick = function () {
			notification.close()
		}
		notification.onshow = function () {
			myAud=document.getElementById("notify");
			myAud.play();
			setTimeout(function() {notification.close();}, 10000);
		}
		if(util.isNodeWebkit()){
			myAud=document.getElementById("notify");
			myAud.play();
		}
	}
};

chat.notifyGrant = function(){
	if (!("Notification" in window)) {
		alert("This browser does not support desktop notification");
	}

	// Let's check whether notification permissions have alredy been granted
	else if (Notification.permission === "granted") {
		// If it's okay let's create a notification
		return true;
	}

	// Otherwise, we need to ask the user for permission
	else if (Notification.permission !== 'denied') {
		Notification.requestPermission(function (permission) {
			// If the user accepts, let's create a notification
			if (permission === "granted") {
				return true;
			}
		});
	}
};

util.isNodeWebkit = function(){
	var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
	var isNodeWebkit = false;
		
	//Is this Node.js?
	if(isNode) {
	  //If so, test for Node-Webkit
	  try {
	    isNodeWebkit = (typeof require('nw.gui') !== "undefined");
	  } catch(e) {
	    isNodeWebkit = false;
	  }
	}
	return isNodeWebkit;
};