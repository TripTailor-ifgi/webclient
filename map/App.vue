<script setup>
import { ref } from "vue"

const center = ref([849296,6793837]);
const zoom = ref(10);
</script>


<template>
    <ol-map id="main-map">
      <ol-view ref="view" :center="center" :zoom="zoom"/>
      <ol-tile-layer>
        <ol-source-osm />
      </ol-tile-layer>
    </ol-map>
</template>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
}

#main-map {
  min-height: 100vh;
  min-width: 100vw;
}
</style>
