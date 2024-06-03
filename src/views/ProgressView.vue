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
    <div class="parent">
      <div class="child" v-for="capsule in capsuleName" :key=capsule>
        <img class="capsule" src="../components/images/capsule.gif">
        <div>
          <a href="/encyclopedia" class="capsule-name">{{ capsule }}</a>
        </div>
      </div>
    </div>
    <div class="button-container">
      <button @click="navigateTo('/main')">뒤로가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const typedText = ref('여긴 진척도 확인하는 곳! ');

const capsuleName = ref(['책읽기', '프로그래밍', '운동', '강의듣기', '물마시기', '씻기', '밥먹기', '잠자기']);

const navigateTo = (route) => {
  window.location.href = route;
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

.capsule-name {
  font-family: 'CustomFont';
  font-size: 20px;
  font-weight: bold;
  color: #000;
}
.capsule-list {
  height: 200px;
  width: 200px;
  border: 2px solid #000;
  border-radius: 15px;
  position: absolute;
  text-align: center;
} .capsule {
  width: 100px;
  height: 100px;
}

.parent {
  margin: 1px;
  padding: 10px;
  text-align: justify;
  height: 70%;
  width: 97%;
  overflow: auto;
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

.list-box {
  width: 95%;
  height: 75%;
  border: 2px solid black;
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
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

.input-container {
  display: flex;
  justify-content: space-between;
  margin: 10px 0;
  margin-left: 100px;
  margin-right: 100px;
}

.input-container div {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.input-container label {
  margin-right: 10px;
  font-size: 24px;
  color: black;
}

.input-container input {
  align-items: middle;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
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
