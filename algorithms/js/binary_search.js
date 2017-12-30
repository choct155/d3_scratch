// We need to generate random integer arrays
function randomInteger(min, max) {
    // Function returns random integers between given min and max values.
    // The integer is approximated by the float value associated with some
    // random distance between the min and max. The integers are drawn from
    // the uniform distribution.
    var min = Math.ceil(min);
    var max = Math.floor(max);
    var intApprox = (Math.random() * (max - min)) + min;
    return Math.floor(intApprox);
};

function randomIntArray(min, max, n) {
    // Function returns an array of random integers of length n, drawn from
    // the uniform distribution.
    var randInts = [];
    var i;
    for (i = 0; i < n; i++){
        randInts.push(randomInteger(min, max));
    }
    return randInts;
};

var integers = randomIntArray(0, 100, 25);

// We are going to want to map colors to each integer value.
// By basing the color on the integer, it will make it easier
// to see that they are sorted. First, we will map each integer
// to the [0, 1] interval, and then we will use those values to
// map colors
var color_scale = d3.scaleLinear()
    .range([0,0.5])
    .domain([d3.min(integers), d3.max(integers)])
var int_col_map = {}
integers.forEach(function(d, i) { int_col_map[d] = d3.interpolateInferno(color_scale(d))})

// All drawings will have the same height and width
var margin = {
    top: 10,
    right: 40,
    bottom: 10,
    left: 40
}
var width = 1000 - margin.left - margin.right
var height = 80 - margin.top - margin.bottom
// We want the scale to provide equal spacing for each rectangle
var x = d3.scaleLinear()
    .range([0, width])
    .domain([0, integers.length])
var y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, 5])

// The first task is to just simply display the numbers. We need a
// canvas in the middle of the div
var num_svg = d3.select("#static_random_draws")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
// The number elements to be displayed depend on randomly drawn integers
var num_grp = num_svg.selectAll("g")
    .data(integers)
    .enter()
    .append("g")
// Each rectangle (which will hold numbers) should be colored in a manner
// consistent with the number value. In this case we are using linear
// interpolation between the minimum and maximum values, and a linear color
// mapper
var num_rects = num_grp
    .append("rect")
        .attr("x", function(d, i) { return x(i);})
        .attr("y", y(5))
        .attr("width", x(0.8))
        .attr("height", x(0.8))
        .attr("fill", function(d) { return int_col_map[d]; })
// Each integer is then bound to it's respective rectangle
var num_labs = num_grp
    .append("text")
        .attr("x", function(d, i) { return x(i);})
        .attr("y", y(5))
        .attr("dx", "0.9em")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
            .text(function(d) { return d; })
                .attr("stroke", "#ffffff")
                .attr("fill", "#ffffff")
                .attr("font-family", "Courier")

// The user enters a number to see if it can be found in our set. Upon entry,
// we need to grab the value (after the user presses enter)
var user_value = d3.select("#search_target")
    .on("keypress", function() {
        if(d3.event.keyCode == 13){
            console.log("User has selected " + this.value);
            return +this.value;
        }
    })

