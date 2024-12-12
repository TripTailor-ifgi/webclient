import '../src/assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import ElementPlus from 'element-plus';
import 'bootstrap'
import 'element-plus/dist/index.css';
import 'bootstrap/dist/css/bootstrap.css';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');