$(document).ready(function(){
	user.startSession();
	chat.nodeCase();
	$('#connection').click(function(){
		if($('#pseudo').val() != ''){
			window.localStorage.user = $('#pseudo').val();
			window.localStorage.room = "#db";
			window.location = 'index.html';
		}
	});

	$('#connection').submit(function(e){
		e.preventDefault();
		if($('#pseudo').val() != ''){
			window.localStorage.user = $('#pseudo').val();
			window.localStorage.room = "#db";
			window.location = 'index.html';
		}
	});
});