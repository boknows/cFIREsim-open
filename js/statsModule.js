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
				"thirds": [],
			},
			"median": {
				"first5years": null,
				"thirds": [],
			},
			"stDev": {
				"first5years": null,
				"thirds": [],
			},
			"highest": {
				"first5years": null,
				"thirds": [],
			},
			"lowest": {
				"first5years": null,
				"thirds": [],
			},
			"failures": {
				"first5years": null,
				"thirds": [],
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
    init: function(sim) {
        this.calcGeneralStats(sim);
        this.calcWithdrawalAnalysis(sim);
        console.log(this.finalStats);
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
    median: function(values) {
        values.sort(function(a, b) {
            return a - b;
        });
        var half = Math.floor(values.length / 2);
        if (values.length % 2) {
            return values[half];
        } else {
            return (values[half - 1] + values[half]) / 2.0;
        }
    },
    max: function(values) {
        return Math.max.apply(null, values);
    },
    min: function(values) {
        return Math.min.apply(null, values);
    },
    calcGeneralStats: function(sim) {
        //Initialize arrays for storing values from sim container
        var endingPortfolios = [],
            yearlyWithdrawals = [],
            totalWithdrawals = [],
            totalWithdrawalsSummed = [],
            totalWithdrawalAvgs = 0;

        //Add appropriate values to arrays from the main sim container, for each year of each cycle
        for (var i = 0; i < sim.length; i++) {
            totalWithdrawalsSummed[i] = [];
            for (var j = 0; j < sim[i].length; j++) {
                endingPortfolios.push(sim[i][j].portfolio.infAdjEnd);
                yearlyWithdrawals.push(sim[i][j].infAdjSpending);
                totalWithdrawalsSummed[i].push(sim[i][j].infAdjSpending);
                totalWithdrawals.push(sim[i][j].infAdjSpending);
            }
        }

        //Sum up the total withdrawals from a given cycle, to determine the average total withdrawals for all cycles
        for (var i = 0; i < totalWithdrawalsSummed.length; i++) {
            totalWithdrawalAvgs = totalWithdrawalAvgs + this.average(totalWithdrawalsSummed[i]);
        }

        //Send values to finalStats object
        this.finalStats.average = {
            "endingPortfolios": this.average(endingPortfolios),
            "yearlyWithdrawals": this.average(yearlyWithdrawals),
            "totalWithdrawals": (totalWithdrawalAvgs / totalWithdrawalsSummed.length)
        };
        this.finalStats.median = {
            "endingPortfolios": this.median(endingPortfolios),
            "yearlyWithdrawals": this.median(yearlyWithdrawals),
            "totalWithdrawals": this.median(totalWithdrawals)
        };
        this.finalStats.stDev = {
            "endingPortfolios": this.standardDeviation(endingPortfolios),
            "yearlyWithdrawals": this.standardDeviation(yearlyWithdrawals),
            "totalWithdrawals": this.standardDeviation(totalWithdrawals)
        };
        this.finalStats.highest = {
            "endingPortfolios": this.max(endingPortfolios),
            "yearlyWithdrawals": this.max(yearlyWithdrawals),
            "totalWithdrawals": this.max(totalWithdrawals)
        };
        this.finalStats.lowest = {
            "endingPortfolios": this.min(endingPortfolios),
            "yearlyWithdrawals": this.min(yearlyWithdrawals),
            "totalWithdrawals": this.min(totalWithdrawals)
        };
    },
    calcWithdrawalAnalysis: function(sim) {
    	//Determine time periods
    	var cycleLength = sim[0].length;
    	var period = {
    		"first5": {
    			"start": 0,
    			"stop": 4
    		},
       	};

       	if(cycleLength%3==0){ //If perfectly divisible into thirds, each 3rd is the same size. Else, have more years in the first third. Else, have more years in the first third and second third.
       		period.thirds = [
       			{"start": 0, "stop": (cycleLength/3)-1},
       			{"start": (cycleLength/3), "stop": ((cycleLength/3))*2-1},
       			{"start": ((cycleLength/3))*2, "stop": ((cycleLength/3))*3-1},
       		];
       	}else if(cycleLength%3==1){
			period.thirds = [
       			{"start": 0, "stop": (Math.ceil(cycleLength/3)-1)},
       			{"start": (Math.ceil(cycleLength/3)), "stop": (Math.floor(cycleLength/3)*2)},
       			{"start": (Math.floor(cycleLength/3)*2+1), "stop": (cycleLength-1)},
       		];
       	}else if(cycleLength%3==2){
       		period.thirds = [
       			{"start": 0, "stop": (Math.ceil(cycleLength/3)-1)},
       			{"start": (Math.ceil(cycleLength/3)), "stop": (Math.ceil(cycleLength/3)*2-1)},
       			{"start": (Math.ceil(cycleLength/3)*2), "stop": (cycleLength-1)},
       		];
       	}

        //call all time period functions
        first5years(sim, period);
        analyzeThirds(sim, period);
       	
       	//Analysis functions for each time period
        function first5years(sim, period) {
            var withdrawals = [];
            var failures = 0;
            for (var i = 0; i < sim.length; i++) {
                for (var j = period.first5.start; j < period.first5.stop; j++) {
                    withdrawals.push(sim[i][j].infAdjSpending);
                    if (sim[i][j].portfolio.infAdjEnd < 0) {
                        failures++;
                    }
                }
            }
            StatsModule.finalStats.withdrawalAnalysis.average.first5years = StatsModule.average(withdrawals);
            StatsModule.finalStats.withdrawalAnalysis.median.first5years = StatsModule.median(withdrawals);
            StatsModule.finalStats.withdrawalAnalysis.stDev.first5years = StatsModule.standardDeviation(withdrawals);
            StatsModule.finalStats.withdrawalAnalysis.highest.first5years = StatsModule.max(withdrawals);
            StatsModule.finalStats.withdrawalAnalysis.lowest.first5years = StatsModule.min(withdrawals);
            StatsModule.finalStats.withdrawalAnalysis.failures.first5years = failures;
        }

        function analyzeThirds(sim, period){
        	for(var third = 0; third < period.thirds.length; third++){
        		var withdrawals = [];
	            var failures = 0;
	            for (var i = 0; i < sim.length; i++) {
	                for (var j = period.thirds[third].start; j < period.thirds[third].stop; j++) {
	                    withdrawals.push(sim[i][j].infAdjSpending);
	                    if (sim[i][j].portfolio.infAdjEnd < 0) {
	                        failures++;
	                    }
	                }
	            }
	            StatsModule.finalStats.withdrawalAnalysis.average.thirds.push(StatsModule.average(withdrawals));
	            StatsModule.finalStats.withdrawalAnalysis.median.thirds.push(StatsModule.median(withdrawals));
	            StatsModule.finalStats.withdrawalAnalysis.stDev.thirds.push(StatsModule.standardDeviation(withdrawals));
	            StatsModule.finalStats.withdrawalAnalysis.highest.thirds.push(StatsModule.max(withdrawals));
	            StatsModule.finalStats.withdrawalAnalysis.lowest.thirds.push(StatsModule.min(withdrawals));
	            StatsModule.finalStats.withdrawalAnalysis.failures.thirds.push(failures);
        	}
        }
    }

};