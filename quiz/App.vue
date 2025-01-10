<script setup>
import NavbarHeader from "@/components/Navbar.vue"
import DraggableDiv from "@/components/quiz/DraggableDiv.vue"
import DraggableLine from "@/components/quiz/DraggableLine.vue";
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useLinesStore } from "@/stores/store.js"

const lines = useLinesStore();
const circle = ref(null);
const boxes = reactive([
  { label: 'Start', left: 50, top: 50, width: 100, height: 50, isEditing: false }, 
]);

// Function to draw lines between the centroids of the boxes
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

// start dragging a box
const startDragging = (box, event) => {
  draggingBox.value = box;
  startPosition.value = { x: event.clientX, y: event.clientY };
  initialPosition.value = { left: box.left, top: box.top };

  // listen for drag movement
  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDragging);
};

//handle dragging movement
const onDrag = (event) => {
  if (!draggingBox.value) return;

  const dx = event.clientX - startPosition.value.x;
  const dy = event.clientY - startPosition.value.y;

  draggingBox.value.left = initialPosition.value.left + dx;
  draggingBox.value.top = initialPosition.value.top + dy;

  // redraw lines during dragging 
  drawLines();
};

// stop dragging
const stopDragging = () => {
  draggingBox.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDragging);

  // Redraw lines only after dragging is complete, would be computationally cheaper
  // drawLines();
};

// update positions in a circle, with the "Start" box on the leftmost side
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


const addBox = () => {
  boxes.push({ label: '', left: 50, top: 50, width: 100, height: 50, isEditing: true });
  nextTick(() => {
    updatePositions();
  });
};


const finishEditing = (box) => {
  box.isEditing = false;
  nextTick(() => {
    updatePositions();
  });
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
        <DraggableDiv
          v-for="(box, index) in boxes" 
          :key="index"
          :style="{ left: box.left + 'px', top: box.top + 'px', width: box.width + 'px', height: box.height + 'px' }"
          :label="box.label"
          @mousedown="startDragging(box, $event)"
        >
          <template v-slot:header>
            Activity {{ index }}
          </template>
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
        <DraggableLine v-for="(line, index) in lines.lines" :key="index" :line="line" />
      </div>

      <div class="sidebar">
        <button class="plus" @click="addBox">Add location</button>
        <a class="start" href="/map/">Start Routing</a>
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
.quiz-container {
  color: var(--tt-dark);
  line-height: 1.6;
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

.start {
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
</style>
