<template>
  <div id="main" class="container">
    <img class="obakuser" src="../components/images/prof_oh.png" @click="maingameview">
    <div class="border-box">
      <p class="top-comment">
        <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.1) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="link-container">
        <div>
          <a @mouseover="showLink1 = true" @mouseleave="showLink1 = false" @click="openMaketimeModal">
        <span v-if="showLink1">▶</span><span v-else></span>&nbsp;새로운 타임캡슐을 만든다</a>
          <a @mouseover="showLink2 = true" @mouseleave="showLink2 = false" @click="openMakegoalModal">
        <span v-if="showLink2">▶</span><span v-else></span>&nbsp;새로운 목표캡슐을 만든다</a>
          <a @mouseover="showLink3 = true" @mouseleave="showLink3 = false" @click="openProgressModal">
        <span v-if="showLink3">▶</span><span v-else></span>&nbsp;도감 / 진척도를 확인한다</a>
        </div>
        <div>
          <a @mouseover="showLink4 = true" @mouseleave="showLink4 = false" @click="openUserUpdateModal">
            <span v-if="showLink4">▶</span><span v-else></span>&nbsp;내 정보를 변경한다</a>
          <a @mouseover="showLink5 = true" @mouseleave="showLink5 = false" @click="logout">
            <span v-if="showLink5">▶</span><span v-else></span>&nbsp;로그아웃</a>
          <a v-if="role==='admin'" @mouseover="showLink6 = true" @mouseleave="showLink6 = false" @click="openDeveloperModal">
        <span v-if="showLink6">▶</span><span v-else></span>&nbsp;개발자 도구</a>
        </div>
      </div>
    </div>
    <div v-if="showDeveloperModal" class="modal-overlay">
      <div class="modal-content">
        <h2>원하는 개발자도구를 선택하세요.</h2>
        <div class="developerToolbox">
          <a @mouseover="showLink7 = true" @mouseleave="showLink7 = false" @click="developer">
            <span v-if="showLink7">▶</span><span v-else></span>&nbsp;시분초 확인 프로그램</a>
          <a @mouseover="showLink14 = true" @mouseleave="showLink14 = false" @click="adminPage">
            <span v-if="showLink14">▶</span><span v-else></span>&nbsp;Admin Page</a>
        </div>
        <p class="warn">개발자 도구도 DB랑 연동되어 있습니다!</p>
        <button @click="closeDeveloperModal">취소</button>
      </div>
    </div>
    <div v-if="showMaketimeModal" class="modal-overlay">
      <div class="modal-content">
        <h2>원하는 기능을 선택하세요.</h2>
        <div class="developerToolbox">
          <a @mouseover="showLink8 = true" @mouseleave="showLink8 = false" @click="maketime">
            <span v-if="showLink8">▶</span><span v-else></span>&nbsp;나만의 타임캡슐을 만든다.</a>
          <a @mouseover="showLink9 = true" @mouseleave="showLink9 = false" @click="maketimeToUser">
            <span v-if="showLink9">▶</span><span v-else></span>&nbsp;타임캡슐을 전송한다.</a>
        </div>
        <p class="warn">타임캡슐을 생성합니다!</p>
        <button @click="closeMaketimeModal">취소</button>
      </div>
    </div>
    <div v-if="showMakegoalModal" class="modal-overlay">
      <div class="modal-content">
        <h2>원하는 기능을 선택하세요.</h2>
        <div class="developerToolbox">
          <a @mouseover="showLink10 = true" @mouseleave="showLink10 = false" @click="makegoal">
            <span v-if="showLink10">▶</span><span v-else></span>&nbsp;나만의 목표캡슐을 만든다.</a>
          <a @mouseover="showLink11 = true" @mouseleave="showLink11 = false" @click="makegoalToUser">
            <span v-if="showLink11">▶</span><span v-else></span>&nbsp;목표캡슐을 전송한다.</a>
        </div>
        <p class="warn">골캡슐을 생성합니다!</p>
        <button @click="closeMakegoalModal">취소</button>
      </div>
    </div>

    <div v-if="showProgressModal" class="modal-overlay">
      <div class="modal-content">
        <h2>원하는 작업을 선택하세요.</h2>
        <div class="developerToolbox">
          <a @mouseover="showLink12 = true" @mouseleave="showLink12 = false" @click="progress">
            <span v-if="showLink12">▶</span><span v-else></span>&nbsp;캡슐의 진척도를 확인한다.</a>
          <a @mouseover="showLink13 = true" @mouseleave="showLink13 = false" @click="complete">
            <span v-if="showLink13">▶</span><span v-else></span>&nbsp;캡슐 도감을 확인한다.</a>
          <a @mouseover="showLink15 = true" @mouseleave="showLink15 = false" @click="checkCapsules">
            <span v-if="showLink15">▶</span><span v-else></span>&nbsp;전송한 캡슐의 상태를 확인한다.</a>
        </div>
        <div class="comment">
          <p class="warn" v-if="showLink12">목표캡슐의 진행상황을 확인할 수 있습니다!</p>
          <p class="warn" v-if="showLink13">만료된 타임캡슐과 목표캡슐을 확인할 수 있습니다!</p>
          <p class="warn" v-if="showLink15">전송한 타임캡슐과 목표캡슐을 확인할 수 있습니다!</p>
        </div>
        <button @click="closeProgressModal">취소</button>
      </div>
    </div>

    <div v-if="showUserUpdateModal" class="modal-overlay">
      <div class="modal-content">
        <h2>계정 확인</h2>
        <div class="pass-check">
          <input type="password" class="password-check" v-model="passwordCheck" placeholder="*비밀번호확인*"/>
            <div>
              <button @click="passCheck" class="check-btn">확인</button>
            </div>
        </div>
        <p class="warn">확인을 위해 비밀번호를 입력해주세요</p>
        <button @click="closeUserUpdateModal">취소</button>
      </div>
    </div>


  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { onMounted, ref } from 'vue';
