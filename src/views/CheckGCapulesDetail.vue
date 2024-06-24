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
          <div class="capsule-box">
            <img src="../components/images/capsule.gif" class="capsule-image">
            <img v-if="capsuleDetail.isSuccess == true" src="../components/images/success.png" class="image-overlay">
            <img v-else-if="capsuleDetail.isSuccess == false && capsuleDetail.isFailed == false" src="../components/images/inprogress.png" class="image-overlay">
            <img v-else src="../components/images/fail.png" class="image-overlay">
          </div>
        </div>
        <div class="capsule"> 
          <p>{{ capsuleDetail.title }}</p>
          <p>{{ formattedCreatedAt }} ~ {{ formattedExpired }}</p>
        </div>
      </div>

      <div class="right-board">
        <div class="inner-board">
          <div class="board-top">
              <div class="capsule-name">
                <p>진행도: </p>
              <div class="progress">
                <div class="progress-bar-container">
                  <div class="progress-bar" :style="{ width: progress + '%' }" />
                </div>
              </div>
              <p> {{ progress }}%</p>
            </div> 
          </div>
          <div class="board-bottom">
            <div class="inner-content">
              <div class="achieved-ment">
                <div v-if="capsuleDetail.isSuccess == true">
                  <p>
                    {{ capsuleDetail.otherEmail }}님께서
                    {{ capsuleDetail.title }} 목표를 성공적으로 달성하였습니다!
                    다음 목표는 조금 더 어려운 목표 캡슐을 전송해 보는 것도 좋을 것 같네요..!
                  </p>
                </div>
                <div v-else-if="capsuleDetail.isFailed == true">
                  <p>
                    {{ capsuleDetail.otherEmail }}님께서
                    {{ capsuleDetail.title }} {{ capsuleDetail.goalCount }}회를 {{ capsuleDetail.nowCount }} 달성하였지만..
                    {{ capsuleDetail.goalCount - capsuleDetail.nowCount }}회 부족하여 목표를 성공하지 못했습니다..
                    다음 목표는 조금 더 쉬운 목표 캡슐을 전송해 보는게 좋을 것 같네요..!
                  </p>
                </div>
                <div v-else-if="capsuleDetail.isSuccess == false && capsuleDetail.isFailed == false">
                  <p>
                    {{ capsuleDetail.otherEmail }}님께서
                    {{ capsuleDetail.title }} {{ capsuleDetail.goalCount }}회 목표를 현재 
                    {{ capsuleDetail.nowCount }}회 수행하였습니다!
                    {{ capsuleDetail.otherEmail }}님께서 목표를 달성하실 수 있도록 응원해주세요..!
                  </p>
                </div>
              </div>
              <div class="achieved">
                <p v-for="(date, index) in achievedDates" :key="index">
                  {{ index + 1 }} / {{ total }} 목표 달성 날짜 : {{ date }} <span :style="{ color: 'green' }"> ✔ </span>
                </p>
              </div>
            </div>
            <div v-if="capsuleDetail.isSuccess == true" class="show-image-box">
              <p>상대방이 목표를 달성하여 보상을 확인할 수 있습니다 ! !</p>
            </div>
            <div v-else-if="capsuleDetail.isSuccess == false && capsuleDetail.isFailed == false" class="show-image-box">
              <p>목표를 달성할 수 있도록 응원과 관심 부탁드립니다 !</p>
            </div>
            <div v-else class="show-image-box">
              <p>아쉽게도 상대방이 목표를 달성하지 못하여 보상을 확인할 수 없습니다..</p>
            </div>
          </div>
        </div>
      </div>    
    </div>
    <div class="button-container">
      <button v-if="initialPosition === 'center'" @click="gamemain">뒤로가기</button>
      <button v-else @click="goBack">뒤로가기</button>
    </div>

    <div v-if="showImageModal" class="modal-overlay">
      <div v-if="imagePath === ''" class="modal-content">
        <p>저장하신 사진이 없습니다.</p>
      </div>
      <div v-else class="modal-content">
        <h2>이미지보기</h2>
        <div v-for="image in imagePath" :key="image.id" class="image-box">
          <img :src="image" width="300px" height="200px">
        </div>
      </div>    
      <div>
        <button class="btn-style" @click="closeImageModal">뒤로가기</button>
      </div>
    </div>
    <div class="button-container">
      <button v-if="initialPosition === 'center'" @click="gamemain">뒤로가기</button>
      <button v-else @click="goBack" style="display: none;">뒤로가기</button>
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
const imagePath = ref([]);
const achievedDates = ref([]);
const progress = computed(() => {
  let average = (now.value / total.value) * 100;
  return average.toFixed(1);
});
const initialPosition = route.query.initialPosition; // 초기 위치

