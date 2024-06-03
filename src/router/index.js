import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import RootView from '../views/RootView.vue'
import SignUpView from '../views/SignUpView.vue'
import MainView from '../views/MainView.vue'
import MakeTimeView from '../views/MakeTimeView.vue'
import MakeGoalView from '../views/MakeGoalView.vue'
import ProgressView from '../views/ProgressView.vue'
import EncyclopediaView from '../views/ProgressDetail.vue'
import UpdateUserInfoView from '../views/UpdateUserInfoView.vue'
import DummyFile from '../views/DummyFile.vue'

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
      // component: DummyFile
    },
    {
      path: '/main',
      name: 'main',
      component : MainView
    },
    {
      path: '/maketime',
      name: 'maketime',
      component : MakeTimeView
    },
    {
      path: '/makegoal',
      name: 'makegoal',
      component : MakeGoalView
    },
    {
      path: '/progress',
      name: 'progress',
      component : ProgressView
    },
    {
      path: '/encyclopedia',
      name: 'encyclopedia',
      component : EncyclopediaView
    },
    {
      path: '/updateuserinfo',
      name: 'updateuserinfo',
      component : UpdateUserInfoView
    }
  ]
})

export default router