// Now we will try a slightly different approach for our array visualization. Since
// we will need to show it many times, let's create a function that returns a built
// out canvas. Then we can just modify what we need off the base case.
function arr_viz(svg_elem, data){

    // Generate groups to hang rectangles and text on
    var target_grp = svg_elem.selectAll("g")
        .data(data)
        .enter()
        .append("g")
        .attr("id", function(d, i){ return "grp-" + i; })
    // Attach rectangles
    var target_rects = target_grp
        .append("rect")
        .attr("x", function(d, i) { return x(i);})
        .attr("y", y(5))
        .attr("width", x(0.8))
        .attr("height", x(0.8))
        .attr("fill", function(d) { return int_col_map[d]; })
        .attr("id", function(d, i){ return "rect-" + i; })
    // Attach text
    var target_labs = target_grp
        .append("text")
        .attr("x", function(d, i) { return x(i);})
        .attr("y", y(5))
        .attr("dx", "0.9em")
        .attr("dy", "1.2em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d; })
        .attr("stroke", "#ffffff")
        .attr("fill", "#ffffff")
        .attr("font-family", "Courier")
        .attr("id", function(d, i){ return "text-" + i; })
    return target_svg
}

// Create a new canvas that can hold multiple arrays
var sort_svg = d3.select("#sort_ints")
    .append("svg")
    .attr("width", 1000 + margin.left + margin.right)
    .attr("height", 600 + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

// Create two arrays
var arr_a = arr_viz(sort_svg, integers)
var arr_b = arr_viz(sort_svg, integers)
// Move B down and "empty" via a blank fill.
arr_b.selectAll("rect")
    .attr("y", y(4.5))
    .attr("fill", "#ffffff")
    .attr("stroke", "#495568")
arr_b.selectAll("text")
    .attr("y", y(4.5))
// We also need to shift all boxes right to make room for labels
arr_a.selectAll("g")
    .attr("transform", "translate(" + x(1.2) + "," + margin.top + ")")
arr_b.selectAll("g")
    .attr("transform", "translate(" + x(1.2) + "," + margin.top + ")")
// We need to label our arrays
arr_a
    .append("text")
    .attr("x", x(-0.05))
    .attr("y", y(2.5))
    .text("Array A:")
    .attr("fill", "#000000")
    .attr("font-family", "Courier")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")
arr_b
    .append("text")
    .attr("x", x(-0.05))
    .attr("y", y(2.1))
    .text("Array B:")
    .attr("fill", "#000000")
    .attr("font-family", "Courier")
    .attr("text-anchor", "middle")
    .attr("font-weight", "bold")

// We need to visually establish a scan function. We can do this with an arrow
// marker pointing a given box in Array A
//var triangle = d3.svg.symbolTriangle
var triangle = d3.symbol().type(d3.symbolTriangle)
    .size(x(4))
arr_a.append("path")
    .attr("d", triangle)
    .attr("fill", "#000000")
//    .attr("transform", "translate(" + x(1.6) + "," + y(5) + ") rotate(180)")
    .attr("transform", "rotate(180)")
    .attr("refX", function(){ return x(2.6); })
    .attr("y", y(5))
    .attr("id", "arrow")

// Now, we need to be able to scan. The triangle should "consider" each element
// of the array. By "consider", I mean the triangle position should be coordinated
// with the value in the array position it is over, which should enable selection
// when need be. We can leverage #start_sort and #reset_sort to initialize, but
// the other coordination must be on the fly.

function scan_next(){
    var min_val = 101
    var min_idx = 0
    arr_a.select("#rect-0").attr("stroke", "#f2ad0c").attr("stroke-width", 5)
    for(i = 1; i < arr_a.selectAll("g")._groups[0].length + 1; i++){
        arr_a.select("#arrow")
            .transition().duration(1000)
            .attr("transform", "translate(" + x(i + 0.6) + "," + y(5) + ") rotate(180)")
        console.log(integers[i-1], min_val)
        if(integers[i-1] < min_val){
            console.log("New min value!")
            min_val = integers[i - 1];
            min_idx = i - 1;
            arr_a.selectAll("rect").attr("stroke-width", 0)
            arr_a.select("#rect-" + (i - 1)).attr("stroke", "#f2ad0c").attr("stroke-width", 5)
        }
    }
    return min_idx;
}

function scan_reset(){
    arr_a.select("#arrow")
        //.transition().duration(1000)
        .attr("transform", "translate(" + x(1.6) + "," + y(5) + ") rotate(180)");
    arr_a.selectAll("rect").attr("stroke-width", 0)
}

var start_sort = d3.select("#start_sort")
    .on("click", function(){
        console.log("Scanning array!");
        scan_next();
    })

var reset_sort = d3.select("#reset_sort")
    .on("click", function(){
        console.log("Resetting scan!");
        scan_reset();
    })
