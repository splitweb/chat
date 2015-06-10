$(document).ready(function(){
	chat.preventDefault($('#chat'));
	chat.addLisnters();
	user.connectedAs();
	chat.loadFirst();
	chat.setInterval(chat.refresh);
});

var interval;
var chat = {};
var user = {};
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
		var objDiv = document.getElementById("messages");
		objDiv.scrollTop = objDiv.scrollHeight;
	}
};

chat.successLazy = function(data){
	console.log(data);
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
	$('#btn-send').click(function(){
		chat.write();
	});
	$('#btn-close').click(function(){
		chat.exit();
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
	chat.refresh();
};
chat.loadFirst = function(){
	var message = {};
	message.load = {
		startLine:10,
		limit:0,
	};
	Sophwork.AJAX(message, chat.successRead, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
}
chat.refresh = function(){
	var message = {};
	message.read = {
		startLine:0,
		limit:0,
	};
	Sophwork.AJAX(message, chat.successRead, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
}

chat.lazyLoad = function(offset){
	var message = {};
	message.lazy = {
		startLine:offset,
		limit:Math.abs(offset-10),
	};
	Sophwork.AJAX(message, chat.successLazy, "http://splitweb.fr/splitapp/splitchat/ajax.php", 'text');
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

user.userMessage = function(){
	var session = window.localStorage;
	var userMsgs = document.querySelectorAll('.post');
	[].forEach.call(userMsgs, function(userMsg) {
		if(userMsg.children[1].innerHTML == window.localStorage.user){
			userMsg.classList.remove('msg-get');
			userMsg.classList.add('msg-send');
		}
	});
};