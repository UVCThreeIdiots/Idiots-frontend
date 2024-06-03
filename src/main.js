import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import store from './stores/index.js'; // Vuex store import

import App from './App.vue'
import router from './router'

const pinia = createPinia();
const app = createApp(App)
app.use(store); // Vuex store 사용

app.use(pinia)
app.use(router)

app.mount('#app')
