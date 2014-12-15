$(document).ready(function() {
    $("#runSim").click(function() {
        simulation(formData);
    });
});

function simulation (form, data){ //For iterating over each cycle
	var years = (form.retirementEndYear-form.retirementStartYear+1); //years per simulation cycle
	var cycles = Market.getLength()-years+1;
	var sim = [];	//primary simulation output container
	for(var i=0;i<cycles;i++){
		var cyc = cycle(i, (i+years));
		sim.push(cyc);
	}
	console.log(sim);
};

function cycle (start, end){ //For iterating over each year of each cycle
	var cyc = [];
	for(var i=start;i<end;i++){
		cyc.push( Market.getData(i) );

		doWork(); //Placeholder for where all the yearly calculations must occur
	}
	return cyc;
};

function doWork(){ //Placeholder

};