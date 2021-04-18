const ISS_API_URL = "https://api.wheretheiss.at/v1/satellites/25544";
const ISSLatitudeDisplay = document.querySelector(".latitude_display");
const ISSLongitudeDisplay = document.querySelector(".longitude_display");

// create map
const leafletMap = L.map('leaflet-map');
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1Ijoid29lbGJpbmdlbGlqYWgiLCJhIjoiY2tubDJ6eGhxMGM4NzJucXYzdXpsdTY0dCJ9.2lAtXsFKU9Eg1YNDDFnARA'
}).addTo(leafletMap);

const ISSIcon = L.icon({
  iconUrl: './images/ISS.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

(async () => {
  try {
    // fetch coords
    let ISSCoords = await getISSCoords();
    let userCoords = await getUserCoords();
    // create iss marker and add to map
    const marker = L.marker([ISSCoords.latitude, ISSCoords.longitude], { title: "ISS Location", icon: ISSIcon });
    marker.addTo(leafletMap);
    // output coords
    updateLatLngDisply(ISSCoords.latitude, ISSCoords.longitude);
    // show user position
    leafletMap.setView([userCoords.latitude, userCoords.longitude], 1);
    L.marker([userCoords.latitude, userCoords.longitude], {title: "Your Location"}).addTo(leafletMap);
    // update ISS marker position and display every 5 sec
    setInterval(async () => {
      ISSCoords = await getISSCoords();
      marker.setLatLng([ISSCoords.latitude, ISSCoords.longitude]);
      updateLatLngDisply(ISSCoords.latitude, ISSCoords.longitude);
    }, 5000);
  } catch (error) {
    console.error(error);
  }
})();

// updates HTML to display lat lang
function updateLatLngDisply(latitude, longitude) {
  ISSLatitudeDisplay.innerText = latitude;
  ISSLongitudeDisplay.innerText = longitude;
}

// fetch iss coords from API
async function getISSCoords() {
  try {
    const response = await fetch(ISS_API_URL);
    const data = await response.json();
    return { latitude: data.latitude, longitude: data.longitude };
  } catch (error) {
    throw new Error("unable to get iss location");
  }
}
// gets users location if user accepts
function getUserCoords() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        let coords = { latitude: position.coords.latitude, longitude: position.coords.longitude }
        resolve(coords)
      }, (error) => {
        reject(error);
      });
    } else {
      reject("geolocation is not supported by this browser");
    }
  });
}









