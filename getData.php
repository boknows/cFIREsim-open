<?php
include 'db_connect.php';
if($_POST['param']=="getNames"){
	$stmt = $db->prepare('SELECT * FROM queriesJSON WHERE username = :username ORDER BY simName');
	$stmt->execute(array(':username' => $_POST['username']));
	foreach ($stmt as $row) {
		$data['simName'][] = $row['simName'];	
		$data['qid'][] = $row['qid'];	
	}
	echo JSON_encode($data);
}

if($_POST['param']=="saveSim"){
	$stmt = $db->prepare('INSERT INTO queriesJSON (username, simName, json) VALUES (:username, :simName, :json)');
	$stmt->execute(array(':username' => $_POST['username'], ':simName' => $_POST['simName'], ':json' => $_POST['json']));
	echo JSON_encode('Success');
}

if($_POST['param']=="getSavedSim"){
	$stmt = $db->prepare('SELECT * FROM queriesJSON WHERE qid = :qid');
	$stmt->execute(array(':qid' => $_POST['qid']));
	foreach ($stmt as $row) {
		$data = $row['json'];
	}
	echo JSON_encode($data);
}


?>