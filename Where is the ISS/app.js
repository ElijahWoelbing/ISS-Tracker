let mymap = L.map('mapid');
const api_url ="https://api.wheretheiss.at/v1/satellites/25544";

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1Ijoid29lbGJpbmdlbGlqYWgiLCJhIjoiY2p3NGR5aHdtMHpzZDRhbnp1c241Zno2NyJ9.1GOYDOtaLcQoMkMWHZyHUQ'
}).addTo(mymap);

function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    mymap.setView([position.coords.latitude, position.coords.longitude], 1);
    L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
 
  }

 

async function getData(){
const response = await fetch(api_url);
const data = await response.json();
const {latitude, longitude} = data;
document.getElementById("lat").innerText = latitude;
document.getElementById("long").innerText = longitude;
L.circle([latitude, longitude], {
    color: 'black',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 3000
}).addTo(mymap);
}
getLocation();
getData();
setInterval(getData, 3000);




