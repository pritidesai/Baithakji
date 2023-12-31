window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-RBBQN6B0EM');

mapboxgl.accessToken = 'pk.eyJ1Ijoia2FsYWthciIsImEiOiJjaW4yNHBvMDMwYjZrdXBra29qYmxnOGM5In0.4Lh20IMXH60mscRm5EKuNw';
// Create the map
const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/kalakar/clgnvvub2007301qn2ym83hwn',
	center: [78.194226, 22.372645],
	zoom: 2,
	minZoom: 3.5, // note the camel-case
});
// Add marker labels for each location 
var url = "baithakji.json"
map.on('load', function() {
	// Add a GeoJSON source containing place coordinates and information.
	map.addSource('geojson', {
		'type': 'geojson',
		'data': 'https://nirja-desai.github.io/kalakar.github.io/geo_json_final.geojson',
		// 'data': url,
		cluster: true,
		clusterMaxZoom: 8, // Max zoom to cluster points on
		clusterRadius: 23 // Radius of each cluster when clustering points (defaults to 50)
	});
	map.addLayer({
		'id': 'poi-labels',
		'type': 'symbol',
		'source': 'geojson',

		'layout': {
			'text-field': ['get', 'name'],
			'text-variable-anchor': ['top'],
			'text-radial-offset': 1.5,
			'text-justify': 'auto',
			// 'icon-image': 'bhagvat.svg'
			'icon-image': ['concat', ['get', 'icon'], '-15'],
			'text-font': ["Lato Bold"],
			'text-transform': "uppercase"

		},

		"paint": {
			"text-color": "#264163",
			"text-halo-width": 1.5,
			"text-halo-color": "#EFE9D8"
		}
	});
});

////////////////////////
///// RASTER LAYER /////
////////////////////////

// Function to toggle image visibility
function toggleImage() {
	var imageLayer = map.getLayer('custom-image-layer');
	if (imageLayer) {
		map.setLayoutProperty('custom-image-layer', 'visibility', document.getElementById('toggleCheckbox').checked ? 'visible' : 'none');
	}
}

// Add the raster image as an overlay layer
map.on('load', function() {
	map.addSource('custom-image', {
		'type': 'image',
		'url': 'https://cors-anywhere.herokuapp.com/https://github.com/nirja-desai/kalakar.github.io/blob/main/radar.png?raw=true',
		'coordinates': [
			[68.1, 7.1], // Top-left corner (longitude, latitude)
			[97.4, 7.1], // Top-right corner
			[97.4, 35.7], // Bottom-right corner
			[68.1, 35.7]
		]
	});

	map.addLayer({
		'id': 'custom-image-layer',
		'type': 'raster',
		'source': 'custom-image',
		'paint': {
			'raster-opacity': 0.5
		},
		'layout': {
			'visibility': 'none' // Set initial visibility to 'none'
		}
	});
});

// Get the geoJSON data again from the github page and load it in as JSON
// so that it can be used by the marker and popup functions
fetch('https://nirja-desai.github.io/kalakar.github.io/geo_json_final.geojson')
	.then(function(response) {
		return response.json();
	})
	.then(function(data) {
		// Do something with the GeoJSON data
		for (const feature of data.features) {
			// create a HTML element for each feature
			const el = document.createElement('div');
			// get description for each feature
			const name = feature.properties.name
			const description = feature.properties.description
			const image = "./images/" + feature.properties.image
			// get the correspnding market based on gupt property
			if (feature.properties.gupt) {
				el.className = 'marker_gupt';
			} else {
				el.className = 'marker';
			}
			// make a marker for each feature and add it to the map
			new mapboxgl.Marker(el).setLngLat(feature.geometry.coordinates)
				// .setLngLat(feature.properties.name)
				.setPopup(new mapboxgl.Popup({
						offset: 25
					}) // add popups
					.setHTML(`
                      <h3>${name}</h3>
                      <img src=${image} style="width: 100%; height: auto;">
                      <p>${description}<p>
                      `)).addTo(map);
		}
	});
// add markers to map
// import * as data from './geo_json_final.json';
// const geo_test = data;

//////////////////////
//COLLAPSABLE BUTTON//
//////////////////////

var coll = document.getElementsByClassName("collapsible");
var i;
for (i = 0; i < coll.length; i++) {
	coll[i].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.maxHeight) {
			content.style.maxHeight = null;
		} else {
			content.style.maxHeight = content.scrollHeight + "px";
		}
	});
}