<template>
  <div id="dummy" class="container">
    <img class="obakuser" src="../components/images/prof_oh.png">
    <div class="border-box">
      <p>
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.1) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="input-container">
        <div v-if="currentStep === 0">
          <label for="id">ID :</label>
          <input type="text" id="id" v-model="userId" class="custom-input">
        </div>
        <div v-if="currentStep === 1">
          <label for="pw">PW :</label>
          <input type="password" id="pw" v-model="password" class="custom-input">
        </div>
        <div v-if="currentStep === 2">
          <label for="name">NAME :</label>
          <input type="text" id="name" v-model="name" class="custom-input">
        </div>
        <div v-if="currentStep === 3">
          <label for="age">AGE :</label>
          <input type="text" id="age" v-model="age" class="custom-input">
        </div>
        <div v-if="currentStep === 4">
          <label for="email">EMAIL :</label>
          <input type="text" id="email" v-model="email" class="custom-input">
        </div>
      </div>
      <div class="button-container">
        <button v-if="currentStep === 4" @click="openModal">등록</button>
        <button v-else @click="nextStep">다음</button>
        <button :disabled="currentStep < 1" @click="beforeStep">이전</button>
        <button @click="navigateTo('/')">초기 화면</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>회원가입 정보 확인</h2>
        <p>ID: {{ userId }}</p>
        <p>PW: {{ password }}</p>
        <p>NAME: {{ name }}</p>
        <p>AGE: {{ age }}</p>
        <p>EMAIL: {{ email }}</p>
        <p>해당 유저정보로 가입하시겠습니까?</p>
        <button @click="signupSubmit">확인</button>
        <button @click="closeModal">취소</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const name = ref('');
const age = ref('');
const userId = ref('');
const password = ref('');
const email = ref('');
let currentStep = ref(0);
const showModal = ref(false);
const stepsInfo = [
  { label: '아이디 :', model: userId },
  { label: '비밀번호 :', model: password },
  { label: '이름 :', model: name },
  { label: '나이 :', model: age },
  { label: '이메일 :', model: email }
];
const typedText = ref('시작에 앞서, 너에 대해 알려다오!\n아이디는 무엇으로 할까?');

const navigateTo = (route) => {
  window.location.href = route;
};

const nextStep = () => {
  if (currentStep.value < stepsInfo.length - 1) {
    currentStep.value++;
    if (currentStep.value <= 0)
      typedText.value = '시작에 앞서, 너에 대해 알려다오!\n아이디는 무엇으로 할까?';
    else if (currentStep.value === 1)
      typedText.value = '그렇다면 비밀번호는 무엇으로 할까?';
    else if (currentStep.value === 2)
      typedText.value = '그렇다면 너의 이름을 알려다오!\n(주의 : 페이지 내에서 해당 이름이 사용됩니다.)';
    else if (currentStep.value === 3)
      typedText.value = '이번에는 나이를 알려다오!';
    else if (currentStep.value === 4)
      typedText.value = '마지막으로 이메일을 알려다오!\n(주의 : 아이디/비밀번호 찾기 및 알림 전송에 사용됩니다.)';
  }
};

const beforeStep = () => {
  currentStep.value -= 2;
  nextStep();
};

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

const signupSubmit = () => {
  const saveData = {
    name: name.value,
    age: age.value,
    userId: userId.value,
    password: password.value,
    email: email.value,
  };

  axios.post("http://13.125.169.9:3000/user", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    if (res.status === 200) {
      // 유저 정보 등록 성공시 처리해줘야할 부분
      navigateTo('/');
      console.log("등록 성공");
    }
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

.id-pw {
  width: 40px;
}

body {
  background-color: #ffffff;
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

.input-container {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
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
</style>
