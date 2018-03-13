//////////////////////
// Global Variables //
//////////////////////

var margin = {
  top: 50,
  right: 30,
  bottom: 50,
  left: 30
}

var canvas_width = 900
var canvas_height = 600
var w = canvas_width - margin.left - margin.right;
var h = canvas_height - margin.top - margin.bottom;

var margin_adj = 'translate(' + margin.left + ',' + margin.top + ')'

////////////////
// Line Chart //
////////////////

var line_svg = d3.select('#d3_line').append('svg')
    .attr('width', w)
    .attr('height', h)
  .append('g')
    .attr('transform', margin_adj);

var line_x = d3.time.scale().range([0,w]);
var line_y = d3.scale.linear().range([h,0]);
var color = d3.scale.ordinal(d3.schemeCategory10);

var lineGenerator = d3.line()
  .x(function(d) { return d.month; })
  .y(function(d) { return d.growth_rate; })

console.log(cbsa_map)
