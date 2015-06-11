<?php
header("Access-Control-Allow-Origin: *");
function listen(){
	if(isset($_POST['write'])){
		$_POST['room'] = $_POST['write']['room'];
		if(!isset($_POST['write']['room']))
			$_POST['room'] = 'db';
		verify();
		return;
	}
	elseif(isset($_POST['load'])){
		$_POST['room'] = $_POST['load']['room'];
		if(!isset($_POST['load']['room']))
			$_POST['room'] = 'db';
		readMsg($_POST['load']["startLine"], $_POST['load']["limit"]);
	}
	elseif(isset($_POST['read'])){
		$_POST['room'] = $_POST['read']['room'];
		if(!isset($_POST['read']['room']))
			$_POST['room'] = 'db';
		readMsg($_POST["read"]["startLine"], $_POST["read"]["limit"]);
	}
	elseif(isset($_POST['lazy'])){
		$_POST['room'] = $_POST['lazy']['room'];
		if(!isset($_POST['lazy']['room']))
			$_POST['room'] = 'db';
		readMsg($_POST["lazy"]["startLine"], $_POST["lazy"]["limit"]);
	}
	elseif(isset($_POST['room'])){
		createRoomFile($_POST['room']['roomId']);
	}
}

function readMsg($start = 10, $limit = 0){
	if(!file_exists($_POST['room'].'.txt')){
		echo 'false-room';
		return;
	}
	// echo'<pre style="background:#ffffff">';
	// var_dump(file_exists($_POST['room'].'.txt'));
	// echo'</pre>';
	$f = fopen($_POST['room'].'.txt', 'r');
	$total = 0;
	while ($line = fgets($f)) {
		$total++;
	}

	$curLine = 0;
	$f = fopen($_POST['room'].'.txt', 'r');
	while ($line = fgets($f)) {
		$curLine++;
		if (($curLine >= ($total - $start))  && ($curLine <= ($total - $limit))) {
		    echo $line;
		}
	}
	fclose($f);
	return;
}

function writeMsg(){
	$date = date('Y-m-d H:i:s', strtotime("now"));
	$message = "<div class='post grid-2_3 msg-get'><b class='date'>" . $date . "</b><i class='pseudo'>" . $_POST['write']['user'] . "</i> : ";
	$message .= "<p>" . preg_replace("#\n#", " ", $_POST['write']['msg']) . "</p>";
	$message .= "</div></br>\n";
	$f = fopen($_POST['room'].'.txt', 'a+');
	fwrite($f, $message);
	fclose($f);
	echo $message;
	return;
}

function createRoomFile($roomId){
	$f = fopen($roomId . ".txt", "x+");
	if(!$f){
		echo 'false';
		return;
	}
	echo 'true';
	return;
}

function verify(){
	if(isset($_POST['write'])){
		if(!empty($_POST['write']['user']) && strlen($_POST['write']['user']) > 2
			&& !empty($_POST['write']['msg']) && strlen($_POST['write']['msg']) > 1){
			// prevent html code
			$_POST['write']['msg'] = trim(strip_tags($_POST['write']['msg']));
			if(empty($_POST['write']['msg'])){
				echo 'false';
				return;
			}
			writeMsg();
		}
		else{
			echo 'false';
			return;
		}

	}
}

listen();