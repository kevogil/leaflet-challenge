// Define variable to All Month GeoJSON URL
var allEarthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Define variable to tectonic plates URL
var tectonicPlatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

// Create layer group for tectonic plates
var tectonicPlates = L.layerGroup();


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
        var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            color: "black",
            fillColor: markerColor(earthquake.geometry.coordinates[2]),
            fillOpacity: 0.9,
            radius: earthquake.properties.mag * 3
        }).bindPopup("<b>Location: </b>" + earthquake.properties.place + "<br>" + "<b>Magnitude: </b>" + earthquake.properties.mag + "<br>" + "<b>Depth: </b>" + earthquake.geometry.coordinates[2] + "<br>" + "<b>Time: </b>" + new Date(earthquake.properties.time));
        
        // Add coordinates to the markers array
        markers.push(marker);
    })

    // Create a layer group that's made from the markers array, and pass it to the createMap function
    createMap(L.layerGroup(markers));
}


function markerColor(depth){
    switch(true){
        case (depth<10):
            return "chartreuse";
        case (depth<30):
            return "greenyellow";
        case (depth<50):
            return "gold";
        case (depth<70):
            return "darkorange";
        case (depth<90):
            return "red";
        default:
            return "crimson";
    };
}


function createTectonicOutlines(response) {
    console.log(response);

    L.geoJSON(response, {
        color: "white",
        weight: 3
    }).addTo(tectonicPlates);
}


function createMap(markers) {
    // Satellite tile layer for map background
    var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery ?? <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
      });
    
    // Dark tile layer for map background
    var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery ?? <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "dark-v10",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the tile layers
    var baseMaps = {
        "Satellite Map": satellitemap,
        "Dark Map": darkmap
    };

    // Create an overlayMaps object to hold the markers layer.
    var overlayMaps = {
        "Earthquakes": markers,
        "Tectonic Plates": tectonicPlates
    };

    // Create the map object with options.
    var myMap = L.map("map", {
        center: [0, 0],
        zoom: 3,
        layers: [satellitemap, markers]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);


    // Perform an API call and send response to the createTectonicOutlines function
    d3.json(tectonicPlatesURL).then(createTectonicOutlines);

    // Add tectonic plates outlines to map
    tectonicPlates.addTo(myMap);


    // Set up map legend
    var legend = L.control({position: "bottomright"});

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend"),
      depth = [-10, 10, 30, 50, 70, 90];
      
      div.innerHTML += "<h3 style='text-align: center'>Depth</h3>"
  
      for (var i =0; i < depth.length; i++) {
        div.innerHTML += 
        '<i style="background:' + markerColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
        }
        return div;
      };

      // Add legend to map
      legend.addTo(myMap);
}