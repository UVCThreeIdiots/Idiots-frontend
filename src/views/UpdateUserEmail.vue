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
        <button @click="isRealEmail" :disabled="!isValidEmail">중복검사</button>
      </div>
      <div class="comment">
          <p v-if="newEmail.length <1" class="warn">변경할 이메일을 작성해주세요!</p>
          <p v-else-if="!isValidEmail" class="warn">잘못된 이메일 형식입니다!</p>
        </div>
    </div>

    <div class="bottom">
      <button class="btn-style" @click="goBack">뒤로가기</button>
      <button class="btn-style" @click="updateEmail" :disabled="emailCheck == false">변경하기</button>
    </div>

    <div v-if="showModalEmail" class="modal-overlay">
      <div class="modal-content">
        <h2>유효 이메일 확인</h2>
        <p>{{ newEmail }}로 인증문자가 포함된 메일을 발송했습니다.</p>
        <p>인증문자를 확인 후 아래에 입력해 주세요.</p>
        <input type="text" v-model="emailKey"/>
        <button @click="checkKey" style="width: 80px; height: 30px; font-size: 16px;">확인</button>
        <p v-if="isCheckKey">유효한 이메일입니다.</p>
        <p v-else class="warn">잘못된 인증문자 입니다.</p> 
        <button @click="closeModalEmail">취소</button>
        <button @click="closeModalEmailwithSuccess" :disabled="!isCheckKey">{{ timerText }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { computed, onBeforeUnmount, ref } from 'vue';
import axiosInstance from '@/config/axiosInstance';
import { useRoute } from 'vue-router';
import axios from 'axios';
const route = useRoute();
const initialPosition = route.query.initialPosition;

const emailKey = ref('');
const isCheckKey = ref(false);
const newEmail = ref('');
const showModalEmail = ref(false);
const emailMent = ref(0);
const emailCheck = ref(false);
const timer = ref(60);
const timerText = ref(`확인 (1:00)`);
const isTimerRunning = ref(false);
const emailChecked = ref(false);
let interval = null;


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
  if (initialPosition === 'home') {
    navigateTo(`/updateuserinfo/?initialPosition=home`);
  }else navigateTo(`/updateuserinfo/`);
};



const openModalEmail = () => {
  showModalEmail.value = true;
}

const closeModalEmail = () => {
  showModalEmail.value = false;
  isTimerRunning.value = false;
  clearInterval(interval);
};

const closeModalEmailwithSuccess = () => {
  showModalEmail.value = false;
  emailChecked.value = true;
  isTimerRunning.value = false;
  clearInterval(interval);
};

const startTimer = () => {
  if (!isTimerRunning.value) {
    timer.value = 60; // Reset the timer
    isTimerRunning.value = true;
    timerText.value = `확인 (1:00)`;
    interval = setInterval(updateTimer, 1000);
  }
};

const updateTimer = () => {
  console.log(timer.value)
  if (timer.value > 0) {
    timer.value -= 1;
    const minutes = Math.floor(timer.value / 60);
    const seconds = timer.value % 60;
    timerText.value = `확인 (${minutes}:${seconds < 10 ? '0' : ''}${seconds})`;
  } else {
    // Disable the confirmation button if time runs out
    isCheckKey.value = false;
    timerText.value = '시간 초과';
  }
};

const isRealEmail = () => {

const saveData = {
  email: newEmail.value,
};

axios.post("http://localhost:3000/auth/email", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    console.log(res.data);
    console.log(typeof res.data);
    if (res.data === 'true') { 
      openModalEmail();
      emailMent.value = 1;
      emailCheck.value = true;
      startTimer();
      console.log("사용 가능 이메일");
    } else {
      emailMent.value = 2;
      emailCheck.value = false;
      alert("이미 사용중인 이메일 입니다.");
      console.log("이미 사용중인 이메일");
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

const checkKey = () => {
  const saveData = {
    email: newEmail.value,
    code : emailKey.value,
  };

  axios.post("http://localhost:3000/auth/code", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    console.log(res.data);
    console.log(typeof res.data);
    if (res.data === 'true') { 
      isCheckKey.value = true;
      console.log("인증문자 성공");
    } else {
      isCheckKey.value = false;
      console.log("인증문자 실패");
    }
  })
  .catch((error) => {
    console.error(error);
    console.log(newEmail.value);
  });
};

const updateEmail = () => {
  const saveData = {
    email: newEmail.value,
  };
    axiosInstance.put(`http://localhost:3000/user/`, JSON.stringify(saveData), {
      headers: {
        'Content-Type': 'application/json',
      },
      }).then((response) => {
        if(response.status == 200) {
          console.log('이메일 변경 성공');
          alert('이메일이 성공적으로 변경되었습니다.');
          if (initialPosition === 'home'){
            navigateTo(`/maingameview/?initialPosition=userinfo`);
          }else navigateTo(`/main/`)
        }
      }).catch((error) => {
        alert('이미 등록된 메일이 존재합니다.');
        console.log('이메일 변경 실패', error);
      });
    }

onBeforeUnmount(() => {
  clearInterval(interval);
});
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
  height: 500px;
  color: black; /* Set text color to black */
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: black; /* Ensure heading color is black */
}

.modal-content p {
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

.comment {
  margin-top: 20px;
  height: 20px;
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
