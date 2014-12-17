
 $("#runSim").click(function() {
      simulation(formData);
 });

var sim = [];	//primary simulation output container
function simulation (form, data){ //For iterating over each cycle
	var years = (form.retirementEndYear-form.retirementStartYear+1); //years per simulation cycle
	var cycles = Market.getLength()-years+1;
	
	for(var i=0;i<cycles;i++){
		var cyc = cycle(i, (i+years));
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

function cycle (start, end){ //For iterating over each year of each cycle
	var startCPI = Market.getCPI(start + 1871);  //The starting CPI value of this cycle, for comparison throughout the cycle.
	var cyc = [];
	for(var i=start;i<end;i++){
        cyc.push({
            "data": Market.getData(i + 1871),
            "portfolio": null,
            "infAdjPortfolio": null,
            "spending": null,
            "infAdjSpending": null,
            "cumulativeInflation": (1+((Market.getCPI(i + 1871) - startCPI)/startCPI)),
        });
	}
	//1+(($data[$i+$j+1]['CPI']-$data[$i]['CPI'])/$data[$i]['CPI']);
	return cyc;
};



function doWork(){ //Placeholder

};

var Simulation = (function() {

});