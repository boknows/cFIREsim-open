/*
spendingModule.js - A template for modular spending methods for cFIREsim
Each module object will have a standard set of properties that will allow the main cFIREsim function to properly determine spending for any given year, given this particular spending method. 

Required properties:
	- fullName - A textual representation of the name of this spending method
	- calcSpending - this is the primary spending calculation. This must always have the parameters (form, sim, i, j) to represent the input form, the simulation container, i - the current simulation cycle, and j - the current year within the simulation cycle. 

All other properties can support the main calcSpending function

The "form" parameter for each function contains all of the form inputs. This can be seen in the javascript console when a simulation is ran.
The "sim" parameter for each function is a multi-dimensional array of the simulation results.  sim[0][0] is the first year of the first simulation cycle. sim[9][25] is the 26th year of the 10th simulation cycle.  In crafting a new spending method, sim[i][j] represents the current year, and sim[i][j-1] represents the previous year (if you want to do calculations based on the previous year).
*/

var SpendingModule = {
    "inflationAdjusted": {
        calcSpending: function(form, sim, i, j) {
            return (form.spending.initial * sim[i][j].cumulativeInflation);
        }
    },
    "notInflationAdjusted": {
        calcSpending: function(form, sim, i, j) {
            return (form.spending.initial);
        }
    },
    "hebelerAutopilot": {
        "rmdTable": [82.4, 81.6, 80.6, 79.7, 78.7, 77.7, 76.7, 75.8, 74.8, 73.8, 72.8, 71.8, 70.8, 69.9, 68.9, 67.9, 66.9, 66.0, 65.0, 64.0, 63.0, 62.1, 61.1, 60.1, 59.1, 58.2, 57.2, 56.2, 55.3, 54.3, 53.3, 52.4, 51.4, 50.4, 49.4, 48.5, 47.5, 46.5, 45.6, 44.6, 43.6, 42.7, 41.7, 40.7, 39.8, 38.8, 37.9, 37.0, 36.0, 35.1, 34.2, 33.3, 32.3, 31.4, 30.5, 29.6, 28.7, 27.9, 27.0, 26.1, 25.2, 24.4, 23.5, 22.7, 21.8, 21.0, 20.2, 19.4, 18.6, 17.8, 17.0, 16.3, 15.5, 14.8, 14.1, 13.4, 12.7, 12.1, 11.4, 10.8, 10.2, 9.7, 9.1, 8.6, 8.1, 7.6, 7.1, 6.7, 6.3, 5.9, 5.5, 5.2, 4.9, 4.6, 4.3, 4.1, 3.8, 3.6, 3.4, 3.1, 2.9, 2.7, 2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.4, 1.2, 1.1],
        calcSpending: function(form, sim, i, j) {
            var rmdAge = parseInt(form.spending.hebelerAgeOfRetirement) + j;
            var rmdFactor = this.rmdTable[rmdAge];
            var rmdWeight = parseInt(form.spending.hebelerWeightedRMD) / 100;
            var cpiWeight = parseInt(form.spending.hebelerWeightedCPI) / 100;
            var rmdPortfolio = (sim[i][j].portfolio.start / rmdFactor);
            return (((form.spending.initial * sim[i][j].cumulativeInflation * cpiWeight) + (rmdPortfolio * rmdWeight)));
        },
    },
    "variableSpending": {
        calcSpending: function(form, sim, i, j) {
            var currentYear = new Date().getFullYear();
            var isInitialYearInCycle = j == (form.retirementStartYear - currentYear);
            var isAfterInitialYearInCycle = j > (form.retirementStartYear - currentYear);

            var floor = (form.spending.floor == 'definedValue') && ("floorValue" in form.spending) ? form.spending.floorValue * sim[i][j].cumulativeInflation : Number.NEGATIVE_INFINITY;
            var ceiling = (form.spending.ceiling == 'definedValue') && ("ceilingValue" in form.spending) ? form.spending.ceilingValue * sim[i][j].cumulativeInflation : Number.POSITIVE_INFINITY;

            if (isInitialYearInCycle) {
                return form.spending.initial;
            } else if (isAfterInitialYearInCycle) {
                var spendingAdjustment = ((sim[i][j].portfolio.start / (sim[i][0].portfolio.start * sim[i][j].cumulativeInflation) - 1) * form.spending.variableSpendingZValue) + 1;
                var spending = form.spending.initial * spendingAdjustment * sim[i][j].cumulativeInflation;
                return Math.min(ceiling, Math.max(floor, spending));
            }
            return 0;
        }
    },
    "percentOfPortfolio": {
        calcSpending: function(form, sim, i, j) {
        	var spending = 0;
        	if(form.spending.percentageOfPortfolioType == "withFloorAndCeiling") {
        		//Calculate floor value
        		var floor;
				if (form.spending.percentageOfPortfolioFloorType == "percentageOfPortfolio") {
                    floor = sim[0][0].portfolio.start * (form.spending.percentageOfPortfolioFloorPercentage / 100);
                }else if(form.spending.percentageOfPortfolioFloorType == "percentageOfPreviousYear"){
                	floor = sim[i][j - 1].spending * (form.spending.percentageOfPortfolioFloorPercentage / 100);
                }else if(form.spending.percentageOfPortfolioFloorType == "none"){
					floor = 0;
                }

                //Calculate Ceiling
                var ceiling;
				if (form.spending.percentageOfPortfolioCeilingType == "percentageOfPortfolio") {
                    ceiling = sim[0][0].portfolio.start * (form.spending.percentageOfPortfolioCeilingPercentage / 100);
                }else if(form.spending.percentageOfPortfolioCeilingType == "percentageOfPreviousYear"){
                	ceiling = sim[i][j - 1].spending * (form.spending.percentageOfPortfolioCeilingPercentage / 100);
                }else if(form.spending.percentageOfPortfolioCeilingType == "none"){
					ceiling = 0;
                }

                //Determine spending based on floor/ceiling values and the given % of portfolio value
                var baseSpending = sim[i][j].portfolio.start * (form.spending.percentageOfPortfolioPercentage/100);
                if(baseSpending > ceiling){
                	spending = ceiling;
                }else if(baseSpending < floor){
                	spending = floor;
                }else{
                	spending = baseSpending;
                }

        	}else{
        		spending = sim[i][j].portfolio.start * (form.spending.percentageOfPortfolioPercentage/100);
        	}

        	return spending;
        }
    },
    "guytonKlinger": {
    	"iwr": 0,
        calcSpending: function(form, sim, i, j) {
            var spending = 0;
            var currentYear = new Date().getFullYear();
            var exceeds = (form.spending.guytonKlingerExceeds / 100);
            var cut = form.spending.guytonKlingerCut / 100;
            var fall = (form.spending.guytonKlingerFall / 100);
            var raise = form.spending.guytonKlingerRaise / 100;
            SpendingModule.guytonKlinger.iwr = form.spending.initial / sim[i][j].portfolio.start;
            if (j == (form.retirementStartYear - currentYear)) {
                //Set Initial Withdrawal Rate for comparison each year.
                spending = form.spending.initial;
            }
            if (j > (form.retirementStartYear - currentYear)) {
            	var iwr = SpendingModule.guytonKlinger.iwr;
                var wr = (sim[i][j - 1].spending) / sim[i][j].portfolio.start;
                if (i == 2) {console.log(j, wr, iwr, exceeds, fall);}
                if (((wr / iwr) - 1) > exceeds) {
                    spending = ((wr * (1 - cut)) * sim[i][j].portfolio.start);
                    if (i == 2) {
                        console.log("CPR active - This Year Spending=" + spending);
                    }
                }else if((1 - (wr / iwr)) > fall) {
                    spending = ((wr * (1 + raise)) * sim[i][j].portfolio.start);
                    if (i == 2) {
                        console.log("PR active - This Year Spending=" + spending);
                    }
                }else{
                    spending = sim[i][j-1].spending * sim[i][j].cumulativeInflation;
                    if (i == 2) {
                        console.log("No rules active - This Year Spending=" + spending);
                    }
                }
            }
            if(form.spending.floor == "definedValue" && form.spending.floorValue > (spending*sim[i][j].cumulativeInflation)){
            	spending = form.spending.floorValue;
            }else if(form.spending.ceiling == "definedValue" && form.spending.ceilingValue < (spending*sim[i][j].cumulativeInflation)){
            	spending = form.spending.ceilingValue;
            }
            return spending;
        }
    }
};