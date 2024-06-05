<template>
  <div class="container">
    <div class="top">
      <img class="obakuser" src="../components/images/prof_oh.png">
      <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
      </span>
    </div>

    <div class="middle">
      <div class="input-container">
        <label for="email">변경할 이메일 :</label>
        <input type="text" id="newEmail" v-model="newEmail" class="custom-input">
        <div>
          <p v-if="newEmail.length <1" class="warn">변경할 이메일을 작성해주세요!</p>
          <p v-else-if="!isValidEmail" class="warn">잘못된 이메일 형식입니다!</p>
        </div>
      </div>
    </div>

    <div class="bottom">
      <button class="btn-style" @click="goBack">뒤로가기</button>
      <button class="btn-style" @click="updateEmail">변경하기</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { computed, ref } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const newEmail = ref('');

const typedText = ref('사용하고있는 이메일로 변경해주렴 ! ! !');

const isValidEmail = computed(()=>{
  if (newEmail.value.length <1) return false;
  const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return regex.test(newEmail.value);
})

const useStore = useUserStore();
const userId = ref(useStore.getUser().id);

const navigateTo = (route) => {
  window.location.href = route;
};

const goBack = () => {
  navigateTo(`/updateuserinfo/${userId.value}`);
};

const updateEmail = () => {
  const saveData = {
    email: newEmail.value,
  };

  axios.put(`http://localhost:3000/user/${userId.value}`, JSON.stringify(saveData), {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if(response.status == 200) {
      console.log('이메일 변경 성공');
    }
  }).catch((error) => {
    console.log('이메일 변경 실패', error);
  });
}



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

.input-container {
  display: flex;
  flex-direction: row;
  margin-left: 30px;
  align-items: center;
}

.input-container div {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.input-container input {
  align-items: middle;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  margin-right: 16px;
}

label {
  width:200px;
  font-size: 24px;
  color: black;
}

.custom-input{
  width:250px;
}

.warn{
  color : red;
  font-size : 18px;
}

</style>
