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
		if((portfolio >= 0) && !(isNaN(portfolio))){
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
	

	//Spending Validation
	function cmpInitialSpending(){
		var spending = parseInt($("input[ng-model='data.spending.initial']").val());
		if((spending >= 0) && !(isNaN(spending))){
			return true;
		}else{
			return false;
		}
	}
	$("input[ng-model='data.spending.initial']").keyup(function() {
		if(cmpInitialSpending()){
			$("#initialSpendingError").hide();
			$(".runSim").removeClass("disabled");
		}else{
			$("#initialSpendingError").show();
			$(".runSim").addClass("disabled");
		}
	});

});



//Pensions Validation
function cmpPensions() {
    var startYears = $("input[ng-model='pension.startYear']");
	var values = $("input[ng-model='pension.val']");
    var currentYear = new Date().getFullYear();
	var inflRate = $("input[ng-model='pension.inflationRate']");
    var inflType = $("select[ng-model='pension.inflationType']");
    var yearsTrigger = true, rateTrigger = true, valueTrigger = true;
    for (var i = 0; i < startYears.length; i++) {
        if ((parseInt(startYears[i].value) < currentYear) || (isNaN(parseInt(startYears[i].value)))) {
            yearsTrigger = false;
        }
		if(parseInt(values[i].value) < 0 || (isNaN(parseInt(values[i].value)))){
			valueTrigger = false;
		}
    }
    for (var i = 0; i < inflRate.length; i++) {
        if (((parseInt(inflRate[i].value) < 0) || (isNaN(parseInt(inflRate[i].value)))) && inflType[i].value == 1) {
            rateTrigger = false;
        }
    }
    if (yearsTrigger == true) {
        $("#pensionsError").hide();
        $(".runSim").removeClass("disabled");
    } else if (yearsTrigger == false) {
        $("#pensionsError").show();
        $(".runSim").addClass("disabled");
    }
	if (valueTrigger == true) {
        $("#pensionsValueError").hide();
        $(".runSim").removeClass("disabled");
    } else if (valueTrigger == false) {
        $("#pensionsValueError").show();
        $(".runSim").addClass("disabled");
    }
	if (rateTrigger == true) {
        $("#pensionsRateError").hide();
        $(".runSim").removeClass("disabled");
    } else if (rateTrigger == false) {
        $("#pensionsRateError").show();
        $(".runSim").addClass("disabled");
    }
}

$(document).on("keyup", "input[ng-model='pension.startYear']", function() {
    cmpPensions();
});
$(document).on("keyup", "input[ng-model='pension.inflationRate']", function() {
	cmpPensions();
});
$(document).on("keyup", "input[ng-model='pension.val']", function() {
	cmpPensions();
});
$(document).on('change',"select[ng-model='pension.inflationType']",  function() {
	cmpPensions();
});


//Extra Spending Validation
function cmpExtraSpending() {
    var startYears = $("input[ng-model='extraSpending.startYear']");
    var endYears = $("input[ng-model='extraSpending.endYear']");
    var currentYear = new Date().getFullYear();
	var values = $("input[ng-model='extraSpending.val']");
	var inflRate = $("input[ng-model='extraSpending.inflationRate']");
    var inflType = $("select[ng-model='extraSpending.inflationType']");
	var recurring = $("select[ng-model='extraSpending.recurring']");
    var yearsTrigger = true, rateTrigger = true, valueTrigger = true;
    for (var i = 0; i < startYears.length; i++) {
        if ((parseInt(startYears[i].value) < currentYear) || (isNaN(parseInt(startYears[i].value))) || (parseInt(startYears[i].value) >= parseInt(endYears[i].value))) {
            yearsTrigger = false;
        }
		if(parseInt(values[i].value) < 0 || (isNaN(parseInt(values[i].value)))){
			valueTrigger = false;
		}
		if(((isNaN(parseInt(startYears[i].value))) || (isNaN(parseInt(endYears[i].value)))) && recurring[i].value == 0){
			yearsTrigger = false;
		}
    }
	for (var i = 0; i < inflRate.length; i++) {
        if (((parseInt(inflRate[i].value) < 0) || (isNaN(parseInt(inflRate[i].value)))) && inflType[i].value == 1) {
            rateTrigger = false;
        }
    }
    if(yearsTrigger == true){
    	$("#extraSpendingError").hide();
        $(".runSim").removeClass("disabled");
    }else if (yearsTrigger == false){
    	$("#extraSpendingError").show();
        $(".runSim").addClass("disabled");
    }
	if(valueTrigger == true){
    	$("#extraSpendingValueError").hide();
        $(".runSim").removeClass("disabled");
    }else if (valueTrigger == false){
    	$("#extraSpendingValueError").show();
        $(".runSim").addClass("disabled");
    }
	if(rateTrigger == true){
    	$("#extraSpendingRateError").hide();
        $(".runSim").removeClass("disabled");
    }else if (rateTrigger == false){
    	$("#extraSpendingRateError").show();
        $(".runSim").addClass("disabled");
    }

}

