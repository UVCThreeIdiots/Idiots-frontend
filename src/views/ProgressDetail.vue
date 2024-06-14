<template>
  <div id="progress" class="container">
    <div class="border-box">
      <img class="obakuser" src="../components/images/prof_oh.png">
      <div class="text-box">
        <p class="obakuser-text">
        <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
      </div>
    </div>   
  
    <div class="board">
      <div class="left-board">
        <div class="capsule">
          <img src="../components/images/capsule.gif">
        </div>
        <div class="capsule"> 
          <p>{{ capsuleDetail.title }}</p>
        </div>
      </div>

      <div class="right-board">
        <div class="inner-board">
          <div class="board-top">
            <div class="capsule-name">
              <div>
                <p>진행도: </p>
              </div>
              <div>
                <p> {{ progress }}%</p>
              </div>
            </div>
            <div class="progress">
              <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: progress + '%' }" />
            </div>
            <div class="check-btn">
              <button @click="increaseProgress" :disabled="!isChecked">달성</button>
            </div>
            </div>
          </div>
          <div class="board-bottom">
            <p>{{now}}</p>
            <p>{{total}}</p>
            <p>백분률: {{progress}}</p>
          </div>
        </div>
      </div>    
    </div>
    <div class="button-container">
      <button v-if="initialPosition==='center'" @click="gamemain">뒤로가기</button>
      <button v-else @click="goBack">뒤로가기</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosInstance';

const route = useRoute();
const typedText = ref('캡슐에 대해서 궁금하구나 ! ! !');
const capsuleDetail = ref([]);
const useStore = useUserStore();
const userId = ref(useStore.getUser().id);
const now = ref(0);
const total = ref(0);
const dailyCheck = ref(0);
const isChecked = ref(true);
const progress = computed(() => {
  let average = (now.value / total.value) * 100;
  return average.toFixed(1);
});

//메인메뉴로 갈지 게임메뉴로 갈지 선택
const initialPosition = route.query.initialPosition; // 초기 위치

const GCapsuleDetails = () => {
  const goalId = route.params.goalId;
  axiosInstance.get(`http://localhost:3000/goal/${goalId}`)
  .then(response => {
    console.log(response.data);
    capsuleDetail.value = response.data;
    now.value = response.data.nowCount;
    total.value = response.data.goalCount;
    dailyCheck.value = response.data.dailyCheck;
    isChecked.value = !dailyCheck.value;
    console.log(dailyCheck.value);
  })
  .catch(error => {
    console.error(error);
  })
}

const navigateTo = (route) => {
  window.location.href = route;
};

const goBack = () => {
  navigateTo(`/progress/`);
};
const gamemain = () => {
  navigateTo(`/progress/?initialPosition=center`)
}

const increaseProgress = () => {
  const goalId = route.params.goalId;
  if (progress.value < 100) {
    now.value++;
    dailyCheck.value = true;
    isChecked.value = !dailyCheck.value;
    const saveData = {
      nowCount: now.value,
      dailyCheck : dailyCheck.value,
    };

    axiosInstance.put(`http://localhost:3000/goal/${goalId}`, JSON.stringify(saveData), {
      headers: {
        'Content-Type': 'application/json'
      },
    }).then((response) => {
      if (response.status === 200){
        console.log("nowCount 전달 성공");
      }
    }).catch((error) => {
      console.error("전달 실패: " ,error);
  });
};

}
onMounted(GCapsuleDetails);
</script>

<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}

body {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

.progress {
  display: flex;
  width: 75%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.check-btn {
  display: flex;
}

.check-btn button {
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  /* font-size: 10px; */
  width: 85px;
  height: 32px;
}

.button-container {
  display: flex;
  /* justify-content: space-around; */
  margin-top: 8px;
  margin-left: 12px;
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

.border-box {
  border: 2px solid black;
  border-radius: 15px;
}

.obakuser {
  width: 100px;
}

.obakuser-text {
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
  margin-left: 30px;
}

.board {
  display: flex;
  width: 100%;
  height: 65%;
  margin: 0 auto;
  text-align: center;
}

.left-board {
  flex: 1;
  /* border: 2px solid #000; */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 15px;
}

.left-board img {
  width: 100px;
  height: 100px;
}

.left-board .capsule {
  border: 2px solid #000;
  border-radius: 15px;
  height: 50%;
  width: 100%;
  margin-top: 10px;
  font-size: 20px;
  color: black;
  align-content: center;
}

.right-board {
  flex: 2;
  /* border: 2px solid #000; */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 15px;
  color: black;
  flex-direction: column; /* 세로 정렬을 위해 추가 */
}

.right-board .inner-board {
  border: 2px solid #000;
  border-radius: 15px;
  width: 100%;
  height: 100%;
  margin-top: 10px;
}

.right-board .inner-board .board-top {
  flex: 1;
  /* border: 2px solid #000; */
  border-radius: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  padding: 16px;
}

.right-board .inner-board .board-bottom {
  flex: 2;
  /* border: 2px solid #000; */
  border-radius: 15px;
  width: 100%;
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}

.capsule-name {
  /* border: 2px solid #000; */
  margin: 16px 10px;
  display: flex;
}

.capsule-name p {
  font-size: 16px;
}

.progress-bar-container {
  width: 50%;
  background-color: #e0e0e0;
  overflow: hidden;
  height: 16px;
  margin: 16px 8px;
}

.text-box {
  display: flex;
    /* justify-content: center; */
    align-items: center;
    /* margin-top: 20px; */
    /* margin-bottom: 20px;*/
}

.progress-bar {
  height: 100%;
  background-color: #000;
  width: 0;
  transition: width 1.5s ease-in-out;
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
  display: flex;
  border: 2px solid black;
  padding: 5px;
  border-radius: 15px;
}
.obakuser-text {
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
  margin-left: 30px;
}
</style>