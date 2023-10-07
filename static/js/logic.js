// Set up a function to create the map
function createMap(earthquakeLayer) {
  // Create the tile layer that will be the background of our map.
  let map = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  });
  // Define the map starting point - centered on Salt Lake City, Utah
  let myMap = L.map("map", {
    center: [40.7608, -111.891],
    zoom: 4,
    layers: [map, earthquakeLayer],
  });
}

// Set url for earthquake data - All earthquakes within the last day
let url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

// Perform a GET request to the query URL
d3.json(url).then(function (data) {
  // Send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(earthquakes) {
  // Define an empty array to hold the earthquake marker information
  let earthquakeInfo = [];

  // Set up a loop to add all marker information to the earthquake array
  for (let i = 0; i < earthquakes.length; i++) {
    // Set up variables
    let magnitude = earthquakes[i].properties.mag;
    let longitude = earthquakes[i].geometry.coordinates[0];
    let latitude = earthquakes[i].geometry.coordinates[1];
    let depth = earthquakes[i].geometry.coordinates[2];

    // Establish marker colors
    let color = "";
    if (depth <= 10) {
      color = "#44ce1b";
    } else if (depth <= 30) {
      color = "#bbdb44";
    } else if (depth <= 50) {
      color = "#f7e379";
    } else if (depth <= 70) {
      color = "#f2a134";
    } else if (depth <= 90) {
      color = "#e51f1f";
    } else {
      color = "#660000";
    }

    // Add all marker information to the earthquake array
    earthquakeInfo.push(
      L.circle([latitude, longitude], {
        stroke: false,
        color: "black",
        weight: 3.5,
        fillColor: color,
        fillOpacity: 0.6,
        radius: magnitude * 50000,
      }).bindPopup(
        `<h3>Location: ${earthquakes[i].properties.title}</h3><hr>
        <h4>Latitude: ${latitude}&#176;</h4>
        <h4>Longitude: ${longitude}&#176;</h4>
        <h4>Depth: ${depth} Kilometers</h4>`
      )
    );
  }
  // Save earthquake information as a layer
  let earthquakeLayer = L.layerGroup(earthquakeInfo);

  // Send the earthquake info layer to the createMap function
  createMap(earthquakeLayer);
}
