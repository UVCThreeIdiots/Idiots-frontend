<template>
  <div id="dummy" class="container">
    <img class="img" src="../components/images/prof_oh.png">
    <div class="border-box">
      <p class="npc">
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.075) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="input-container">
        <div>
          <label for="email">EMAIL :</label>
          <input type="text" id="email" v-model="email" class="custom-input">
          <p v-if="email.length < 1" class="warn">이메일은 공백으로 사용할 수 없습니다!</p>
          <p v-else-if="!isValidEmail" class="warn">잘못된 이메일 형식입니다!</p>
        </div>
      </div>
      <div class="button-container">
        <button @click="navigateTo('/')">초기 화면</button>
        <button @click="findUserId">아이디 찾기</button>
        <button @click="resetPassword">비밀번호 재설정</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosInstance from '@/config/axiosInstance';
import { ref, computed } from 'vue';

const email = ref('');
const typedText = ref('아이디를 찾고싶니? 비밀번호를 찾고싶니?');
const currentStep = ref(0);

const navigateTo = (route) => {
  window.location.href = route;
};

const isValidEmail = computed(() => {
  if (email.value.length < 1) return false;
  const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return regex.test(email.value);
});

const findUserId = () => {
  if (!isValidEmail.value) {
    alert('유효한 이메일을 입력하세요.');
    return;
  }

  const saveData = { email: email.value };

  axiosInstance.post("http://13.125.169.9:80/auth/find/id", saveData, {
    headers: { "Content-Type": "application/json" },
  })
  .then((res) => {
    alert('이메일로 전송되었습니다.');
  })
  .catch((error) => {
    console.error(error);
    alert('아이디 찾기 요청에 실패했습니다.');
  });
};

const resetPassword = () => {
  if (!isValidEmail.value) {
    alert('유효한 이메일을 입력하세요.');
    return;
  }

  const saveData = { email: email.value };

  axiosInstance.post("http://13.125.169.9:80/auth/forgot-password", saveData, {
    headers: { "Content-Type": "application/json" },
  })
  .then((res) => {
    alert('비밀번호 재설정 이메일이 발송되었습니다.');
  })
  .catch((error) => {
    console.error(error);
    alert('비밀번호 재설정 요청에 실패했습니다.');
  });
};
</script>

<style scoped>
/* 폰트 관련 */
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
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
/* 바디 */
body {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width : 100vh;
  margin: 0;
}
/* 최외각 프레임 */
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

/* 이미지 부분 */
.img {
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
label {
  width:100px;
  font-size: 24px;
  color: black;
  margin-left : 50px;
}
.npc {
  margin-top: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  width: 100%;
  height: 100px;
  padding-top: 10px;
  font-size: 24px;
  margin-left: 30px;
  color: black;
}
.warn
{
  color : red;
  font-size : 18px;
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
.checkbox{
  width:20px;
  height: 20px;
}
button:disabled {
  background-color: #f0f0f0;
  color: grey; /* 비활성화 상태 버튼의 글자색 */
  cursor: not-allowed; /* 커서 모양 */
  opacity: 0.6; /* 불투명도 */
}
.custom-input{
  width:250px;
}

</style>
