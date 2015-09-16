<?php
	//include 'headers.php';
	error_reporting(0);

?>
<!DOCTYPE html>
<html lang="en" ng-app="cFIREsim">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes">
		<meta name="description" content="A Crowdsourced Financial Independence and Early Retirement Simulator and Calculator. Uses historic stock data to model your retirement and give you a success rate based on all of the possible periods of time in the stock market (good and bad)."><title>Crowdsourced Financial Independence and Early Retirement Simulator/Calculator</title>
		<style>
		.dygraph-axis-label-y { padding-right:10px; padding-left:10px;}
		.output > span { display: none; }
  		.output > span.highlight { display: inline; }
  		.output { color: black; }
		#tabNav .nav-pills > li > a {
		  border-radius: 4px 4px 0 0 ;
		}

		#tabNav .tab-content {
		  color : white;
		  background-color: #428bca;
		}
			
		.table {
			background-color: white;
			color: black;
		}
			
		.table-nonfluid {
			width: auto !important;
			font-size: 80%;
		}
			
		.table-nonfluid th {
			width: auto !important;
		}

		.table-nonfluid th {
			background-color: grey;
		}

		.rowHeaders tr td:first-child {
			background-color: grey;
			font-weight: bold;
		}

		</style>
		<script src='http://code.jquery.com/jquery-1.10.2.min.js' language='Javascript' type='text/javascript'></script>
		<script type="text/javascript" src="http://dygraphs.com/dygraph-combined.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		<script type="text/javascript" src="js/bootstrap-select.min.js"></script>
		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.3.7/angular.min.js"></script>
		<script type="text/javascript" src="https://cdn.datatables.net/r/bs/dt-1.10.8/datatables.min.js"></script>
		<script type="text/javascript" src="js/accounting.min.js"></script>

		<script type="text/javascript" src="js/cFIREsimOpen.js"></script>
		<script type="text/javascript" src="js/formData-stub.js"></script>
		<script type="text/javascript" src="js/marketData.js"></script>
		<script type="text/javascript" src="js/spendingModule.js"></script>
		<script type="text/javascript" src="js/statsModule.js"></script>
		<script type="text/javascript" src="js/validation.js"></script>

		<!-- Bootstrap core CSS -->
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/bootstrap-select.min.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/r/bs/dt-1.10.8/datatables.min.css"/>
	</head>
	<body>
		<!-- Welcome Modal -->
		<div class="modal fade" id="welcomeModal" tabindex="" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title">Welcome to the cFIREsim Open Project</h4>
					</div>
					<div class="modal-body">
						<p class="alert alert-success">
							 9-16-2015 - Added VPW Spending Method and Investigate Maximum Spending option. 
						</p>
						<p>
							The cFIREsim Open Project is a completely rebuilt version of cFIREsim with efficiency and transparaceny in mind. Currently not <b>all</b> of the cFIREsim legacy capabilities exist here, but you can access the <a href="http://gator3089.hostgator.com/~boknows/input.php">old site</a> until they do.
						</p>
						<p>
							All of the code for cFIREsim Open is located in the <a href="https://github.com/boknows/cFIREsim-open">GitHub Repo</a>. Feel free to contribute new ideas, or <a href="https://github.com/boknows/cFIREsim-open/issues">report any issues you might find.</a>
						</p>
						<p>
							All of the current issues and enhancement requests are listsed on <a href="https://github.com/boknows/cFIREsim-open/issues">the GitHub Issues Page</a>. The list of backlogged issues and the list of issues I'm currently working on can be found <a href="https://trello.com/b/traCS117/cfiresim-open">on my Trello board.</a>
						</p>
						<p>
							I hope that you enjoy the new format, and I look forward to bringing new things to cFIREsim.
						</p>
						<p>
							-Bo
						</p>
						<p class="alert alert-danger">
							 Any issues? <a href="mailto:cfiresim@gmail.com">Email me</a>.
						</p>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
					</div>
				</div>
		  </div>
		</div>
		<div class="page-header">
			<h1 class="text-center">The Crowdsourced FIRE Simulator (cFIREsim) - Open Source</h1>
		</div>
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					</button>
				</div>
				<!-- Collect the nav links, forms, and other content for toggling -->
				<div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<?php
						//Start Login Code. Unnecessary for standalone app
								if(!($user->data['is_registered'])){
									echo "<li><button type='button' class='btn btn-default navbar-btn' id='signInBtn'><img src='http://www.cfiresim.com/phpBB3/styles/prosilver/theme/images/icon_logout.gif'>Sign in</button></li>";
								}else {
									echo "<p class='navbar-text'>Logged in as [ <font color='red'><b id='username'>" . $user->data['username'] . " </b></font>]</p>";
									echo '<li><p class="navbar-btn btn btn-default"><img src="http://www.cfiresim.com/phpBB3/styles/prosilver/theme/images/icon_logout.gif"><a href="http://www.cfiresim.com/phpBB3/ucp.php?mode=logout&sid=' . $user->session_id . '">Sign Out</a></p></li>';
									echo '<li><button type="button" class="btn btn-default navbar-btn" id="saveSimBtn">Save Simulation Inputs</button></li>';
									echo '<li class="dropdown">
										<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Load Saved Sim <span class="caret"></span></a>
										<ul class="dropdown-menu" id="savedSimsDropdown">
										</ul>
									</li>';

								}
								//End Login Code
						?>
					</ul>
					<ul class="nav navbar-nav navbar-right">
						<li>
							<p class="navbar-btn">
								<a href="phpBB3/index.php" class="btn btn-default">cFIREsim Forums</a>
							</p>
						</li>
						<li>
							<p class="navbar-btn">
								<a data-toggle="modal" href="#donateModal" class="btn btn-default">Donate/Support</a>
							</p>
						</li>
						<li>
							<p class="navbar-btn">
								<a data-toggle="modal" href="#reportIssueModal" class="btn btn-default">Report an Issue</a>
							</p>
						</li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Blogs/Forums <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="http://www.bogleheads.org">Bogleheads</a></li>
							<li><a href="http://bucking-the-trend.com/">Bucking The Trend</a></li>
							<li><a href="http://earlyretirementextreme.com/">Early Retirement Extreme</a></li>
							<li><a href="http://early-retirement.org">Early-Retirement.org</a></li>
							<li><a href="http://www.gocurrycracker.com/">Go Curry Cracker!</a></li>
							<li><a href="http://www.1500Days.com/">1500 Days</a></li>
							<li><a href="http://the-military-guide.com/">Military Retirement</a></li>
							<li><a href="http://www.mrmoneymustache.com">Mr. Money Mustache</a></li>
							<li><a href="http://wpfau.blogspot.com/">Wade Pfau's Retirement Research</a></li>
						</ul>
					</li>
					<li class="dropdown">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Other Calculators/Tools <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="https://www.fidelity.com/calculators-tools/retirement-income-planner">Fidelity Retirement Income Planner</a></li>
							<li><a href="http://www.firecalc.com">FireCalc</a></li>
							<li><a href="http://www.i-orp.com/">Optimized Retirement Planner (i-ORP)</a></li>
							<li><a href="http://www.ssa.gov/estimator/">Social Security Benefits Estimator</a></li>
							<li><a href="http://www.vanguard.com/us/insights/retirement/plan-for-a-long-retirement-tool">Vanguard Life Expectancy Tool</a></li>
						</ul>
					</li>
				</ul>
				</div><!-- /.navbar-collapse -->
				</div><!-- /.container-fluid -->
			</nav>
			<div id="input" ng-controller="simulationInputController">
				<form name="form">
				<div class="row">
					<div class="col-md-12" style="display:none" id="loadedSimHeader">
						<div class="panel panel-success">
							<div class="panel-heading" id="loadedSimHeaderText">
								Successfully loaded  
							</div>
						</div>
					</div>
					<div class="col-md-12" style="display:none" id="loadedSimFail">
						<div class="panel panel-danger">
							<div class="panel-heading" id="loadedSimFailText">
								Failed to load  
							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<div class="panel panel-primary">
							<div class="panel-heading">
								Basics  
							</div>
							<div class="panel-body">
								<div class="alert alert-danger" role="alert" id="yearsError" style="display:none">
									<span class="sr-only">Error:</span>
									Retirement Start must be >= Current Year. Retirement Start must be before Retirement End.
								</div>
								<label>Retirement Year:<input type="text" class="form-control" ng-model="data.retirementStartYear"></label>
								<label>Retirement End Year:<input type="text" class="form-control" ng-model="data.retirementEndYear"></label>

								<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
								<!-- cFIREsim Open -->
								<ins class="adsbygoogle"
								     style="display:block"
								     data-ad-client="ca-pub-5980092593965662"
								     data-ad-slot="3095196591"
								     data-ad-format="auto"></ins>
								<script>
								(adsbygoogle = window.adsbygoogle || []).push({});
								</script>
							</div>
						</div>

					</div>
					<div class="col-md-6">
						<div class="panel panel-primary">
							<div class="panel-heading">
								Data Options
							</div>
							<div class="alert alert-danger" role="alert" id="dataError" style="display:none">
								<span class="sr-only">Error:</span>
								Start Year must be >= 1871. Start Year must be less than End Year. End Year must be less than current year. Total span of years must be > simulation period. 
							</div>
							<div class="alert alert-danger" role="alert" id="dataRateError" style="display:none">
								<span class="sr-only">Error:</span>
								Market Growth must be a positive integer. 
							</div>
							<div class="panel-body">
								<label>Data To Use:
									<select class="form-control"
										ng-model="data.data.method"
										ng-change="refreshDataForm()"
										ng-options="dataOptions.value as dataOptions.text for dataOptions in dataOptionTypes">
									</select>
								</label>

								<div id="historicalSpecificOptions" class="dataOptions" style="display:none">
									<label>Starting Data Year:
										<div class="input-group">
											<input type="text" class="form-control" ng-model="data.data.start">
										</div>
									</label>
									<label>Ending Data Year:
										<div class="input-group">
											<input type="text" class="form-control" ng-model="data.data.end">
										</div>
									</label>
								</div>
								<div id="singleCycleOptions" class="dataOptions" style="display:none">
									<label>Starting Data Year:
										<div class="input-group">
											<input type="text" class="form-control" ng-model="data.data.singleStart">
										</div>
									</label>
								</div>
								<div id="constantGrowthOptions" class="dataOptions" style="display:none">
									<label>Market Growth:
										<div class="input-group">
											<input type="text" class="form-control" ng-model="data.data.growth">
											<span class="input-group-addon">%</span>
										</div>
									</label>
								</div>
								<div class="row">
									<div class="col-md-12">
										<label>Investigate:
											<select class="form-control"
												ng-model="data.investigate.type"
												ng-change="refreshInvestigateForm()"
												ng-options="investigateOptions.value as investigateOptions.text for investigateOptions in investigateOptionTypes">
											</select>
										</label>
									</div>
								</div>
								<div id="maxInitialSpendingOptions" class="dataOptions" style="display:none">
									<label>Minimum Success Rate:
										<div class="input-group">
											<input type="text" class="form-control" ng-model="data.investigate.successRate">
											<span class="input-group-addon">%</span>
										</div>
									</label>
								</div>
								<br><a data-toggle="modal" href="#outputModal" class="btn btn-success btn-lg runSim" ng-click="runSimulation()">Run Simulation</a>

							</div>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-md-6">
						<div class="panel panel-primary" id="portfolioPanel">
							<div class="panel-heading">
								Portfolio
							</div>
							<div class="panel-body">
								<div class="alert alert-danger" role="alert" id="portfolioError" style="display:none">
									<span class="sr-only">Error:</span>
									Portfolio must be a positive integer.
								</div>
								<label>Portfolio Value:<input type="number" class="form-control" ng-model="data.portfolio.initial"></label>
								<div class="panel panel-default">
									<div class="panel-heading">
										Initial Assets
									</div>
									<div class="panel-body">
										<div class="row">
											<div class="alert alert-danger" role="alert" id="allocationError" style="display:none">
												<span class="sr-only">Error:</span>
												Allocations must add up to 100%
											</div>
											<div class="col-md-6">
												<label>Equities:
													<div class="input-group">
														<input type="text" class="form-control" ng-model="data.portfolio.percentEquities">
														<span class="input-group-addon">%</span>
													</div>
												</label>
											</div>
											<div class="col-md-6">
												<label>Bonds:
													<div class="input-group">
														<input type="text" class="form-control" ng-model="data.portfolio.percentBonds">
														<span class="input-group-addon">%</span>
													</div>
												</label>
											</div>
										</div>
										<div class="row">
											<div class="col-md-6">
												<label>Gold:
													<div class="input-group">
														<input type="text" class="form-control" ng-model="data.portfolio.percentGold">
														<span class="input-group-addon">%</span>
													</div>
												</label>
											</div>
											<div class="col-md-6">
												<label>Cash:
													<div class="input-group">
														<input type="text" class="form-control" ng-model="data.portfolio.percentCash">
														<span class="input-group-addon">%</span>
													</div>
												</label>
											</div>
										</div>
										<div class="row">
											<div class="col-md-6">
												<label>Fees/Drag:
													<div class="input-group">
														<input type="text" class="form-control" ng-model="data.portfolio.percentFees">
														<span class="input-group-addon">%</span>
													</div>
												</label>
											</div>
											<div class="col-md-6">
												<label>Growth of Cash:
													<div class="input-group">
														<input type="text" class="form-control" ng-model="data.portfolio.growthOfCash">
														<span class="input-group-addon">%</span>
													</div>
												</label>
											</div>
										</div>
									</div>
								</div>
								<div class="row" style="display:none">
									<div class="col-md-6">
										<div class="form-group">
											<label>Rebalance Annually:</label>
											<div>
												<label class="radio-inline">
													<input type="radio" name="rebalanceProtfolioRadio" value="true" ng-model="data.portfolio.rebalanceAnnually" ng-value="true" ng-change="enableRebalancing(true)">Yes
												</label>
												<label class="radio-inline">
													<input type="radio" name="rebalanceProtfolioRadio" value="false" ng-model="data.portfolio.rebalanceAnnually" ng-value="false" ng-change="enableRebalancing(false)">No
												</label>
											</div>
										</div>
									</div>
									<div class="col-md-6">
										<div class="form-group">
											<label>Keep Allocation Constant:</label>
											<div>
												<label class="radio-inline">
													<input type="radio" name="constantAllocationRadio" value="true" ng-model="data.portfolio.constantAllocation" ng-value="true" ng-change="enableChangeAllocation(true)">Yes
												</label>
												<label class="radio-inline">
													<input type="radio" name="constantAllocationRadio" value="false" ng-model="data.portfolio.constantAllocation" ng-value="false" ng-change="enableChangeAllocation(false)">No
												</label>
											</div>
										</div>
									</div>
								</div>
								<div class="panel panel-default" style="display:none">
									<div class="panel-heading">
										Target Assets
									</div>
									<div class="panel-body">
										<div class="row">
											<div class="col-md-6">
												<label>Start Year:
													<input type="text" class="form-control" ng-model="data.portfolio.changeAllocationStartYear">
												</label>
											</div>
											<div class="col-md-6">
												<label>End Year:
													<input type="text" class="form-control" ng-model="data.portfolio.changeAllocationEndYear">
												</label>
											</div>
										</div><div class="row">
										<div class="col-md-6">
											<label>Equities:
												<div class="input-group">
													<input type="text" class="form-control" ng-model="data.portfolio.targetPercentEquities">
													<span class="input-group-addon">%</span>
												</div>
											</label>
										</div>
										<div class="col-md-6">
											<label>Bonds:
												<div class="input-group">
													<input type="text" class="form-control" ng-model="data.portfolio.targetPercentBonds">
													<span class="input-group-addon">%</span>
												</div>
											</label>
										</div>
									</div>
									<div class="row">
										<div class="col-md-6">
											<label>Gold:
												<div class="input-group">
													<input type="text" class="form-control" ng-model="data.portfolio.targetPercentEquities">
													<span class="input-group-addon">%</span>
												</div>
											</label>
										</div>
										<div class="col-md-6">
											<label>Cash:
												<div class="input-group">
													<input type="text" class="form-control" ng-model="data.portfolio.targetPercentBonds">
													<span class="input-group-addon">%</span>
												</div>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-6">
					<div class="panel panel-primary">
						<div class="panel-heading">
							Spending Plan
						</div>
						<div class="alert alert-danger" role="alert" id="initialSpendingError" style="display:none">
							<span class="sr-only">Error:</span>
							Initial Spending amount must be a positive integer.
						</div>
						<div class="panel-body">
							<label>Spending Plan:
								<select class="form-control"
									ng-model="data.spending.method"
									ng-change="refreshSpendingForm()"
									ng-options="spendingPlan.value as spendingPlan.text for spendingPlan in spendingPlanTypes">
								</select>
							</label>
							<div id="yearlySpendingOptions" class="spendingOptions">
								<label>Initial Yearly Spending:
									<div class="input-group">
										<span class="input-group-addon">$</span>
										<input type="text" class="form-control" ng-model="data.spending.initial">
									</div>
								</label>
							</div>
							<div id="percentageOfPortfolioOptions" class="spendingOptions">
	                            <label>Yearly Spending (% of portfolio):
	                                <div class="input-group">
	                                    <input  type="text"
	                                            class="form-control"
	                                            ng-model="data.spending.percentageOfPortfolioPercentage">
	                                    <span class="input-group-addon">%</span>
	                                </div>
	                            </label>
	                            <div id="percentageOfPortfolioLimits">
	                                <label>Floor Spending:
	                                    <div class="input-group">
	                                        <select class="form-control"
	                                                ng-model="data.spending.percentageOfPortfolioFloorType"
	                                                ng-change="clearProperty(true, 'data.spending.percentageOfPortfolioFloorValue')"
	                                                ng-options="limitType.value as limitType.text for limitType in percentOfPortfolioFloorLimitTypes">
	                                        </select>     
	                                    </div>                           
	                                </label>
	                                <label>Never Less Than:
	                                    <div class="input-group">
	                                        <span class="input-group-addon" ng-show="data.spending.percentageOfPortfolioFloorType == 'definedValue'">$</span>
	                                        <input type="text"
	                                                class="form-control"
	                                                ng-model="data.spending.percentageOfPortfolioFloorValue"
	                                                ng-disabled="data.spending.percentageOfPortfolioFloorType == 'none' || data.spending.percentageOfPortfolioFloorType == 'pensions'">
	                                        <span class="input-group-addon" ng-show="data.spending.percentageOfPortfolioFloorType != 'definedValue'">%</span>
	                                    </div>
	                                </label>
	                                <br>                              
	                                <label>Ceiling Spending:
	                                    <div class="input-group">
	                                        <select class="form-control"
	                                                ng-model="data.spending.percentageOfPortfolioCeilingType"
	                                                ng-change="clearProperty(true, 'data.spending.percentageOfPortfolioCeilingValue')"
	                                                ng-options="limitType.value as limitType.text for limitType in percentOfPortfolioCeilingLimitTypes">
	                                        </select>   
	                                    </div>                             
	                                </label>
	                                <label>Never More Than:
	                                    <div class="input-group">
	                                        <span class="input-group-addon" ng-show="data.spending.percentageOfPortfolioCeilingType == 'definedValue'">$</span>
	                                        <input  type="text"
	                                                class="form-control"
	                                                ng-model="data.spending.percentageOfPortfolioCeilingValue"
	                                                ng-disabled="data.spending.percentageOfPortfolioCeilingType == 'none'">
	                                        <span class="input-group-addon" ng-show="data.spending.percentageOfPortfolioCeilingType != 'definedValue'">%</span>
	                                    </div>
	                                </label>
	                            </div>
	                        </div>
							<div id="hebelerAutopilotOptions" class="spendingOptions">
								<label>Age of Retirement:
									<input type="text" class="form-control" ng-model="data.spending.hebelerAgeOfRetirement">
								</label>
								<label>Weighted RMD:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.hebelerWeightedRMD">
										<span class="input-group-addon">%</span>
									</div>
								</label>
								<label>Weighted CPI:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.hebelerWeightedCPI">
										<span class="input-group-addon">%</span>
									</div>
								</label>
							</div>
							<div id="variableSpendingOptions" class="spendingOptions">
								<label>Z Value (0.000 - 1.000):
									<input type="text" class="form-control" ng-model="data.spending.variableSpendingZValue">
								</label>
							</div>
							<div id="guytonKlingerOptions" class="spendingOptions">
								<label>Exceeds:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.guytonKlingerExceeds">
										<span class="input-group-addon">%</span>
									</div>
								</label>
								<label>Cut:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.guytonKlingerCut">
										<span class="input-group-addon">%</span>
									</div>
								</label>
								<br>
								<label>Fall:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.guytonKlingerFall">
										<span class="input-group-addon">%</span>
									</div>
								</label>
								<label>Raise:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.guytonKlingerRaise">
										<span class="input-group-addon">%</span>
									</div>
								</label>
							</div>
							<div id="retireAgainAndAgainOptions" class="spendingOptions">
								<label>RAA Target Portfolio Amount:
									<div class="input-group">
										<select class="form-control"
											ng-model="data.spending.retireAgainAmountType"
											ng-options="retireAgainAmountType.value as retireAgainAmountType.text for retireAgainAmountType in retireAgainAmountTypes">
										</select>
									</div>
								</label>
								<label>RAA Custom Portfolio Target:
									<div class="input-group">
										<span class="input-group-addon">$</span>
										<input  type="text"
										class="form-control"
										ng-model="data.spending.retireAgainCustomTarget">
									</div>
								</label>
								<label>Threshold for Spending Increase:
									<div class="input-group">
										<input  type="text"
										class="form-control"
										ng-model="data.spending.retireAgainThreshold">
										<span class="input-group-addon">%</span>
									</div>
								</label>
							</div>
							<div id="customVPWOptions" class="spendingOptions">
								<div class="panel panel-default">
									<div class="panel-body">
										<p>The PMT function used in VPW is calculated based on the "Years to model" and your actual retirement year. The Initial Withdrawal Rate is based on the portfolio during the first year of retirement, and your "Yearly Spending" listed in the Spending Plan section.</p>
									</div>
								</div>
							</div>
							<div id="spendingLimitOptions" class="spendingOptions">
								<label>Spending Floor (Inflation Adjusted):
									<select class="form-control"
										ng-model="data.spending.floor"
										ng-options="floor.value as floor.text for floor in spendingFloorTypes">
									</select>
								</label>
								<div class="input-group">
									<span class="input-group-addon">$</span>
									<input  type="text"
									class="form-control"
									ng-model="data.spending.floorValue"
									ng-disabled="data.spending.floor != 'definedValue'">
								</div>
								<label>Spending Ceiling (Inflation Adjusted):
									<select class="form-control"
										ng-model="data.spending.ceiling"
										ng-options="ceiling.value as ceiling.text for ceiling in spendingCeilingTypes">
									</select>
								</label>
								<div class="input-group">
									<span class="input-group-addon">$</span>
									<input  type="text"
									class="form-control"
									ng-model="data.spending.ceilingValue"
									ng-disabled="data.spending.ceiling != 'definedValue'">
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-12">
					<div class="panel panel-primary">
						<div class="panel-heading">
							Extra Income/Savings
						</div>
						<div class="panel-body">
							<div class="panel panel-default">
								<div class="panel-heading">
									Social Security
								</div>
								<div class="panel-body">
									<div class="alert alert-danger" role="alert" id="ssError" style="display:none">
										<span class="sr-only">Error:</span>
										Start Year must be >= current year. Start Year must be less than End Year.
									</div>
									<div class="alert alert-danger" role="alert" id="ssValueError" style="display:none">
										<span class="sr-only">Error:</span>
										Amount must be a positive integer.
									</div>
									<div class="row">
										<div class="col-md-4">
											<label>Annual:
												<div class="input-group">
													<span class="input-group-addon">$</span>
													<input type="text" class="form-control" ng-model="data.extraIncome.socialSecurity.val">
												</div>
											</label>
										</div>
										<div class="col-md-4">
											<label>Start Year:<input type="text" class="form-control" ng-model="data.extraIncome.socialSecurity.startYear"></label>
										</div>
										<div class="col-md-4">
											<label>End Year:<input type="text" class="form-control" ng-model="data.extraIncome.socialSecurity.endYear"></label>
										</div>
									</div>
									<div class="row">
										<div class="col-md-4">
											<label>Annual Spousal:
												<div class="input-group">
													<span class="input-group-addon">$</span>
													<input type="text" class="form-control" ng-model="data.extraIncome.socialSecuritySpouse.val">
												</div>
											</label>
										</div>
										<div class="col-md-4">
											<label>Start Year:<input type="text" class="form-control" ng-model="data.extraIncome.socialSecuritySpouse.startYear"></label>
										</div>
										<div class="col-md-4">
											<label>End Year:<input type="text" class="form-control" ng-model="data.extraIncome.socialSecuritySpouse.endYear"></label>
										</div>
									</div>
								</div>
							</div>
							<div class="panel panel-default">
								<div class="panel-heading">
									Pensions
								</div>
								<div class="panel-body">
									<div class="alert alert-danger" role="alert" id="pensionsError" style="display:none">
										<span class="sr-only">Error:</span>
										Pension Start Year must be >= the current year and must be an integer. 
									</div>
									<div class="alert alert-danger" role="alert" id="pensionsValueError" style="display:none">
										<span class="sr-only">Error:</span>
										Amount must be a positive integer.
									</div>
									<div class="alert alert-danger" role="alert" id="pensionsRateError" style="display:none">
										<span class="sr-only">Error:</span>
										Pension inflation rate must be a positive integer. 
									</div>
									<table class="table">
										<thead>
											<tr>
												<th>
													Label
												</th>
												<th>
													Amount ($)
												</th>
												<th>
													Start Year
												</th>
												<th>
													Inflation Adjusted
												</th>
												<th>
													Inflation Type
												</th>
												<th>
													Inflation %
												</th>
												<th>
												</th>
											</tr>
										</thead>
										<tbody>
											<tr ng-repeat="pension in data.extraIncome.pensions">
												<td>
													<input type="text" class="form-control" ng-model="pension.label">
												</td>
												<td>
													<input type="text" class="form-control" ng-model="pension.val">
												</td>
												<td>
													<input type="text" class="form-control" ng-model="pension.startYear">
												</td>
												<td>
													<select class="form-control"
														ng-model="pension.inflationAdjusted"
														ng-options="bool for bool in boolOptions"
														ng-change="changeInflationAdjusted($index, data.extraIncome.pensions)">
													</select>
												</td>
												<td>
													<select class="form-control"
														ng-model="pension.inflationType"
														ng-options="option.value as option.text for option in inflationTypes"
														ng-change="changeInflationType($index, data.extraIncome.pensions)"
														ng-disabled="!pension.inflationAdjusted">
													</select>
												</td>
												<td>
													<input type="text"
													class="form-control"
													ng-model="pension.inflationRate"
													ng-disabled="pension.inflationType != 'constant' || !pension.inflationAdjusted">
												</td>
												<td>
													<input type="button" ng-click="removeObject($index, data.extraIncome.pensions)" value="Delete"/>
												</td>
											</tr>
										</tbody>
									</table>
									<input type="button" ng-click="addObject(data.extraIncome.pensions)" value="Add Pension"/>
								</div>
							</div>
							<div class="panel panel-default">
								<div class="panel-heading">
									Other Income
								</div>
								<div class="alert alert-danger" role="alert" id="extraIncomeRateError" style="display:none">
									<span class="sr-only">Error:</span>
									Extra Income inflation rate must be a positive integer. 
								</div>
								<div class="alert alert-danger" role="alert" id="extraIncomeValueError" style="display:none">
									<span class="sr-only">Error:</span>
									Amount must be a positive integer. 
								</div>
								<div class="alert alert-danger" role="alert" id="extraIncomeError" style="display:none">
									<span class="sr-only">Error:</span>
									Start Year must be >= current year. Start Year must be less than End Year.
								</div>
								<div class="panel-body">
									<table class="table">
										<thead>
											<tr>
												<th>
													Label
												</th>
												<th>
													Amount ($)
												</th>
												<th>
													Recurring
												</th>
												<th>
													Start year
												</th>
												<th>
													End Year
												</th>
												<th>
													Inflation Adjusted
												</th>
												<th>
													Inflation Type
												</th>
												<th>
													Inflation %
												</th>
												<th>
												</th>
											</tr>
										</thead>
										<tbody>
											<tr ng-repeat="extraSaving in data.extraIncome.extraSavings">
												<td>
													<input type="text" class="form-control" ng-model="extraSaving.label">
												</td>
												<td>
													<input type="text" class="form-control" ng-model="extraSaving.val">
												</td>
												<td>
													<select class="form-control"
														ng-model="extraSaving.recurring"
														ng-options="bool for bool in boolOptions"
														ng-change="clearEndYear($index, data.extraIncome.extraSavings)">
													</select>
												</td>
												<td>
													<input type="text" class="form-control" ng-model="extraSaving.startYear">
												</td>
												<td>
													<input  type="text"
													class="form-control"
													ng-model="extraSaving.endYear"
													ng-disabled="!extraSaving.recurring">
												</td>
												<td>
													<select class="form-control"
														ng-model="extraSaving.inflationAdjusted"
														ng-options="bool for bool in boolOptions"
														ng-change="changeInflationAdjusted($index, data.extraIncome.extraSavings)">
													</select>
												</td>
												<td>
													<select class="form-control"
														ng-model="extraSaving.inflationType"
														ng-options="option.value as option.text for option in inflationTypes"
														ng-change="changeInflationType($index, data.extraIncome.extraSavings)"
														ng-disabled="!extraSaving.inflationAdjusted">
													</select>
												</td>
												<td>
													<input type="text"
													class="form-control"
													ng-model="extraSaving.inflationRate"
													ng-disabled="extraSaving.inflationType != 'constant' || !extraSaving.inflationAdjusted">
												</td>
												<td>
													<input type="button" ng-click="removeObject($index, data.extraIncome.extraSavings)" value="Delete"/>
												</td>
											</tr>
										</tbody>
									</table>
									<input type="button" ng-click="addObject(data.extraIncome.extraSavings)" value="Add Savings"/>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="col-md-12">
					<div class="panel panel-primary">
						<div class="panel-heading">
							Extra Spending
						</div>
						<div class="panel-body">
							<div class="panel panel-default">
								<div class="panel-heading">
									Other Spending
								</div>
								<div class="alert alert-danger" role="alert" id="extraSpendingError" style="display:none">
									<span class="sr-only">Error:</span>
									Start Year must be >= current year. Start Year must be less than End Year.
								</div>
								<div class="alert alert-danger" role="alert" id="extraSpendingValueError" style="display:none">
									<span class="sr-only">Error:</span>
									Amount must be a positive integer.
								</div>
								<div class="alert alert-danger" role="alert" id="extraSpendingRateError" style="display:none">
									<span class="sr-only">Error:</span>
									Inflation Rate for Spending must be a positive integer. 
								</div>
								<div class="panel-body">
									<table class="table">
										<thead>
											<tr>
												<th>
													Label
												</th>
												<th>
													Amount ($)
												</th>
												<th>
													Recurring
												</th>
												<th>
													Start year
												</th>
												<th>
													End Year
												</th>
												<th>
													Inflation Adjusted
												</th>
												<th>
													Inflation Type
												</th>
												<th>
													Inflation %
												</th>
												<th>
												</th>
											</tr>
										</thead>
										<tbody>
											<tr ng-repeat="extraSpending in data.extraSpending">
												<td>
													<input type="text" class="form-control" ng-model="extraSpending.label">
												</td>
												<td>
													<input type="text" class="form-control" ng-model="extraSpending.val">
												</td>
												<td>
													<select class="form-control"
														ng-model="extraSpending.recurring"
														ng-options="bool for bool in boolOptions"
														ng-change="clearEndYear($index, data.extraSpending)">
													</select>
												</td>
												<td>
													<input type="text" class="form-control" ng-model="extraSpending.startYear">
												</td>
												<td>
													<input  type="text"
													class="form-control"
													ng-model="extraSpending.endYear"
													ng-disabled="!extraSpending.recurring">
												</td>
												<td>
													<select class="form-control"
														ng-model="extraSpending.inflationAdjusted"
														ng-options="bool for bool in boolOptions"
														ng-change="changeInflationAdjusted($index, data.extraSpending)">
													</select>
												</td>
												<td>
													<select class="form-control"
														ng-model="extraSpending.inflationType"
														ng-options="option.value as option.text for option in inflationTypes"
														ng-change="changeInflationType($index, data.extraSpending)"
														ng-disabled="!extraSpending.inflationAdjusted">
													</select>
												</td>
												<td>
													<input type="text"
													class="form-control"
													ng-model="extraSpending.inflationRate"
													ng-disabled="extraSpending.inflationType != 'constant' || !extraSpending.inflationAdjusted">
												</td>
												<td>
													<input type="button" ng-click="removeObject($index, data.extraSpending)" value="Delete"/>
												</td>
											</tr>
										</tbody>
									</table>
									<input type="button" ng-click="addObject(data.extraSpending)" value="Add Spending"/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</form>
			<a data-toggle="modal" href="#outputModal" class="btn btn-success btn-lg runSim" ng-click="runSimulation()">Run Simulation</a>
		</div>
		<!-- Modal -->
		  <div class="modal fade" id="outputModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
		    <div class="modal-dialog">
		      <div class="modal-content">
		        <div class="modal-header">
		          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
		          <h4 class="modal-title">cFIREsim Simulation Cycles</h4>
		        </div>
		        <div class="modal-body" id="output">
					<div id="tabNav" class="container-fullwidth">
            			<ul class="nav nav-pills" id="tabNames">
            				<li class="active"><a href="#1a" data-toggle="tab">Sim 1</a></li>
							<li style="display:none"><a href="#2a" data-toggle="tab">Sim 2</a></li>
							<li style="display:none"><a href="#3a" data-toggle="tab">Sim 3</a></li>
							<li style="display:none"><a href="#4a" data-toggle="tab">Sim 4</a></li>
							<li style="display:none"><a href="#5a" data-toggle="tab">Sim 5</a></li>
							<li style="display:none"><a href="#6a" data-toggle="tab">Sim 6</a></li>
							<li style="display:none"><a href="#7a" data-toggle="tab">Sim 7</a></li>
							<li style="display:none"><a href="#8a" data-toggle="tab">Sim 8</a></li>
							<li style="display:none"><a href="#9a" data-toggle="tab">Sim 9</a></li>
							<li style="display:none"><a href="#10a" data-toggle="tab">Sim 10</a></li>
            			</ul>
						<!--
							Tabs are stubbed out here, because if they do not exist at load time, the output graphs cannot be written to.
						-->
            			<div class="tab-content clearfix">
            				<div class="tab-pane active" id="1a">
								<div style="margin:15px">
									<div id='graph1' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels1' style='background:white;width:800px;height:20px;' class='output'></div>
									<div>
										<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
										<!-- cFIREsim-open Leaderboard -->
										<ins class="adsbygoogle"
										     style="display:inline-block;width:728px;height:90px"
										     data-ad-client="ca-pub-5980092593965662"
										     data-ad-slot="2988961795"></ins>
										<script>
										(adsbygoogle = window.adsbygoogle || []).push({});
										</script>
									</div>
									<div id='graph1b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels1b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download1'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats1a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats1b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats1c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats1d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats1e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
									
								</div>
            				</div>
							<div class="tab-pane" id="2a">
								<div style="margin:15px">
									<div id='graph2' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels2' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph2b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels2b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download2'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats2a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats2b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats2c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats2d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats2e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="3a">
								<div style="margin:15px">
									<div id='graph3' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels3' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph3b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels3b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download3'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats3a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats3b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats3c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats3d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats3e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="4a">
								<div style="margin:15px">
									<div id='graph4' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels4' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph4b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels4b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download4'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats4a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats4b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats4c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats4d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats4e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="5a">
								<div style="margin:15px">
									<div id='graph5' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels5' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph5b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels5b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download5'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats5a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats5b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats5c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats5d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats5e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="6a">
								<div style="margin:15px">
									<div id='graph6' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels6' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph6b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels6b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download6'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats6a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats6b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats6c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats6d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats6e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
            				</div>
							<div class="tab-pane" id="7a">
								<div style="margin:15px">
									<div id='graph7' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels7' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph7b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels7b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download7'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats7a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats7b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats7c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats7d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats7e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="8a">
								<div style="margin:15px">
									<div id='graph8' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels8' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph8b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels8b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download8'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats8a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats8b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats8c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats8d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats8e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="9a">
								<div style="margin:15px">
									<div id='graph9' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels9' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph9b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels9b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download9'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats9a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats9b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats9c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats9d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats9e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
							<div class="tab-pane" id="10a">
								<div style="margin:15px">
									<div id='graph10' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels10' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='graph10b' style='width:800px; height:400px;background:white;' class='output'></div>
									<div id='labels10b' style='background:white;width:800px;height:20px;' class='output'></div>
									<div id='download1'></div>
									<p>
										<h1>
											Statistics
										</h1>
									</p>
									<table id='stats10a' class="table table-bordered table-nonfluid display compact"></table>
									<div class="row">
    									<div class="col-md-6">
											<table id='stats10b' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats10c' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats10d' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
										<div class="col-md-6">
											<table id='stats10e' class="table table-bordered table-nonfluid display compact rowHeaders"></table>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
		        </div>
		        <div class="modal-footer">
		          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
		        </div>
		      </div><!-- /.modal-content -->
		    </div><!-- /.modal-dialog -->
		  </div><!-- /.modal -->	

			<!-- Report Issue Modal -->
		  	<div class="modal fade" id="reportIssueModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
							<h4 class="modal-title">Report an Issue</h4>
						</div>
						<div class="modal-body">
							<p>
								There are 2 ways to report an issue or request a new feature.
							</p>
							<ul>
								<li>
									You can log in to the <a href="https://github.com/boknows/cFIREsim-open/issues">GitHub Issues page</a> and report your issue or request a new feature.
								</li>
								<li>
									You can <a href="phpBB3/index.php">Log in to the forums</a> and post in the cFIREsim Bugs or cFIREsim Feature Requests forum.
								</li>
							</ul>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
						</div>
					</div>
			  </div>
			</div>

			<!-- Donate/Support Modal -->
		  	<div class="modal fade" id="donateModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
							<h4 class="modal-title">Donate/Support cFIREsim</h4>
						</div>
						<div class="modal-body">
							<p>
								There are a few ways to donate or support cFIREsim
							</p>
							<ul>
								<li>
									You can log in to the <a href="https://github.com/boknows/cFIREsim-open/issues">GitHub Issues page</a> and contribute to the cFIREsim Open project by coding a feature/bugfix.
								</li>
								<li>
									You can donate via Paypal to support the web hosting fees of this site. 
									<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
									<input type="hidden" name="cmd" value="_s-xclick">
									<input type="hidden" name="hosted_button_id" value="6GFG7N3JXP8HN">
									<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
									<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
									</form>
								</li>
							</ul>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
						</div>
					</div>
			  </div>
			</div>


		<!-- Save Sim Modal -->
		<div class="modal fade" id="saveSimPopup" tabindex="" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
						<h4 class="modal-title">Save Simulation Inputs</h4>
					</div>
					<div class="modal-body">
						<div class="input-group">
							<span class='input-group-addon'>Saved Simulation Name:</span><input type='text' size='12' class='form-control' id='simNameInput'>
						</div>
						<button type="button" class="btn btn-success" id="confirmSaveSim">Save Sim</button>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-danger" data-dismiss="modal">Cancel</button>
					</div>
				</div>
		  </div>
		</div> <!-- End Save Sim Modal -->

		<div id="saveSimSuccess" style="display:none" class="popup small">
			<p>Your simulation was successfully saved</p>
			<button type="button" class="btn btn-danger" id="closeSaveSuccess">Close</button>
		</div>

		<script type="text/javascript" src="js/marketData.js"></script>
		<script type="text/javascript" src="js/cFIREsimOpen.js"></script>

	</body>