const showImageModal = ref(false);

const createdAt = ref('');
const expired = ref('');


const openImageModal = () => {
  showImageModal.value = true;
}
const closeImageModal = () => {
  showImageModal.value = false;
}

const navigateTo = (route) => {
  window.location.href = route;
};

const goBack = () => {
  navigateTo(`/checkCapsules/`);
};
const gamemain = () => {
  navigateTo(`/checkCapsules/}?initialPosition=center`);
}

const GCapsuleDetails = () => {
  const goalId = route.params.id;
  axiosInstance.get(`https://www.3idiots.xyz:3000/goal/${goalId}`)
  .then(response => {
    console.log(response.data);
    imagePath.value = response.data.imagePath.map(imagePath => { return imagePath });
    capsuleDetail.value = response.data;
    createdAt.value = response.data.createdAt;
    expired.value = response.data.expired;
    now.value = response.data.nowCount;
    total.value = response.data.goalCount;
    dailyCheck.value = response.data.dailyCheck;
    isChecked.value = !dailyCheck.value;
    achievedDates.value = response.data.achievedDates;
    console.log(dailyCheck.value);
  })
  .catch(error => {
    console.error(error);
  })
};

const formattedCreatedAt = computed(() => {
  console.log(createdAt.value);
  return createdAt.value.slice(0, 10);
});

const formattedExpired = computed(() => {
  console.log(expired.value);
  return expired.value.slice(0, 10);
});

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

.achieved {
  border-top: 2px double #eee;
  padding-top: 8px;
  font-size: 16px;
  height: 152px;
  overflow: auto;
}

.achieved-ment {
    margin-bottom: 16px;
}

.image-box{
  border: 1px solid #eee;
  margin: 0px 0px 16px 0px;
  padding: 16px;
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
  flex-direction: column;
}
.btn-style {
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
  margin-bottom: 16px;
}

.modal-overlay .modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 600px;
  height: 500px;
  color: black;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.modal-overlay .modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-overlay .modal-content::-webkit-scrollbar-thumb { 
    background-color: #cbcbcbbd;
    border-radius: 15px;
}

.modal-overlay .modal-content::-webkit-scrollbar-button {
    display: none;
}

.show-image-box button {
  /* margin: 8px 8px 0px 0px; */
  background: white;
  border: 0px solid white;
  width: 40px;
}

.show-image-box button:hover {
  cursor: pointer;
  background-color: #eee;
  border-radius: 8px;
}

.show-image-box button img {
  width: 20px;
  height: 20px;
}

.show-image-box {
  /* border: 1px solid red; */
  display: flex;
  padding: 8px;
  margin-left: 8px;
  margin-bottom: 8px;
}

.inner-content {
  /* border: 1px solid green; */
  height: 88%;
  /* display: flex; */
  padding: 8px;
  border-bottom: 2px double #eee;
}

.right-board .inner-board .board-bottom {
  flex: 2;
  /* border: 2px solid #000; */
  border-radius: 15px;
  width: 100%;
  height: 64%;
}

.progress {
  display: flex;
  width: 75%;
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
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
}

.capsule-box {
  position: relative;
  display: inline-block;
}

.capsule-image {
  display: block;
}

.image-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); 
  width: 50%;
  height: 50%;
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

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}

.capsule-name {
  /* border: 2px solid #000; */
  margin: 16px 10px;
  display: flex;
  align-items: center;
  width: 100%;
}

.capsule-name p {
  font-size: 16px;
  /* width: 20%; */
  margin: 8px 0px 8px 8px;
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