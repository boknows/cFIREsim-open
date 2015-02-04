/*
statsModule.js - A template for modular statistical analysis methods for cFIREsim

Required paramters:
Functions must always have the parameters (form, sim) to represent the input form, the simulation container.

All other properties can support the main statistical analysis functions

The "form" parameter for each function contains all of the form inputs. This can be seen in the javascript console when a simulation is ran.
The "sim" parameter for each function is a multi-dimensional array of the simulation results.  sim[0][0] is the first year of the first simulation cycle. sim[9][25] is the 26th year of the 10th simulation cycle.  In crafting a new spending method, sim[i][j] represents the current year, and sim[i][j-1] represents the previous year (if you want to do calculations based on the previous year).
*/

var StatsModule = {
	"finalStats":  {
		"successRate": null,
		"avgPortfolioAtRetirement": null,
		"average": {
			"endingPortfolio": null,
			"yearlyWithdrawals": null,
			"totalWithdrawals": null
		},
		"median": {
			"endingPortfolio": null,
			"yearlyWithdrawals": null,
			"totalWithdrawals": null
		},
		"stDev": {
			"endingPortfolio": null,
			"yearlyWithdrawals": null,
			"totalWithdrawals": null
		},
		"highest": {
			"endingPortfolio": null,
			"yearlyWithdrawals": null,
			"totalWithdrawals": null
		},
		"lowest": {
			"endingPortfolio": null,
			"yearlyWithdrawals": null,
			"totalWithdrawals": null
		},
		"withdrawalAnalysis": {
			"average": {
				"first5years": null,
				"begThird": null,
				"midThird": null,
				"finalThird": null
			},
			"median": {
				"first5years": null,
				"begThird": null,
				"midThird": null,
				"finalThird": null
			},
			"stDev": {
				"first5years": null,
				"begThird": null,
				"midThird": null,
				"finalThird": null
			},
			"highest": {
				"first5years": null,
				"begThird": null,
				"midThird": null,
				"finalThird": null
			},
			"lowest": {
				"first5years": null,
				"begThird": null,
				"midThird": null,
				"finalThird": null
			},
			"failures": {
				"first5years": null,
				"begThird": null,
				"midThird": null,
				"finalThird": null
			}
		},
		"dipAnalysis": {
			"below10": {
				"portfolioDips": null,
				"maxPortfolioDips": null,
				"withdrawalDips": null,
				"maxWithdrawalDips": null
			},
			"below20": {
				"portfolioDips": null,
				"maxPortfolioDips": null,
				"withdrawalDips": null,
				"maxWithdrawalDips": null
			},
			"below40": {
				"portfolioDips": null,
				"maxPortfolioDips": null,
				"withdrawalDips": null,
				"maxWithdrawalDips": null
			},
			"below60": {
				"portfolioDips": null,
				"maxPortfolioDips": null,
				"withdrawalDips": null,
				"maxWithdrawalDips": null
			}
		},
		"individualDips": [ 
			{
				"portfolioDip": null,
				"portfolioCycleStartDipYear": null,
				"withdrawalDip": null,
				"withdrawalCycleStartDipYear": null
			}
		]
	},
	//General Statistical Functions
	average: function(data) {
        var sum = data.reduce(function(sum, value) {
            return sum + value;
        }, 0);

        var avg = sum / data.length;
        return avg;
    },
    standardDeviation: function(values) {
        var avg = this.average(values);
        var squareDiffs = values.map(function(value) {
            var diff = value - avg;
            var sqrDiff = diff * diff;
            return sqrDiff;
        });
        var avgSquareDiff = this.average(squareDiffs);

        var stdDev = Math.sqrt(avgSquareDiff);
        return stdDev;
    },
    calcAvgEndingPortfolio: function(sim){
    	var values = [];
    	for(var i = 0; i < sim.length; i++){
    		for(var j = 0; j < sim[i].length; j++){
    			values.push(sim[i][j].portfolio.infAdjEnd);
    		}
    	}
    	return this.average(values);
    }
};