<?php
	include 'headers.php';
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

		.ot_banner {
			color: white;
			background-color: #e78f08;
			width: 50%;
			float: none;
    		margin: 0 auto;
    		border: 2px;
    		border-radius: 8px;
    		padding: 3px;
    		text-align: center;
    		margin-bottom: 5px;
		}

		.ot_banner a {
			color: #23568f;
		}

		.ot_banner_output {
			color: white;
			background-color: #e78f08;
			width: 50%;
			float: none;
    		border: 2px;
    		border-radius: 8px;
    		padding: 3px;
    		text-align: center;
    		margin-bottom: 5px;
    		margin-top: 5px;
		}

		.ot_banner_output a {
			color: #23568f;
		}


		</style>
		<script src='https://code.jquery.com/jquery-1.11.3.min.js' language='Javascript' type='text/javascript'></script>
		<script type="text/javascript" src="http://dygraphs.com/dygraph-combined.js"></script>
		<script type="text/javascript" src="js/bootstrap.min.js"></script>
		
		<!-- Dependencies for cFIREsim tour -->
		<script src="js/bootstrap-tour.min.js"></script>
		<!-- End Tour dependencies -->
		
		<script type="text/javascript" src="js/bootstrap-select.min.js"></script>

		<!-- Bootstrap core CSS -->
		<link href="css/bootstrap.min.css" rel="stylesheet">
		<link href="css/bootstrap-select.min.css" rel="stylesheet">
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/r/bs/dt-1.10.8/datatables.min.css"/>
	</head>
	<body>
		<div class="page-header">
			<h1 class="text-center">The Crowdsourced FIRE Simulator (cFIREsim) - Open Source</h1>
		</div>
		<div class="ot_banner">
			<p>cFIREsim and OnTrajectory.com are teaming up to create a "financial life planning tool". </p>
			<p><b><a href="http://www.ontrajectory.com">Come check us out!</a></b></p>
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
								<a href="faq.php" class="btn btn-default">FAQ/Tutorial</a>
							</p>
						</li>
						<li>
							<p class="navbar-btn">
								<a data-toggle="modal" href="#donateModal" class="btn btn-default">Donate/Support</a>
							</p>
						</li>
						<li>
							<p class="navbar-btn">
								<a href="phpBB3/index.php" class="btn btn-default">cFIREsim Forums</a>
							</p>
						</li>
						<!--<li>
							<p class="navbar-btn">
								<a data-toggle="modal" href="#" class="btn btn-default" id="tutorialBtn">Tutorial</a>
							</p>
						</li>-->
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
		<div class="container">
			<div class="row">
				<div class="panel panel-default">
		            <div class="panel-heading compact">
		                <h3 class="panel-title">What is cFIREsim?</h3>
		            </div>
		            <div class="panel-body">
			            <p>If the market does no worse than the great depression, 1970's stagflation, or the dotcom bust, will my money last in retirement?</p>
			            <p>The math behind retirement: The simple question of "Will my money last in retirement?" is rife with complications. Do you have a good handle on what your expenses are? What sort of investments do you have? How long might you live? Do you have any large one-time expenses in the future? What happens if you retire during a major market downturn? What happens if you retire in the worst market downturn in history?</p>
			            <p>Retirement advisors and various financial websites will often give you the most overused "Rule of thumb" in the financial world. The "4% rule", derived from the Trinity Study, states that if you have a retirement period of 30 years, you can safely withdraw 4% of your portfolio in year 1 of retirement and continually adjust that for inflation, without fear of running out of money. Critics of this study say that the financial world is a much different place than it was in the past, and that we should adjust our thinking on how much we should withdraw in retirement.</p>
			            <p>How do I know if my portfolio will last? At it's most basic level, cFIREsim uses historical stock/bond/gold/inflation data from 1871 to present, and calculates how your portfolio would have fared throughout history. If you enter a 30 year simulation period, it will run your data for every 30yr period in history. Example: cFIREsim will figure out your portfolio value, if you would have theoretically retired for the period of 1871-1900, then for the period of 1872-1901, 1873-1902, etc. It will take all of your inputs and determine whether or not the portfolio "failed" (failure is defined as going below $0 at any given point). What does this tell me? If cFIREsim says that your portfolio survived 95% of the simulation cycles, it means that if the market does no worse than the worst years in recorded stock market history, your portfolio will survive.</p>
			            <p>What can cFIREsim do? At it's core, you can enter information in the a few simple inputs and return the basic simulation. At it's most complicated, it can determine your portfolio success based on 80 individual portfolio adjustments, multiple types of inflation, multiple types of market returns, and graphically show you the results. There are many options to choose from outside of the "Basic Inputs". You can find information for each section within this FAQ.</p>
		            </div>
		        </div>
		        <div class="panel panel-default">
		            <div class="panel-heading compact">
		                <h3 class="panel-title">Basic Tutorial</h3>
		            </div>
		            <div class="panel-body">
		            	<p>The 4 most basic inputs that are required in cFIREsim are:
							<ul>
								<li><b>Retirement Year:</b> The year in which you begin withdrawing money from retirement investments. This can be the current year, or any year in the future.</li>
								<li><b>Retirement End Year:</b> This is the end year for the simulation. Set this to be in line with your life expectancy estiamtes.</li>
								<li><b>Portfolio Amount:</b> The total amount of investable assets you own currently (including both tax-deferred and post-tax amounts). cFIREsim does not distinguish between different taxed accounts. It is suggested that you take into account taxes when you choose your yearly spending amount. If you'd like to accurately choose a withdrawal strategy based on what is most tax efficient, consider using www.i-orp.com.</li>
								<li><b>Yearly Spending:</b> This is your total yearly expenses. It is suggested that you consider this a gross income amount, and account for taxes being taken out according to where your portfolio funds reside. (If the majority of your funds are tax-deferred, and you think you'll be in the 25% tax bracket in retirement, include an amount 25% more than you need to live on)</li>
							</ul>
						</p>
						<p>After entering those 4 numbers, hitting the "Run Simulation" button will provide the output chart and graph. The very first field on the output chart is "Success Rate". It will say something like <b>"Failed 8 times out of 115 cycles, for a 93.04% success rate"</b> which means that if you chose the default settings of 30 years to model, it simulated you specific retirement scenario in 115 different 30yr periods. Of those 115 cycles, there were 8 times where your portfolio got to $0 before the end of the simulation. That is considered a "failure". Whether or not a 93.04% success rate is good enough for you is an entirely personal choice.</p>

						<p>That is a very basic tutorial on how to run cFIREsim. The rest of the FAQ is dedicated to talking about the details of each section and how to fine-tune your simulation to fit your unique situation.</p>
		            </div>
		   		</div>
		   		<div class="panel panel-default">
		            <div class="panel-heading compact">
		                <h3 class="panel-title">Portfolio Section</h3>
		            </div>
		            <div class="panel-body">
			            <ul>
				            <li><b>Portfolio Value:</b> Your total investable assets. Include all accounts where stocks, bonds, and cash instruments might reside. Do not include pensions, social security, house equity or other income streams in this number.</li>
				            <li><b>Initial Assets:</b> This is the asset allocation of your portfolio as of today. You can choose any mixture of Equities, Bonds, Gold, and Cash. <b>Please note: Gold prices were unchanged for a large period of time in the 1800's. Take this into consideration for the simulations.</b> Since there is no reliable historical data on cash investments (that I can find), the Growth of Cash input is for the user to determine how much growth over time that your cash allocation receives. As a default, it is set to 0.25%, an average value for a savings account at the credit unions in my area. Fees represent the maintenance/administrative fees that your portfolio requires. This number is calculated against your entire portfolio each year, so please use an average number across all accounts.</li> 
				            <li><b>Rebalance Annually:</b> Choosing "Yes" will automatically rebalance your portfolio to match your chosen asset allocation. If you choose "No", your portfolio will drift to different percentages depending on how each asset class performs.</li>
				            <li><b>Keep Allocation Constant::</b> Choosing "Yes" means that your asset allocation will remain the same throughout the simulation. Choosing "No", you can set what is commonly called a <b>Glide Path</b> allocation change. You will choose a target allocation that is different from your current one (Ex. You want to go from 80%/20% stocks/bonds to 60%/40% stocks and bonds in retirement). You will then choose a "Start Year" and "End Year" to execute this allocation change. Your allocation will slowly change to the target allocation over the course of those years.</li>
			            </ul>

		            </div>
		        </div>
		   		<div class="panel panel-default">
		            <div class="panel-heading compact">
		                <h3 class="panel-title">Spending Plan Section</h3>
		            </div>
		            <div class="panel-body">
						<p>The Spending Plan section is where you define your basic yearly expenses that will be taken out of your portfolio during retirement. There are MANY "withdrawal strategies" out there, and cFIREsim attempts to capture just a few of the more relevant ones. If you have a suggestion for a withdrawal strategy that should be implemented as a cFIREsim Spending Plan please visit the forums and post your idea.</p>

						<p><b>Yearly Spending</b> is your yearly default expenses that will be subtracted from your portfolio. This is required for most spending plans.</p>
						<p><b>Spending Floor/Ceiling:</b> Most spending plans vary from year to year. To prevent the simulation from going to an unreasonable level of spending, you should define a "ceiling" and "floor" for your spending. These are the maxmimum and mininum spending that you want to allow during retirement.</p>

						<h4>Spending Plan Explanations</h4>
						<ul>
							<li><b>Inflation Adjusted:</b> This increases your spending each year by the amount of inflation indicated in the Inflation Assumptions section on the sidebar. This means that your "spending power" remains the same throughout retirement. By default, Inflation Assumptions is set to use the Consumer Price Index (CPI) for it's calculations, which is the generally accepted rule-of-thumb for inflation.</li>
							<li><b>Not Inflation Adjusted:</b> This leaves your spending at the same value as you put in the Yearly Spending input. This means that as the prices of goods gets higher and higher, your spending will never go up to match that price increase.</li>
							<li><b>% of Portfolio:</b> This calculates your spending each year based on the value of your portfolio. The default option is a Constant % which means that it will take that same percentage out of your portfolio each year (in nominal dollars), regardless of market conditions. If you choose Floor and Ceiling Values, you will be given the option to set limits to the yearly spending calculation. These floor/ceiling values are based on inflation-adjusted (according to your Inflation Assumptions in the sidebar) percentages of the initial portfolio at retirement. Example: With $1M portfolio, you can specify a 4% nominal withdrawal rate, with a 3.5% floor and 5% ceiling. This means that with market/inflation fluctuations, your spending will never dip below $35k/yr (inflation-adjusted) and never go above $50k/yr (inflation-adjusted). Another option for the Floor Spending is % of Previous Year. This is based on Robert Clyatt's 95% rule, but gives you the freedom to choose the value. This option states that if the market dips enough to cause your yearly spending to dip, it will never be less than 95% (or whatever you enter) of the previous year's spending value. This limits wild fluctuations. (Example: $1M Portfolio, 4% spending, floor of 95% previous year. If in year 2, your portfolio drops to $800k, 4% would only be $32,000 in spending. However, the floor rule would set your spending to no less than $40,000 * 95% = $38,000).</li>
							<li><b>Hebeler Autopilot Method:</b> is based on <a href="http://www.marketwatch.com/story/put-retirement-savings-withdrawals-on-autopilot-2013-07-24">Henry Hebeler's Autopilot Method Article</a>. This Method is a blend between "Inflation Adjusted Spending" and the Required Minimum Distribution Method (RMD). This method provides an inflation-adjusted spending that also corresponds to your longevity expectation. Your Age at Retirement input helps to determine your RMD calculations. The final yearly spending is an average between the 2 methods, and you can choose the weight that each method has on your spending calculations by changing the percentage values.</li>
							<li><b>Variable Spending:</b> allows for small deviations in spending within those values when the market dictates it. The Z-value determines how much your spending changes during the market changes. The method then tracks an inflation-adjusted version of your Spending amount. Example: If your portfolio is up 10%, Z-value is 0.5, and Spending was $40k, your new spending is now (1+(10% * 0.5)) * $40k = (1.05)*40k = $42000. Example2: If your portfolio then is down 25%, Z-value is still 0.5, Spending was $42000, your new spending is now (1-(25% * 0.5)) * $42k = (0.875)*42000 = your $36750. So, the z-value just provides a value of how much your spending reacts to your portfolio health. If the Z-value is lower, your spending swings less. If it is higher, it swings more. Add in the universal Spending Floor/Ceiling for guardrails, and you've got yourself a pretty good spending method.</li>
							<li><b>Guyton-Klinger Method:</b> This method is a hybrid of adjusting your spending by inflation and the 4% rule, with additional rules regarding bull/bear markets. It was developed by a pair of economists (Guyton and Klinger). <a href="http://www.schulmerichandassoc.homestead.com/using_decision_rules_to_create_retirement_withdrawal_profiles.pdf">Please read their paper on the method before using this option.</a> It properly defines the rules of the withdrawals. Note: The Guyton-Klinger "Initial Withdrawal Rate" is based on your Yearly Spending Input and the amount of your portfolio at the time of retirement, not a static %.</li>
							<li><b>VPW Method:</b> A mix of the constant-dollar and constant-percentage methods, with the goal of spending down your nest-egg nearly completely before the end. <a href="https://www.bogleheads.org/forum/viewtopic.php?f=10&t=120430">Proposed and developed by longinvest on the Bogleheads Forums.</a> Your yearly spending is entirely calculated based on your portfolio at retirement and the number of years that you're in retirement, along with some factors of asset allocation.</li>
							<li><b>Variable CAPE Method:</b> <a href="https://en.wikipedia.org/wiki/Cyclically_adjusted_price-to-earnings_ratio">CAPE (Cyclically-adjusted price-to-earning ratio)</a> is a valuation measure usually applied to the US S&P 500 equity market. It is defined as price divided by the average of ten years of earnings (moving average), adjusted for inflation.  The CAPE method adjusts your retirement based on this valuation of the market (spending more in the boom times, and less in the down times). Example for how spending is calculated in a given year: Spending will always equal (spendingRate = currentCAPEYield * multiplier + constantAdjustment). If we're in a year where the CAPE is 17.48, currentCAPEYield will equal 1/17.48 or 0.0572. If you kept the the defaults inputs, the "constantAdjustment" would equal 1/100 or .01.  So, for that given year, your spending rate would be adjusted to 0.0572 * 0.5 + .01 = 0.0386 (or 3.86% withdrawal rate). So if your portfolio happened to be $1M at the time, you'd withdraw $38,600.</li>
						</ul>




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
	</body>
</html>

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
