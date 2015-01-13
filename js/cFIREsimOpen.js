$(document).ready(function() {
    $("#runSim").click(function() {
        Simulation.runSimulation(formData);
    });
});

var Simulation = {
    sim: [],
    runSimulation: function(form) {
        var startYear = form.retirementStartYear;
        var endYear = form.retirementEndYear;
        var cycleLength = endYear - startYear + 1;
        var numCycles = Object.keys(Market).length - cycleLength + 1;

        for (var cycleStart = 1871; cycleStart < 1871 + numCycles; cycleStart++) {
            var cyc = this.cycle(cycleStart, cycleStart + cycleLength);
            this.sim.push(cyc);
        }

        for (var i = 0; i < this.sim.length; i++) {
            for (var j = 0; j < this.sim[i].length; j++) {	
                if (j > 0) {
                    this.sim[i][j].portfolio = this.roundTwoDecimals(this.sim[i][(j - 1)].portfolio.end - form.spending.initial);
                    this.sim[i][j].infAdjPortfolio = this.roundTwoDecimals(this.sim[i][j].portfolio * this.sim[i][j].cumulativeInflation);
                    this.sim[i][j].infAdjSpending = this.roundTwoDecimals(this.sim[i][j].spending / this.sim[i][j].cumulativeInflation);
                } else {
                    this.sim[i][j].portfolio = (form.portfolio.initial - form.spending.initial);
                }
                this.calcSpending(form, i, j); //Nominal spending for this specific cycle
            	this.calcMarketGains(form, i, j); //Calculate market gains on portfolio based on allocation from form and data points
            }
        }
        console.log(this.sim);
    },
    cycle: function(startOfRange, endOfRange) {
        //The starting CPI value of this cycle, for comparison throughout the cycle.
        var startCPI = Market[startOfRange.toString()].cpi;
        var cyc = [];

        for (var year = startOfRange; year < endOfRange; year++) {
            data = Market[year.toString()]
            cyc.push({
                "year": year,
                "data": data,
                "portfolio": {"start": null, "end": null},
                "infAdjPortfolio": null,
                "spending": null,
                "infAdjSpending": null,
                "equities": {"growth": null, "val": null},
                "bonds": {"growth": null, "val": null},
                "gold": {"growth": null, "val": null},
                "cash": {"growth": null, "val": null},
                "dividends": {"growth": null, "val": null},
                "cumulativeInflation": this.cumulativeInflation(startCPI, data.cpi),
            });
        }

        return cyc;
    },
    roundTwoDecimals: function(num) {
        return Math.round(num * 100) / 100;
    },
    cumulativeInflation: function(startCPI, endCPI) {
        return 1 + ((endCPI - startCPI) / startCPI)
    },
    calcSpending: function(form, i, j){
    	var spending;
    	if(j==0){
    		spending = form.spending.initial;
    	}else{
    		spending =  this.roundTwoDecimals(form.spending.initial * this.sim[i][j].cumulativeInflation);
    	}
    	this.sim[i][j].spending = spending; //assign value to main sim container
    	this.sim[i][j].infAdjSpending = this.roundTwoDecimals(spending / this.sim[i][j].cumulativeInflation);
    },
    calcMarketGains: function(form, i, j){
        var portfolio;
        if(j==0){
            portfolio = form.portfolio.initial; 
        }else{
            portfolio = this.sim[i][(j - 1)].portfolio.end;
        }
        this.sim[i][j].portfolio.start = portfolio;
        portfolio = portfolio - this.sim[i][j].spending; //Take out spending before calculating asset allocation. This simulates taking your spending out at the beginning of a year.
    	
        var equities = (form.portfolio.percentEquities/100 * portfolio);
    	var bonds = (form.portfolio.percentBonds/100 * portfolio);
    	var gold = (form.portfolio.percentGold/100 * portfolio);
    	var cash = (form.portfolio.percentCash/100 * portfolio);

        //Calculate growth
    	this.sim[i][j].equities.growth = this.roundTwoDecimals(equities * (this.sim[i][j].data.growth));
    	this.sim[i][j].dividends.growth = this.roundTwoDecimals(equities * this.sim[i][j].data.dividends);
    	this.sim[i][j].bonds.growth = this.roundTwoDecimals(bonds * (this.sim[i][j].data.fixed_income));
    	this.sim[i][j].gold.growth = this.roundTwoDecimals(gold * (this.sim[i][j].data.gold));
    	this.sim[i][j].cash.growth = this.roundTwoDecimals(cash * ((form.portfolio.growthOfCash/100)));

        //Calculate total value
        this.sim[i][j].equities.val = this.roundTwoDecimals(equities + this.sim[i][j].equities.growth);
        this.sim[i][j].dividends.val = this.sim[i][j].dividends.growth;
        this.sim[i][j].bonds.val = this.roundTwoDecimals(bonds + this.sim[i][j].bonds.growth);
        this.sim[i][j].gold.val = this.roundTwoDecimals(gold + this.sim[i][j].gold.growth);
        this.sim[i][j].cash.val = this.roundTwoDecimals(cash + this.sim[i][j].cash.growth);

    },
    calcEndPortfolio: function(form , i, j){
        if(form.portfolio.rebalanceAnnually == true){
            
        }else{ //Add logic for non-rebalancing portfolios

        }
    },

};
