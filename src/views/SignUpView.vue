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
        <div v-if="currentStep === 0">
          <label for="id">ID :</label>
          <input type="text" id="id" v-model="userId" class="custom-input">
          <p v-if="userId.length <1" class="warn">아이디는 공백으로 사용할 수 없습니다!</p>
          <p v-else-if="userId.length >=1 && userId.length <4" class="warn">ID는 최소 4자리를 사용해야 합니다!</p>
          <p v-else-if="!isValidUserId" class="warn">아이디는 영문 및 숫자를 사용해야 합니다!</p>
          <p v-else-if="canUseUserIdforMent===2" class="warn">이미 사용중인 아이디입니다!</p>
          <p v-else-if="canUseUserIdforMent===1" class="warn">사용가능한 아이디입니다!</p>
          <p v-else-if="canUseUserIdforMent===0" class="warn"></p>

        </div>
        <div v-if="currentStep === 1">
          <label for="pw">PW :</label>
          <input type="password" id="pw" v-model="password" class="custom-input">
          <p v-if="!isValidPassword" class="warn">비밀번호는 4자리 이상 설정해야 합니다!</p>
        </div>
        <div v-if="currentStep === 2">
          <label for="name">NAME :</label>
          <input type="text" id="name" v-model="name" class="custom-input">
          <p v-if="name.length <1" class="warn">이름은 공백으로 사용할 수 없습니다!</p>
          <p v-else-if="!isValidName" class="warn">이름은 한글, 영문 및 숫자를 사용해야합니다!</p>
        </div>
        <div v-if="currentStep === 3">
          <label for="age">AGE :</label>
          <input type="text" id="age" v-model="age" class="custom-input">
          <p v-if="age.length <1" class="warn">나이는 공백으로 사용할 수 없습니다!</p>
          <p v-else-if="age < 1" class="warn">나이는 0보다 커야 합니다!</p>
          <p v-else-if="!isValidAge" class="warn">나이는 숫자를 사용해야합니다!</p>
        </div>
        <div v-if="currentStep === 4">
          <label for="email">EMAIL :</label>
          <input type="text" id="email" v-model="email" class="custom-input">
          <p v-if="email.length <1" class="warn">이메일은 공백으로 사용할 수 없습니다!</p>
          <p v-else-if="!isValidEmail" class="warn">잘못된 이메일 형식입니다!</p>
        </div>
      </div>
      <div class="button-container">
        <button @click="navigateTo('/')">초기 화면</button>
        <button v-if="currentStep < 4" :disabled="currentStep != 0" @click="isUsedUserId">중복검사</button>
        <button v-else @click="openModalEmail">e중복검사</button>
        <button :disabled="currentStep < 1" @click="beforeStep">이전</button>
        <button v-if="currentStep === 4" @click="openModal" :disabled="!isValidEmail || !emailChecked">등록</button>
        <button v-else @click="nextStep" :disabled="(currentStep <=0 && (!isValidUserId || canUseUserIdforMent != 1))|| (currentStep === 1 && !isValidPassword) ||(currentStep === 2 && !isValidName) ||(currentStep === 3 && !isValidAge)">다음</button>
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
        <p>해당 유저정보로 가입하시겠습니까?  YES:<input v-model="isChecked" type="checkbox" class="checkbox"/></p>
        
        <button @click="closeModal">취소</button>
        <button @click="signupSubmit" :disabled="!isChecked">확인</button>
      </div>
    </div>
    <div v-if="showModalEmail" class="modal-overlay">
      <div class="modal-content">
        <h2>유효 이메일 확인</h2>
        <p>{{ email }}로 인증문자가 포함된 메일을 발송했습니다.</p>
        <p>인증문자를 확인 후 아래에 입력해 주세요.</p>
        <input type="text" v-model="emailKey"/>
        <button @click="checkKey"></button>
        <p v-if="isCheckKey">유효한 이메일입니다.</p>
        <p v-else>잘못된 인증문자 입니다.</p> 
        <button @click="closeModalEmail">취소</button>
        <button @click="closeModalEmailwithSuccess" :disabled="!isCheckKey">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const name = ref('');
