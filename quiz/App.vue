<script setup>
import NavbarHeader from "@/components/Navbar.vue"
import DraggableDiv from "@/components/quiz/DraggableDiv.vue"
import DraggableLine from "@/components/quiz/DraggableLine.vue";
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useLinesStore } from "@/stores/store.js"
import { Toast } from "bootstrap"

  const range = ref(3)
  const errmsg = ref()
  const infomsg = ref("Please select a starting point")
  const addressEntered = ref(false)
  const dateEntered = ref(false)
  const customizerEnabled = ref(false)
  const routable = ref(false)
  const lines = useLinesStore();
  const circle = ref(null);
  const boxes = reactive([
    { label: 'Start', left: 50, top: 50, width: 150, height: 100, isEditing: false, isSubCat:false, subcat: '' }, 
  ]);

const startLocationQuery = ref("");
const suggestions = ref([]);
const startLocation = ref({ name: "", coords: { lat: null, lon: null } });

/**
 * Fetches suggestions from Photon API
 */
const fetchSuggestions = async () => {
  if (!startLocationQuery.value) {
    suggestions.value = [];
    return;
  }

  try {
    const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(startLocationQuery.value)}`);
    const data = await response.json();

    // Get the first suggestion only
    const firstSuggestion = data.features[0];

    if (firstSuggestion) {
      const { name, street, housenumber, city, country } = firstSuggestion.properties;

      // Construct the address string
      const address = [
        street ? `${street}${housenumber ? ` ${housenumber}` : ""}` : null,
        city,
        country
      ]
        .filter(Boolean) // Remove null/undefined values
        .join(", ");

      suggestions.value = [{
        name: name || "Unknown location",
        address: address || "Unknown address",
        coords: { lat: firstSuggestion.geometry.coordinates[1], lon: firstSuggestion.geometry.coordinates[0] }
      }];
    } else {
      suggestions.value = [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    suggestions.value = [];
  }
};

/**
 * Selects suggestion for autocomplete of address search, populates the input field
 * @param {never} suggestion
 */
const selectSuggestion = (suggestion) => {
  startLocationQuery.value = `${suggestion.name} - ${suggestion.address}`;
  startLocation.value.name = suggestion.name;
  startLocation.value.coords = suggestion.coords;
  suggestions.value = [];

  addressEntered.value = true;
  infomsg.value = "Please select your day of travel";
};

/**
 * Handle enabling elements after a date is selected
 * */
const checkDateInput = (event) => {
  if (!event) {
    console.log("Error: No event supplied");
    return -1;
  }
  if(addressEntered.value){
    if(event.target.value) {
      let date = new Date(event.target.value).getTime() / 1000;
      let now = Date.now()/1000;
      if(date >= now){
        dateEntered.value = true;
        customizerEnabled.value = true;
      }else{
        infomsg.value = "Please select a valid date. The day of travel cannot be in the past";
        dateEntered.value = false;
        customizerEnabled.value = false;
      }
    }
  }else {
    dateEntered.value = false;
  }
}

/**
 * Function to draw lines between the centroids of the boxes
 */
const drawLines = () => {
  let tmpArray = [];

  if (boxes.length > 1) {
    for (let i = 0; i < boxes.length; i++) {
      let box = boxes[i];
      let nextbox = boxes[(i + 1) % boxes.length];

      // Calculate centroids (center points) of each box
      const boxCentroidX = box.left + box.width / 2;
      const boxCentroidY = box.top + box.height / 2;
      const nextboxCentroidX = nextbox.left + nextbox.width / 2;
      const nextboxCentroidY = nextbox.top + nextbox.height / 2;

      tmpArray.push({
        x1: boxCentroidX,
        y1: boxCentroidY,
        x2: nextboxCentroidX,
        y2: nextboxCentroidY
      });
    }
    lines.setLines(reactive(tmpArray));
  }
};

// track dragging state for each box
const draggingBox = ref(null);
const startPosition = ref({ x: 0, y: 0 });
const initialPosition = ref({ left: 0, top: 0 });

/**
 * Starts dragging
 * */
const startDragging = (box, event) => {
  draggingBox.value = box;
  startPosition.value = { x: event.clientX, y: event.clientY };
  initialPosition.value = { left: box.left, top: box.top };

  // listen for drag movement
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDragging);
};

/**
 * Handles dragging actions
 * @param {Event} event
 */
const onDrag = (event) => {
  if (!draggingBox.value) return;

  const dx = event.clientX - startPosition.value.x;
  const dy = event.clientY - startPosition.value.y;

  draggingBox.value.left = initialPosition.value.left + dx;
  draggingBox.value.top = initialPosition.value.top + dy;

  // redraw lines during dragging 
  drawLines();
};

/**
 * Stops dragging
 * */
const stopDragging = () => {
  draggingBox.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDragging);

  // Redraw lines only after dragging is complete, would be computationally cheaper
  // drawLines();
};

/**
 * update positions in a circle, with the "Start" box on the leftmost side
 * */
const updatePositions = () => {
  if (!circle.value) return;

  const centerX = circle.value.offsetWidth / 2;
  const centerY = circle.value.offsetHeight / 2;
  const angleStep = (2 * Math.PI) / boxes.length;

  // Radius of the circle arrangement
  const radius = Math.max(300, 50 + boxes.length * 20);

  boxes.forEach((box, index) => {
    const angle = (index * angleStep) - Math.PI;

    box.left = centerX + radius * Math.cos(angle);
    box.top = centerY + radius * Math.sin(angle);
  });

  drawLines();  // Update the lines after repositioning
};

/**
 * Adds a box entity to the boxes array so that it can be processed and displayed in the customizer
 * */
const addBox = () => {
  boxes.push({ label: '', left: 50, top: 50, width: 150, height: 100, isEditing: true,isSubCat:false, subcat:'' });
  nextTick(() => {
    updatePositions();
  });
  routable.value = true;
};

/**
 * Deletes a box from the customizer
 * @param box proxy object of the selected box
 */
const deleteBox = (box) => {
  let tmpArr = boxes.slice()
  boxes.splice(0)
  for (let i = 0; i < tmpArr.length; i++) {
    if(!(tmpArr[i].top===box.top && tmpArr[i].label===box.label && tmpArr[i].left===box.left)){
      boxes.push(tmpArr[i])
    }
  }
  nextTick(() => {
    updatePositions();
  });
};

/**
 * Change referenced values / states if a top level category is selected
 */
const finishEditing = (box) => {
  box.isEditing = false;
  box.isSubCat = true;
  nextTick(() => {
    updatePositions();
  })
};

/**
 * Change referenced values / states if a sub level category is selected
 */
const finishSubCat = (box) => {
  box.isSubCat = false;
  nextTick(() => {
    updatePositions();
  })
};

const setIcon = (subcat) => {
  let sub = subcat.toLowerCase().replace(" ", "_")
  let iconUrl = ""
  switch (sub) {
    case 'attraction':
      iconUrl = '../../src/assets/icons/Attraction.svg'; 
      break;
    case 'museum':
      iconUrl =  '../../src/assets/icons/Museum.svg';
      break;
    case 'gallery':
      iconUrl = '../../src/assets/icons/Gallery.svg';
      break;
    case 'zoo':
      iconUrl = '../../src/assets/icons/Zoo.svg';
      break;
    case 'park':
      iconUrl = '../../src/assets/icons/Park.svg';
      break;
    case 'ice_cream':
      iconUrl = '../../src/assets/icons/Icecream.svg';
      break;
    case 'fast_food':
      iconUrl = '../../src/assets/icons/Fastfood.svg';
      break;
    case 'cafe':
      iconUrl = '../../src/assets/icons/Cafe.svg';
      break;
    case 'bar':
      iconUrl = '../../src/assets/icons/Bar.svg';
      break;
    case 'restaurant':
      iconUrl = '../../src/assets/icons/Restaurant.svg';
      break;
    default:
      iconUrl = '../../src/assets/icons/Default.svg'; // defualt icon
  }

  return iconUrl
}

/**
 * Set a local Storage data object to give selected information to the map application
 */
const setCookie = () => {
  const toastTrigger = document.getElementById('startRouting')
  const toastLiveExample = document.getElementById('liveToast')
  if(boxes.length>1){
    if(document.getElementById("startLoc").value!==""){
      if(document.getElementById("date").value!==""){
        let range = document.getElementById("range").value
        let date = document.getElementById("date").value
        let barrierFree = document.getElementById("barrierFree").checked
        let vegan = document.getElementById("vegan").checked

        let options = {
            range: range,
            date: date,
            barrierFree: barrierFree,
            vegan: vegan,
            startLocation: startLocation.value,
          };

        let locations = []
        for (let i = 0; i < boxes.length; i++) {
          let label = boxes[[i]].label
          let subcat = boxes[[i]].subcat
          if(label==='' || (label!=='Start' && subcat==='')){
            if (toastTrigger) {
              const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
              errmsg.value="All locations need to be selected!"
              toastBootstrap.show()
            }
            return -1;
          }
          locations.push({"top":label.toLowerCase(),"sub":subcat.toLowerCase().replace(" ", "_")})
        }

        localStorage.setItem("tripTailorRoute", JSON.stringify({"options":options,"locations":locations}));
        window.location.replace("/map/");
      }else{
        if (toastTrigger) {
          const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
          errmsg.value="Please select a date of travel"
          toastBootstrap.show()
        }
      }
    }else{
      if (toastTrigger) {
        const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
        errmsg.value="Please choose a starting point"
        toastBootstrap.show()
      }
    }
  }else{
    if (toastTrigger) {
      const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
      errmsg.value="Please add at least one location"
      toastBootstrap.show()
    }
  }
  
};

onMounted(() => {
  updatePositions();  // intial positioning and drawing of lines
});
</script>

<template>
  <div class="quiz-container">
    <NavbarHeader/>
    <main>
      <div class="circle-container" ref="circle">
        <!-- Error Toast -->
        <div class="toast-container position-fixed top-0 end-0 p-3">
          <div id="liveToast" class="toast text-bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
              <strong class="me-auto">Error</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              {{ errmsg }}
            </div>
          </div>
        </div>
        <DraggableDiv
          v-for="(box, index) in boxes" 
          :key="index"
          :style="{ left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' }"
          :label="box.label"
          :subcat="box.subcat"
          @mousedown="startDragging(box, $event)"
        >
          <template v-slot:header>
            <b v-if="index!==0">Activity {{ index }}</b>
            <b v-if="index==0"></b>
            <i v-if="index!==0" @click="deleteBox(box)" class="bi bi-trash delete-icon"></i>
          </template>
          <template v-slot:body>
            <select v-if="box.isEditing" v-model="box.label" @change="finishEditing(box)">
              <option disabled value="" selected>Select activity</option>
              <option value="Tourism">Tourism</option>
              <option value="Amenity">Amenity</option>
            </select>
            <p v-if="!box.isEditing"> {{ box.label }} </p>
            <select v-if="box.isSubCat && box.label!=='Start'" v-model="box.subcat" @change="finishSubCat(box)">
              <option disabled value="" selected>Select category</option>
              <option v-if="box.label==='Tourism'" value="Museum">Museum</option>
              <option v-if="box.label==='Tourism'" value="Attraction">Attraction</option>
              <option v-if="box.label==='Tourism'" value="Gallery">Gallery</option>
              <option v-if="box.label==='Tourism'" value="Zoo">Zoo</option>
              <option v-if="box.label==='Tourism'" value="Park">Park</option>
              <option v-if="box.label==='Amenity'" value="Cafe">Cafe</option>
              <option v-if="box.label==='Amenity'" value="Bar">Bar</option>
              <option v-if="box.label==='Amenity'" value="Ice Cream">Ice Cream</option>
              <option v-if="box.label==='Amenity'" value="Fast Food">Fast Food</option>
              <option v-if="box.label==='Amenity'" value="Restaurant">Restaurant</option>
            </select>
            <p v-if="!box.isSubCat && !box.isEditing && box.label!=='Start'"> <img :src="setIcon(box.subcat)"/> {{ box.subcat }} </p>
          </template>
        </DraggableDiv>
        <DraggableLine v-for="(line, index) in lines.lines" :key="index" :line="line" />
      </div>
      <div class="lock-layer" v-if="!customizerEnabled">
        <p class="lock-layer-text">{{ infomsg }}</p>
      </div>

      <div class="sidebar">
        <div>
          <!-- Starting Point Input with Autosuggestions -->
          <label for="startLoc" class="form-label">Starting Point</label>
          <input
            type="text"
            class="form-control"
            id="startLoc"
            name="start-location"
            placeholder="e.g., Münster (Westf.) Hauptbahnhof"
            v-model="startLocationQuery"
            @input="fetchSuggestions"
          />
          <ul v-if="suggestions.length > 0" class="suggestions-list">
            <li 
              v-for="(suggestion, index) in suggestions" 
              :key="index"
              @click="selectSuggestion(suggestion)"
              class="suggestion-item"
            >
              <strong>{{ suggestion.name }}</strong> <br>
              <small>{{ suggestion.address }}</small> <!-- Display the address -->
            </li>
          </ul>


          <hr>
          <!-- Date of Travel Input-->
          <label for="date" class="form-label">Day of Travel</label>
          <input type="date" class="form-control" id="date" name="trip-start" :disabled="!addressEntered" @change="checkDateInput"/>
          <hr>
          <!-- max Travel Range from Start Input-->
          <label for="range" class="form-label">Range from starting point: {{ range }} km</label>
          <input type="range" class="form-range custom-range" min="1" max="10" id="range" value="3" v-model="range" list="range-list" :disabled="!dateEntered">
          <datalist id="range-list">
            <option value="0" label="1"></option>
            <option value="100" label="10"></option>
          </datalist>
          <hr>
          <!-- More Options Block-->
          <b>More Options</b>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="barrierFree" :disabled="!dateEntered">
            <label class="form-check-label" for="barrierFree">Consider only barrier free locations</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="vegan" :disabled="!dateEntered">
            <label class="form-check-label" for="vegan">Amenities should have a Vegan Option</label>
          </div>
        </div>
        <!-- Buttons -->
        <button class="plus" @click="addBox" :disabled="!dateEntered">Add location</button>
        <button class="start" @click="setCookie" id="startRouting" :disabled="!routable">Start routing</button>
      </div>
    </main>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
hr{
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.quiz-container {
  color: var(--tt-dark);
  line-height: 1.6;
}

.lock-layer{
  grid-area: circle;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  background: rgba(92, 92, 92, 0.373);
  width: 100%;
  height: 100%;
}

.lock-layer-text{
  font-size: 24pt;
  font-weight: bold;
  background-color: rgba(92, 92, 92, 0.85);
  color: var(--tt-light);
  padding: 1rem;
  border-radius: 10px;
}

main {
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  grid-template-areas: "sidebar circle";
  align-items: center;
  justify-content: center;
  justify-items: center;
  min-height: 95vh;
}

.circle-container {
  grid-area: circle;
  width: 100%;
  height: 100%;
  background-color: var(--tt-gray);
  position: relative;
  top: 0;
  left: 0;
}

.sidebar {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  align-items: center;
  padding: .5rem;
}

.plus, .start {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}

.plus {
  background-color: var(--tt);
  color: var(--tt-dark);
}
.plus:disabled {
  background-color: var(--tt-light) !important;
  pointer-events: none !important;
}

.start {
  background-color: var(--tt-dark);
  color: var(--tt);
}
.start:disabled {
  background-color: rgba(41, 29, 0, 0.78);
  pointer-events: none !important;
}

.delete-icon{
  cursor: pointer;
}

select {
  border: none;
  background-color: transparent;
  font-size: 14px;
  cursor: pointer;
  z-index: 3;
}

[type="checkbox"] {
  border-color: var(--tt-gray);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23e8e7e7'/%3e%3c/svg%3e");
}
[type="checkbox"]:checked {
  background-color: var(--tt);
  border-color: var(--tt-dark);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23291d00'/%3e%3c/svg%3e");
}
[type="checkbox"]:focus, [type="checkbox"]:active {
  box-shadow: 0 0 0 0.25rem var(--tt-light);
  border-color: var(--tt-dark);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23291d00'/%3e%3c/svg%3e");
}
[type="checkbox"]:active{
  background-color: var(--tt-light);
  filter: unset;
}

.form-control:focus{
  box-shadow: 0 0 0 0.25rem var(--tt-light);
  border-color: var(--tt-dark);
}

/* Range Slider CSS */
.custom-range{
  width: 100%;
}
datalist {
  display: flex;
  justify-content: space-between;
  color: var(--tt-dark);
  width: 100%;
}
.custom-range::-webkit-slider-thumb{
  background: var(--tt-dark);
  box-shadow: none;
}
.custom-range::-moz-range-thumb {
  background: var(--tt-dark);
  box-shadow: none;
}
.custom-range::-ms-thumb {
  background: var(--tt-dark);
  box-shadow: none;
}

.custom-range:active::-webkit-slider-thumb {
  background: var(--tt-dark);
  box-shadow: 0 0 0 0.25rem var(--tt-light);
}
.custom-range:active::-moz-range-thumb {
  background: var(--tt-dark);
  box-shadow: 0 0 0 0.25rem var(--tt-light);
}
.custom-range:active::-ms-thumb {
  background: var(--tt-dark);
  box-shadow: 0 0 0 0.25rem var(--tt-light);
}

.custom-range:focus::-webkit-slider-thumb{
  background: var(--tt-dark);
  box-shadow: 0 0 0 0.25rem var(--tt-light);
}
.custom-range:focus::-moz-range-thumb{
  background: var(--tt-dark);
  box-shadow: 0 0 0 0.25rem var(--tt-light);
}
.custom-range:focus::-ms-thumb{
  background: var(--tt-dark);
  box-shadow: 0 0 0 0.25rem var(--tt-light);
}

.custom-range::-webkit-slider-runnable-track {
  background-color: var(--tt-gray);
}
.custom-range::-moz-range-track {
  background-color: var(--tt-gray);
}
.custom-range::-ms-track {
  background-color: var(--tt-gray);
}
.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: white;
  border: 1px solid #ccc;
  position: absolute;
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  padding: 10px;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f0f0f0;
}
</style>
