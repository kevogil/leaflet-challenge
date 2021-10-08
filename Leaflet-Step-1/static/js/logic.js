// Define variable to All Month GeoJSON URL
var allEarthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform an API call and send response to the createMarkers function
d3.json(allEarthquakesURL).then(createMarkers);


function createMarkers(response) {
    console.log(response);

    // Create variable to store response.features
    var earthquakes = response.features;

    // Initialize an array to hold earthquake markers.
    var markers = [];

    // Loop through the earthquakes array
    earthquakes.forEach(earthquake => {
        var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]]).bindPopup(earthquake.properties.place + "<br>" + earthquake.properties.mag);
        // Add coordinates to the markers array
        markers.push(marker);
    })

    // Create a layer group that's made from the markers array, and pass it to the createMap function
    createMap(L.layerGroup(markers));
}


function createMap(markers) {
    // Satellite tile layer for map background
    var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
    
    // Tile layer for dark map background
    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.dark",
    accessToken: API_KEY
    });
}