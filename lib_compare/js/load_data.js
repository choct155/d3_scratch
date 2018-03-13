///////////////
// LOAD DATA //
///////////////

function getJSON(url) {
   // Note that we need to pass the data object through a couple function scopes
   // to get it in returnable position
   var d = fetch(url).then(function(response) {
     // Report issues in data transfer
     if (response.status !== 200) {
       console.log('Houston, we have a problem. That data does not seem to be available. Status Code: ' + 	response.status);
       return
     }

     // Some of the files are just data, while others include an explicit variable reference
     // (e.g. "[{per: 1, data: 2}]" or "income = [{per: 1, data: 2}];")
     var data_out = response.text().then(function(data){
       if (data.split(" = ").length == 2){
         // We want only the data component (without the ;)
         var data_out_text = data.split(" = ")[1].replace(";","")
         var data_out = JSON.parse(data_out_text)
       }
       else {
         var data_out = JSON.parse(data)
       }

       return data_out;
     });

     return data_out;
   })
   .catch(function(err) {
     console.log('Fetch error: -S', err);
    });
   return d;
}

// Collect data from each files respective location
var data_loc = "https://www.jpmorganchase.com/corporate/institute/javascript/";
var data_file_names = ({
  all_city: "all-city-data.js",
  all_cbsa: "all-cbsa-data.js",
  age: "age_centralcity.js",
  income: "income_cbsa.js",
  location: "location_centralcity.js",
  merch_size: "bizsize_cbsa.js",
  prod_type: "product_cbsa.js"
});
var data_urls = {};
Object.keys(data_file_names).forEach(function(d) {
  data_urls[d] = data_loc + data_file_names[d]
});


var data = {};
Object.keys(data_urls).forEach(function(d) {
  // Promises do not seem to be able to return values outside of the "thenable" scope
  data[d] = getJSON(data_urls[d])
  //getJSON(data_urls[d]).then(function(dpromise){
  //  data[d] = dpromise
  //})
});

console.log("Raw Data: ", data)

///////////////////////
// DEFINE REFERENCES //
///////////////////////

// Capture categories for each driver
var cat_map = {
  age: ["<25", "25-34", "35-44", "45-54", "55-64", "65+"],
  income: ["q1", "q2", "q3", "q4", "q5"],
  location: ["Same Neighborhood", "Same Region", "Different Region"],
  merch_size: ["Small", "Medium", "Large"],
  prod_type: ["Durables", "Fuel", "Nondurables", "Restaurants", "Other Services"]
}

// Capture CBSA codes for each metro
cbsa_map = {
  12060: "Atlanta",
  16980: "Chicago",
  18140: "Columbus",
  19100: "Dallas-Ft. Worth",
  19740: "Denver",
  19820: "Detroit",
  26420: "Houston",
  31080: "Los Angeles",
  33100: "Miami",
  35620: "New York",
  38060: "Phoenix",
  38900: "Portland",
  41740: "San Diego",
  41860: "San Francisco"
}

// Capture city groupings
city_size = {
  'Small': [18140, 19740, 38900, 41740],
  'Mid-Sized': [12060, 19820, 33100, 38060, 41860],
  'Large': [16980, 19100, 26420, 31080, 35620]
}


/////////////////////////////
// PREPARE DATA FOR CHARTS //
/////////////////////////////

// Use total CBSA growth for line charts
var line_data = {}
city_size['Large'].forEach(function(city){
  data['all_cbsa'].then(function(d) {
    // First isolate the city data series via CBSA code
    line_data[city] = d.filter(function(row) {
      return row.cbsa == city;
    })
    // Then shorten name and use a real timestamp
    line_data[city].forEach(function(row){
      row['area'] = cbsa_map[city];
      row['month'] = new Date(String(row['periodid']).slice(0,4), String(row['periodid']).slice(4) - 1)
    })
  })
})
console.log("Line Data: ", line_data)

// Use growth contributions by age in Houston for stacked bar charts
var stacked_data = []
data['age'].then(function(d) {
  // First isolate Houston
  var filtered_data = d.filter(function(row) {
    return row.area == 26420;
  })
  // Split out each growth contribution value
  filtered_data.forEach(function(row) {
      cat_map['age'].forEach(function(cat, i) {
        row[cat] = row["data"].split(",")[i]
      })
      row['month'] = new Date(String(row['periodid']).slice(0,4), String(row['periodid']).slice(4) - 1)
      stacked_data.push(row)
  })
})
console.log("Stackable Data: ", stacked_data)
