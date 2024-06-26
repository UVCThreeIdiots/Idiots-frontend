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
import PracticeTakenPhotoView from '../views/PracticeTakenPhoto.vue'
import FindInfoView from '../views/FindInfoView.vue'
import ResetPwView from '../views/ResetPwView.vue'
import MainGameView from '../views/MainGameView.vue'
import MainGameView2 from '../views/MainGameView2.vue'
import MainGameView3 from '../views/MainGameView3.vue'
import CheckCapsuleView from '../views/CheckCapsuleView.vue'
import CheckGoalDetailView from '../views/CheckGCapulesDetail.vue'
import CheckTimeDetailView from '../views/CheckTCapsuleDetail.vue'

import { useSessionStore } from '../stores/session'

import AdminMainView from '../views/AdminPages/AdminView.vue'
import AdminUsersView from '../views/AdminPages/AdminUsers.vue'
import AdminTimeCapsulesView from '../views/AdminPages/AdminTimeCapsules.vue'
import AdminGoalCapsulesView from '../views/AdminPages/AdminGoalCapsules.vue'

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
      path: '/ProgressDetail/progress/:goalId',
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
      path : '/checkGDetail/:id',
      name : 'checkGDetail',
      component : CheckGoalDetailView,
    },
    {
      path : '/checkTDetail/:id',
      name : 'checkTDetail',
      component : CheckTimeDetailView,
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
    {
      path : '/findinfo/',
      name :'findinfo',
      component : FindInfoView
    },
    {
      path : '/reset-password/:token',
      name :'reset-password',
      component : ResetPwView
    },
    {
      path : '/admin/main/',
      name : 'adminmain',
      component : AdminMainView
    },
    {
      path : '/admin/users/',
      name : 'adminusers',
      component : AdminUsersView
    },
    {
      path : '/admin/timecapsules',
      name : 'admaintimecapsules',
      component: AdminTimeCapsulesView
    },
    {
      path : '/admin/goalcapsules',
      name : 'admaingoalcapsules',
      component: AdminGoalCapsulesView
    },
    {
      path : '/checkCapsules/',
      name : 'checkCapsules',
      component: CheckCapsuleView
    }
  ]
})

router.beforeEach((to, from, next) => {
  const sessionStore = useSessionStore();
  sessionStore.checkSession();

  if (sessionStore.isSessionExpired && to.name !== 'root' && to.name !== 'signup' && to.name !== 'findinfo' && to.name !== 'reset-password') {
    next({ name: 'root' });
  } else {
    next();
  }
});

export default router