import axiosInstance from '@/config/axiosInstance';

const useStore = useUserStore();
const userName = ref(useStore.getUser().name);
const userLoginId = ref(useStore.getUser().userId);
const userId = ref(useStore.getUser().id);
const role = ref(useStore.getUser().role);
const passwordCheck = ref('');
const typedText = `${userName.value}는 무엇을 할까?`;
const userMode = ref(useStore.getUser());
const showModal = ref(false);
const showProgressModal = ref(false);
const showDeveloperModal = ref(false);
const showMaketimeModal = ref(false);
const showMakegoalModal = ref(false);
const showUserUpdateModal = ref(false);

const showLink1 = ref(false);
const showLink2 = ref(false);
const showLink3 = ref(false);
const showLink4 = ref(false);
const showLink5 = ref(false);
const showLink6 = ref(false);
const showLink7 = ref(false);
const showLink8 = ref(false);
const showLink9 = ref(false);
const showLink10 = ref(false);
const showLink11 = ref(false);
const showLink12 = ref(false);
const showLink13 = ref(false);
const showLink14 = ref(false);
const showLink15 = ref(false);
const navigateTo = (route) => {
  window.location.href = route;
};

const maketime = () => {
  navigateTo(`/maketime/`);
}
const makegoal = () => {
  navigateTo(`/makegoal/`);
}
const updateuserinfo = () => {
  navigateTo(`/updateuserinfo/`);
}
const developer = () => {
  navigateTo(`/developer/`);
}
const adminPage = () => {
  navigateTo(`/admin/main`);
}
const progress = () => {
  navigateTo(`/progress/`);
}
const complete = () => {
  navigateTo(`/complete/`);
}
const checkCapsules = () => {
  navigateTo(`/checkCapsules/`);
}
const logout = () => {
  axiosInstance.post(`https://www.3idiots.xyz:3000/auth/logout/`)
      .then(response => {
        console.log(response.data);
        useStore.logout();
        navigateTo('/');
      })
      .catch(error => {
        console.log(error);
      })
}
const maingameview = () =>{
  navigateTo(`/maingameview/`);
}


const openProgressModal = () => {
  showProgressModal.value = true;
}

const closeProgressModal = () => {
  showProgressModal.value = false;
}

const openModal = () => {
  showModal.value = true;
};

const maketimeToUser = () => {
  navigateTo(`/maketimeToUser/`);
}
const makegoalToUser = () => {
  navigateTo(`/makegoalToUser/`);
}
const openDeveloperModal = () => {
  showDeveloperModal.value = true;

};
const closeDeveloperModal = () => {
  showDeveloperModal.value = false;
};
const openMaketimeModal = () => {
  showMaketimeModal.value = true;
};
const closeMaketimeModal = () => {
  showMaketimeModal.value = false;
};
const openMakegoalModal = () => {
  showMakegoalModal.value = true;
};
const closeMakegoalModal = () => {
  showMakegoalModal.value = false;
};
const openUserUpdateModal = () => {
  showUserUpdateModal.value = true;
}
const closeUserUpdateModal = () => {
  showUserUpdateModal.value = false;
}

const passCheck = () => {
  const saveData = {
    password: passwordCheck.value,
  };

  axiosInstance.post(`https://www.3idiots.xyz:3000/auth/info`, JSON.stringify(saveData), {
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((response) => {
    if( response.status === 200){
      navigateTo(`/updateuserinfo/`);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  }).catch((error) => {
    console.log('비밀번호 불일치', error);
    alert('비밀번호가 일치하지 않습니다.'); 
  });
}

</script>


<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}

.check-btn {
  height: 40px;
}

.id-pw {
  width: 40px;
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
  /* border: 2px solid #000; */
  padding: 8px;
}

.pass-check {
  display: flex;
  align-items: center;
  /* border: 2px solid #000; */
}

.password-check {
  font-family: 'CustomFont';
  font-size: 16px;
  width: 240px;
  height: 40px;
}

.comment {
  /* border: 2px solid red; */
  height: 100%;
  width: 100%;
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
  cursor : pointer;
}

.link-container {
  display: flex;
  justify-content: space-between; /* Spread items evenly */
  flex-wrap: wrap; /* Allow items to wrap */
  margin: 10px 0;
  font-size : 24px;
}
.link-container div {
  flex-basis: 30%; /* Each column takes up 30% of the container */
  display: flex;
  flex-direction: column; /* Arrange items vertically */
  align-items: center; /* Center items horizontally */
}

.link-container a{
  color : black;
  width : 340px;
  margin-left : 30px;
  margin-right: 30px;
  margin-bottom : 10px;
}


p {
  /* margin-top: 10px; */
  white-space: pre-wrap;
  overflow: hidden;
  width: 100%;
  height: 100px;
  /* padding-top: 10px; */
  font-size: 24px;
  /* margin-left: 30px; */
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.developerToolbox{
  /* border: 2px solid black; */
  display: flex;
  justify-content: center;
  width : 80%;
  height : 300px;
  flex-direction: column;
  align-items: center;
}
</style>
