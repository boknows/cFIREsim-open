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
            var floor = SpendingModule.calcBasicSpendingFloor(form, sim, i, j);
            var ceiling = SpendingModule.calcBasicSpendingCeiling(form, sim, i, j);
            return Math.min(ceiling, Math.max(floor, form.spending.initial));
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

            var floor = SpendingModule.calcBasicSpendingFloor(form, sim, i, j);
            var ceiling = SpendingModule.calcBasicSpendingCeiling(form, sim, i, j);

            var baseSpending = (((form.spending.initial * sim[i][j].cumulativeInflation * cpiWeight) + (rmdPortfolio * rmdWeight)));
            return Math.min(ceiling, Math.max(floor, baseSpending));
        },
    },
    "variableSpending": {
        calcSpending: function(form, sim, i, j) {
            var currentYear = new Date().getFullYear();
            var isInitialYearInCycle = j == (form.retirementStartYear - currentYear);
            var isAfterInitialYearInCycle = j > (form.retirementStartYear - currentYear);

            var floor = SpendingModule.calcBasicSpendingFloor(form, sim, i, j);
            var ceiling = SpendingModule.calcBasicSpendingCeiling(form, sim, i, j);

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

    		//Calculate floor value
    		var floor = 0;
			if (form.spending.percentageOfPortfolioFloorType == "percentageOfPortfolio" && "percentageOfPortfolioFloorValue" in form.spending) {
                floor = sim[0][0].portfolio.start * (form.spending.percentageOfPortfolioFloorValue / 100) * sim[i][j].cumulativeInflation;
            }else if(form.spending.percentageOfPortfolioFloorType == "percentageOfPreviousYear" && "percentageOfPortfolioFloorValue" in form.spending && form.spending.percentageOfPortfolioFloorValue != ""){
                floor = (j == 0) ? 0 : (sim[i][j - 1].spending * (form.spending.percentageOfPortfolioFloorValue / 100)  * sim[i][j].cumulativeInflation / sim[i][j-1].cumulativeInflation);
            }else if(form.spending.percentageOfPortfolioFloorType == "definedValue" && "percentageOfPortfolioFloorValue" in form.spending && form.spending.percentageOfPortfolioFloorValue != "") {
                floor = form.spending.percentageOfPortfolioFloorValue * sim[i][j].cumulativeInflation;
            }else if(form.spending.percentageOfPortfolioFloorType == "pensions" && sim[i][j].socialSecurityAndPensionAdjustments != null) {
                floor = sim[i][j].socialSecurityAndPensionAdjustments;
            }

            //Calculate Ceiling
            var ceiling = Number.POSITIVE_INFINITY;
			if (form.spending.percentageOfPortfolioCeilingType == "percentageOfPortfolio" && "percentageOfPortfolioCeilingValue" in form.spending && form.spending.percentageOfPortfolioCeilingValue != "") {
                ceiling = sim[0][0].portfolio.start * (form.spending.percentageOfPortfolioCeilingValue / 100) * sim[i][j].cumulativeInflation;
            }else if(form.spending.percentageOfPortfolioCeilingType == "definedValue" && "percentageOfPortfolioCeilingValue" in form.spending && form.spending.percentageOfPortfolioCeilingValue != "") {
                ceiling = form.spending.percentageOfPortfolioCeilingValue * sim[i][j].cumulativeInflation;
            }

            //Determine spending based on floor/ceiling values and the given % of portfolio value
            var baseSpending = sim[i][j].portfolio.start * (form.spending.percentageOfPortfolioPercentage/100);
            spending = Math.min(ceiling, Math.max(floor, baseSpending))

        	return spending;
        }
    },
    "guytonKlinger": {
        calcSpending: function(form, sim, i, j) {
            if(j == 0)
            {
                return form.spending.initial;
            }

            var currentYear = new Date().getFullYear();
            var initialWithdrawalRate = form.spending.initial / sim[i][0].portfolio.start;
            var exceeds = (form.spending.guytonKlingerExceeds / 100);
            var cut = form.spending.guytonKlingerCut / 100;
            var fall = (form.spending.guytonKlingerFall / 100);
            var raise = form.spending.guytonKlingerRaise / 100;

            var currentWithdrawalRate = sim[i][j-1].spending / sim[i][j].portfolio.start;
            var exceedsRate = initialWithdrawalRate * (1 + exceeds);
            var fallRate = initialWithdrawalRate * (1 - fall);
            
            var floor = SpendingModule.calcBasicSpendingFloor(form, sim, i, j);
            var ceiling = SpendingModule.calcBasicSpendingCeiling(form, sim, i, j);

            var currentYearInflation = ((sim[i][j].cumulativeInflation - sim[i][j-1].cumulativeInflation) / sim[i][j-1].cumulativeInflation + 1);
            var simulationDuration = form.retirementEndYear - form.retirementStartYear + 1;
            var yearsLeftInSimulation = simulationDuration - j;
            if(currentWithdrawalRate > exceedsRate && yearsLeftInSimulation > 15)
            {
                return Math.max(sim[i][j-1].spending * (1 - cut) * currentYearInflation, floor);
            }
            if(currentWithdrawalRate < fallRate)
            {
                return Math.min(sim[i][j-1].spending * (1 + raise) * currentYearInflation, ceiling);
            }
            return sim[i][j-1].spending * currentYearInflation;
        }
    },
    calcBasicSpendingFloor: function(form, sim, i, j) {
        if(form.spending.floor == 'definedValue' && "floorValue" in form.spending) {
            return form.spending.floorValue * sim[i][j].cumulativeInflation;
        } else if (form.spending.floor == "pensions" && sim[i][j].socialSecurityAndPensionAdjustments != null){
            return sim[i][j].socialSecurityAndPensionAdjustments;
        }
        return 0;
    },
    calcBasicSpendingCeiling: function(form, sim, i, j) {
        return form.spending.ceiling == "definedValue" && form.spending.ceilingValue != null ? form.spending.ceilingValue * sim[i][j].cumulativeInflation : Number.POSITIVE_INFINITY;
    },
    calcPayment: function(rate, nper, pv, fv) {
        return (rate * (pv - fv)) / (1 - Math.pow(1 + rate, nper))
    }
};