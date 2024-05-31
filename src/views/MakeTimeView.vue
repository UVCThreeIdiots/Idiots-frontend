<template>
  <div id="dummy" class="container">
    <div class="border-box">
      <p>
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.1) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="settings">
        <div v-if="currentStep === 0">
          <label for="message"></label>
          <textarea type="text" id="message" v-model="message" class="custom-textarea"></textarea>
        </div>
        <div v-if="currentStep === 1">
          <label for="dueDate"></label>
          <div class="date-picker">
            <div v-for="(unit, index) in dateUnits" :key="index" class="date-unit">
              <button class="date-button" @click="incrementDateUnit(index)">▲</button>
              <div class="date-value">{{ unit }}</div>
              <button class="date-button" @click="decrementDateUnit(index)">▼</button>
            </div>
          </div>
        </div>
        <div v-if="currentStep === 2">
          <div class="loading">
            <label for="loading">Loading...</label>
            <img src="../components/images/loading.gif" class="loading-image"/>
          </div>
        </div>
        <div v-if="currentStep === 3">
          <label for="age">AGE :</label>
        </div>
      </div>
    </div>
    <div class="border-box">
      <div class="button-container">
        <button v-if="currentStep === 1" @click="openModal">등록</button>
        <button v-else @click="nextStep">다음</button>
        <button :disabled= "currentStep < 1" @click="beforeStep">이전</button>
        <button @click="navigateTo('/main')">메인 메뉴</button>
      </div>
    </div>

    <!-- Modal / 서버 연결 있어야함-->
    <!-- <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>To. 미래의 나</h2>
        <p>{{ message }}</p>
        <p>설정된 날짜: {{ formattedDate }}</p>
        <p>타임캡슐을 제작하시겠습니까?<br>주의 : 생성된 타임캡슐은 수정 삭제가 불가하며, 설정된 날짜까지 조회가 불가합니다.</p>
        <button @click="timecapsuleSubmit">확인</button>
        <button @click="closeModal">취소</button>
      </div>
    </div> -->

    <!-- Test용 Modal / 서버 연결 없이 다음 진행-->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>To. 미래의 나</h2>
        <p>{{ message }}</p>
        <p>설정된 날짜: {{ formattedDate }}</p>
        <p>타임캡슐을 제작하시겠습니까?<br>주의 : 생성된 타임캡슐은 수정 삭제가 불가하며, 설정된 날짜까지 조회가 불가합니다.</p>
        <button @click="testtimecapsulesubmit">확인</button>
        <button @click="closeModal">취소</button>
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
const message = ref('이곳에 내용을 입력하자!');
const typedText = ref('이곳에서는 새로운 타임캡슐을 만들 수 있단다!\n어떤 내용을 타임 캡슐에 담을까?');
const currentStep = ref(0);
const showModal = ref(false);
const dateUnits = ref(['Y', 'Y', 'Y', 'Y', 'M', 'M', 'D', 'D']);
const stepsInfo = [
  { label: '아이디 :', model: userId },
  { label: '비밀번호 :', model: password },
  { label: '이름 :', model: name },
  { label: '나이 :', model: age },
  { label: '이메일 :', model: email }
];


const nextStep = () => {
  if (currentStep.value < stepsInfo.length - 1) {
    currentStep.value++;
    if (currentStep.value <= 0)
      typedText.value = '이곳에서는 새로운 타임캡슐을 만들 수 있단다!\n어떤 내용을 타임 캡슐에 담을까?';
    else if (currentStep.value === 1)
      typedText.value = '그렇다면, 타임 캡슐을 언제 전달할까?';
    else if (currentStep.value === 2)
      typedText.value = '포켓몬들이 타임 캡슐을 땅속 깊숙히 묻고 있단다!';
    else if (currentStep.value === 3)
      typedText.value = `새로운 타임 캡슐이 성공적으로 저장되었단다.\n포켓몬들이 너의 타임 캡슐을 ${formattedDate.value}에 가져다 준단다! `;
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

const incrementDateUnit = (index) => {
  let unit = dateUnits.value[index];
  if (unit === 'Y' || unit === 'M' || unit === 'D') {
    dateUnits.value.splice(index, 1, '0');
  } else {
    dateUnits.value.splice(index, 1, String((parseInt(unit) + 1) % 10));
  }
};

const decrementDateUnit = (index) => {
  let unit = dateUnits.value[index];
  if (unit === 'Y' || unit === 'M' || unit === 'D') {
    dateUnits.value.splice(index, 1, '9');
  } else {
    dateUnits.value.splice(index, 1, String((parseInt(unit) - 1 + 10) % 10));
  }
};

const formattedDate = computed(() => {
  const year = dateUnits.value.slice(0, 4).join('');
  const month = dateUnits.value.slice(4, 6).join('');
  const day = dateUnits.value.slice(6, 8).join('');
  return `${year}-${month}-${day}`;
});

const timecapsuleSubmit = () => {
  const saveData = {
    name: name.value,
    age: age.value,
    userId: userId.value,
    password: password.value,
    email: email.value,
    dueDate: `${formattedDate.value}`+"T00:00:00+09:00", // datetime 형식으로 변환된 값
    message: message.value,
  };

  axios.post("http://localhost:3000/user", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    if (res.status === 200) {
      navigateTo('/');
      console.log("등록 성공");
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

const testtimecapsulesubmit = () => {
  closeModal();
  nextStep();
  let postDate = `${formattedDate.value}`+"T00:00:00+09:00"
  console.log(`${postDate}`)
  setTimeout(() => {
        nextStep();
      }, 50000);
}
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

.settings {
  display: flex;
  flex-direction: column;
  margin-left: 30px;
}

.settings div {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

.settings label {
  margin-right: 10px;
  font-size: 24px;
  color: black;
}

.settings input {
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
  font-family: 'CustomFont', Arial, sans-serif;
  color: black;
  margin-top: 10px;
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

.settings{
  height : 350px;
}

.settings input {
  height : 300px;
  width : 750px;
  border : none;
  background : #eee;
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

.custom-textarea {
  height: 330px;
  width : 750px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
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

.date-picker {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.date-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-unit div {
  width: 60px; /* Width increased by 1.5x */
  height: 60px; /* Height increased by 1.5x */
  text-align: center;
  font-size: 36px; /* Font size increased by 1.5x */
  color: black; /* Text color changed to black */
}

.date-button {
  width: 60px; /* Width increased by 1.5x */
  height: 60px; /* Height increased by 1.5x */
  font-size: 36px; /* Font size increased by 1.5x */
  color: black; /* Text color changed to black */
  background-color: #f0f0f0;
  border: 2px solid black;
  border-radius: 5px;
  cursor: pointer;
}
.loading-image {
  width : 300px;
  height : 300px;
}
.loading{
  margin-left : 150px;
}
</style>
