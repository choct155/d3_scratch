/*
FUNCTION:     nd_array
AUTHOR:       Marvin Ward Jr.
DATE CREATED: 12/29/2017

This script demonstrates a function that displays an array as a collection of squares. Each square
is labeled with the value of the number in the corresponding position of the array, and is filled
with a color that reflects said value.

In the initial offering, only 1- and 2-d arrays of integers are supported. Colors are determined
via linear interpolation between the minimum and maximum values of the array.
 */

function emptyArray(d1, d2){
  // Function returns an array of 1 or 2 dimensions
  var arr_out = new Array(d1);
  if (d2) {
    for (i = 0; i < arr_out.length; i++){
      arr_out[i] = new Array(d2);
    }
  }
  return arr_out;
}

function constantArray(val=0,...dim){
  // Function returns an nd-array of the given constant value. Note that the ellipsis in
  // the function definition enables a variable number of arguments. Note that at least one
  // dimension value must be given, and all desired dimension extents must be defined as
  // integer lengths.
  arr_out = [];
  // The initial value forms the kernel of the array
  for (i = 0; i < dim[dim.length - 1]; i++) {
    arr_out.push(val);
  }
  // Reducing the dimension list on each pass provides a natural stopping point for recursion
  dim.pop(dim[dim.length - 1])
  if (dim.length == 0) {
    return arr_out;
  }
  else {
    // Note that the ellipsis in the function call allows us to pass the remaining dimensions
    // as a list. In this context, the ellipsis is the "spread" operator.
    return constantArray(arr_out, ...dim);
  }
}

function countDims(arr, dim_cnt=0){
  // Function returns the number of dimensions in an array. Note that we keep the dimension
  // count in the function arguments to ease updating during recursive calls.
  if (Array.isArray(arr)) {
    dim_cnt++;
    countDims(arr[0], dim_cnt);
  }
  else {
    return dim_cnt;
  }
}

function getDimLengths(arr) {
  // Function leverages the dimension count to non-recursively capture dimension extent. It
  // returns a dictionary mapping {dim number : dim extent}.
  dim_cnt = countDims(arr)
  dim_len = {}
  tmp_arr = arr
  for (i = 1; i < dim_cnt; i++){
   dim_len[i] = tmp_arr.length;
   tmp_arr = tmp_arr[0];
  }
  return dim_len;
}

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
function
function nd_array(target, data)
var svg = d3.select(target)
