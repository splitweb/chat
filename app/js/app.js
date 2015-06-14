$(document).ready(function(){
	room.pastRoom();
	chat.preventDefault($('#chat'));
	chat.addLisnters();
	user.connectedAs();
	// user.initSession();
	chat.nodeCase();
	chat.loadFirst();
	intervalPost = chat.setInterval(chat.refresh);
	autoSend = document.getElementById('auto-send').checked;
	chat.notifyGrant();
});
