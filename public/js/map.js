let MapToken = mapToken;
let Coordinates = coordinates;

mapboxgl.accessToken = MapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: Coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 9 // starting zoom
});

// console.log(Coordinates); 

const marker = new mapboxgl.Marker()
    .setLngLat(Coordinates) 
    .setPopup(
        new mapboxgl.Popup({offset: 25}).setHTML(`<h4>${t}</h4> <p>Exact Location</p>`)
    )
    .addTo(map);