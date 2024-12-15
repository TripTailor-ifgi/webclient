<script setup>
import { ref } from "vue"
import NavbarHeader  from "../src/components/Navbar.vue"

const center = ref([849296,6793837]);
const zoom = ref(10);
</script>


<template>
    <ol-map id="main-map">
      <NavbarHeader/>
      <ol-view ref="view" :center="center" :zoom="zoom"/>
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-map>
</template>

<style scoped>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Arial, sans-serif;
}
#main-map {
  min-height: 100vh;
  min-width: 100vw;
  color: var(--tt-dark);
  line-height: 1.6;
}
</style>
