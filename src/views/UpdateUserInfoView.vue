<template>
  <div id="main" class="container">
    <img class="obakuser" src="../components/images/prof_oh.png">
    <div class="border-box">
      <p class="top-comment">
        <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div>
        <div class="link-container">
          <div class = "left-container">
            <a @mouseover="showLink1 = true" @mouseleave="showLink1 = false" @click="UpdateUserEmail">
              <span v-if="showLink1">▶</span><span v-else></span>&nbsp;등록된 이메일을 변경한다.</a>
            <a a @mouseover="showLink2 = true" @mouseleave="showLink2 = false" @click="UpdateUserPassword">
              <span v-if="showLink2">▶</span><span v-else></span>&nbsp;새로운 비밀번호로 변경한다.</a>
            <a @mouseover="showLink3 = true" @mouseleave="showLink3 = false" @click="UpdateUserName">
              <span v-if="showLink3">▶</span><span v-else></span>&nbsp;등록된 이름을 변경한다.</a>
          </div>
        
        <div class = "right-container">
            <a @mouseover="showLink6 = true" @mouseleave="showLink6 = false" @click="openUpdateUserMode">
              <span v-if="showLink6">▶</span><span v-else></span>&nbsp;메인화면 모드를 변경한다.</a>
            <a @mouseover="showLink5 = true" @mouseleave="showLink5 = false" @click="openDeleteAccountModal">
              <span v-if="showLink5">▶</span><span v-else></span>&nbsp;탈퇴한다.</a>
            <a @mouseover="showLink4 = true" @mouseleave="showLink4 = false" @click="goBack">
              <span v-if="showLink4">▶</span><span v-else></span>&nbsp;돌아간다.</a>
            </div>
        </div>
      </div>
    </div>
    <div v-if="showDeleteCheck" class="modal-overlay">
      <div class="modal-content delete">
        <h2>탈퇴 확인</h2>
        <p class="warn">탈퇴하시겠습니까?</p>
        <div class="delete-button-box">
        <button @click="closeDeleteAccountModal">취소</button>
        <button @click="DeleteAccount">확인</button>
      </div>
      </div>
    </div>
    <div v-if="showModeCheck" class="modal-overlay">
      <div class="modal-content delete">
        <h2>모드 변경</h2>
        <p v-if="userMode==='normal'" class="warn">게임모드로 변경하시겠습니까?</p>
        <p v-else class="warn">일반모드로 변경하시겠습니까?</p>
        <div class="delete-button-box">
        <button @click="closeModeModal">취소</button>
        <button @click="changeMode">확인</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosInstance';

const useStore = useUserStore();
const showLink1 = ref(false);
const showLink2 = ref(false);
const showLink3 = ref(false);
const showLink4 = ref(false);
const showLink5 = ref(false);
const showLink6 = ref(false);
const showDeleteCheck = ref(false);
const showModeCheck = ref(false);
const userName = ref(useStore.getUser().name);
const userMode = ref(useStore.getUser().mode);
const typedText = `${userName.value}은(는) 어떤 정보를 바꿀까?`;
const route = useRoute();
const initialPosition = route.query.initialPosition; // 초기 위치

const navigateTo = (route) => {
  window.location.href = route;
};

const UpdateUserEmail = () => {
  if (initialPosition === 'home'){
    navigateTo(`/UpdateUserEmail/?initialPosition=home`);
  } else navigateTo(`/UpdateUserEmail/`);
};

const UpdateUserPassword = () => {
  if (initialPosition === 'home'){
    navigateTo(`/UpdateUserPassword/?initialPosition=home`);
  } else navigateTo(`/UpdateUserPassword/`);
};

const UpdateUserName = () => {
  if (initialPosition === 'home'){
    navigateTo(`/UpdateUserName/?initialPosition=home`);
  }
  else navigateTo(`/UpdateUserName/`);
}

const DeleteAccount = () => {
  axiosInstance.delete('http://13.125.169.9:80/user/', {
    'Content-Type': 'application/json',
  }).then((response) => {
    console.log(response);
    useStore.logout();
    navigateTo('/');
  }).catch((error) => {
    console.log('탈퇴 실패', error);
  });
}

const goBack = () => {
  if (initialPosition === 'home'){
    console.log('hi');
    navigateTo(`/maingameview/?initialPosition=userinfo`);
  } else navigateTo(`/main/`);
};

const openDeleteAccountModal = () => {
  showDeleteCheck.value = true;
}
const closeDeleteAccountModal = () => {
  showDeleteCheck.value = false;
}
const closeModeModal = () => {
  showModeCheck.value = false;
}
const openUpdateUserMode = () => {
  showModeCheck.value = true;
}

const changeMode = () => {
  const newMode = ref('');
  if (userMode.value === 'normal'){newMode.value = 'game'}
  else {newMode.value = 'normal'}
  const saveData = {
    mode: newMode.value,
  };

  console.log(saveData);

  axiosInstance.put(`http://13.125.169.9:80/user/`, JSON.stringify(saveData),{
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(() => {
    axiosInstance.post(`http://13.125.169.9:80/auth/logout/`)
      .then(response => {
        console.log(response.data);
        useStore.logout();
        navigateTo('/');
      })
      .catch(error => {
        console.log(error);
      })
  })
  .catch((error) => {
    console.error(error);
  });
};
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

.top-comment {
  padding: 8px;
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
    justify-content: space-between;
    flex-wrap: nowrap;
    margin: 10px 0;
    font-size: 24px;
    flex-direction: row;
}
.link-container div {
  flex-basis: 30%; /* Each column takes up 30% of the container */
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center items horizontally */
}

.link-container div a{
  color : black;
  width : 370px;
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
  /* margin-left: 30px; */
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}

.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 8px;
  border-radius: 15px;
}
.disabled {
  pointer-events: none; /* Disable click */
  color: grey; /* Optional: Change color to indicate disabled state */
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 600px;
  height: 450px;
  color: black; /* Set text color to black */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal-content a {
  margin-bottom: 5px; /* Reduce gap between paragraphs */
  font-size: 20px;
  color: black; /* Ensure paragraph color is black */
  width: 100%;
  height: 50px;
}

.modal-content button {
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  margin: 10px;
  color: black; /* Ensure button text color is black */
}
.modal-content h2 {
  margin-bottom: 11px;
  /* border: 2px solid black; */
  padding: 16px;
}
.warn{
  color:red;
  font-size: 20px;
  padding: 16px;
}
.delete-button-box{
  display:flex;
  flex-direction:row;
}
.modal-content.delete{
  width : 400px;
  height : 300px;  
}
</style>
