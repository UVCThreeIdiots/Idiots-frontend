<template>
  <div id="makegoal" class="container">
    <div class="border-box">
      <p>
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.1) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="settings">
        <div v-if="currentStep === 0" class="textarea">
          <label for="title"></label>
          <textarea type="text" id="email" v-model="email" class="custom-textarea9"></textarea>
          <button @click="emailCheck">이메일체크</button>
          <button>이메일체크(test)</button>
          <div class="warnings" v-if="isEmailChecked">
            <p class = "info" v-if="isEmailExists">해당 이메일정보로 가입된 {{ otherUserName }} 님에게 캡슐을 전송합니다.</p>
            <p class = "info" v-else>해당 이메일정보로 가입된 유저가 없습니다.<br>받으려는 유저가 해당 이메일로 가입시, 캡슐을 전송합니다.</p>
          </div>
        </div>
        <div v-if="currentStep === 1">
          <label for="goal"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input v-model="goal">
            <p class="false" v-if="goal.length > 16"> 주의 : 원칙에 따라 최대 16자를 넘길 수 없습니다. </p>
            <p class="false" v-else-if="goal.length < 1"> 주의 : 목표는 공백으로 사용할 수 없습니다!</p>
            <p class="true" v-else> 주의 : 목표는 16자 이하로 설정해주십시오.</p>
          </div>
        </div>
        <div v-if="currentStep === 2">
          <label for="due"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input v-model="inputDue">
            <p class="false" v-if="inputDue>52"> 주의 : 52주가 넘는 목표기간은 설정 할 수 없습니다. </p>
            <p class="false" v-else-if="inputDue.length < 1"> 주의 : 빈칸으로 둘 수 없습니다! </p>
            <p class="false" v-else-if="inputDue<1"> 주의 : 최소 1주 이상의 목표기간을 설정해야 합니다. </p>
            <p class="false" v-else-if="!isValidDue"> 주의 : 숫자를 입력해야 합니다!</p>
            <p class="true" v-else> 주의 : 최소 1주에서 52주 이내 선택 가능합니다.</p>
          </div>
        </div>
        <div v-if="currentStep === 3">
          <label for="reps"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input v-model="inputReps"> 
            <p class="false" v-if="inputReps>maxReps"> 주의 : 원칙에 따라 최대 {{ maxReps }}회를 넘길 수 없습니다. </p>
            <p class="false" v-else-if="inputReps.length < 1"> 주의 : 빈칸으로 둘 수 없습니다! </p>
            <p class="false" v-else-if="inputReps < 1"> 주의 : 최소 1회 이상의 횟수를 설정해야 합니다.</p>
            <p class="false" v-else-if="!isValidReps"> 주의 : 숫자를 입력해야 합니다! </p>
            <p class="true" v-else> 주의 : 목표는 하루에 최대 1회를 원칙으로 합니다.</p>
          </div>
        </div>
        <div v-if="currentStep === 4">
          <label for="age">"여기에 사진 넣어야함."</label>
        </div>
      </div>
    </div>
    <div class="border-box">
      <div class="button-container">
        <button @click="movemain">메인 메뉴</button>
        <button :disabled= "currentStep < 1 || currentStep >=4" @click="beforeStep">이전</button>
        <button v-if="currentStep === 3" @click="openModal" :disabled="!isValidReps">등록</button>
        <button v-else @click="nextStep" :disabled="currentStep >=4 || (currentStep === 0 && !isEmailChecked)||(currentStep === 1 && !isValidGoal) || (currentStep === 2 && !isValidDue )">다음</button>


      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2> </h2>
        <p>목표 : {{ goal }}</p>
        <p>목표 기간 : {{ inputDue }}</p>
        <p>목표 횟수 : {{ inputReps }}</p>
        <p>골 캡슐을 제작하시겠습니까?<br>주의 : 생성된 골 캡슐은 수정 삭제가 불가합니다.</p>
        <button @click="closeModal">취소</button>
        <button @click="goalCapsuleSubmit">확인</button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user.js';
