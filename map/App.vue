<script setup>
  import NavbarHeader  from "@/components/Navbar.vue"
</script>
<script>
import 'ol/ol.css';
import * as ol from 'ol';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { LineString, Point } from 'ol/geom';

export default {
  name: 'App',
  data() {
    return {
      map: null,
      poiVectorSource: new VectorSource(),
      routeVectorSource: new VectorSource(),
      poiList: [],
      orsApiKey: '5b3ce3597851110001cf6248bb291358ecb148c487121422c1602b93',
      orsBaseUrl: 'https://api.openrouteservice.org/v2/directions/',
    };
  },
  methods: {
    initMap() {
      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: this.poiVectorSource,
            style: new Style({
              image: new CircleStyle({
                radius: 6,
                fill: new Fill({ color: 'blue' }),
                stroke: new Stroke({ color: 'white', width: 2 }),
              }),
            }),
          }),
          new VectorLayer({
            source: this.routeVectorSource,
            style: new Style({
              stroke: new Stroke({
                color: 'blue',
                width: 5,
                lineDash: [10, 10],
              }),
            }),
          }),
        ],
        view: new ol.View({
          center: fromLonLat([7.6261, 51.9607]),
          zoom: 13,
        }),
      });
    },
    displayError(message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
    },
    async fetchPOIs() {
      // Clear existing markers
      this.poiVectorSource.clear();
      this.poiList = [];
      document.getElementById('poi-list').innerHTML = '';

      const query = `
        [out:json];
        (node["tourism"~"museum|attraction|viewpoint"](around:10000, 51.9607, 7.6261););
        out body;
      `;

      try {
        const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (!data.elements?.length) return this.displayError('No POIs found in this area.');

        const uniquePOIs = new Map();
        data.elements.forEach(({ tags, lat, lon }) => {
          if (!tags?.name || uniquePOIs.has(tags.name)) return;

          const poiFeature = new ol.Feature({
            geometry: new Point(fromLonLat([lon, lat])),
            name: tags.name,
            type: tags.tourism,
          });

          this.poiVectorSource.addFeature(poiFeature);
          this.poiList.push({ name: tags.name, lat, lon, type: tags.tourism });

          const poiItem = document.createElement('div');
          poiItem.innerHTML = `<label><input type="checkbox" data-index="${this.poiList.length - 1}"> ${tags.name} (${tags.tourism})</label>`;
          document.getElementById('poi-list').appendChild(poiItem);

          uniquePOIs.set(tags.name, true);
        });
      } catch (error) {
        this.displayError(`Error fetching POIs: ${error.message}`);
      }
    },
    async createRoute() {
      // Clear previous route
      this.routeVectorSource.clear();

      const selectedPOIs = Array.from(document.querySelectorAll('input:checked')).map(
        (input) => this.poiList[input.dataset.index]
      );
      if (selectedPOIs.length < 2) return this.displayError('Please select at least 2 POIs for routing.');

      const body = JSON.stringify({
        coordinates: selectedPOIs.map(({ lon, lat }) => [lon, lat]),
        preference: 'shortest',
      });

      try {
        const response = await fetch(this.orsBaseUrl + document.getElementById('transport-mode').value, {
          method: 'POST',
          headers: {
            Authorization: this.orsApiKey,
            'Content-Type': 'application/json',
          },
          body,
        });

        if (!response.ok) return this.displayError(`Route error: ${response.statusText}`);
        const routeData = await response.json();

        const route = routeData.routes[0];
        const routeGeometry = this.decodePolyline(route.geometry);

        const routeFeature = new ol.Feature({
          geometry: new LineString(routeGeometry),
        });
        this.routeVectorSource.addFeature(routeFeature);

        const routeExtent = routeFeature.getGeometry().getExtent();
        this.map.getView().fit(routeExtent, { padding: [50, 50, 50, 50], duration: 1000 });



        // Route Details Display
        const { distance, duration } = route.summary;
        const distanceKm = (distance / 1000).toFixed(1); // Convert distance to km
        const durationHours = Math.floor(duration / 3600); // Convert duration to hours
        const durationMinutes = Math.round((duration % 3600) / 60); // Convert remaining seconds to minutes

        const allSteps = route.segments.flatMap(segment => segment.steps); // Collect steps from segments

        // Generate HTML for route details
        const stepsHtml = allSteps.map((step, index) => `
            <li>
                <strong>Step ${index + 1}:</strong> ${step.instruction}
                (Distance: ${(step.distance / 1000).toFixed(2)} km, Duration: ${(step.duration / 60).toFixed(1)} mins)
            </li>
        `).join('');

        const routeDetailsDiv = document.getElementById('route-details') || document.createElement('div');
        routeDetailsDiv.id = 'route-details';
        routeDetailsDiv.innerHTML = `
            <h3>Route Details</h3>
            <p><strong>Total Distance:</strong> ${distanceKm} km</p>
            <p><strong>Total Duration:</strong> ${durationHours} hours ${durationMinutes} minutes</p>
            <h4>Detailed Route Steps:</h4>
            <ul>${stepsHtml}</ul>
        `;

        // Append route details div to the document if not already present
        if (!document.getElementById('route-details')) {
            document.body.appendChild(routeDetailsDiv);
        }
      } catch (error) {
        this.displayError(`Routing error: ${error.message}`);
      }

    },
    decodePolyline(encoded) {
      let lat = 0, lng = 0, coordinates = [], shift = 0, result = 0, b, index = 0;

      while (index < encoded.length) {
        shift = result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        lat += result & 1 ? ~(result >> 1) : result >> 1;

        shift = result = 0;
        do {
          b = encoded.charCodeAt(index++) - 63;
          result |= (b & 0x1f) << shift;
          shift += 5;
        } while (b >= 0x20);
        lng += result & 1 ? ~(result >> 1) : result >> 1;

        coordinates.push(fromLonLat([lng * 1e-5, lat * 1e-5]));
      }
      return coordinates;
    },
  },
  mounted() {
    this.initMap();
    this.fetchPOIs();
    // localStorage read for the Route data
    console.log(JSON.parse(localStorage.getItem("tripTailorRoute")))
  },
};
</script>


