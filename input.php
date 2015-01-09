<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes">
	<meta name="description" content="A Crowdsourced Financial Independence and Early Retirement Simulator and Calculator. Uses historic stock data to model your retirement and give you a success rate based on all of the possible periods of time in the stock market (good and bad)."><title>Crowdsourced Financial Independence and Early Retirement Simulator/Calculator</title>
    <script src='http://code.jquery.com/jquery-1.10.2.min.js' language='Javascript' type='text/javascript'></script>
	<script type="text/javascript" src="js/bootstrap.min.js"></script>
	<script type="text/javascript" src="js/bootstrap-select.min.js"></script> 
	<?php
		echo '<script type="text/javascript" src="js/cFIREsimOpen.js?v='.time().'"></script>';
		echo '<script type="text/javascript" src="js/formData-stub.js?v='.time().'"></script>';
		echo '<script type="text/javascript" src="js/marketData.js?v='.time().'"></script>';
	?>
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
	<link href="css/bootstrap-select.min.css" rel="stylesheet">
  </head>
<body>
	<div class="page-header">
        <h1 class="text-center">The Crowdsourced FIRE Simulator (cFIREsim) - Open Source</h1>
    </div>
    <div class="container">
    	<div class="row">
    		<p>Press button below, and see results in the Javascript Console</p>
			<div class="input-group col-md-9">
				<span class='input-group-addon'><b>Portfolio:</b></span><input type='text' name='portfolio' class='form-control' id='portfolio' value="1000000">
			</div>
			<div class="input-group col-md-9">
				<span class='input-group-addon'><b>Spending:</b></span><input type='text' name='spending' class='form-control' id='spending' value="40000">
			</div>
			<div class="input-group col-md-9">
				<span class='input-group-addon'><b>Retirement Start Year:</b></span><input type='text' name='retirementStartYear' class='form-control' id='retirementStartYear' value="2014">
			</div>
			<div class="input-group col-md-9">
				<span class='input-group-addon'><b>Retirement End Year:</b></span><input type='text' name='retirementEndYear' class='form-control' id='retirementEndYear' value="2044">
			</div>
			<div class='input-group'>
				<button class="btn btn-success btn-large" id='runSim' type='button'>Run Simulation</button>
			</div>
    	</div>
    </div>
</body>
</html>