const email = ref('이곳에 이메일 입력!')
const otherUserid = ref('');
const otherUserName = ref('');
const isEmailChecked = ref(false);
const isEmailExists = ref(false);
const typedText = ref('이곳에서는 새로운 골 캡슐을 만들어 ');
const currentStep = ref(0);
const showModal = ref(false);
const stepsInfo = 4;
const goal = ref('목표를 입력하세요');
const inputDue = ref('1');
const inputReps = ref('1');
const maxReps = computed(() => inputDue.value * 7);
const nextStep = () => {
  if (currentStep.value < stepsInfo) {
    currentStep.value++;
    if (currentStep.value <= 0)
      typedText.value = '이곳에서는 새로운 골 캡슐을 만들 수 있단다!\n어떤 목표를 세울까? (예 : 운동, 독서, 프로그래밍 공부)';
    else if (currentStep.value === 1)
      typedText.value = '목표는 몇 주동안 진행할까?';
    else if (currentStep.value === 2)
      typedText.value = '기간동안 목표는 몇번 수행할까?\n목표는 하루에 한번까지 수행할 수 있단다!';
    else if (currentStep.value === 3)
      typedText.value = '포켓몬들이 골 캡슐을 땅속 깊숙히 묻고 있단다!';
    else if (currentStep.value === 4)
      typedText.value = `새로운 골 캡슐이 성공적으로 저장되었단다.\n목표를 위해 모험을 시작하자!`;
  }
};

const isValidDue = computed(()=>{
  if (inputDue.value.length <1) return false;
  if (inputDue.value < 1) return false;
  if (inputDue.value >52) return false;
  const regex = /^[0-9]*$/;
  return regex.test(inputDue.value);
});
const isValidReps = computed(()=>{
  if (inputReps.value.length <1) return false;
  if (inputReps.value < 1) return false;
  if (inputReps.value > maxReps.value) return false;
  const regex = /^[0-9]*$/;
  return regex.test(inputReps.value);
});
const isValidGoal = computed(()=>{
  return (goal.value.length >= 1 && goal.value.length <= 16)
});
const useStore = useUserStore();
const userId = ref(useStore.getUser().id);

const navigateTo = (route) => {
  window.location.href = route;
};
const movemain = () => {
  navigateTo(`/main/${userId.value}`);
}
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

const emailCheck = () => {
  const data = {email : email.value};
  axios.post("http://localhost:3000/other/email", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    if (res.status === 200) {
      console.log("🚀 ~ .then ~ res.data:", res.data)
      if(res.data) {
      console.log("조회 성공");
      isEmailChecked.value = true;
      isEmailExists.value = true;
      otherUserName.value = res.data.name;
      otherUserid.value = res.data.id;
      }
      else{
      isEmailChecked.value = true;
      }
    }

  })
  .catch((error) => {
    console.error(error);
  });

};

const goalCapsuleSubmit = () => {
  const saveData = {
    userId : userId.value,
    title : goal.value,
    body : null,
    goalCount : inputReps.value,
    goalTerm : inputDue.value,
    otherId : otherUserid.value,
    otherEmail : email.value,
  };

  axios.post("http://localhost:3000/goal", JSON.stringify(saveData), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    if (res.status === 200) {
      console.log("등록 성공");
      closeModal();
      nextStep();
      setTimeout(() => {
        nextStep();
      }, 5000);
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

.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  height : 300px;
  justify-content: center;
  gap:20px;

}

.settings div {
  align-items: center;
  margin: 10px;
  color: black;
  font-size : 24px;
}
.blur{
  display: flex;
  flex-direction:row;

}
.unblur input{
margin-right:10px;
}
.blurdiv1{
  background : lightgrey;
  width : 430px;
  height : 50px;
  padding: 8px;
  padding-left : 8px;
}
.blurdiv2{
  background : lightgrey;
  width : 70px;
  height : 50px;
  padding-left : 16px;
  margin-left : 20px;

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
  width : 600px;
  height : 50px;
  border-radius: 5px;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  background : white;
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
  margin-top: 10px;
  font-size: 24px;
  margin-left: 30px;
}

.true {
  color: green;
  
}
.false {
  color: red;
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
.custom-textarea9{
  height: 50px;
  width : 500px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
  margin-bottom : 20px;
}
.warnings{
  color:red;
  font-size: 20px;
}

.loading-image {
  width : 300px;
  height : 300px;
}
.loading{
  margin-left : 150px;
}
</style>
