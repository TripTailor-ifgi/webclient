<script setup>
import NavbarHeader  from "@/components/Navbar.vue"
import DraggableDiv  from "@/components/quiz/DraggableDiv.vue"
import DraggableLine from "@/components/quiz/DraggableLine.vue";
import { ref, reactive, onMounted, nextTick } from 'vue';
import { useLinesStore } from "@/stores/store.js"

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
</script>

<template>

  <div class="quiz-container">
    <NavbarHeader/>
    
    <main>
      <div class="circle-container" ref="circle">
        <!--<canvas ref="connectionCanvas"></canvas>-->
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
</style>
