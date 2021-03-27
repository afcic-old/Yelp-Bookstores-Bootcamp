const bookshop = require("../../models/bookshop");

mapboxgl.accessToken = mapToken;¸
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/streets-v10", // style URL
  center: bookshop.geometry.coordinates, // starting position [lng, lat]
  zoom: 6, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
  .setLngLat(bookshop.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }).setHTML(
      `<h3>${bookshop.title}</h3><p>${bookshop.location}</p>`
    )
  )
  .addTo(map);
