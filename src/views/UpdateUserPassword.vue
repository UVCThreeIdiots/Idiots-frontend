<template>
  <div class="container">
    <div class="top">
      <img class="obakuser" src="../components/images/prof_oh.png">
      <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
      </span>
    </div>

    <div class="middle">
      
    </div>

    <div class="bottom">
      <button class="btn-style">뒤로가기</button>
      <button class="btn-style">수정완료</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const typedText = ref('강력한 암호를 입력해주렴 ! ! !');


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

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
  font-size: 24px;
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
}


.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
}

.obakuser {
  width: 100px;
}

.container {
  font-family: 'CustomFont', Arial, sans-serif;
  width: 900px;
  height: 680px;
  border: 2px solid black;
  background-color: white;
  box-shadow: 4px 4px 0 0 #888, 8px 8px 0 0 #aaa;
  border-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.top{
  flex: 0.2;
  border: 2px solid #000;
  border-radius: 15px;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.middle{
  flex: 0.7;
  border: 2px solid #000;
  border-radius: 15px;
  height: 300px;
  margin: 16px 0 0 0;
}

.bottom{
  flex: 0.15;
  /* border: 2px solid #000;
  border-radius: 15px; */
  height: 300px;
  display: flex;
  justify-content: space-between;
}

.btn-style {
  padding: 10px 20px;
  border: 2px solid #000;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  margin: 8px 16px 8px 16px;
}

</style>
