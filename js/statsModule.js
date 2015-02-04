/*
statsModule.js - A template for modular statistical analysis methods for cFIREsim

Required paramters:
Functions must always have the parameters (form, sim) to represent the input form, the simulation container.

All other properties can support the main statistical analysis functions

The "form" parameter for each function contains all of the form inputs. This can be seen in the javascript console when a simulation is ran.
The "sim" parameter for each function is a multi-dimensional array of the simulation results.  sim[0][0] is the first year of the first simulation cycle. sim[9][25] is the 26th year of the 10th simulation cycle.  In crafting a new spending method, sim[i][j] represents the current year, and sim[i][j-1] represents the previous year (if you want to do calculations based on the previous year).
*/

var StatsModule = {
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
};