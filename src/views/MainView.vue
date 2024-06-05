<template>
  <div id="main" class="container">
    <img class="obakuser" src="../components/images/prof_oh.png">
    <div class="border-box">
      <p>
        <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.1) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="link-container">
        <div>
          <a @click="maketime"> ▶ 새로운 타임캡슐을 만든다 </a>
          <a @click="makegoal"> ▶ 새로운 골캡슐을 만든다 </a>
          <a @click="progress"> ▶ 도감/진척도를 확인한다 </a>
        </div>
        <div>
          <a @click="updateuserinfo"> ▶ 내 정보를 변경한다 </a>
          <a href="/"> ▶ 로그아웃</a>
          <a href="/developer"> ▶ 개발자 도구</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { ref } from 'vue';

const useStore = useUserStore();
const userName = ref(useStore.getUser().name);
const userId = ref(useStore.getUser().id);
const typedText = `${userName.value}는 무엇을 할까?`;
const navigateTo = (route) => {
  window.location.href = route;
};


const maketime = () => {
  navigateTo(`/maketime/${userId.value}`);
}
const makegoal = () => {
  navigateTo(`/makegoal/${userId.value}`);
}
const updateuserinfo = () => {
  navigateTo(`/updateuserinfo/${userId.value}`);
}
const progress = () => {
  navigateTo(`/progress/${userId.value}`);
}
</script>

<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}

.id-pw {
  width: 40px;
}

body {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
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
  width: 250px;
  height: 250px;
  display: block;
  margin: 0 auto 20px;
}

.link-container {
  display: flex;
  justify-content: space-between; /* Spread items evenly */
  flex-wrap: wrap; /* Allow items to wrap */
  margin: 10px 0;
  font-size : 24px;
}
.link-container div {
  flex-basis: 30%; /* Each column takes up 30% of the container */
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center items horizontally */
}

.link-container a{
  color : black;
  width : 340px;
  margin-left : 30px;
  margin-right: 30px;
  margin-bottom : 10px;
}


p {
  margin-top: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  width: 100%;
  height: 100px;
  padding-top: 10px;
  font-size: 24px;
  margin-left: 30px;
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}

@keyframes reveal {
  0% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}

.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
}
.disabled {
  pointer-events: none; /* Disable click */
  color: grey; /* Optional: Change color to indicate disabled state */
}
</style>
