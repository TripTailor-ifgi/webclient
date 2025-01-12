<script setup>
import NavbarHeader  from "@/components/Navbar.vue"
import DraggableDiv  from "@/components/quiz/DraggableDiv.vue"
import DraggableLine from "@/components/quiz/DraggableLine.vue";
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useLinesStore } from "@/stores/store.js"
import { Toast } from "bootstrap"

  const range = ref(3)
  const errmsg = ref()
  const lines = useLinesStore()
  const circle = ref(null);
  const boxes = reactive([
    { label: 'Start', left: '50%', top: '50%', isEditing: false },
  ]);

  const drawLines = () => {
    let boxElements = document.querySelector(".draggable-container")
    let centerX = boxElements.offsetWidth/2
    let centerY  = boxElements.offsetWidth/2
    let tmpArray = [];
    if(boxes.length>1){
      for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        let nextbox = boxes[(i + 1) % (boxes.length)];
        tmpArray.push({x1: parseFloat(box.left.slice(0, -2)) + centerX, y1: parseFloat(box.top.slice(0, -2)) + centerY, x2: parseFloat(nextbox.left.slice(0, -2)) + centerX, y2: parseFloat(nextbox.top.slice(0, -2)) + centerY})
      }
      lines.setLines(reactive(tmpArray))
    }
  };

  const updatePositions = () => {
    if (!circle.value) return;

    const centerX = circle.value.offsetWidth / 2;
    const centerY = circle.value.offsetHeight / 2;
    const angleStep = (2 * Math.PI) / boxes.length;

    let radius = Math.max(300, 50 + boxes.length * 20);

    boxes.forEach((box, index) => {
      const angle = index * angleStep;
      box.left = `${(centerX + radius * Math.cos(angle))}px`;
      box.top = `${(centerY + radius * Math.sin(angle))}px`;
    });
    drawLines();
  };

  const addBox = () => {
    boxes.push({ label: '', left: "50%", top: "50%", isEditing: true });
    nextTick(updatePositions);
  };

  const finishEditing = (box) => {
    box.isEditing = false;
    nextTick(updatePositions);
  };

  onMounted(() => {
    updatePositions();
  });

  const setCookie = () => {
    const toastTrigger = document.getElementById('startRouting')
    const toastLiveExample = document.getElementById('liveToast')
    
    if(document.getElementById("date").value!==""){
      let range = document.getElementById("range").value
      let date = document.getElementById("date").value
      let barrierFree = document.getElementById("barrierFree").checked
      let vegan = document.getElementById("vegan").checked

      let options = {"range": range, "date": date, "barrierFree": barrierFree, "vegan": vegan}

      let locations = []
      for (let i = 0; i < boxes.length; i++) {
        let label = boxes[[i]].label
        if(label===''){
          if (toastTrigger) {
            const toastBootstrap = Toast.getOrCreateInstance(toastLiveExample)
            errmsg.value="All locations need to be selected!"
            toastBootstrap.show()
          }
          return -1;
        }
        locations.push(label)
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

  }
</script>

<template>

  <div class="quiz-container">
    <NavbarHeader/>
    
    <main>
      <div class="circle-container" ref="circle">
        <!--<canvas ref="connectionCanvas"></canvas>-->
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
        <DraggableDiv v-for="(box, index) in boxes" 
        :key="index" :style="{ left: box.left, top: box.top }" :label="box.label">
          <template v-slot:header> Activity {{ index }} </template>
          <template v-slot:body>
            <select v-if="box.isEditing" v-model="box.label" @change="finishEditing(box)">
              <option disabled value="">Select activity</option>
              <option value="Museum">Museum</option>
              <option value="Cafe">Cafe</option>
              <option value="Park">Park</option>
              <option value="Restaurant">Restaurant</option>
            </select>
          </template>
        </DraggableDiv>
        <DraggableLine/>
      </div>
      <div class="sidebar">
        <div>
          <label for="date" class="form-label">Day of Travel</label>
          <input type="date" class="form-check" id="date" name="trip-start"/>
          <hr>
          <label for="range" class="form-label">Range from starting point: {{ range }} km</label>
          <input type="range" class="form-range custom-range" min="1" max="10" id="range" value="3" v-model="range" list="range-list">
          <datalist id="range-list">
            <option value="0" label="1"></option>
            <option value="100" label="10"></option>
          </datalist>
          <hr>
          <b>More Options</b>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="barrierFree">
            <label class="form-check-label" for="barrierFree">Consider only barrier free locations</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" role="switch" id="vegan">
            <label class="form-check-label" for="vegan">Amenities should have a Vegan Option</label>
          </div>
        </div>
        <button class="plus" @click="addBox">Add location</button>
        <button class="start" @click="setCookie" id="startRouting">Start routing</button>
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

main{
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto;
  grid-template-areas: 
    "sidebar circle";
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
.sidebar{
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  height: 100%;
  align-items: center;
}
.plus, .start {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}

.plus{
  background-color: var(--tt);
  color: var(--tt-dark);
}
.start{
  background-color: var(--tt-dark);
  color: var(--tt);
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

/* Range Slider CSS */
.custom-range{
  width: 90%;
}
datalist {
  display: flex;
  justify-content: space-between;
  color: var(--tt-dark);
  width: 90%;
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
</style>
