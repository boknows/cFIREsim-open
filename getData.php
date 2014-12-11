<?php
### getData.php - Retrieves historical data for simulation
$db = new PDO('mysql:host=localhost;dbname=cfiresim;charset=utf8', 'root', '');

$sql = "SELECT * FROM multipliers"; 
foreach ($db->query($sql) as $row) {
	$data[] = array("Date" => $row['Date'], "MarketGrowth" => $row['MarketGrowth'], "DividendGrowth" => $row['Dividends'], "CPI" => $row['CPI'], "FixedIncomeGrowth" =>$row['FixedIncome'], "Gold" => $row['Gold']); 
}
echo JSON_encode($data);

?>