$(document).on("keyup", "input[ng-model='extraSpending.endYear']", function() {
    cmpExtraSpending();
});
$(document).on("keyup", "input[ng-model='extraSpending.inflationRate']", function() {
    cmpExtraSpending();
});
$(document).on("keyup", "input[ng-model='extraSpending.startYear']", function() {
    cmpExtraSpending();
});
$(document).on("keyup", "input[ng-model='extraSpending.val']", function() {
    cmpExtraSpending();
});
$(document).on('change',"select[ng-model='extraSpending.inflationType']",  function() {
	cmpExtraSpending();
});
$(document).on('change',"select[ng-model='extraSpending.recurring']",  function() {
	cmpExtraSpending();
});

//Extra Income Validation
function cmpExtraIncome() {
    var startYears = $("input[ng-model='extraSaving.startYear']");
    var endYears = $("input[ng-model='extraSaving.endYear']");
    var currentYear = new Date().getFullYear();
	var values = $("input[ng-model='extraSaving.val']");
	var inflRate = $("input[ng-model='extraSaving.inflationRate']");
    var inflType = $("select[ng-model='extraSaving.inflationType']");
	var recurring = $("select[ng-model='extraSaving.recurring']");
    var yearsTrigger = true, rateTrigger = true, valueTrigger = true;
    for (var i = 0; i < startYears.length; i++) {
        if ((parseInt(startYears[i].value) < currentYear) || (parseInt(startYears[i].value) >= parseInt(endYears[i].value))) {
            yearsTrigger = false;
        }
		if(((isNaN(parseInt(startYears[i].value))) || (isNaN(parseInt(endYears[i].value)))) && recurring[i].value == 0){
			yearsTrigger = false;
		}
		if(parseInt(values[i].value) < 0 || (isNaN(parseInt(values[i].value)))){
			valueTrigger = false;
		}
		if (((parseInt(inflRate[i].value) < 0) || (isNaN(parseInt(inflRate[i].value)))) && inflType[i].value == 1) {
            rateTrigger = false;
        }
    }

    if(yearsTrigger == true){
    	$("#extraIncomeError").hide();
        $(".runSim").removeClass("disabled");
    }else if (yearsTrigger == false){
    	$("#extraIncomeError").show();
        $(".runSim").addClass("disabled");
    }
	if(valueTrigger == true){
    	$("#extraIncomeValueError").hide();
        $(".runSim").removeClass("disabled");
    }else if (valueTrigger == false){
    	$("#extraIncomeValueError").show();
        $(".runSim").addClass("disabled");
    }
	if(rateTrigger == true){
    	$("#extraIncomeRateError").hide();
        $(".runSim").removeClass("disabled");
    }else if (rateTrigger == false){
    	$("#extraIncomeRateError").show();
        $(".runSim").addClass("disabled");
    }

}

$(document).on("keyup", "input[ng-model='extraSaving.endYear']", function() {
    cmpExtraIncome();
});
$(document).on("keyup", "input[ng-model='extraSaving.inflationRate']", function() {
    cmpExtraIncome();
});
$(document).on("keyup", "input[ng-model='extraSaving.startYear']", function() {
    cmpExtraIncome();
});
$(document).on("keyup", "input[ng-model='extraSaving.val']", function() {
    cmpExtraIncome();
});
$(document).on('change',"select[ng-model='extraSaving.inflationType']",  function() {
	cmpExtraIncome();
});
$(document).on('change',"select[ng-model='extraSaving.recurring']",  function() {
	cmpExtraIncome();
});

