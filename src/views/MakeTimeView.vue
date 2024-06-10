<template>
  <div id="maketime" class="container">
    <div class="border-box">
      <p>
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.07) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="settings">
        <div v-if="currentStep === 0" class="textarea">
          <label for="title"></label>
          <textarea type="text" id="title" v-model="title" class="custom-textarea0" placeholder="이곳에 제목을 입력하자 ! ! !"></textarea>
          <label for="message"></label>
          <textarea type="text" id="message" v-model="message" class="custom-textarea" placeholder="이곳에 내용을 입력하자 ! ! !"></textarea>
        </div>
        <div v-if="currentStep === 1" class="buttons-and-ment">
          <label for="dueDate"></label>
          <div class="date-picker">
            <div v-for="(unit, index) in dateUnits" :key="index" class="date-unit">
              <button class="date-button" @click="incrementDateUnit(index)">▲</button>
              <div class="date-value">{{ unit }}</div>
              <button class="date-button" @click="decrementDateUnit(index)">▼</button>
            </div>
          </div>
          <div class="warnings">
          <p v-if="!isValidDateType" class="warn">날짜의 형식이 잘못되었습니다!</p>
          <p v-else-if="!isValidDueDate" class="warn">현재 혹은 과거로 캡슐을 보낼 수 없습니다! </p>
          <p v-else class="notwarn">해당 날짜로 캡슐을 보낼 수 있습니다!</p>
          </div>
        </div>
        <div v-if="currentStep === 2">
          <div class="loading">
            <label for="loading">Loading...</label>
            <img src="../components/images/loading.gif" class="loading-image"/>
          </div>
        </div>
        <div v-if="currentStep === 3">
          <label for="age">여기 사진 추가</label>
        </div>
      </div>
    </div>
    <div class="border-box">
      <div class="button-container">
        <button @click="movemain" :disabled="currentStep===2">메인 메뉴</button>
        <button :disabled= "currentStep < 1 || currentStep >=2" @click="beforeStep">이전</button>
        <button v-if="currentStep === 1" @click="openModal" :disabled="!isValidDateType || !isValidDueDate">등록</button>
        <button v-else @click="nextStep" :disabled="currentStep >= 2">다음</button>
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
        <p class = "modal-message">{{ message }}</p>
        <p class = "modal-date">설정된 날짜: {{ formattedDate }}</p>
        <p class = "modal-warn">타임캡슐을 제작하시겠습니까?<br>주의 : 생성된 타임캡슐은 수정 삭제가 불가하며, 설정된 날짜까지 조회가 불가합니다.</p>
        <div class="modal-buttons">
          <button @click="timeCapsuleSubmit">확인</button>
          <button @click="closeModal">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user.js';

const useStore = useUserStore();
const title = ref('')
const message = ref('');
const typedText = ref('이곳에서는 새로운 타임캡슐을 만들 수 있단다!\n어떤 내용을 타임 캡슐에 담을까?');
const currentStep = ref(0);
const showModal = ref(false);
const stepsInfo = 4
const currentDate = new Date();
const year = currentDate.getFullYear().toString(); // 연도
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 월 (0부터 시작하므로 +1, padStart로 2자리로 맞춤)
const date = currentDate.getDate().toString().padStart(2, '0');
const dateUnits = ref([year[0], year[1], year[2], year[3], month[0], month[1], date[0], date[1]]);

const isValidDueDate = computed(()=> {
  let year = dateUnits.value[0] + dateUnits.value[1] + dateUnits.value[2] + dateUnits.value[3];
  let month = dateUnits.value[4] + dateUnits.value[5];
  let date = dateUnits.value[6] + dateUnits.value[7];
  let dueDate = new Date(year, month - 1, date);
  return dueDate > currentDate;
})
const isValidDateType = computed(() => {
  const year = parseInt(dateUnits.value.slice(0, 4).join(''));
  const month = parseInt(dateUnits.value.slice(4, 6).join(''));
  const day = parseInt(dateUnits.value.slice(6, 8).join(''));

  // 각 부분이 숫자인지 확인
  const isYearNumeric = !isNaN(year);
  const isMonthNumeric = !isNaN(month);
  const isDayNumeric = !isNaN(day);

  // 각 부분의 범위를 확인
  const isYearValid = year >= 1000 && year <= 9999;
  const isMonthValid = month >= 1 && month <= 12;
  const isDayValid = day >= 1 && day <= 31;

  // 각 월의 일 확인 함수
  const isMonthDayValid = (year, month, day) => {
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12)
      return day <= 31;
    else if (month === 4 || month === 6 || month === 9 || month === 11)
      return day <= 30;
    else if (month === 2) {
      if (year % 4 === 0) {
        if (year % 100 === 0) {
          if (year % 400 === 0)
            return day <= 29;
          else
            return day <= 28;
        } else {
          return day <= 29;
        }
      } else {
        return day <= 28;
      }
    }
    return false; // month가 1-12가 아니면 false 반환
  };

  // 모든 조건이 충족되면 true 반환
  return isYearNumeric && isMonthNumeric && isDayNumeric && isYearValid && isMonthValid && isDayValid && isMonthDayValid(year, month, day);
});





