import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import axios from './config/axiosInstance';

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(router)
pinia.use(piniaPersistedstate);
app.use(pinia)
app.config.globalProperties.$axios = axios; 

app.mount('#app')