//Social Security Validation
function cmpSS(){
	var startYears = [$("input[ng-model='data.extraIncome.socialSecurity.startYear']"), $("input[ng-model='data.extraIncome.socialSecuritySpouse.startYear']")] ;
	var endYears = [$("input[ng-model='data.extraIncome.socialSecurity.endYear']"), $("input[ng-model='data.extraIncome.socialSecuritySpouse.endYear']")] ;    
	var currentYear = new Date().getFullYear();
	var values = [$("input[ng-model='data.extraIncome.socialSecurity.val']"), $("input[ng-model='data.extraIncome.socialSecuritySpouse.val']")] ;  
    var yearsTrigger = true, rateTrigger = true, valueTrigger = true;
	 for (var i = 0; i < startYears.length; i++) {
        if ((parseInt(startYears[i][0].value) < currentYear) || (parseInt(startYears[i][0].value) >= parseInt(endYears[i][0].value))) {
            yearsTrigger = false;
        }
		if(((isNaN(parseInt(startYears[i][0].value))) || (isNaN(parseInt(endYears[i][0].value))))){
			yearsTrigger = false;
		}
		if(parseInt(values[i][0].value) < 0 || (isNaN(parseInt(values[i][0].value)))){
			valueTrigger = false;
		}
    }

    if(yearsTrigger == true){
    	$("#ssError").hide();
        $(".runSim").removeClass("disabled");
    }else if (yearsTrigger == false){
    	$("#ssError").show();
        $(".runSim").addClass("disabled");
    }
	if(valueTrigger == true){
    	$("#ssValueError").hide();
        $(".runSim").removeClass("disabled");
    }else if (valueTrigger == false){
    	$("#ssValueError").show();
        $(".runSim").addClass("disabled");
    }

}
$(document).on("keyup", "input[ng-model='data.extraIncome.socialSecurity.endYear']", function() {
    cmpSS();
});
$(document).on("keyup", "input[ng-model='data.extraIncome.socialSecurity.startYear']", function() {
    cmpSS();
});
$(document).on("keyup", "input[ng-model='data.extraIncome.socialSecurity.val']", function() {
    cmpSS();
});
$(document).on("keyup", "input[ng-model='data.extraIncome.socialSecuritySpouse.endYear']", function() {
    cmpSS();
});
$(document).on("keyup", "input[ng-model='data.extraIncome.socialSecuritySpouse.startYear']", function() {
    cmpSS();
});
$(document).on("keyup", "input[ng-model='data.extraIncome.socialSecuritySpouse.val']", function() {
    cmpSS();
});

//Data Options Validation
function cmpDataOptions(){
	var startYear = $("input[ng-model='data.data.start']");
    var endYear = $("input[ng-model='data.data.end']");
	var retirementStartYear = $("input[ng-model='data.retirementStartYear']");
	var retirementEndYear = $("input[ng-model='data.retirementEndYear']");
	var currentYear = new Date().getFullYear();
	var rate = $("input[ng-model='data.data.growth']");
	var yearsTrigger = true, rateTrigger = true, valueTrigger = true;
	if ((parseInt(startYear[0].value) < 1871) || (parseInt(startYear[0].value) >= parseInt(endYear[0].value)) || (parseInt(endYear[0]) > currentYear)) {
        yearsTrigger = false;
	}
	if(((isNaN(parseInt(startYear[0].value))) || (isNaN(parseInt(endYear[0].value))))){
		yearsTrigger = false;
	}
	if(	(parseInt(endYear[0].value) - parseInt(startYear[0].value)) <  (parseInt(retirementEndYear[0].value) - parseInt(retirementStartYear[0].value))					){
		yearsTrigger = false;
	}

	if (((parseInt(rate[0].value) < 0) || (isNaN(parseInt(rate[0].value))))) {
		rateTrigger = false;
	}

	if(yearsTrigger == true){
    	$("#dataError").hide();
        $(".runSim").removeClass("disabled");
    }else if (yearsTrigger == false){
    	$("#dataError").show();
        $(".runSim").addClass("disabled");
    }
	if(rateTrigger == true){
    	$("#dataRateError").hide();
        $(".runSim").removeClass("disabled");
    }else if (rateTrigger == false){
    	$("#dataRateError").show();
        $(".runSim").addClass("disabled");
    }

}
$(document).on("keyup", "input[ng-model='data.data.start']", function() {
    cmpDataOptions();
});
$(document).on("keyup", "input[ng-model='data.data.end']", function() {
    cmpDataOptions();
});
$(document).on("keyup", "input[ng-model='data.data.growth']", function() {
    cmpDataOptions();
});