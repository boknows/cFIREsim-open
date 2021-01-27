/*
statsModule.js - A template for modular statistical analysis methods for cFIREsim

Required parameters:
Functions must always have the parameters (form, sim) to represent the input form, the simulation container.

All other properties can support the main statistical analysis functions

The "form" parameter for each function contains all of the form inputs. This can be seen in the javascript console when a simulation is ran.
The "sim" parameter for each function is a multi-dimensional array of the simulation results.  sim[0][0] is the first year of the first simulation cycle. sim[9][25] is the 26th year of the 10th simulation cycle.  In crafting a new spending method, sim[i][j] represents the current year, and sim[i][j-1] represents the previous year (if you want to do calculations based on the previous year).
*/

var StatsModule = {
    init: function(sim, form) {
		this.finalStats =  {
			"successRate": null,
				"failures": null,
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
																			"individualDips": []
		};
        this.calcGeneralStats(sim, form);
        this.calcWithdrawalAnalysis(sim, form);
        this.calcDipAnalysis(sim);
        console.log("Final Stats: ", this.finalStats);

		//Rounds all data for data tables
		function roundData(rawData){
			var data = [];
			for (var i=0;i<rawData.length;i++){
				for(var j=0; j<rawData[i].length;j++){
					if(typeof(rawData[i][j])==="number"){
						rawData[i][j] = Math.round(rawData[i][j]);
					}
				}
			}
			return rawData;
		}
		//First Table - Success Rates
		var dataSet1a = [
			[Math.round(100*this.finalStats.successRate)/100 + "%", accounting.formatMoney(this.finalStats.avgPortfolioAtRetirement, "$", 0)]
		];
        $('#stats'+Simulation.tabs+"a").DataTable( {
			data: dataSet1a,
			columns: [
				{ title: "Success Rate" },
				{ title: "Avg. Portfolio at Retirement" },
			],
			"ordering": false,
			"paging": false,
			"searching": false,
			"info": false,
			"autoWidth": false
    	} );

		//Second Table - General Stats
		var dataSet1b = [
			["Average:", accounting.formatMoney(this.finalStats.average.endingPortfolios, "$", 0), accounting.formatMoney(this.finalStats.average.yearlyWithdrawals, "$", 0), accounting.formatMoney(this.finalStats.average.totalWithdrawals, "$", 0)],
			["Median:", accounting.formatMoney(this.finalStats.median.endingPortfolios, "$", 0), accounting.formatMoney(this.finalStats.median.yearlyWithdrawals, "$", 0), accounting.formatMoney(this.finalStats.median.totalWithdrawals, "$", 0)],
			["St. Dev.:", accounting.formatMoney(this.finalStats.stDev.endingPortfolios, "$", 0), accounting.formatMoney(this.finalStats.stDev.yearlyWithdrawals, "$", 0), accounting.formatMoney(this.finalStats.stDev.totalWithdrawals, "$", 0)],
			["Highest:", accounting.formatMoney(this.finalStats.highest.endingPortfolios, "$", 0), accounting.formatMoney(this.finalStats.highest.yearlyWithdrawals, "$", 0), accounting.formatMoney(this.finalStats.highest.totalWithdrawals, "$", 0)],
			["Lowest:", accounting.formatMoney(this.finalStats.lowest.endingPortfolios, "$", 0), accounting.formatMoney(this.finalStats.lowest.yearlyWithdrawals, "$", 0), accounting.formatMoney(this.finalStats.lowest.totalWithdrawals, "$", 0)],
		];
        $('#stats'+Simulation.tabs+"b").DataTable( {
			data: dataSet1b,
			columns: [
				{ title: "" },
				{ title: "Ending Portfolio" },
				{ title: "Yearly Withdrawals" },
				{ title: "Total Withdrawals" },
			],
			"ordering": false,
			"paging": false,
			"searching": false,
			"info": false
    	} );

		//Third Table - Withdrawal Analysis
		var dataSet1c = [
			["Average:", accounting.formatMoney(this.finalStats.withdrawalAnalysis.average.first5years, "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.average.thirds[0], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.average.thirds[1], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.average.thirds[2], "$", 0)],
			["Median:", accounting.formatMoney(this.finalStats.withdrawalAnalysis.median.first5years, "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.median.thirds[0], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.median.thirds[1], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.median.thirds[2], "$", 0),],
			["St. Dev.:", accounting.formatMoney(this.finalStats.withdrawalAnalysis.stDev.first5years, "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.stDev.thirds[0], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.stDev.thirds[1], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.stDev.thirds[2], "$", 0)],
			["Highest:", accounting.formatMoney(this.finalStats.withdrawalAnalysis.highest.first5years, "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.highest.thirds[0], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.highest.thirds[1], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.highest.thirds[2], "$", 0)],
			["Lowest:", accounting.formatMoney(this.finalStats.withdrawalAnalysis.lowest.first5years, "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.lowest.thirds[0], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.lowest.thirds[1], "$", 0), accounting.formatMoney(this.finalStats.withdrawalAnalysis.lowest.thirds[2], "$", 0)],
			["Failures:", this.finalStats.withdrawalAnalysis.failures.first5years, this.finalStats.withdrawalAnalysis.failures.thirds[0], this.finalStats.withdrawalAnalysis.failures.thirds[1], this.finalStats.withdrawalAnalysis.failures.thirds[2]],
		];
		dataSet1c = roundData(dataSet1c);
        $('#stats'+Simulation.tabs+"c").DataTable( {
			data: dataSet1c,
			columns: [
				{ title: "Withdrawal Analysis" },
				{ title: "First 5 Years" },
				{ title: "Beginning Third" },
				{ title: "Middle Third" },
				{ title: "Final Third" }
			],
			"ordering": false,
			"paging": false,
			"searching": false,
			"info": false
    	} );

        //Fourth Table - Dip Analysis
        var dataSet1d = [
            ["Cycles dipped >10% below initial:", this.finalStats.dipAnalysis.below10.portfolioDips, this.finalStats.dipAnalysis.below10.maxPortfolioDips, this.finalStats.dipAnalysis.below10.withdrawalDips, this.finalStats.dipAnalysis.below10.maxWithdrawalDips],
            [">20% below initial:", this.finalStats.dipAnalysis.below20.portfolioDips, this.finalStats.dipAnalysis.below20.maxPortfolioDips, this.finalStats.dipAnalysis.below20.withdrawalDips, this.finalStats.dipAnalysis.below20.maxWithdrawalDips],
            [">40% below initial:", this.finalStats.dipAnalysis.below40.portfolioDips, this.finalStats.dipAnalysis.below40.maxPortfolioDips, this.finalStats.dipAnalysis.below40.withdrawalDips, this.finalStats.dipAnalysis.below40.maxWithdrawalDips],
            [">60% below initial:", this.finalStats.dipAnalysis.below60.portfolioDips, this.finalStats.dipAnalysis.below60.maxPortfolioDips, this.finalStats.dipAnalysis.below60.withdrawalDips, this.finalStats.dipAnalysis.below60.maxWithdrawalDips],
        ];
        $('#stats'+Simulation.tabs+"d").DataTable( {
            data: dataSet1d,
            columns: [
                { title: "Dip Analysis" },
                { title: "Portfolio Dips(cycles)" },
                { title: "Max Dips(in a cycle)" },
                { title: "Withdrawal Dips(cycles)" },
                { title: "Max Dips(in a cycle)" }
            ],
            "ordering": false,
            "paging": false,
            "searching": false,
            "info": false
        } );

        //Fifth Table - Individual Dips
        var dataSet1e = [
            ["Lowest Dip:", accounting.formatMoney(this.finalStats.individualDips.portfolioDips[0].portfolio, "$", 0), this.finalStats.individualDips.portfolioDips[0].cycleStart + "/" + this.finalStats.individualDips.portfolioDips[0].dipYear, accounting.formatMoney(this.finalStats.individualDips.withdrawalDips[0].withdrawal, "$", 0), this.finalStats.individualDips.withdrawalDips[0].cycleStart + "/" + this.finalStats.individualDips.withdrawalDips[0].dipYear],
            ["2nd Lowest Dip:", accounting.formatMoney(this.finalStats.individualDips.portfolioDips[1].portfolio, "$", 0), this.finalStats.individualDips.portfolioDips[1].cycleStart + "/" + this.finalStats.individualDips.portfolioDips[1].dipYear, accounting.formatMoney(this.finalStats.individualDips.withdrawalDips[1].withdrawal, "$", 0), this.finalStats.individualDips.withdrawalDips[0].cycleStart + "/" + this.finalStats.individualDips.withdrawalDips[0].dipYear],
            ["3rd Lowest Dip:", accounting.formatMoney(this.finalStats.individualDips.portfolioDips[2].portfolio, "$", 0), this.finalStats.individualDips.portfolioDips[2].cycleStart + "/" + this.finalStats.individualDips.portfolioDips[2].dipYear, accounting.formatMoney(this.finalStats.individualDips.withdrawalDips[2].withdrawal, "$", 0), this.finalStats.individualDips.withdrawalDips[0].cycleStart + "/" + this.finalStats.individualDips.withdrawalDips[0].dipYear],
            ["4th Lowest Dip:", accounting.formatMoney(this.finalStats.individualDips.portfolioDips[3].portfolio, "$", 0), this.finalStats.individualDips.portfolioDips[3].cycleStart + "/" + this.finalStats.individualDips.portfolioDips[3].dipYear, accounting.formatMoney(this.finalStats.individualDips.withdrawalDips[3].withdrawal, "$", 0), this.finalStats.individualDips.withdrawalDips[0].cycleStart + "/" + this.finalStats.individualDips.withdrawalDips[0].dipYear],
            ["5th Lowest Dip:", accounting.formatMoney(this.finalStats.individualDips.portfolioDips[4].portfolio, "$", 0), this.finalStats.individualDips.portfolioDips[4].cycleStart + "/" + this.finalStats.individualDips.portfolioDips[4].dipYear, accounting.formatMoney(this.finalStats.individualDips.withdrawalDips[4].withdrawal, "$", 0), this.finalStats.individualDips.withdrawalDips[0].cycleStart + "/" + this.finalStats.individualDips.withdrawalDips[0].dipYear],
        ];
        $('#stats'+Simulation.tabs+"e").DataTable( {
            data: dataSet1e,
            columns: [
                { title: "Individual Dips" },
                { title: "Portfolio Dip" },
                { title: "Cycle Start / Dip Year" },
                { title: "Withdrawal Dip" },
                { title: "Cycle Start / Dip Year" }
            ],
            "ordering": false,
            "paging": false,
            "searching": false,
            "info": false
        } );

        //Add mouseover info to output tabs
        $('#tabNames li.active').tooltip({
            trigger: 'hover',
            html: true,
            title: 'Retirement: '+form.retirementStartYear+'-'+form.retirementEndYear+
                    '<br>Spending: '+accounting.formatMoney(form.spending.initial, "$", 0)+
                    '<br>Avg. Portfolio: '+dataSet1a[0][1]+
                    '<br>Success: '+dataSet1a[0][0]
        });
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
    calcGeneralStats: function(sim, form) {
        //Initialize arrays for storing values from sim container
        var endingPortfolios = [],
            yearlyWithdrawals = [],
            totalWithdrawals = [],
            totalWithdrawalsSummed = [],
            totalWithdrawalAvgs = 0;
		var currentYear = new Date().getFullYear();
    	var retireYrIndex = (form.retirementStartYear - currentYear);
		var cycles = form.retirementEndYear - form.retirementStartYear + 1;

        //Add appropriate values to arrays from the main sim container, for each year of each cycle
        for (var i = 0; i < sim.length; i++) {
            var tempSummedWithdrawals = [];
            for (var j = 0; j < sim[i].length; j++) {
				if(j >= retireYrIndex){
					yearlyWithdrawals.push(sim[i][j].infAdjSpending);
					tempSummedWithdrawals.push(sim[i][j].infAdjSpending);
					totalWithdrawals.push(sim[i][j].infAdjSpending);
				}
				if(j == sim[i].length-1){
					endingPortfolios.push(sim[i][j].portfolio.infAdjEnd);
				}
            }
            totalWithdrawalsSummed.push(tempSummedWithdrawals.reduce(function(a,b,index,array){return a+b}));
        }

        //Sum up the total withdrawals from a given cycle, to determine the average total withdrawals for all cycles
        totalWithdrawalAvgs = this.average(yearlyWithdrawals);

        //Send values to finalStats object
        this.finalStats.average = {
            "endingPortfolios": this.average(endingPortfolios),
            "yearlyWithdrawals": this.average(yearlyWithdrawals),
            "totalWithdrawals": this.average(totalWithdrawalsSummed)
        };
        this.finalStats.median = {
            "endingPortfolios": this.median(endingPortfolios),
            "yearlyWithdrawals": this.median(yearlyWithdrawals),
            "totalWithdrawals": this.median(totalWithdrawalsSummed)
        };
        this.finalStats.stDev = {
            "endingPortfolios": this.standardDeviation(endingPortfolios),
            "yearlyWithdrawals": this.standardDeviation(yearlyWithdrawals),
            "totalWithdrawals": this.standardDeviation(totalWithdrawalsSummed)
        };
        this.finalStats.highest = {
            "endingPortfolios": this.max(endingPortfolios),
            "yearlyWithdrawals": this.max(yearlyWithdrawals),
            "totalWithdrawals": this.max(totalWithdrawalsSummed)
        };
        this.finalStats.lowest = {
            "endingPortfolios": this.min(endingPortfolios),
            "yearlyWithdrawals": this.min(yearlyWithdrawals),
            "totalWithdrawals": this.min(totalWithdrawalsSummed)
        };

        //Calculate Success Rate - THIS IS REDUNDANT. Delete/consolidate from cFIREsimOpen.js
        var totalFailures = 0;
        for (var i = 0; i < sim.length; i++) {
            for (var j = 0; j < sim[i].length; j++) {
                if(sim[i][j].portfolio.infAdjEnd < 0){
                    totalFailures++;
                    break;
                }
            }
        }
        StatsModule.finalStats.successRate = (1-(totalFailures/sim.length))*100;
        StatsModule.finalStats.failures = totalFailures;

        //Calculate Average Portfolio at Retirement
        var portfolioAtRetirement = [];
		var dt = new Date();
		var retireYear = form.retirementStartYear - (dt.getYear()+1900);
        for (var i = 0; i < sim.length; i++) {
            for (var j = 0; j < sim[i].length; j++) {
				if(retireYear == j){
					portfolioAtRetirement.push(sim[i][j].portfolio.infAdjStart);
				}
            }
        }
		StatsModule.finalStats.avgPortfolioAtRetirement = this.average(portfolioAtRetirement);
    },
    calcWithdrawalAnalysis: function(sim, form) {
    	//Determine time periods
		var currentYear = new Date().getFullYear();
    	var cycleLength = form.retirementEndYear - form.retirementStartYear;
    	var period = {
    		"first5": {
    			"start": (form.retirementStartYear - currentYear),
    			"stop": (form.retirementStartYear - currentYear + 4)
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
    },
	calcDipAnalysis: function (sim) {
		//Initialize variables
        var dips = {
            "portfolioDip10" : [],
            "portfolioDip20" : [],
            "portfolioDip40" : [],
            "portfolioDip60" : [],
            "withdrawalDip10" : [],
            "withdrawalDip20" : [],
            "withdrawalDip40" : [],
            "withdrawalDip60" : [],
            "portfolioDip10MaxDips" : [],
            "portfolioDip20MaxDips" : [],
            "portfolioDip40MaxDips" : [],
            "portfolioDip60MaxDips" : [],
            "withdrawalDip10MaxDips" : [],
            "withdrawalDip20MaxDips" : [],
            "withdrawalDip40MaxDips" : [],
            "withdrawalDip60MaxDips" : []
        };
		var initialPortfolio = sim[0][0].portfolio.start;
		var initialWithdrawal = sim[0][0].infAdjSpending;

		//Cycle through main sim container, for each year of each cycle
        for (var i = 0; i < sim.length; i++) {
            for (var j = 0; j < sim[i].length; j++) {
                //Check Portfolio Dips
				if(sim[i][j].portfolio.infAdjEnd < (initialPortfolio * .4)){
					dips.portfolioDip60.push({"year": sim[i][j].year, "cycle": i, "portfolio": sim[i][j].portfolio.infAdjEnd});
					dips.portfolioDip60MaxDips.push({"year": sim[i][j].year, "cycle": i});
				}
                if(sim[i][j].portfolio.infAdjEnd < (initialPortfolio * .6)){
					dips.portfolioDip40.push({"year": sim[i][j].year, "cycle": i});
                    dips.portfolioDip40MaxDips.push({"year": sim[i][j].year, "cycle": i});
				}
                if(sim[i][j].portfolio.infAdjEnd < (initialPortfolio * .8)){
                    dips.portfolioDip20.push({"year": sim[i][j].year, "cycle": i});
                    dips.portfolioDip20MaxDips.push({"year": sim[i][j].year, "cycle": i});
                }
                if(sim[i][j].portfolio.infAdjEnd < (initialPortfolio * .9)){
                    dips.portfolioDip10.push({"year": sim[i][j].year, "cycle": i, "portfolio": sim[i][j].portfolio.infAdjEnd});
                    dips.portfolioDip10MaxDips.push({"year": sim[i][j].year, "cycle": i, "portfolio": sim[i][j].portfolio.infAdjEnd});
                }

                //Check Withdrawal Dips
                if(sim[i][j].infAdjSpending < (initialWithdrawal * .4)){
                    dips.withdrawalDip60.push({"year": sim[i][j].year, "cycle": i});
                    dips.withdrawalDip60MaxDips.push({"year": sim[i][j].year, "cycle": i});
                }
                if(sim[i][j].infAdjSpending < (initialWithdrawal * .6)){
                    dips.withdrawalDip40.push({"year": sim[i][j].year, "cycle": i});
                    dips.withdrawalDip40MaxDips.push({"year": sim[i][j].year, "cycle": i});
                }
                if(sim[i][j].infAdjSpending < (initialWithdrawal * .8)){
                    dips.withdrawalDip20.push({"year": sim[i][j].year, "cycle": i});
                    dips.withdrawalDip20MaxDips.push({"year": sim[i][j].year, "cycle": i});
                }
                if(sim[i][j].infAdjSpending < (initialWithdrawal * .9)){
                    dips.withdrawalDip10.push({"year": sim[i][j].year, "cycle": i});
                    dips.withdrawalDip10MaxDips.push({"year": sim[i][j].year, "cycle": i});
                }
            }
        }

        //Calculate dips that have at least 1 cycle
        function dipsPerCycle (dipsArray){
            var cyclesWithDips = [];
            for(var i=0;i<dipsArray.length;i++){
                var trigger = false;
                for(var j=0;j<cyclesWithDips.length; j++){
                    if(dipsArray[i].cycle == cyclesWithDips[j].cycle){
                        trigger = true;
                    }
                }
                if(trigger == false){
                    cyclesWithDips.push({"cycle": dipsArray[i].cycle, "year": dipsArray[i].year});
                }
            }
            return cyclesWithDips;
        }

        //Calculate max dips in a single cycle
        function maxDipsSingleCycle (dipsArray){
            var max = 0;
            var cycles = [];
            for(var i=0;i<dipsArray.length;i++){
                cycles.push(dipsArray[i].cycle);
            }
            //Find all unique cycles that a dip occurred, for future comparison
            var uniqueCycles = cycles.filter(function(itm,i,cycles){
                return i==cycles.indexOf(itm);
            });
            for(var i=0; i<uniqueCycles.length; i++){
                var counter = 0;
                for(var j=0; j<dipsArray.length; j++){
                    if(uniqueCycles[i] == dipsArray[j].cycle){
                        counter++;
                    }
                }
                if(counter > max){
                    max = counter;
                }
            }
            return max;
        }

        //Find the lowest 5 dips across all cycles
        function lowestIndividualDips (sim){
            var lowestPortfolioDips = [];
            var lowestWithdrawalDips = [];
            for (var i = 0; i < sim.length; i++) {
                for (var j = 0; j < sim[i].length; j++) {
                    if(lowestPortfolioDips.length<5){
                        lowestPortfolioDips.push({"portfolio": sim[i][j].portfolio.infAdjEnd, "cycleStart": (sim[i][j].year-j), "dipYear": sim[i][j].year});
                    }else{
                        for(var k=0; k<lowestPortfolioDips.length; k++){
                            if(lowestPortfolioDips[k].portfolio > sim[i][j].portfolio.infAdjEnd){
                                lowestPortfolioDips.splice(k,1);
                                lowestPortfolioDips.push({"portfolio": sim[i][j].portfolio.infAdjEnd, "cycleStart": (sim[i][j].year-j), "dipYear": sim[i][j].year});
                                break;
                            }
                        }
                    }
                    if(lowestWithdrawalDips.length<5){
                        lowestWithdrawalDips.push({"withdrawal": sim[i][j].infAdjSpending, "cycleStart": (sim[i][j].year-j), "dipYear": sim[i][j].year});
                    }else{
                        for(var k=0; k<lowestWithdrawalDips.length; k++){
                            if(lowestWithdrawalDips[k].withdrawal > sim[i][j].infAdjSpending){
                                lowestWithdrawalDips.splice(k,1);
                                lowestWithdrawalDips.push({"withdrawal": sim[i][j].infAdjSpending, "cycleStart": (sim[i][j].year-j), "dipYear": sim[i][j].year});
                                break;
                            }
                        }
                    }

                }
            }
            return {"portfolioDips": lowestPortfolioDips, "withdrawalDips": lowestWithdrawalDips };
        }

        function comparePortfolio(a,b) {
          if (a.portfolio < b.portfolio)
            return -1;
          if (a.portfolio > b.portfolio)
            return 1;
          return 0;
        }

        function compareWithdrawal(a,b) {
          if (a.withdrawal < b.withdrawal)
            return -1;
          if (a.withdrawal > b.withdrawal)
            return 1;
          return 0;
        }

        var individualDips = lowestIndividualDips(sim);
        individualDips.portfolioDips.sort(comparePortfolio);
        individualDips.withdrawalDips.sort(compareWithdrawal);
        StatsModule.finalStats.individualDips.portfolioDips = individualDips.portfolioDips;
        StatsModule.finalStats.individualDips.withdrawalDips = individualDips.withdrawalDips;

        StatsModule.finalStats.dipAnalysis.below10.maxPortfolioDips = maxDipsSingleCycle(dips.portfolioDip10);
        StatsModule.finalStats.dipAnalysis.below20.maxPortfolioDips = maxDipsSingleCycle(dips.portfolioDip20);
        StatsModule.finalStats.dipAnalysis.below40.maxPortfolioDips = maxDipsSingleCycle(dips.portfolioDip40);
        StatsModule.finalStats.dipAnalysis.below60.maxPortfolioDips = maxDipsSingleCycle(dips.portfolioDip60);
        StatsModule.finalStats.dipAnalysis.below10.maxWithdrawalDips = maxDipsSingleCycle(dips.withdrawalDip10);
        StatsModule.finalStats.dipAnalysis.below20.maxWithdrawalDips = maxDipsSingleCycle(dips.withdrawalDip20);
        StatsModule.finalStats.dipAnalysis.below40.maxWithdrawalDips = maxDipsSingleCycle(dips.withdrawalDip40);
        StatsModule.finalStats.dipAnalysis.below60.maxWithdrawalDips = maxDipsSingleCycle(dips.withdrawalDip60);

        StatsModule.finalStats.dipAnalysis.below10.portfolioDips = dipsPerCycle(dips.portfolioDip10).length;
        StatsModule.finalStats.dipAnalysis.below20.portfolioDips = dipsPerCycle(dips.portfolioDip20).length;
        StatsModule.finalStats.dipAnalysis.below40.portfolioDips = dipsPerCycle(dips.portfolioDip40).length;
        StatsModule.finalStats.dipAnalysis.below60.portfolioDips = dipsPerCycle(dips.portfolioDip60).length;
        StatsModule.finalStats.dipAnalysis.below10.withdrawalDips = dipsPerCycle(dips.withdrawalDip10).length;
        StatsModule.finalStats.dipAnalysis.below20.withdrawalDips = dipsPerCycle(dips.withdrawalDip20).length;
        StatsModule.finalStats.dipAnalysis.below40.withdrawalDips = dipsPerCycle(dips.withdrawalDip40).length;
        StatsModule.finalStats.dipAnalysis.below60.withdrawalDips = dipsPerCycle(dips.withdrawalDip60).length;

	}

};
