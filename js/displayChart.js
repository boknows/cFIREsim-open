var data = {
    "Series 1": {
        "20141020": 3.5003987252672744,
        "20141019": 2.505802351020492,
        "20141018": 1.511804171940014,
        "20141015": 1.466520821512944,
        "20141014": 2.458051096911987,
        "20141017": 0.518412786499141,
        "20141016": 0.4743643618143949,
        "20141013": 3.4489507475146013},
    "Series 2": {
        "20141008": 3.386547593121662,
        "20141009": 2.1369256424188166,
        "20141011": 0.3631764039020311,
        "20141010": 0.8870161087572228,
        "20141013": 2.8643781772248076,
        "20141012": 1.6136442355091276},
    "Series 3": {
        "20141024": 1.041445076319178,
        "20141025": 1.1241181263211502,
        "20141026": 1.38667149365412,
        "20141027": 1.818787980672198,
        "20141020": 2.5807963840540538,
        "20141021": 1.9209716474825598,
        "20141022": 1.4397443637179492,
        "20141023": 1.1457284782715362,
        "20141028": 2.4079290114153764,
        "20141029": 3.1402443065157684,
        "20141019": 3.4040698638675053},
    "Series 4": {
        "20141015": 0.6342340828370823,
        "20141014": 0.5870678384520431,
        "20141017": 3.0054047120678433,
        "20141016": 1.8435837647016058,
        "20141011": 3.997287602433431,
        "20141013": 1.786070641215474,
        "20141012": 2.9316731724834995},
    "Series 5": {
        "20141024": 2.1140684266577807,
        "20141025": 2.0313953766558086,
        "20141026": 1.7688420093228387,
        "20141027": 1.3367255223047607,
        "20141020": 0.574717118922905,
        "20141021": 1.234541855494399,
        "20141022": 1.7157691392590095,
        "20141023": 2.0097850247054225,
        "20141030": 0.8458214720297121,
        "20141028": 0.7475844915615824,
        "20141029": 0.015269196461190404,
        "20141019": 0.24855636089054656,
        "20141018": 1.2136523216203159,
        "20141017": 2.2931197800781717,
        "20141016": 3.4549407274444093}
}

var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category20();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(parseDate(d.key)); })
    .y(function(d) { return y(d.value); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var entries = d3.entries(data);

var allX = d3.values(data).map(d3.keys)
    .reduce(function(a,b) { return a.concat(b); }).map(parseDate);
var allY = d3.values(data).map(d3.values)
    .reduce(function(a,b) { return a.concat(b); });

x.domain(d3.extent(allX));
y.domain(d3.extent(allY));

var element = svg.selectAll(".element")
		.data(entries)
		.enter().append("g")
		.attr("class", "element");

element.append("path")
		.attr("class", "line")
		.attr("d", function (d) {
			var entry = d3.entries(d.value);
			return line(entry);
		})
		.style("fill", function (d) {
			return color(d.key);
		});

element.append("text")
		.datum(function (d) {
			var entry = d3.entries(d.value);
			return {
				name: d.key,
				date: parseDate(entry[entry.length - 1].key),
				value: entry[entry.length - 1].value
			};
		})
		.attr("transform", function (d) {
			return "translate(" + x(d.date) + "," + y(d.value) + ")";
		})
		.attr("x", -6)
		.attr("dy", ".35em")
		.text(function (d) {
			return d.name;
		});

svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis);

svg.append("g")
		.attr("class", "y axis")
		.call(yAxis);
