// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");
require("component-leaflet-map");

var voterData = require("./washington_voters.geo.json");

var $ = require("./lib/qsa");

var mapElement = $.one("leaflet-map");
var map = mapElement.map;
var L = mapElement.leaflet;
var mode = "haters_2016";
var legend = $.one(".legend");

var percentLegend = $(".percentages");
var deltaLegend = $(".change");

var styleMap = function(feature) {
  var color;
  if (mode == "delta") {
    // return a palette for delta
    var delta = feature.properties.haters_2016 - feature.properties.haters_2012;

    if (delta < 0) {
      color = "#fef0d9"
    }
    else if (delta < 10) {
      color = "#fdbb84";
    }
    else if (delta < 15) {
      color = "#fc8d59";
    }
    else if (delta < 20) {
      color = "#ef6548";
    }
    else if (delta < 25) {
      color = "#d7301f";
    }
    else { //over 25
      color = "#990000";
    }

  } else {
    //color based on the property
    var value = feature.properties[mode];

    if (value < 10) {
      color = "#f1eef6";
    }
    else if (value < 15) {
      color = "#d0d1e6";
    }
    else if (value < 20) {
      color = "#a6bddb";
    }
    else if (value < 25) {
      color = "#74a9cf";
    }
    else if (value < 30) {
      color = "#2b8cbe";
    }
    else {
      color = "#045a8d"; //over 30
    }

  }
  return {
    stroke: false,
    fillOpacity: .7,
    fillColor: color
  }
};

var onEachFeature = function(feature, layer) {
  var html = `
    <h1 class="popup-title">${feature.properties.STATE_NAME}</h1>
    <ul class="popup-items">
      <li><span class="label">2016:</span> ${feature.properties.haters_2016}% didn't like candidates or campaign issues</li>
      <li><span class="label">2012:</span> ${feature.properties.haters_2012}% didn't like candidates or campaign issues</li>
      <li><span class="label">Change:</span> ${feature.properties.CHANGE} percentage points</li>
    </ul>
  `;
  layer.bindPopup(html);
}

var geojson = L.geoJSON(voterData, {
  style: styleMap,
  onEachFeature: onEachFeature
});
geojson.addTo(map);


// var bounds = geojson.getBounds();
var bounds = [[49.93, -125.82], [23.69, -65.17]];
map.fitBounds(bounds);

var onClickButton = function() {
  var selection = this.getAttribute("data-mode");
  mode = selection;
  geojson.setStyle(styleMap);
  $(".mode-select.active").forEach(el => el.classList.remove("active"));
  this.classList.add("active");

  legend.setAttribute("data-mode", mode);
};

var buttons = $(".mode-select");
buttons.forEach(b => b.addEventListener("click", onClickButton));

onClickButton.call($.one(".mode-select"));

