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
                    this.sim[i][j].spending = this.roundTwoDecimals(form.spending.initial * this.sim[i][j].cumulativeInflation);
                    this.sim[i][j].infAdjSpending = this.roundTwoDecimals(this.sim[i][j].spending / this.sim[i][j].cumulativeInflation);
                } else {
                    this.sim[i][j].portfolio = form.portfolio.initial;
                }
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
    }

};