<template>
  <div class="route-planning-container">
    <NavbarHeader/>
    <div class="map-controls">
      <div id="poi-selector" class="control-panel">
        <h3>Select POIs for Route</h3>
        <select id="transport-mode">
          <option value="foot-walking">Walking</option>
          <option value="driving-car">Driving</option>
          <option value="cycling-regular">Cycling</option>
        </select>
        <button id="create-route" class="create-route-btn">Create Route</button>
        <div id="poi-list" class="poi-list"></div>
      </div>
    </div>
    <div class="map-container">
      
      <div id="map" class="map"></div>
      <div id="route-details" class="route-details">
        <!-- Route details will be dynamically populated here -->
      </div>
    </div>
  </div>
</template>



<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
.route-planning-container {
  color: var(--tt-dark);
  line-height: 1.6;
}

.map-controls {
  position: fixed; /* 固定在右侧 */
  top: 30px;
  right: 30px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 15px;
  margin-bottom: 10px;
  max-width: 300px;
  width: 100%;
}

.control-panel {
  padding: 15px;
  margin-bottom: 10px;
}

.map-container {
  flex: 1; 
  width: 100%;
}

.map {
  width: 100%;
  height: 600px; 
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.route-details {
  flex: 1; 
  width: 100%;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 20px;
  margin-top: 20px;
}

.route-details h3 {
  margin-top: 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.route-details ul {
  padding-left: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.route-details li {
  margin-bottom: 10px;
  line-height: 1.5;
}

.create-route-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
}

.create-route-btn:hover {
  background-color: #45a049;
}

.error-message {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #f44336;
  color: white;
  padding: 15px;
  border-radius: 5px;
  z-index: 2000;
}

</style>
