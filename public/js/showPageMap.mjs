mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v11", // style URL
  center: campground.geometry.coordinates, // starting position [lng, lat]
  zoom: 8, // starting zoom
  projection: "globe", // display the map as a 3D globe
});
map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});
map.addControl(new mapboxgl.NavigationControl());
// Create a new marker.
const marker = new mapboxgl.Marker()
  .setLngLat(campground.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 20 }).setHTML(`<h3>${campground.location}</h3`)
  )
  .addTo(map);
