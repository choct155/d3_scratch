//////////////////
// TABLE SET UP //
//////////////////

// Create an SVG object for drawing
var svg = d3.select("body").append("svg")
	.attr("height", 1)
	.attr("width", 1);

// Add a striped table object
var table = d3.select("#iris_table")
		.attr("class", "scroll").attr("style","height:" + 500 + "px;")
		.append("table")
		.attr("class", "table")
		.append("font")
			.attr("face", "Arial");
var caption = table.append("caption").text("The Illustrious Iris Data Set")
var thead = table.append("thead")
	.attr("class", "thead");
var tbody = table.append("tbody")
	.attr("class", "tbody");

// Capture images of irises
var iris_imgs = { 
	"setosa": "http://www.badbear.com/signa/photos/Iris-setosa-23.jpg",
	"versicolor": "https://www.minnesotawildflowers.info/udata/r9ndp23q/pd/iris-versicolor-11.jpg",
	"virginica": "https://www.fs.fed.us/wildflowers/beauty/iris/Blue_Flag/images/iris_virginica_virginica_lg.jpg",
}
var iris_img_labs = {
	"setosa": "Iris Setosa",
	"versicolor": "Iris Versicolor",
	"virginica": "Iris Virginica"
}
		
////////////////////
// SCATTER SET UP //
////////////////////

// Define plot margins (to place it in the div)
var margin = {
	top: 20,
	right: 20,
	bottom: 30,
	left: 40
}
var width = 720 - margin['left'] - margin['right']
var height = 375 - margin['top'] - margin['bottom']

// Define x and y axes
// Note that scales map from one contiguous set of numbers (the domain) to another (the range).
var x = d3.scaleLinear()
	.range([0, width]);
var xAxis = d3.axisBottom(x);

var y = d3.scaleLinear()
	.range([height, 0]);
var yAxis = d3.axisLeft(y)

// Attach an SVG for drawing to the plot div
var svg = d3.select("#iris_scatter").append("svg")
	.attr("width", width + margin['left'] + margin['right'])
	.attr("height", height + margin['top'] + margin['bottom'])
	.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


