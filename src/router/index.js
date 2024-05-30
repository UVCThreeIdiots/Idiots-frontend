import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import RootView from '../views/RootView.vue'
import SignUpView from '../views/SignUpView.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'root',
      component: RootView
    },
    
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    }
  ]
})

export default router
