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
        <label for="Name">변경할 이름 :</label>
        <input type="text" id="newName" v-model="newName" class="custom-input" placeholder="새로운 이름을 작성해주세요.">
      </div>
      <div class="comment">
        <p v-if="newName.length <1" class="warn">이름은 공백으로 사용할 수 없습니다!</p>
        <p v-else-if="!isValidName" class="warn">이름은 한글, 영문 및 숫자를 사용해야합니다!!</p>
      </div>
    </div>

    <div class="bottom">
      <button class="btn-style" @click="goBack">뒤로가기</button>
      <button class="btn-style" @click="updateName" :disabled="!isValidName">변경하기</button>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { computed, ref } from 'vue';
import axiosInstance from '@/config/axiosInstance';
import { useRoute } from 'vue-router';
const route = useRoute();
const initialPosition = route.query.initialPosition;

const newName = ref('');

const typedText = ref('너의 새로운 이름이 궁금하구나 ! ! !');

const isValidName = computed(()=>{
  if (newName.value.length <1) return false;
  const regex = /^[가-힣a-zA-Z0-9]*$/;
  return regex.test(newName.value);
})

const useStore = useUserStore();
const userName = ref(useStore.getUser().name);

const navigateTo = (route) => {
  window.location.href = route;
};

const goBack = () => {
  if (initialPosition === 'home'){
    navigateTo(`/updateuserinfo/?initialPosition=home`);
  } else navigateTo(`/updateuserinfo/`);
};

const updateName = () => {
  const saveData = {
    name: newName.value,
  };

  if ( saveData.name === userName.value ) {
    alert('변경할 이름과 현재 이름이 같습니다.');
    return;
  }
  axiosInstance.put(`http://localhost:3000/user/`, JSON.stringify(saveData), {
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((response) => {
    if(response.status == 200) {
      axiosInstance.get(`http://localhost:3000/user/`, JSON.stringify(response), {
        headers: {
          "Content-Type": "application/json"
        }
      }).then((response) => {
          const userData = response.data;
          const loginedId = userData.id;
          const loginUserId = userData.userId
          const loginedName = userData.name;
          const loginedRole = userData.role;
          useStore.setUser(loginedId, loginUserId, loginedName, loginedRole);
          alert('이름이 성공적으로 변경되었습니다.');
          if (initialPosition === 'home'){
            navigateTo(`/maingameview/${loginedId}?initialPosition=userinfo`)
          } else navigateTo(`/main/`);
      })
    }
  }).catch((error) => {
    console.log('이름 변경 실패', error);
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

.comment{
  /* border: 2px solid #000; */
  margin-top: 20px;
  height: 20px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  width: 340px;
}

label {
  width: 170px;
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
