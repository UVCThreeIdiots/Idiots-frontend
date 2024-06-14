import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersistedstate from 'pinia-plugin-persistedstate';
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia();

app.use(router)
pinia.use(piniaPersistedstate);
app.use(pinia)

app.mount('#app')
