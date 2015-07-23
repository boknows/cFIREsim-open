<?php
$db = new PDO('mysql:host=localhost;dbname=boknows_stock_data;charset=utf8', 'root', '');
if($_POST['param']=="getNames"){
	$stmt = $db->prepare('SELECT * FROM queries WHERE username = "bo_knows" ORDER BY simName');
	$stmt->execute();
	foreach ($stmt as $row) {
		$data['simName'][] = $row['simName'];	
		$data['qid'][] = $row['qid'];	
	}
	echo JSON_encode($data);
}


?>