// Create a map object
var myMap = L.map("map", {
  center: [37.7749, -122.4194],
  zoom: 9
});

// Add tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accesstoken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>openstreetmap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>improve this map</a></strong>",
  tilesize: 512,
  maxzoom: 18,
  zoomoffset: -1,
  id: "mapbox/streets-v11",
  accesstoken: "pk.eyJ1IjoiYmFmOTUiLCJhIjoiY2tuMXlzZmU1MTJncjJvbG5qcTJ1eGw0aiJ9.svLrJq1jL1C2l8PdFxVMwg"
}).addTo(myMap);


// Function for color-coding
function circleColor(magnitude) {
    if (magnitude <= 0.75) {
      return "yellow";
    }
    else if (magnitude > 0.75 && magnitude <= 1.5) {
      return "green";
    }
    else {
      return "red";
    }
}

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(link, function(data) {
  var earthquakes = data.features;
  console.log(earthquakes)
  for (var i = 0; i < earthquakes.length; i++) {
    var earthquake = earthquakes[i];
    var magnitude = earthquake.properties.mag;

  // Adding circular markers + popups
    L.circle([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      fillColor: circleColor(+magnitude),
      radius: magnitude * 1500
    }).bindPopup("<h1>" + earthquake.properties.place + "</h1> <hr> <h3>Magnitude: " + magnitude + "</h3>").addTo(myMap).addTo(myMap);
  };
});

// Legend
var legend = L.control({position: 'bottomleft'});
  legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var labels = ["Earthquake Magnitude 0-0.75", "Earthquake Magnitude 0.75-1.5", "Earthquake Magnitude 1.50+"];
    var levels = [0.75, 1.5, 2]
    div.innerHTML = '<div><strong>Legend</strong></div>';
    for(var i = 0; i < labels.length; i++) {
      div.innerHTML += '<i style = "background: ' + circleColor(levels[i]) + '">&nbsp;</i>&nbsp;&nbsp;'
      + labels[i] + '<br/>';
    };
    return div;
  };
legend.addTo(myMap);