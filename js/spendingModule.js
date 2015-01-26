/*
spendingModule.js - A template for modular spending methods for cFIREsim
Each module object will have a standard set of properties that will allow the main cFIREsim function to properly determine spending for any given year, given this particular spending method. 

This template is going to be based on Hebeler's Autopilot method, as I find that it is a fairly straightforward method. 

Required properties:
	- fullName - A textual representation of the name of this spending method
	- calcSpending - this is the primary spending calculation. This must always have the parameters (form, sim, i, j) to represent the input form, the simulation container, i - the current simulation cycle, and j - the current year within the simulation cycle. 

All other properties can support the main calcSpending function
*/

var SpendingModule = {
	"inflationAdjusted": {
		calcSpending: function(form, sim, i, j){ 
			return (form.spending.initial * sim[i][j].cumulativeInflation);
		}
	},
	"notInflationAdjusted": {
		calcSpending: function(form, sim, i, j){ 
			return (form.spending.initial);
		}
	},
	"hebelerAutopilot": {
		"fullName": "Hebeler's Autopilot",
	    "rmdTable": [82.4, 81.6, 80.6, 79.7, 78.7, 77.7, 76.7, 75.8, 74.8, 73.8, 72.8, 71.8, 70.8, 69.9, 68.9, 67.9, 66.9, 66.0, 65.0, 64.0, 63.0, 62.1, 61.1, 60.1, 59.1, 58.2, 57.2, 56.2, 55.3, 54.3, 53.3, 52.4, 51.4, 50.4, 49.4, 48.5, 47.5, 46.5, 45.6, 44.6, 43.6, 42.7, 41.7, 40.7, 39.8, 38.8, 37.9, 37.0, 36.0, 35.1, 34.2, 33.3, 32.3, 31.4, 30.5, 29.6, 28.7, 27.9, 27.0, 26.1, 25.2, 24.4, 23.5, 22.7, 21.8, 21.0, 20.2, 19.4, 18.6, 17.8, 17.0, 16.3, 15.5, 14.8, 14.1, 13.4, 12.7, 12.1, 11.4, 10.8, 10.2, 9.7, 9.1, 8.6, 8.1, 7.6, 7.1, 6.7, 6.3, 5.9, 5.5, 5.2, 4.9, 4.6, 4.3, 4.1, 3.8, 3.6, 3.4, 3.1, 2.9, 2.7, 2.5, 2.3, 2.1, 1.9, 1.7, 1.5, 1.4, 1.2, 1.1],
	    calcSpending: function(form, sim, i, j){ 
	    	var rmdAge = parseInt(form.spending.hebelerAgeOfRetirement) + j;
	    	var rmdFactor = this.rmdTable[rmdAge];
	    	var rmdWeight = parseInt(form.spending.hebelerWeightedRMD)/100;
	    	var cpiWeight = parseInt(form.spending.hebelerWeightedCPI)/100;
	    	var rmdPortfolio = (sim[i][j].portfolio.start/rmdFactor);
	    	return (((form.spending.initial*sim[i][j].cumulativeInflation*cpiWeight)+(rmdPortfolio*rmdWeight)));
	    },
	},
};
