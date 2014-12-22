 $("#runSim").click(function() {
      simulation(formData);
 });

var sim = [];	//primary simulation output container

function simulation(form, data){ //For iterating over each cycle
    var startYear = form.retirementStartYear;
    var endYear = form.retirementEndYear;
	var cycleLength = endYear-startYear+1;
	var numCycles = Object.keys(Market).length-cycleLength+1;

	for(var cycleStart=1871; cycleStart<1871+numCycles; cycleStart++){
		var cyc = cycle(cycleStart, cycleStart+cycleLength);
		sim.push(cyc);
	}

	for(var i=0;i<sim.length;i++){
		for(var j=0;j<sim[i].length;j++){
			if(j>0){
				sim[i][j].portfolio = sim[i][(j-1)].portfolio - form.spending.initial;
			}else{
				sim[i][j].portfolio = form.portfolio.initial;
			}
		}
	}
	console.log(sim);
};

//For iterating over each year of each cycle
function cycle(startOfRange, endOfRange){
    //The starting CPI value of this cycle, for comparison throughout the cycle.
	var startCPI = Market[startOfRange.toString()].cpi;

    var cyc = [];

    for(var year=startOfRange; year<endOfRange; year++) {
        data = Market[year.toString()]
        cyc.push({
            "year": year,
            "data": data,
            "portfolio": null,
            "infAdjPortfolio": null,
            "spending": null,
            "infAdjSpending": null,
            "cumulativeInflation": cumulativeInflation(startCPI, data.cpi),
        });
	}

	return cyc;
};

function cumulativeInflation(startCPI, endCPI) {
    return 1+((endCPI-startCPI)/startCPI)
}

function doWork(){ //Placeholder

};

var Simulation = (function() {

});
