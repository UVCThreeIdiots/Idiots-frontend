import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import RootView from '../views/RootView.vue'
import SignUpView from '../views/SignUpView.vue'
import MainView from '../views/MainView.vue'
import MakeTimeView from '../views/MakeTimeView.vue'
import MakeGoalView from '../views/MakeGoalView.vue'
import ProgressView from '../views/ProgressView.vue'
import ProgressDetail from '../views/ProgressDetail.vue'
import UpdateUserInfoView from '../views/UpdateUserInfoView.vue'
import UpdateUserEmailView from '../views/UpdateUserEmail.vue'
import UpdateUserPasswordView from '../views/UpdateUserPassword.vue'
import CompleteView from '../views/CompleteView.vue'
import CompleteGoalDetailView from '../views/CompleteGoalDetail.vue'
import CompleteTCapsuleDetailView from '../views/CompleteTCapsuleDetail.vue'
import DummyFile from '../views/DummyFile.vue'
import DeveloperView from '../views/DeveloperView.vue'
import MakeTimeToUserView from '../views/MakeTimeToUserView.vue'
import MakeGoalToUserView from '../views/MakeGoalToUserView.vue'
import UpdateUserNameView from '../views/UpdateUserName.vue'
import MainGameView from '../views/MainGameView.vue'
import MainGameView2 from '../views/MainGameView2.vue'
import MainGameView3 from '../views/MainGameView3.vue'
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
      path: '/ProgressDetail/progress/:goalId',
      name: 'ProgressDetail',
      component : ProgressDetail,
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
      path : '/updateusername/:userId',
      name : 'updateusername',
      component : UpdateUserNameView
    },
    {
      path : '/developer/:id',
      name : 'developer',
      component : DeveloperView
    },
    {

      path : '/complete/:id',
      name : 'complete',
      component : CompleteView
    },
    {
      path : '/completeGoalDetail/:id',
      name : 'completeGoalDetail',
      component : CompleteGoalDetailView,
    },
    {
      path : '/completeTCapsuleDetail/:id',
      name : 'completeTCapsuleDetail',
      component : CompleteTCapsuleDetailView,
    },
    {
      path : '/maketimetouser/:id',
      name : 'maketimetouser',
      component : MakeTimeToUserView
    },
    {
      path : '/makegoaltouser/:id',
      name : 'makegoaltouser',
      component : MakeGoalToUserView
    },
    {
      path : '/maingameview/:id',
      name : 'maingameview',
      component : MainGameView
    },
    {
      path: '/maingameview2/:id',
      name : 'maingameview2',
      component : MainGameView2
    },
    {
      path : '/maingameview3/:id',
      name :'maingameview3',
      component : MainGameView3
    }

  ]
})

export default router