// It is important to note that the csv function in this example is really containing all of the
// action.  We open the data, and inside of that open data object, we are manipulating it and
// showing it in various ways.  If we were to pass an external data source from, say, an Jupyter
// Notebook, we would not contain all of the work inside of this open data object. 
d3.csv("data/iris.csv", function(error, data) { 
	// Numeric values must be converted to numeric via `+`
	data.forEach(function(d) { 
		d['sepal length'] = +d['sepal length'];
		d['sepal width'] = +d['sepal width'];
		d['petal length'] = +d['petal length'];
		d['petal width'] = +d['petal width'];
		d['class'] = d['class'];
		d['colors'] = d['colors']
	});

	// At this point, the data has been parsed, which means are dealing with an array of
	// key:value maps (each column name maps to a value in each array element). We need to
	// extract the column names from one of these array elements (aka rows). We can extract the
	// keys from an arbitrary object (like row-level maps of keys and values) passing the object
	// to `Object.keys`. Note that this contrasts strongly from the parallel python function for
	// dictionaries, in which one invokes the `keys()` method that is attached directly to the
	// object.

	// Define column names
	var columns = Object.keys(data[0]).filter(function(d) { return d != "colors"})

	//////////////////ii//
	// TABLE GENERATION //
	//////////////////////
	
	// Now we are going to make the header of our table. The key interactive component here is
	// that we want the data to be sorted when clicked. At the moment, we will only worry about
	// one-way sorting. Since there are different kinds of data (numeric and string), we need to
	// specify the sorting rules on the non-numeric side.  
	
	var header = thead.append("tr")
		.selectAll("th")
		.data(columns) // Note that this is a data method, not a reference to the data source
		.enter() // Create new header entries for columns that don't yet exist (enter + append)
		.append("th")
			// Each header element needs to return the name of the column
			.text(function(d) { return d;})
			// Sort a column when clicked
			.on("click", function(d) {
				if ((d == "class") || (d == "colors")) {
					rows.sort(function(a, b) {
						// We need to guide sorting outcome values for
						// strings
						if(a[d] < b[d]) { return -1;}
						else if(a[d] > b[d]) { return 1;}
						else { return 0;}
					})
				}
				else {
					rows.sort(function(a, b) {
						return b[d] - a[d];
					})
				}
				d3.selectAll("th")
					.style("background-color", "#2873ed")
					.style("color", "#ffffff");
				d3.select(this)
					.style("background-color", "#ffffff")
					.style("color", "#2873ed");
			});

	var rows = tbody.selectAll("tr")
		.data(data)
		.enter()
		.append("tr")
		.on("mouseover", function(d){
			d3.select(this)
				.style("background-color", "orange");
			console.log(iris_imgs[d['class']]);
			d3.select("#iris_img").selectAll("img")
				.attr("src", iris_imgs[d['class']]);
			d3.select("#iris_img_caption").text(iris_img_labs[d['class']])
		})
		.on("mouseout", function(d){
			d3.select(this)
				.style("background-color", function(d) {
					return d.color;
				});	
		});

	var cells = rows.selectAll("td")
		.data(function(row) {
			return columns.map(function(d, i){
				return {i: d, value: row[d]};
			});
		})
		.enter()
		.append("td")
		.html(function(d) { return d.value;});

	////////////////////////
	// SCATTER GENERATION //
	////////////////////////

	// Now that we have data loaded, we can establish the domain of our data and map those
	// values to the range of available pizel lengths. Extent returns the minimum and maximum
	// values in a given range. nice() ensures that our last extreme values near the edges of
	// the data values are expressed as integers.
	x.domain(d3.extent(data, function(d){ return d['sepal width'] })).nice()
	y.domain(d3.extent(data, function(d){ return d['sepal length'] })).nice()

	// We can use our mostly done axes objects and our newly defined extents to outfit our chart
	// with x and y axes.  Note that we are leading off by appending new group tags ("g").
	// Presumably these are pointers back to the SVG object we attached our first group tag to?
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0, " + height + ")")
		.call(xAxis)
		.append("text")
			.attr("class", "label")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Sepal Width (cm)");
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
			.attr("class", "label")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Sepal Length (cm)");

	// With our axes and domain convertors in hand, we can actually plot our data. We will plot
	// each data point as a circle whose color is determined by iris species. Note that we are
	// using enter() yet again as a way of storing data points until circles are added for
	// display. This just in time approach allows us to map glyphs to data tightly.
	svg.selectAll(".dot") // of which there are none as of yet
		.data(data)
		.enter()
		.append("circle")
			.attr("class", "dot") // group styling
			.attr("r", 3.5) // circle size by radius
			// x and y coordinates of each circle
			.attr("cx", function(d) { return x(d["sepal width"]); })
			.attr("cy", function(d) { return y(d["sepal length"]); })
			.style("fill", function(d) { return d["colors"]; });

	// To construct the legend, I need the colors associated with each class. Since I set these
	// in the python script that constructed the Iris CSV, I could set these directly. A more
	// general solution would be to employ set operations and extract these values from the
	// data. We can do this by way of the map function, which returns the output of a given
	// function as applied to each element of an array. If we call a function returning the
	// value associated with the color key in each row of data, the output will be organized as
	// an object in which each key is one of the possible values of color across all rows. From
	// here, we can call the keys() method to capture only the unique colors.
	console.log(data['colors']);
	console.log(data);
	console.log(d3.map(data, function(d) { return d['colors']; }).keys());
	console.log(d3.map(data, function(d) { return {d['colors']: d['class']}; }));
	var legend_colors = d3.map(data, function(d) { return d['colors']; }).keys()
	var legend = svg.selectAll(".legend")
		.data(legend_colors)
		.enter()
		.append("g")
			.attr("class", "legend")
			.attr("transform", function(d, i) { return "translate(0, " + i * 20 +")"; });

	legend.append("rect")
		.attr("x", width-18)
		.attr("width", 18)
		.attr("height", 18)
		.style("fill", function(d, i) { return legend_colors[i]; });

	legend.append("text")
		.attr("x", width - 24)
		.attr("y", 9)
		.attr("dy", ".35em")
		.style("text-anchor", "end")
		.text(function(d) { return d; });
		//.style("fill", function(d) { return d['colors']; });
});
