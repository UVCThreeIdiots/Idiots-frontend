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
import UpdateUserEmailView from '../views/UpdateUserEmail.vue'
import UpdateUserPasswordView from '../views/UpdateUserPassword.vue'
import DummyFile from '../views/DummyFile.vue'
import DeveloperView from '../views/DeveloperView.vue'
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
      path: '/main/:id',
      name: 'main',
      component : MainView
    },
    {
      path: '/maketime/:id',
      name: 'maketime',
      component : MakeTimeView
    },
    {
      path: '/makegoal/:id',
      name: 'makegoal',
      component : MakeGoalView
    },
    {
      path: '/progress/:id',
      name: 'progress',
      component : ProgressView
    },
    {
      path: '/encyclopedia/goal/:goalId',
      name: 'encyclopedia',
      component : EncyclopediaView,
      props: true,
    },
    {
      path: '/updateuserinfo/:id',
      name: 'updateuserinfo',
      component : UpdateUserInfoView
    },
    {
      path: '/updateUserEmail/:userId',
      name: 'updateUserEmail',
      component : UpdateUserEmailView
    },
    {
      path: '/updateUserPassword/:userId',
      name: 'updateUserPassword',
      component : UpdateUserPasswordView
    },
    {
      path : '/developer/:id',
      name : 'developer',
      component : DeveloperView
    }
  ]
})

export default router
