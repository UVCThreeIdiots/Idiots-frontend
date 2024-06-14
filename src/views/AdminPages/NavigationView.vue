<template>
  <div class="sidebar">
      <img class="profile-pic" src="../../components/images/ThreeIdiots.png" alt="Profile Picture">
      <div class="greeting">{{ userName }} 님<br>안녕하세요!</div>
      <div class="menu-item" @click="moveMain">Main</div>
      <div class="menu-item" @click="moveUsers">Users</div>
      <div class="menu-item" @mouseover="showCapsuleLinks = true">Capsules</div>
      <div v-if="showCapsuleLinks" class="capsule-links" @mouseover="showCapsuleLinks = true" @mouseleave="showCapsuleLinks = false">
        <a v-if="initialPosition === 'g'" href="/admin/timecapsules?initialPosition=g">Time Capsule</a>
        <a v-else href="/admin/timecapsules">Time Capsule</a>
        <a v-if="initialPosition === 'g'" href="/admin/goalcapsules?initialPosition=g">Goal Capsule</a>
        <a v-else href="/admin/goalcapsules">Goal Capsule</a>
      </div>
      <div class="menu-item" @click="moveGame">Game</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '../../stores/user.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const initialPosition = route.query.initialPosition;
const userStore = useUserStore();
const userName = ref(userStore.getUser().name);
const userId = ref(userStore.getUser().id);
const showCapsuleLinks = ref(false);

const navigateTo = (route) => {
  window.location.href = route;
};

const moveMain = () => {
  if (initialPosition === 'g') navigateTo(`/admin/main?initialPosition=g`);
  else navigateTo('/admin/main');
};
const moveGame = () => {
  if (initialPosition === 'g') navigateTo(`/maingameview3/${userId.value}?initialPosition=a`);
  else navigateTo(`/main/${userId.value}`);
};
const moveUsers = () => {
  if (initialPosition === 'g') navigateTo(`/admin/users?initialPosition=g`);
  else navigateTo('/admin/users');
}
</script>

<style scoped>
.sidebar {
  width: 200px;
    background-color: #254336;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    margin: 20px 0px;
    margin-left: 20px;
}

.profile-pic {
  width: 100%;
  height: 160px;
  background-color: #b0b0b0;
  margin-bottom: 30px;
}

.greeting {
  padding: 10px;
  margin-bottom: 30px;
  text-align: center;
  width: 200px;
  color: white;
  font-size: 18px;
  /* background-color : white; */
}

.menu-item {
  background-color: #254336;
  color: white;
  padding: 15px;
  text-align: center;
  margin-top: 10px;
  width: 200px;
  height: 60px;
  cursor: pointer;
  font-size: 16px;
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
</style>
