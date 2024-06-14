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
import PracticeTakenPhotoView from '../views/PracticeTakenPhoto.vue';
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
      path: '/main/',
      name: 'main',
      component : MainView
    },
    {
      path: '/maketime/',
      name: 'maketime',
      component : MakeTimeView
    },
    {
      path: '/makegoal/',
      name: 'makegoal',
      component : MakeGoalView
    },
    {
      path: '/progress/',
      name: 'progress',
      component : ProgressView
    },
    {
      path: '/ProgressDetail/progress/',
      name: 'ProgressDetail',
      component : ProgressDetail,
      props: true,
    },
    {
      path: '/updateuserinfo/',
      name: 'updateuserinfo',
      component : UpdateUserInfoView
    },
    {
      path: '/updateUserEmail/',
      name: 'updateUserEmail',
      component : UpdateUserEmailView
    },
    {
      path: '/updateUserPassword/',
      name: 'updateUserPassword',
      component : UpdateUserPasswordView
    },
    {
      path : '/updateusername/',
      name : 'updateusername',
      component : UpdateUserNameView
    },
    {
      path : '/developer/',
      name : 'developer',
      component : DeveloperView
    },
    {

      path : '/complete/',
      name : 'complete',
      component : CompleteView
    },
    {
      path : '/completeGoalDetail/',
      name : 'completeGoalDetail',
      component : CompleteGoalDetailView,
    },
    {
      path : '/completeTCapsuleDetail/',
      name : 'completeTCapsuleDetail',
      component : CompleteTCapsuleDetailView,
    },
    {
      path : '/maketimetouser/',
      name : 'maketimetouser',
      component : MakeTimeToUserView
    },
    {
      path : '/makegoaltouser/',
      name : 'makegoaltouser',
      component : MakeGoalToUserView
    },
    {
      path : '/practice',
      name : 'practice',
      component : PracticeTakenPhotoView
    },
    {
      path : '/maingameview/',
      name : 'maingameview',
      component : MainGameView
    },
    {
      path: '/maingameview2/',
      name : 'maingameview2',
      component : MainGameView2
    },
    {
      path : '/maingameview3/',
      name :'maingameview3',
      component : MainGameView3
    },
  ]
})

export default router
