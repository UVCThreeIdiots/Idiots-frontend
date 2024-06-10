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
  
    <div class="board">
      <div class="left-board">
        <div class="capsule">
          <img src="../components/images/capsule.gif">
        </div>
        <div class="capsule"> 
          <p>{{ capsuleDetail.title }}</p>
        </div>
      </div>

      <div class="right-board">
        <div class="inner-board">
          <div class="title">
            <p>제목 : {{capsuleDetail.title}}</p>
          </div>
          <div class="content">
            <p>{{capsuleDetail.body}}</p>
          </div>
        </div>
      </div>
    
  </div>
  <div class="button-container">
      <button @click="goBack">뒤로가기</button>
    </div>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const typedText = ref('캡슐에 대해서 궁금하구나 ! ! !');
const capsuleDetail = ref([]);
const useStore = useUserStore();
const userId = ref(useStore.getUser().id);




const GCapsuleDetails = () => {
  const capsuleId = route.params.id;
  axios.get(`http://localhost:3000/time/TCapsule/${capsuleId}`)
  .then(response => {
    console.log(response.data);
    capsuleDetail.value = response.data;
    
  })
  .catch(error => {
    console.error(error);
  })
}

const navigateTo = (route) => {
  window.location.href = route;
};

const goBack = () => {
  navigateTo(`/complete/${userId.value}`);
};

onMounted(GCapsuleDetails);
</script>

<style scoped>
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

.title {
  font-size: 1.5em;
  font-weight: bold;
  color: #333;
  margin-bottom: 15px;
  border-bottom: 2px solid #eee;
  padding-bottom: 10px;
}

.title p {
  display: flex;
  margin: 8px 8px 0px 16px;
}

.content {
    /* border: 2px solid #eee; */
    font-size: 1.2em;
    line-height: 1.6;
    color: #666;
    margin-top: 10px;
    display: flex;
    padding-left: 16px;
}

.progress {
  display: flex;
  width: 75%;
}

.check-btn {
  display: flex;
}

.check-btn button {
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  /* font-size: 10px; */
  width: 85px;
  height: 32px;
}

.button-container {
  display: flex;
  /* justify-content: space-around; */
  margin-top: 24px;
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

.border-box {
  border: 2px solid black;
  border-radius: 15px;
}

.obakuser {
  width: 100px;
}

.obakuser-text {
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
  margin-left: 30px;
}

.board {
  display: flex;
  width: 100%;
  height: 65%;
  margin: 0 auto;
  text-align: center;
}

.left-board {
  flex: 1;
  /* border: 2px solid #000; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 15px;
}

.left-board img {
  width: 100px;
  height: 100px;
}

.left-board .capsule {
  border: 2px solid #000;
  border-radius: 15px;
  height: 50%;
  width: 100%;
  margin-top: 10px;
  font-size: 20px;
  color: black;
  align-content: center;
}

.right-board {
  /* border: 2px solid #000; */
  padding: 10px;
  flex: 2;
  background-color: #fff;
  
}

.right-board .inner-board {
  display: flex;
  flex-direction: column;
  border: 2px solid #000;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  margin-top: 10px;
}

.right-board .inner-board .board-top {
  flex: 1;
  /* border: 2px solid #000; */
  border-radius: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 16px;
}

.right-board .inner-board .board-bottom {
  flex: 2;
  /* border: 2px solid #000; */
  border-radius: 15px;
  width: 100%;
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}

.capsule-name {
  border: 2px solid #000;
  margin: 16px 10px;
  display: flex;
  align-items: center;
  width: 100%;
}

.capsule-name p {
  font-size: 16px;
  /* width: 20%; */
  margin: 8px 0px 8px 8px;
}

.progress-bar-container {
  width: 50%;
  background-color: #e0e0e0;
  overflow: hidden;
  height: 16px;
  margin: 16px 8px;
}

.text-box {
  display: flex;
    /* justify-content: center; */
    align-items: center;
    /* margin-top: 20px; */
    /* margin-bottom: 20px;*/
}

.progress-bar {
  height: 100%;
  background-color: #000;
  width: 0;
  transition: width 1.5s ease-in-out;
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
  display: flex;
  border: 2px solid black;
  padding: 5px;
  border-radius: 15px;
}
.obakuser-text {
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
  margin-left: 30px;
}
</style>