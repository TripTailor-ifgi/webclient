import '../src/assets/main.css'
import OpenLayersMap from "vue3-openlayers";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App)

app.use(OpenLayersMap /*, options */);
app.use(createPinia())

app.mount('#app')
