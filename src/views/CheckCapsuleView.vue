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
        <div class="image-container">
          <img class="capsule" src="../components/images/capsule.gif">
          <img v-if="GCapsule.sendGCapsules == 100" src="../components/images/success.png" class="overlay-image">
          <img v-else src="../components/images/fail.png" class="overlay-image">
        </div>
        <div>
          <router-link v-if="initialPosition === 'center'" :to="{ name: 'checkGDetail', params: { id: GCapsule.id }, query : {initialPosition : 'center'}}">
            {{ GCapsule.title }}
          </router-link>
          <router-link v-else :to="{ name: 'checkGDetail', params: { id: GCapsule.id }}">
            {{ GCapsule.title }}
          </router-link>
        </div>   
        <div class="progress">
          <div class="progress-bar-container">
            <div class="progress-bar" :style="{ width: GCapsule.sendGCapsules + '%' }"></div>
          </div>
          <p>{{ GCapsule.sendGCapsules }}%</p>
        </div>
      </div>

      <!-- Render TCapsule List -->
      <div class="child" v-for="TCapsule in filteredTCapsules" :key="TCapsule.id">
        <div class="image-container">
          <img class="capsule" src="../components/images/capsule.gif">
        </div>
        <div>
          <router-link v-if="initialPosition === 'center'" :to="{ name: 'checkTDetail', params: { id: TCapsule.id }, query : {initialPosition : 'center'}}">
            {{ TCapsule.title }}
          </router-link>
          <router-link v-else :to="{ name: 'checkTDetail', params: { id: TCapsule.id }}">
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
import { computed, onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosInstance';

const route = useRoute();

const selected = ref('');

const typedText = ref('전송한 캡슐의 상태를 확인할 수 있는 곳 ! ! ! ');
const initialPosition = route.query.initialPosition; // 초기 위치

const sendGCapsuleLists = ref([]);
const sendTCapsuleLists = ref([]);

const navigateTo = (route) => {
  window.location.href = route;
};
const goBack = () => {
  navigateTo(`/main/`);
};

//필터링
const filteredGCapsules = computed(() => {
  if (selected.value === 'option1' || selected.value === '') {
    return sendGCapsuleLists.value;
  }
  return [];
});
const filteredTCapsules = computed(() => {
  if (selected.value === 'option2' || selected.value === '') {
    return sendTCapsuleLists.value;
  }
  return [];
});

const SendCapsuleData = () => {
  axiosInstance.get(`https://www.3idiots.xyz:3000/other/capsules/`)
  .then(response => {
    console.log(response);
    sendGCapsuleLists.value = response.data.gCapsules.map(capsule => {
      const sendGCapsules = ((capsule.nowCount / capsule.goalCount) * 100).toFixed(1);
        return {
        ...capsule,
        sendGCapsules: sendGCapsules,
      };
    });
    sendTCapsuleLists.value = response.data.tCapsules.map(sendTCapsule => { return sendTCapsule});
  })
  .catch(error => {
    console.error('error',error);
  })
};

onMounted(SendCapsuleData);
</script>

<style scoped>
  @keyframes reveal {
    0% {
      visibility: hidden;
    }
    100% {
      visibility: visible;
    }
  }

@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
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
  width: 100px;
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
.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 20px;
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

.border-box {
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
</style>