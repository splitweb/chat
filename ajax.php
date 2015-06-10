<?php
header("Access-Control-Allow-Origin: *");
function listen(){
	if(isset($_POST['write'])){
		verify();
		return;
	}
	elseif(isset($_POST['load'])){
		readMsg($_POST['load']["startLine"], $_POST['load']["limit"]);
	}
	elseif(isset($_POST['read'])){
		readMsg($_POST["read"]["startLine"], $_POST["read"]["limit"]);
	}elseif(isset($_POST['lazy'])){
		readMsg($_POST["lazy"]["startLine"], $_POST["lazy"]["limit"]);
	}
}

function readMsg($start = 10, $limit = 0){
	$f = fopen('db.txt', 'r');
	$total = 0;
	while ($line = fgets($f)) {
		$total++;
	}

	$curLine = 0;
	$f = fopen('db.txt', 'r');
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
	$message .= preg_replace("#\n#", " ", $_POST['write']['msg']);
	$message .= "</div></br>\n";
	$f = fopen('db.txt', 'a+');
	fwrite($f, $message);
	fclose($f);
	echo $message;
	return;
}

/**
 * Constructs the SSE data format and flushes that data to the client.
 *
 * @param string $id Timestamp/id of this connection.
 * @param string $msg Line of text that should be transmitted.
 */
// function sendMsg($msg) {
//   echo PHP_EOL;
//   echo "data: {\n";
//   echo "\"msg\": $msg\n";
//   echo "data: }\n";
//   echo PHP_EOL;
//   ob_flush();
//   flush();
// }


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