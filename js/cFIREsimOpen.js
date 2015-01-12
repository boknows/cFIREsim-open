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
                    this.sim[i][j].portfolio = this.roundTwoDecimals(this.sim[i][(j - 1)].portfolio - form.spending.initial);
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
                "portfolio": null,
                "infAdjPortfolio": null,
                "spending": null,
                "infAdjSpending": null,
                "equities": null,
                "bonds": null,
                "gold": null,
                "cash": null,
                "dividends": null,
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
    	var portfolio = this.sim[i][j].portfolio;
    	var equities = (form.portfolio.percentEquities/100 * this.sim[i][j].portfolio);
    	var bonds = (form.portfolio.percentBonds* this.sim[i][j].portfolio);
    	var gold = (form.portfolio.percentGold * this.sim[i][j].portfolio);
    	var cash = (form.portfolio.percentCash * this.sim[i][j].portfolio);

    	this.sim[i][j].equities = equities * (1+this.sim[i][j].data.growth);
    	this.sim[i][j].dividends = equities * this.sim[i][j].data.dividends;
    	this.sim[i][j].bonds = bonds * (1+this.sim[i][j].data.fixed_income);
    	this.sim[i][j].gold = gold * (1+this.sim[i][j].data.gold);
    	this.sim[i][j].cash = cash * (1+(form.portfolio.growthOfCash/100));
    },
    calcPortfolio: function(form,i, j){

    },

};
