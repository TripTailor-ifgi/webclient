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
import { Icon } from 'ol/style';
import OSM from 'ol/source/OSM';
import axios from 'axios'
import { Stroke, Style } from 'ol/style';
import { LineString, Point } from 'ol/geom';
import { ref} from 'vue';
const loading = ref(false)

export default {
  name: 'App',
  data() {
    return {
      map: null,
      poiVectorSource: new VectorSource(),
      routeVectorSource: new VectorSource(),
      poiList: [],
      selectedPOIs: [],
      orsApiKey: import.meta.env.VITE_ORS_KEY,
      orsBaseUrl: import.meta.env.VITE_ORS_URL,
      iconPaths: { 
        tourism_attraction: {
          withBuffer: '../../src/assets/icons/Attraction_withBuffer.svg',
          normal: '../../src/assets/icons/Attraction.svg',
        },
        tourism_museum: {
          withBuffer: '../../src/assets/icons/Museum_withBuffer.svg',
          normal: '../../src/assets/icons/Museum.svg',
        },
        tourism_gallery: {
          withBuffer: '../../src/assets/icons/Gallery_withBuffer.svg',
          normal: '../../src/assets/icons/Gallery.svg',
        },
        tourism_zoo: {
          withBuffer: '../../src/assets/icons/Zoo_withBuffer.svg',
          normal: '../../src/assets/icons/Zoo.svg',
        },
        tourism_park: {
          withBuffer: '../../src/assets/icons/Park_withBuffer.svg',
          normal: '../../src/assets/icons/Park.svg',
        },
        amenity_ice_cream: {
          withBuffer: '../../src/assets/icons/Icecream_withBuffer.svg',
          normal: '../../src/assets/icons/Icecream.svg',
        },
        amenity_fast_food: {
          withBuffer: '../../src/assets/icons/Fastfood_withBuffer.svg',
          normal: '../../src/assets/icons/Fastfood.svg',
        },
        amenity_cafe: {
          withBuffer: '../../src/assets/icons/Cafe_withBuffer.svg',
          normal: '../../src/assets/icons/Cafe.svg',
        },
        amenity_bar: {
          withBuffer: '../../src/assets/icons/Bar_withBuffer.svg',
          normal: '../../src/assets/icons/Bar.svg',
        },
        amenity_restaurant: {
          withBuffer: '../../src/assets/icons/Restaurant_withBuffer.svg',
          normal: '../../src/assets/icons/Restaurant.svg',
        },
        default: {
          withBuffer: '../../src/assets/icons/Default_withBuffer.svg',
          normal: '../../src/assets/icons/Default.svg',
        },
      },
    };
  },
  methods: {
    
    /**
    * initialize the map and add the necessary layers and controls
    */

    initMap() {
      const container = document.getElementById('popup');
      const content = document.getElementById('popup-content');
      const closer = document.getElementById('popup-closer');

      // overlay for the popup
      const overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: { duration: 250 },
      });

      this.map = new ol.Map({
        target: 'map',
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          new VectorLayer({
            source: this.poiVectorSource,
            style: (feature) => {
              const iconUrl = feature.get('iconUrl');
              return new Style({
                image: new Icon({
                  src: iconUrl,
                  size: [32, 32],
                }),
              });
            },
          }),
          new VectorLayer({
            source: this.routeVectorSource,
            style: new Style({
              stroke: new Stroke({
                color: '#291d00',
                width: 5,
                lineDash: [10, 10],
              }),
            }),
          }),
        ],
        overlays: [overlay],
        view: new ol.View({
          center: fromLonLat([7.6261, 51.9607]),
          zoom: 13,
        }),
      });

      // close popup
      closer.onclick = () => {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
      };

      this.map.on('click', (evt) => {
        const feature = this.map.forEachFeatureAtPixel(evt.pixel, (feat) => feat);
        if (feature) {
          console.log('clicked feature:', feature);
          
          const featureProps = {
            name: feature.get('name'),
            address: feature.get('address'),
            opening_hours: feature.get('opening_hours'),
            iconUrl: feature.get('iconUrl')
          };
          console.log('feature properties:', featureProps);

          const coordinates = feature.getGeometry().getCoordinates();
          

          let info = `<div>`;

          const iconUrl = feature.get('iconUrl');
          if (iconUrl) {
            info += `<img src="${iconUrl}" alt="${feature.get('name')} icon" style="width: 24px; height: 24px; margin-right: 8px; vertical-align: middle;">`;
          }

          const isInRoute = this.selectedPOIs.some(
            (poi) => poi.name === feature.get('name')
          );

          info += `<strong>${feature.get('name')}</strong>`;
          info += `<button
            id="toggle-poi"
            data-name="${feature.get('name')}"
            style="margin-top: 10px; padding: 5px 10px; cursor: pointer; background: ${
              isInRoute ? '#f44336' : '#4CAF50'
            }; color: white; border: none; border-radius: 4px;">
            ${isInRoute ? 'Remove from Route' : 'Add to Route'}
          </button>`;
          info += `</div>`;

          const address = feature.get('address');
          if (address) {
            info += `<p><strong>Address:</strong> ${address}</p>`;
          }

          const openingHours = feature.get('opening_hours');
          if (openingHours) {
            info += `<p><strong>Opening Hours:</strong> ${openingHours}</p>`;
          }

          content.innerHTML = info;
          overlay.setPosition(coordinates);

          // add event listener for the toggle button
          const toggleButton = document.getElementById('toggle-poi');
          if (toggleButton) {
            toggleButton.addEventListener('click', () => {
              const poiName = toggleButton.getAttribute('data-name');
              const poi = this.poiList.find(p => p.name === poiName);

              if (poi) {
                const isInRoute = this.selectedPOIs.some(p => p.name === poiName);
                
                if (isInRoute) {
                  // remove POI from route
                  this.selectedPOIs = this.selectedPOIs.filter(p => p.name !== poiName);
                  toggleButton.textContent = 'Add to Route';
                  toggleButton.style.backgroundColor = '#4CAF50';
                } else {
                  // add POI to route
                  this.selectedPOIs.push(poi);
                  toggleButton.textContent = 'Remove from Route';
                  toggleButton.style.backgroundColor = '#f44336';
                }

                // update route with new selected POIs
                this.updateRoute();
              }
            });
          }
        } else {
          overlay.setPosition(undefined);
          closer.blur();
        }
      });
    },
    displayError(message) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'error-message';
      errorDiv.textContent = message;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
    },
    /**
     * Fetching the POIs from the API according to the filters from the customizer / localStorage
     */
    async fetchPOIs() {
      loading.value = true;
      let cookieData = JSON.parse(localStorage.getItem("tripTailorRoute"));

      axios({
        method: 'post',
        url: `${import.meta.env.VITE_API_BASE_URL}/api/pois`,
        headers: {
          "Content-Type": "application/json",
          "Accept": "*/*"
        },
        data: JSON.stringify(cookieData),
      })
      .then((response) => {
        let data = response.data;
        let pois = [];
        for (let i = 0; i < data.all_results.length; i++) {
          let results = data.all_results[i].results;
          for (let j = 0; j < results.length; j++) {
            results[j].type = data.all_results[i].location_type;
          }
          pois = pois.concat(results);
        }
        console.log('fetched pois:', pois);

        // Clear existing markers
        this.poiVectorSource.clear();
        this.poiList = [];

        // Generating point features on map
        for (let i = 0; i < pois.length; i++) {
          let poi = pois[i];
          const iconType = this.iconPaths[poi.type] || this.iconPaths.default;

          // Determine if the POI is in the initial route
          const isInRoute = this.selectedPOIs.some(p => p.name === poi.name);

          const poiFeature = new ol.Feature({
            geometry: new Point(fromLonLat(JSON.parse(poi.geometry).coordinates)),
            name: poi.name,
            type: poi.type,
            iconUrl: isInRoute ? iconType.withBuffer : iconType.normal,
            address: poi.address || poi.properties?.address,
            opening_hours: poi.opening_hours || poi.properties?.opening_hours,
          });

          this.poiVectorSource.addFeature(poiFeature);
          this.poiList.push(poi);
        }

        // Formatting data for the initial route
        let locationCoords = [];
        let startCoords = [cookieData.options.startLocation.coords.lon, cookieData.options.startLocation.coords.lat];
        let routeLoc = data.closest_results;

        console.log('route locations:', routeLoc);

        locationCoords.push(startCoords);

        
        // Correctly populate selectedPOIs
        this.selectedPOIs = routeLoc.flatMap(loc => {
          const geom = JSON.parse(loc.results[0].geometry);
          return pois.filter(poi =>
            JSON.parse(poi.geometry).coordinates.toString() === geom.coordinates.toString()
          );
        });

        console.log('selected POIs:', this.selectedPOIs);

        for (let i = 0; i < routeLoc.length; i++) {
          let geom = JSON.parse(routeLoc[i].results[0].geometry);
          locationCoords.push(geom.coordinates);
        }
        locationCoords.push(startCoords);

        // Calling initial route creation
        this.createInitialRoute(locationCoords);
      })
      .catch((e) => {
        console.error('Error fetching POIs:', e);
      })
      .finally(() => {
        // Disabling loading screen
        loading.value = false;
      });
    },

    /*
    * toggle POI in the route by adding or removing it
    * @param poiName - name of the POI to toggle
    */

    togglePOI(poiName) {
      // find the POI in the current list
      const poi = this.poiList.find((p) => p.name === poiName);
      if (!poi) {
        console.error('POI not found!');
        return;
      }
      // check if the POI is already in the route
      const isInRoute = this.selectedPOIs.some((p) => p.name === poi.name);
      if (isInRoute) {
        // remove POI from the route
        this.selectedPOIs = this.selectedPOIs.filter((p) => p.name !== poi.name);
      } else {
        // add POI to the route
        this.selectedPOIs.push(poi);
      }
      // update the route with the new selected POIs
      this.updateRoute();
    },
    async updateRoute() {
      console.log('Updating route with POIs:', this.selectedPOIs);

      if (this.selectedPOIs.length < 2) {
        this.displayError('At least two POIs are required to calculate a route.');
        return;
      }

      // Generate coordinates from selected POIs
      const coordinates = this.selectedPOIs.map((poi) =>
        JSON.parse(poi.geometry).coordinates
      );

      // Close loop (return to the starting point)
      const startCoords = JSON.parse(localStorage.getItem("tripTailorRoute")).options.startLocation.coords;
      coordinates.push([startCoords.lon, startCoords.lat]);

      const body = JSON.stringify({
        coordinates,
        preference: 'shortest',
      });

      try {
        const response = await axios.post(`${this.orsBaseUrl}foot-walking`, body, {
          headers: {
            Authorization: this.orsApiKey,
            'Content-Type': 'application/json',
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to update the route');
        }

        const route = response.data.routes[0];
        const routeGeometry = this.decodePolyline(route.geometry);

        // Update the route layer
        this.routeVectorSource.clear();
        const routeFeature = new ol.Feature({
          geometry: new LineString(routeGeometry),
        });
        this.routeVectorSource.addFeature(routeFeature);

        // Adjust the map view to fit the new route
        const routeExtent = routeFeature.getGeometry().getExtent();
        this.map.getView().fit(routeExtent, {
          padding: [50, 50, 50, 50],
          duration: 1000,
        });

        // Update POI icons based on the new route
        this.poiVectorSource.getFeatures().forEach(feature => {
          const isInRoute = this.selectedPOIs.some(p => p.name === feature.get('name'));
          const iconType = this.iconPaths[feature.get('type')] || this.iconPaths.default;
          feature.set('iconUrl', isInRoute ? iconType.withBuffer : iconType.normal);
        });

        // Display updated route details
        const { distance, duration } = route.summary;
        const distanceKm = (distance / 1000).toFixed(1);
        const durationHours = Math.floor(duration / 3600);
        const durationMinutes = Math.round((duration % 3600) / 60);

        const routeDetailsDiv = document.getElementById('route-details') || document.createElement('div');
        routeDetailsDiv.id = 'route-details';
        routeDetailsDiv.innerHTML = `
          <h3>Updated Route Details</h3>
          <p><strong>Total Distance:</strong> ${distanceKm} km</p>
          <p><strong>Total Duration:</strong> ${durationHours} hours ${durationMinutes} minutes</p>
        `;

        if (!document.getElementById('route-details')) {
          document.body.appendChild(routeDetailsDiv);
        }
      } catch (error) {
        this.displayError(`Failed to update the route: ${error.message}`);
      }
    },
    /**
     * Sends a request to the OpenRouteService API to generate a first route for the user
     * @param locations Array of coordinate pairs of the initial results for the first route
     */
    async createInitialRoute(locations) {
      // Generating the body for the request
      const body = JSON.stringify({
        coordinates: locations,
        preference: 'shortest'
      });
      // Sending the Request to the ORS
      axios({
        method: 'post',
        url: `${this.orsBaseUrl}foot-walking`,
        headers: {
          Authorization: this.orsApiKey,
          'Content-Type': 'application/json',
        },
        data: body,
      })
      .then((response) => {
        const route = response.data.routes[0];
        const routeGeometry = this.decodePolyline(route.geometry);

        const routeFeature = new ol.Feature({
          geometry: new LineString(routeGeometry),
        });
        this.routeVectorSource.addFeature(routeFeature);

        // fit map to show the entire route
        const routeExtent = routeFeature.getGeometry().getExtent();
        this.map.getView().fit(routeExtent, { padding: [50, 50, 50, 50], duration: 1000 });

        // display route details
        const { distance, duration } = route.summary;
        const distanceKm = (distance / 1000).toFixed(1);
        const durationHours = Math.floor(duration / 3600);
        const durationMinutes = Math.round((duration % 3600) / 60);

        const routeDetailsDiv = document.getElementById('route-details');
        if (routeDetailsDiv) {
          routeDetailsDiv.innerHTML = `
            <h3>Initial Route Details</h3>
            <p><strong>Total Distance:</strong> ${distanceKm} km</p>
            <p><strong>Total Duration:</strong> ${durationHours} hours ${durationMinutes} minutes</p>
          `;
        }
        // Update POI icons based on the new route
        this.updateRoute(); // Ensure POI icons are updated
      }).catch((e) => console.log(e))
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
      <div class="loading" v-if="loading">
        <div class="spinner-border">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div id="map" class="map"></div>

      <!-- Popup for POI details -->
      <div id="popup" class="ol-popup">
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div id="popup-content"></div>
      </div>

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
  position: relative;
}
.loading{
  position: absolute;
  top: calc( 3rem + 40px );
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  background: rgba(92, 92, 92, 0.373);
  width: 100%;
  height: 600px; 
  margin-bottom: 20px;
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
  position: relative;
  top: 0;
  left: 0;
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

.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 200px;
  z-index: 1001;
  transform: translate(-50%, -100%);
}

.ol-popup-closer {
  position: absolute;
  top: 5px;
  right: 8px;
  font-size: 16px;
  color: #aaa;
  cursor: pointer;
}

</style>