</html>
<script type="text/javascript">
angular.module('cFIREsim', [])
    .controller('simulationInputController', ['$scope',
        function($scope) {
            $scope.data = {
                retirementStartYear: 2015,
                retirementEndYear: 2044,
                data: {
                    method: "historicalAll",
                    start: 1900,
                    end: 1970,
                    growth: 8,
					singleStart: 1966
                },
                investigate: {
                    type: "none",
                    successRate: 95
                },
                portfolio: {
                    initial: 1000000,
                    percentEquities: 75,
                    percentBonds: 25,
                    percentGold: 0,
                    percentCash: 0,
                    percentFees: 0.18,
                    growthOfCash: 0.25,
                    rebalanceAnnually: true,
                    constantAllocation: true
                },
                spending: {
                    initial: 40000,
                    method: 'inflationAdjusted',
                    floor: 'pensions',
                    ceiling: 'none',
                    percentageOfPortfolioType: 'constant',
                    percentageOfPortfolioFloorType: 'pensions',
                    percentageOfPortfolioCeilingType: 'none',
                    percentageOfPortfolioPercentage: 4,
                    retireAgainAmountType: 'valueAtRetirement',
                    hebelerAgeOfRetirement: 60, 
                    hebelerWeightedCPI: 50,
                    hebelerWeightedRMD: 50,
                    variableSpendingZValue: 0.5,
                    guytonKlingerExceeds: 20,
                    guytonKlingerFall: 20,
                    guytonKlingerRaise: 10,
                    guytonKlingerCut: 10
                },
                extraIncome: {
                    socialSecurity: {
                        val: 0,
                        startYear: 2032,
                        endYear: 2100
                    },
                    socialSecuritySpouse: {
                        val: 0,
                        startYear: 2032,
                        endYear: 2100
                    },
                    pensions: [{
                        label: 'One',
                        val: 0,
                        startYear: 2030,
                        endYear: null,
                        recurring: true,
                        inflationAdjusted: true,
                        inflationType: 'CPI',
                        inflationRate: ''
                    }, {
                        label: 'Two',
                        val: 0,
                        startYear: 2030,
                        endYear: null,
                        recurring: true,
                        inflationAdjusted: true,
                        inflationType: 'CPI',
                        inflationRate: ''
                    }],
                    extraSavings: [{
                        label: 'One',
                        val: 0,
                        startYear: 2030,
                        endYear: 2035,
                        recurring: true,
                        inflationAdjusted: true,
                        inflationType: 'CPI',
                        inflationRate: ''
                    }, {
                        label: 'Two',
                        val: 0,
                        startYear: 2031,
                        endYear: 2041,
                        recurring: true,
                        inflationAdjusted: true,
                        inflationType: 'CPI',
                        inflationRate: ''
                    }]
                },
                extraSpending: [{
                    label: 'One',
                    val: 0,
                    startYear: 2030,
                    endYear: 2040,
                    recurring: true,
                    inflationAdjusted: true,
                    inflationType: 'CPI',
                    inflationRate: ''
                }, {
                    label: 'Two',
                    val: 0,
                    startYear: 2030,
                    endYear: 2041,
                    recurring: true,
                    inflationAdjusted: true,
                    inflationType: 'CPI',
                    inflationRate: ''
                }]
            }
            $scope.boolOptions = [
                true,
                false
            ]
            $scope.inflationTypes = [{
                text: 'CPI',
                value: 'CPI'
            }, {
                text: 'Constant %',
                value: 'constant'
            }]
            $scope.dataOptionTypes = [{
                text: 'Historical Data - All',
                value: 'historicalAll'
            }, {
                text: 'Historical Data - Specific Years',
                value: 'historicalSpecific',
                formInputs: [
                    'historicalSpecificOptions'
                ]
            }, {
                text: 'Constant Market Growth',
                value: 'constant',
                formInputs: [
                    'constantGrowthOptions'
                ]
            }, {
				text: 'Single Simulation Cycle',
				value: 'singleCycle',
				formInputs: [
                    'singleCycleOptions'
                ]
			}]
            $scope.investigateOptionTypes = [{
                text: 'None ',
                value: 'none',
            },
            {
            	text: 'Max Initial Spending',
            	value: 'maxInitialSpending',
            	formInputs: [
            		'maxInitialSpendingOptions'
            	]
            }]
            $scope.spendingPlanTypes = [{
                    text: 'Inflation Adjusted',
                    value: 'inflationAdjusted',
                    formInputs: [
                        'yearlySpendingOptions'
                    ]
                }, {
                    text: 'Not Inflation Adjusted',
                    value: 'notInflationAdjusted',
                    formInputs: [
                        'yearlySpendingOptions',
                        'spendingLimitOptions'
                    ]
                }, {
                    text: '% of Portfolio',
                    value: 'percentOfPortfolio',
                    formInputs: [
                        'percentageOfPortfolioOptions'
                    ]
                }, {
                    text: 'Hebeler Autopilot',
                    value: 'hebelerAutopilot',
                    formInputs: [
                        'yearlySpendingOptions',
                        'hebelerAutopilotOptions',
                        'spendingLimitOptions'
                    ]
                }, {
                    text: 'Variable Spending',
                    value: 'variableSpending',
                    formInputs: [
                        'yearlySpendingOptions',
                        'variableSpendingOptions',
                        'spendingLimitOptions'
                    ]
                }, {
                    text: 'Guyton-Klinger',
                    value: 'guytonKlinger',
                    formInputs: [
                        'yearlySpendingOptions',
                        'guytonKlingerOptions',
                        'spendingLimitOptions'
                    ]
                }
                /*,{
text: 'Retire Again and Again',
value: 'retireAgainAndAgain',
formInputs: [
'yearlySpendingOptions',
'retireAgainAndAgainOptions',
'spendingLimitOptions'
]
}
,{
text: 'Original VPW',
value: 'originalVPW',
formInputs: [
'spendingLimitOptions'
]
},{
text: 'Custom VPW',
value: 'customVPW',
formInputs: [
'yearlySpendingOptions',
'customVPWOptions',
'spendingLimitOptions'
]
}*/
            ]
            $scope.spendingFloorTypes = [
                {
                    text: 'No Floor',
                    value: 'none'
                },
                {
                    text: 'Pensions/SS',
                    value: 'pensions'
                },
                {
                    text: 'Defined Value',
                    value: 'definedValue'
                }
            ]
            $scope.spendingCeilingTypes = [
                {
                    text: 'No Ceiling',
                    value: 'none'
                },
                {
                    text: 'Defined Value',
                    value: 'definedValue'
                }
            ]
            $scope.percentOfPortfolioFloorLimitTypes = [
                {
                    text: 'No Floor',
                    value: 'none'
                },
                {
                    text: 'Pensions/SS',
                    value: 'pensions'
                },
                {
                    text: 'Defined Value',
                    value: 'definedValue'
                },
                {
                    text: 'As a % of Starting Portfolio',
                    value: 'percentageOfPortfolio'
                },
                {
                    text: '% of Previous Year',
                    value: 'percentageOfPreviousYear'
                }
            ]
            $scope.percentOfPortfolioCeilingLimitTypes = [
                {
                    text: 'No Ceiling',
                    value: 'none'
                },
                {
                    text: 'Defined Value',
                    value: 'definedValue'
                },
                {
                    text: 'As a % of Starting Portfolio',
                    value: 'percentageOfPortfolio'
                }
            ]
            $scope.retireAgainAmountTypes = [{
                text: 'Portfolio Value at Retirement',
                value: 'valueAtRetirement'
            }, {
                text: 'Custom Portfolio Value',
                value: 'customValue'
            }]
            // Refreshes the spending form by hiding all the sections, showing the correct ones, then wiping the data in the still hidden ones.
            $scope.refreshSpendingForm = function() {
                var spendingPlan = $.grep($scope.spendingPlanTypes, function(spendingPlanType) {
                    return spendingPlanType.value == $scope.data.spending.method
                });
                $('.spendingOptions').hide();
                if (spendingPlan.length == 1) {
                    $.each(spendingPlan[0].formInputs, function(index, formInput) {
                        $('#' + formInput).show();
                    });
                }
                //Removed clearing of fields, so that initial spending value wouldn't disappear when percentOfPortfolio was selected. I don't think this adversely affects the code, but will leave this for posterity.
                //$scope.clearFields('.spendingOptions:hidden');
            }
            $scope.refreshDataForm = function() {
                if ($scope.data.data.method == "historicalSpecific") {
                    $('#historicalSpecificOptions').show();
                    $('#constantGrowthOptions').hide();
					$('#singleCycleOptions').hide();
                } else if ($scope.data.data.method == "constant") {
                    $('#constantGrowthOptions').show();
                    $('#historicalSpecificOptions').hide();
					$('#singleCycleOptions').hide();
                } else if ($scope.data.data.method == "historicalAll") {
                    $('#constantGrowthOptions').hide();
                    $('#historicalSpecificOptions').hide();
					$('#singleCycleOptions').hide();
                } else if ($scope.data.data.method == "singleCycle") {
					$('#singleCycleOptions').show();
                    $('#constantGrowthOptions').hide();
                    $('#historicalSpecificOptions').hide();
                }
            }
            $scope.refreshInvestigateForm = function() {
                if ($scope.data.investigate.type == "maxInitialSpending") {
                    $('#maxInitialSpendingOptions').show();
                } else {
                    $('#maxInitialSpendingOptions').hide();
                }

            }
            // Clears all the inputs and selects within the items returned by the selector.
            $scope.clearFields = function(selector) {
                // For the spending option sections which are still hidden, clear their values.
                $.each($(selector), function(index, option) {
                    $('input', option).val('');
                    $('select', option).prop('selectedIndex', 0);
                    // If called without the timeout Angular with throw and error the first time this function is called.
                    setTimeout(
                        function() {
                            $('select', option).trigger('change')
                        }, 0, option);
                });
            }
            $scope.runSimulation = function() {
                Simulation.runSimulation($scope.data);
            }
            $scope.saveSimulation = function() {
                console.log($scope.data);
                var uri = 'data:text/csv;charset=utf-8,' + JSON.stringify($scope.data);
                var link = document.createElement("a");
                link.href = uri;
                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = "simulation.json";
                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            $scope.loadSimulation = function() {
                // $scope.data =
                //Load from JSON
            }
            // TODO: Could these 2 be turned into declarative Angular statements?
            $scope.enableRebalancing = function(enable) {
                $('#portfolioPanel [name=constantAllocationRadio]').attr('disabled', !enable);
                $scope.enableChangeAllocation(enable);
            }
            $scope.enableChangeAllocation = function(enable) {
                var inputs = $('#targetAssetsPanel input');
                if (!enable) {
                    inputs.val('');
                }
                inputs.attr('disabled', !enable);
            }
            // Adds a saving or pension object.
            $scope.addObject = function(array) {
                array.push({
                    label: '',
                    val: 0,
                    startYear: 2030,
                    endYear: 2035,
                    recurring: true,
                    inflationAdjusted: true,
                    inflationType: 'CPI',
                    inflationRate: ''
                });
				$scope.refreshSpendingForm();
            }
            $scope.removeObject = function(index, array) {
                array.splice(index, 1);
            }
            // TODO: These there methods which clear a property of an object in an array could probably be generalized.
            $scope.changeInflationAdjusted = function(index, array) {
                var object = array[index];
                if (!object.inflationAdjusted) {
                    //object.inflationType = '';
                }
                $scope.changeInflationType(index, array);
            }
            $scope.changeInflationType = function(index, array) {
                var object = array[index];
                if (object.inflationType != 'constant') {
                    //object.inflationRate = '';
                }
            }
            $scope.clearEndYear = function(index, array) {
                var object = array[index];
                if (!object.recurring) {
                    object.endYear = '';
                }
            }
            $scope.clearProperty = function(clear, path) {
                if (clear) {
                    var pathArray = path.split('.');
                    var property = $scope;
                    for (var i = 0; i < pathArray.length; i++) {
                        if (i == (pathArray.length - 1)) {
                            property[pathArray[i]] = '';
                        } else {su
                            property = property[pathArray[i]];
                        }
                    }
                }
            }
            $scope.changeLabel = function(label) {
                if ($scope.data.spending.percentageOfPortfolioFloorType == "definedValue") {
                    $(".spending-floor-span").html("$");
                } else {
                    $(".spending-floor-span").html("%");
                }
                if ($scope.data.spending.percentageOfPortfolioCeilingType == "definedValue") {
                    $(".spending-ceiling-span").html("$");
                } else {
                    $(".spending-ceiling-span").html("%");
                }
            }

			$scope.portfolioCheck = function(value) {
				console.log("Validating...");
			    return (value > 0);
			};
            // Setup the spending form when the controller loads.
            $scope.refreshSpendingForm()
        }
    ]); 



</script>
<script type="text/javascript">
  <?php echo 'var session = "'.json_encode($_SESSION['msg']).'";'; ?>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-42984907-1', 'auto');
  ga('send', 'pageview');

	var loadedByID = Simulation.getUrlVars(["id"]);
	if (Number.isInteger(loadedByID)){
		Simulation.getSavedSim(loadedByID);
	}
  
</script>
