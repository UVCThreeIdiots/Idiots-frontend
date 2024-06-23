<template>
  <div id="progress" class="container">
    <div class="border-box">
      <img class="obakuser" src="../components/images/prof_oh.png">
      <div class="text-box">
        <p class="obakuser-text">
          <span v-for="(char, index) in typedText" :key="index">
            <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
          </span>
        </p>
      </div>
    </div>
    <div class="capsule-filter">
      <select id="capsuleSelect" class="select-box" v-model="selected" @change="selectCapsule">
        <option value="">모두보기</option>
        <option value="option1">목표캡슐</option>
        <option value="option2">타임캡슐</option>
      </select>
    </div>
    <div class="parent">
      <!-- Render GCapsule List -->
      <div class="child" v-for="GCapsule in filteredGCapsules" :key="GCapsule.id">
        <div class="image-container" :style="{ opacity : GCapsule.isFailed || GCapsule.isSuccess ? 0.4 : ''}">
          <img class="capsule" src="../components/images/capsule.gif">
          <img v-if="GCapsule.completeGCapsules == 100" src="../components/images/success.png" class="overlay-image">
          <img v-else src="../components/images/fail.png" class="overlay-image">
        </div>
        <div>
          <router-link v-if="initialPosition === 'center'" :to="{ name: 'completeGoalDetail', params: { id: GCapsule.id }, query : {initialPosition : 'center'}}">
            {{ GCapsule.title }}
          </router-link>
          <router-link v-else :to="{ name: 'completeGoalDetail', params: { id: GCapsule.id }}" :style="{ opacity : GCapsule.isFailed || GCapsule.isSuccess ? 0.8 : ''}">
            {{ GCapsule.title }}
          </router-link>
        </div>
        
        <div class="progress">
          <div class="progress-bar-container" :style="{ opacity : GCapsule.isFailed || GCapsule.isSuccess ? 0.4 : ''}">
            <div class="progress-bar" :style="{ width: GCapsule.completeGCapsules + '%' }"></div>
          </div>
          <p :style="{ opacity : GCapsule.isFailed || GCapsule.isSuccess ? 0.4 : ''}">{{ GCapsule.completeGCapsules }}%</p>
        </div>
      </div>

      <!-- Render TCapsule List -->
      <div class="child" v-for="TCapsule in filteredTCapsules" :key="TCapsule.id">
        <div class="image-container">
          <img class="capsule" src="../components/images/capsule.gif">
        </div>
        <div>
          <router-link v-if="initialPosition === 'center'" :to="{ name: 'completeTCapsuleDetail', params: { id: TCapsule.id }, query : {initialPosition : 'center'}}">
            {{ TCapsule.title }}
          </router-link>
          <router-link v-else :to="{ name: 'completeTCapsuleDetail', params: { id: TCapsule.id }}">
            {{ TCapsule.title }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="button-container">
      <button v-if="initialPosition === 'center'" @click="gamemain">뒤로가기</button>
      <button v-else @click="goBack">뒤로가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '../stores/user.js';
import axiosInstance from '@/config/axiosInstance';

const route = useRoute();
const GCapsuleList = ref([]);
const TCapsuleList = ref([]);
const initialPosition = route.query.initialPosition; // 초기 위치

const selected = ref('');

const typedText = ref('도감을 확인하러 왔구나 ! !');

//필터링
const filteredGCapsules = computed(() => {
  if (selected.value === 'option1' || selected.value === '') {
    return GCapsuleList.value;
  }
  return [];
});
const filteredTCapsules = computed(() => {
  if (selected.value === 'option2' || selected.value === '') {
    return TCapsuleList.value;
  }
  return [];
});

const navigateTo = (route) => {
  window.location.href = route;
};
const goBack = () => {
  navigateTo(`/main/`);
};
const gamemain = () => {
  navigateTo(`/maingameview2/?initialPosition=progress`);
}

const capsuleData = () => {
  axiosInstance.get(`https://www.3idiots.xyz:3000/capsule/`)
  .then(response => {
    console.log('res',response.data);
    GCapsuleList.value = response.data.gCapsules.map(GCapsule => {
      const completeGCapsules = ((GCapsule.nowCount / GCapsule.goalCount) * 100).toFixed(1);
      return {
        ...GCapsule,
        completeGCapsules: completeGCapsules,
      };
    });
    TCapsuleList.value = response.data.tCapsules.map(TCapsule => { return TCapsule });
  })
  .catch(error => {
    console.error(error);
  })
};

onMounted(capsuleData);

</script>

<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}
@keyframes reveal {
  0% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}
body {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.select-box {
  border: 2px solid #000;
  margin: 8px 16px 0px 0px;
  width: 103px;
  border-radius: 16px;
  text-align: center;
  font-size: 16px;
  padding: 4px;
}

.capsule-filter {
  /* border: 2px solid #000; */
  display: flex;
  justify-content: flex-end;
}


.image-container {
  position: relative;
  display: inline-block;
}

.capsule {
  display: block;
}

.overlay-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
.progress {
  display: flex;
  width: 85%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
}
.container {
  font-family: 'CustomFont', Arial, sans-serif;
  width: 900px;
  height: 680px;
  padding: 10px;
  border: 2px solid black;
  background-color: white;
  box-shadow: 4px 4px 0 0 #888, 8px 8px 0 0 #aaa;
  border-radius: 15px;
  position: relative;
}
.obakuser {
  width: 100px;
}
.container .border-box {
  display: flex;
  border: 2px solid black;
  padding: 5px;
  border-radius: 15px;
  margin: 0px 16px 0px 8px;
}
.obakuser-text {
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
  margin-left: 30px;
}
.text-box {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}
.parent {
  margin: 0px 8px 0px 8px;
  /* padding: 8px; */
  /* text-align: justify; */
  width: 97%;
  height: 68%;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* row-gap: 8px;*/
}

.parent::-webkit-scrollbar {
  width: 8px;
}

.parent::-webkit-scrollbar-thumb { 
    background-color: #cbcbcbbd;
    border-radius: 15px;
}

.parent::-webkit-scrollbar-button {
    display: none;
}


.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 8px;
  margin-left: 12px;
}
.button-container button {
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
}
.progress-bar-container {
  width: 50%;
  background-color: #e0e0e0;
  overflow: hidden;
  height: 16px;
  margin: 16px 8px;
}
.progress-bar {
  height: 100%;
  background-color: #000;
  width: 0;
  transition: width 1.5s ease-in-out;
}
.capsule-list {
  height: 200px;
  width: 200px;
  border: 2px solid #000;
  border-radius: 15px;
  position: absolute;
  text-align: center;
}
.capsule {
  width: 100px;
  height: 100px;
}
.child {
  display: inline-block;
  border: 2px solid black;
  margin-left: 50px;
  margin-right: 50px;
  margin-top: 20px;
  height: 200px;
  width: 170px;
  color: black;
  text-align: center;
}
</style>