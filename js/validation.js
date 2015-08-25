$(document).ready(function() {
	//Validation Rules
	//Allocations add up to 100%
	function cmpAllocation(){
		var equities = parseInt($("input[ng-model='data.portfolio.percentEquities']").val());
		var bonds = parseInt($("input[ng-model='data.portfolio.percentBonds']").val());
		var gold = parseInt($("input[ng-model='data.portfolio.percentGold']").val());
		var cash = parseInt($("input[ng-model='data.portfolio.percentCash']").val());
		if(equities + bonds + gold + cash == 100){
			return true;
		}else{
			return false;
		}
	}
	$("input[ng-model='data.portfolio.percentEquities']").keyup(function() {
		if(cmpAllocation()){
			$("#allocationError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#allocationError").show();
			$(".runSim").addClass("disabled");
		}
	});
	$("input[ng-model='data.portfolio.percentBonds']").keyup(function() {
		if(cmpAllocation()){
			$("#allocationError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#allocationError").show();
			$(".runSim").addClass("disabled");
		}
	});
	$("input[ng-model='data.portfolio.percentGold']").keyup(function() {
		if(cmpAllocation()){
			$("#allocationError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#allocationError").show();
			$(".runSim").addClass("disabled");
		}
	});
	$("input[ng-model='data.portfolio.percentCash']").keyup(function() {
		if(cmpAllocation()){
			$("#allocationError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#allocationError").show();
			$(".runSim").addClass("disabled");
		}
	});

	//Retirement Years Validation
	function cmpYears(){
		var startYear = parseInt($("input[ng-model='data.retirementStartYear']").val());
		var endYear = parseInt($("input[ng-model='data.retirementEndYear']").val());
		var currentYear = new Date().getFullYear();
		if((startYear < endYear) && (startYear >= currentYear)){
			return true;
		}else{
			return false;
		}
	}
	$("input[ng-model='data.retirementStartYear']").keyup(function() {
		if(cmpYears()){
			$("#yearsError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#yearsError").show();
			$(".runSim").addClass("disabled");
		}
	});
	$("input[ng-model='data.retirementEndYear']").keyup(function() {
		if(cmpYears()){
			$("#yearsError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#yearsError").show();
			$(".runSim").addClass("disabled");
		}
	});
	
	//Initial Portfolio Validation
	function cmpPortfolio(){
		var portfolio = parseInt($("input[ng-model='data.portfolio.initial']").val());
		if((portfolio > 0) && !(isNaN(portfolio))){
			return true;
		}else{
			return false;
		}
	}
	$("input[ng-model='data.portfolio.initial']").keyup(function() {
		if(cmpPortfolio()){
			$("#portfolioError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#portfolioError").show();
			$(".runSim").addClass("disabled");
		}
	});
	
	//Pensions Validation
	function cmpPensionYears(){
		var startYears = $("input[ng-model='pension.startYear']");
		var currentYear = new Date().getFullYear();
		var trigger = true;
		for(var i=0; i<startYears.length; i++){
			if((parseInt(startYears[i].value) < currentYear) || (isNaN(parseInt(startYears[i].value)))) {
				trigger = false;
			}
		}
		return trigger;
	}
	$("input[ng-model='pension.startYear']").keyup(function() {
		if(cmpPensionYears()){
			$("#pensionsError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#pensionsError").show();
			$(".runSim").addClass("disabled");
		}
	});
	function cmpPensionRates(){
		var inflRate = $("input[ng-model='pension.inflationRate']");
		var trigger = true;
		for(var i=0; i<inflRate.length; i++){
			if((parseInt(inflRate[i].value) < 0) || (isNaN(parseInt(inflRate[i].value)))) {
				trigger = false;
			}
		}
		return trigger;
	}
	$("input[ng-model='pension.inflationRate']").keyup(function() {
		if(cmpPensionRates()){
			$("#pensionsError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#pensionsError").show();
			$(".runSim").addClass("disabled");
		}
	});

	//Extra Spending Validation
	function cmpExtraSpendingYears(){
		var startYears = $("input[ng-model='extraSpending.startYear']");
		var endYears = $("input[ng-model='extraSpending.endYear']");
		var currentYear = new Date().getFullYear();
		var trigger = true;
		for(var i=0; i<startYears.length; i++){
			if((parseInt(startYears[i].value) < currentYear) || (isNaN(parseInt(startYears[i].value))) || (parseInt(startYears[i].value) >= parseInt(endYears[i].value))) {
				trigger = false;
			}
		}
		return trigger;
	}
	$("input[ng-model='extraSpending.startYear']").keyup(function() {
		if(cmpExtraSpendingYears()){
			$("#extraSpendingError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#extraSpendingError").show();
			$(".runSim").addClass("disabled");
		}
	});
	$("input[ng-model='extraSpending.endYear']").keyup(function() {
		if(cmpExtraSpendingYears()){
			$("#extraSpendingError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#extraSpendingError").show();
			$(".runSim").addClass("disabled");
		}
	});
});