const age = ref('');
const userId = ref('');
const password = ref('');
const email = ref('');
const emailKey = ref('');
let currentStep = ref(0);
const emailMent = ref(0);
const isChecked = ref(false);
const showModal = ref(false);
const showModalEmail = ref(false);
const emailChecked = ref(false);
const isCheckKey = ref(false);
const stepsInfo = [
  { label: '아이디 :', model: userId },
  { label: '비밀번호 :', model: password },
  { label: '이름 :', model: name },
  { label: '나이 :', model: age },
  { label: '이메일 :', model: email }
];
const typedText = ref('시작에 앞서, 너에 대해 알려다오! 아이디는 무엇으로 할까?\n아이디는 영어/숫자의 조합으로 작성하렴!');

const navigateTo = (route) => {
  window.location.href = route;
};

const nextStep = () => {
  if (currentStep.value < stepsInfo.length - 1) {
    currentStep.value++;
    if (currentStep.value <= 0)
      typedText.value = '시작에 앞서, 너에 대해 알려다오! 아이디는 무엇으로 할까?';
    else if (currentStep.value === 1)
      typedText.value = '그렇다면 비밀번호는 무엇으로 할까?\n비밀번호는 4자리 이상 설정하렴!';
    else if (currentStep.value === 2)
      typedText.value = '그렇다면 너의 이름을 알려다오!\n(주의 : 페이지 내에서 해당 이름이 사용됩니다.)';
    else if (currentStep.value === 3)
      typedText.value = '이번에는 나이를 알려다오!';
    else if (currentStep.value === 4)
      typedText.value = '마지막으로 이메일을 알려다오!\n(주의 : 아이디/비밀번호 찾기 및 알림 전송에 사용됩니다.)';
  }
};
// 유효성 검사
const isValidUserId = computed(()=>{
  if (userId.value.length < 1)return false;
  if (userId.value.length >=1 && userId.value.length <4) return false;
  const regex = /^[a-zA-Z0-9]*$/;
  return regex.test(userId.value);
});
const isValidPassword = computed(()=>{
  const minLen = 4;
  if (password.value.length < minLen) return false;
  else return true;
});
const isValidName = computed(()=>{
  if (name.value.length < 1) return false;
  const regex = /^[가-힣a-zA-Z0-9]*$/;
  return regex.test(name.value);
});
const isValidAge = computed(()=>{
  if (age.value.length <1) return false;
  if (age.value < 1) return false;
  const regex = /^[0-9]*$/;
  return regex.test(age.value);
});
const isValidEmail = computed(()=>{
  if (email.value.length <1) return false;
  const regex = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  return regex.test(email.value);
})

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

const openModalEmail = () => {
  isRealEmail();
}

const closeModalEmail = () => {
  showModalEmail.value = false;
};
const closeModalEmailwithSuccess = () => {
  showModalEmail.value = false;
  emailChecked.value = true;
};

const canUseUserId = ref(false);
const canUseUserIdforMent = ref(0);

const checkKey = () => {
  const saveData = {
    email: email.value,
    code : emailKey.value,
  };

  axios.post("http://localhost:3000/auth/code", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
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
  });
};

const isRealEmail = () => {
  const saveData = {
    email: email.value,
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
      console.log("사용 가능 이메일");
    } else {
      emailMent.value = 2;
      console.log("이미 사용중인 이메일");
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

const isUsedUserId = () => {
  const saveData = {
    userId: userId.value,
  };

  axios.post("http://localhost:3000/auth/duplicate", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    if (res.data === 'true') { 
      canUseUserId.value = true;
      canUseUserIdforMent.value = 1;
      console.log("사용 가능 아이디");
    } else {
      canUseUserId.value = false;
      canUseUserIdforMent.value = 2;
      console.log("이미 사용중인 아이디");
    }
  })
  .catch((error) => {
    console.error(error);
  });
};


const signupSubmit = () => {
  const saveData = {
    name: name.value,
    age: age.value,
    userId: userId.value,
    password: password.value,
    email: email.value,
  };

  axios.post("http://localhost:3000/user", JSON.stringify(saveData), {
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