const nextStep = () => {
  if (currentStep.value < stepsInfo) {
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
const navigateTo = (route) => {
  window.location.href = route;
};
const movemain = () => {
  navigateTo(`/main/${userId.value}`);
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

  // 각 자릿수에 따른 최대 값 설정
  const maxValues = [9, 9, 9, 9, 1, 9, 3, 9];

  // 현재 값과 최대 값 비교하여 조정
  if (parseInt(unit) < maxValues[index]) {
    dateUnits.value.splice(index, 1, String(parseInt(unit) + 1));
  } else {
    // 최대 값이면 0으로 조정
    dateUnits.value.splice(index, 1, '0');
  }
};

const decrementDateUnit = (index) => {
  let unit = dateUnits.value[index];

  // 각 자릿수에 따른 최소 값 설정
  const minValues = [2, 0, 0, 0, 0, 0, 0, 0];

  // 현재 값과 최소 값 비교하여 조정
  if (parseInt(unit) > minValues[index]) {
    dateUnits.value.splice(index, 1, String(parseInt(unit) - 1));
  } else {
    // 최소 값이면 최대 값으로 조정
    const maxValues = [3, 9, 9, 9, 1, 2, 3, 9];
    dateUnits.value.splice(index, 1, String(maxValues[index]));
  }
};


const formattedDate = computed(() => {
  const year = dateUnits.value.slice(0, 4).join('');
  const month = dateUnits.value.slice(4, 6).join('');
  const day = dateUnits.value.slice(6, 8).join('');
  return `${year}-${month}-${day}`;
});
const userId = ref(useStore.getUser().id);

const timeCapsuleSubmit = () => {
  const saveData = {
    title: title.value,
    userId : userId.value,
    expired: `${formattedDate.value}`+"T00:00:00+09:00", // datetime 형식으로 변환된 값
    // expired: "2024-06-05T10:27:00+09:00", // 테스트용
    body: message.value,
  };

  axios.post("http://localhost:3000/time", JSON.stringify(saveData), {
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

// const testtimecapsulesubmit = () => {
//   closeModal();
//   nextStep();
//   let postDate = `${formattedDate.value}`+"T00:00:00+09:00"
//   console.log(`${postDate}`)
//   setTimeout(() => {
//         nextStep();
//       }, 5000);
// }
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
  justify-content: center;
}

.settings div {
  display: flex;
  align-items: center;
  margin: 20px 0;
  justify-content: center;
  flex-wrap: wrap;
  align-content: center;
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



.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
}

.settings{
  height : 350px;
  align-items : flex-start;
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
.textarea{
  display: flex;
  flex-direction: column;
}
.custom-textarea0 {
  height: 50px;
  width : 750px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  margin-bottom : 20px;
}
.custom-textarea {
  height: 250px;
  width : 100%;
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
  height: 700px;
  color: black; /* Set text color to black */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: black; /* Ensure heading color is black */
}

.modal-content p {
  margin-bottom: 5px; /* Reduce gap between paragraphs */
  font-size: 20px;
  width: 470px;
  
}
.modal-message {
  height: 350px;
}
.modal-date {
  height: 40px
}
.modal-warn {
  height: 120px;
  color:red;
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
  height: 30px; /* Height increased by 1.5x */
  text-align: center;
  font-size: 30px; /* Font size increased by 1.5x */
  color: black;
  margin-bottom: 10px /* Text color changed to black */
}

.date-button {
  width: 60px; /* Width increased by 1.5x */
  height: 30px; /* Height increased by 1.5x */
  font-size: 24px; /* Font size increased by 1.5x */
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
.warn{
  color: red;
}
.notwarn{
  color:green;
}

</style>