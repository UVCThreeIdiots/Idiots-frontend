<template>
  <div class="sidebar">
      <img class="profile-pic" src="../../components/images/ThreeIdiots.png" alt="Profile Picture">
      <div class="greeting">{{ userName }} 님<br>안녕하세요!</div>
      <div class="menu-item" @click="logout"><img class="icon" src="../../components/icons/logoutIcon.png"/> Logout</div>
      <div class="menu-item" @click="moveMain"><img class="icon" src="../../components/icons/mainIcon.png"/> Main</div>
      <div class="menu-item" @click="moveUsers"><img class="icon" src="../../components/icons/userIcon.png"/> Users</div>
      <div class="menu-item" @mouseover="showCapsuleLinks = true"><img class="icon" src="../../components/icons/capsuleIcon.png"/> Capsules</div>
      <div v-if="showCapsuleLinks" class="capsule-links" @mouseover="showCapsuleLinks = true" @mouseleave="showCapsuleLinks = false">
        <a v-if="initialPosition === 'g'" href="/admin/timecapsules?initialPosition=g"> Time Capsule</a>
        <a v-else href="/admin/timecapsules"> Time Capsule</a>
        <a v-if="initialPosition === 'g'" href="/admin/goalcapsules?initialPosition=g"> Goal Capsule</a>
        <a v-else href="/admin/goalcapsules"> Goal Capsule</a>
        </div>
        <div class="menu-item" @click="moveGame"><img class="icon" src="../../components/icons/gameIcon.png"/> Game</div>

  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../../stores/user.js';
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosInstance.js';
const route = useRoute();
const initialPosition = route.query.initialPosition;
const userStore = useUserStore();
const userName = ref(userStore.getUser().name);
const showCapsuleLinks = ref(false);
const navigateTo = (route) => {
  window.location.href = route;
};

const moveMain = () => {
  if (initialPosition === 'g') navigateTo(`/admin/main?initialPosition=g`);
  else navigateTo('/admin/main');
};
const moveGame = () => {
  if (initialPosition === 'g') navigateTo(`/maingameview3/?initialPosition=a`);
  else navigateTo(`/main/`);
};
const moveUsers = () => {
  if (initialPosition === 'g') navigateTo(`/admin/users?initialPosition=g`);
  else navigateTo('/admin/users');
}
const logout = () => {
  axiosInstance.post(`http://localhost:3000/auth/logout/`)
      .then(response => {
        console.log(response.data);
        userStore.logout();
        navigateTo('/');
      })
      .catch(error => {
        console.log(error);
      })  
}
</script>

<style scoped>
.sidebar {
  width: 200px;
  height: 700px;
  background-color: #254336;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0px;
  margin-left: 20px;
  position: -webkit-sticky;
  position: sticky;
  top: 20px;
}

.profile-pic {
  width: 100%;
  height: 160px;
  background-color: #b0b0b0;
  margin-bottom: 10px;
  border-radius:10px;
}

.greeting {
  padding: 10px;
  margin-bottom: 30px;
  text-align: center;
  width: 200px;
  color: white;
  font-size: 18px;
}

.menu-item {
  background-color: #254336;
    color: white;
    padding: 8px;
    text-align: center;
    width: 200px;
    height: 60px;
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-content: flex-start;
    justify-content: center;
    align-items: center;
}

.menu-item:hover {
  background-color: #85836b;
}

.capsule-links {
  width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.capsule-links a {
  color: white;
  background-color: #6B8A7A;
  padding: 10px;
  text-align: center;
  width: 200px;
  height: 40px;
  font-size: 16px;
  text-decoration: none;
  display: block;
}

.capsule-links a:hover {
  background-color: #B7B597;
}

.logout{
  background-color: #254336;
  color: white;
  padding: 15px;
  text-align: end;
  cursor: pointer;
  font-size: 14px;
}
.icon{
  background : none;
  width : 30px;
  height: 30px;
  filter : invert(100%);
  margin-right : 10px;
}
</style>
