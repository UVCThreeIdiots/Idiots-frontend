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
          <p>책읽기</p>
        </div>
      </div>

      <div class="right-board">
        <div class="inner-board">
          <div class="board-top">
            <div class="capsule-name">
              <p>책읽기: {{ progress }}%</p>
            </div>
            <div class="progress">
              <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progress + '%' }" />
            </div>
            <div class="check-btn">
              <button @click="increaseProgress">달성</button>
              <button @click="decreaseProgress">미달성</button>
            </div>
            </div>
          </div>
          <div class="board-bottom">
            <p>달력과 같은 진척도 체크 사항 보여질곳</p>
          </div>
        </div>
      </div>    
    </div>
    <div class="button-container">
      <button @click="navigateTo('/progress')">뒤로가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const typedText = ref('캡슐에 대해서 궁금하구나 ! ! !');
const progress = ref(50); // 프로그래스 초기값, 0%로 설정

const navigateTo = (route) => {
  window.location.href = route;
};

const increaseProgress = () => {
  if (progress.value < 100) {
    progress.value += 10;
  }
};

const decreaseProgress = () => {
  if (progress.value > 0) {
    progress.value -= 10;
  }
};


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

.progress {
  display: flex;
  width: 75%;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
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
  flex: 2;
  /* border: 2px solid #000; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 15px;
  color: black;
  flex-direction: column; /* 세로 정렬을 위해 추가 */
}

.right-board .inner-board {
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
  margin: 16px 10px;
  font-size: 16px;
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