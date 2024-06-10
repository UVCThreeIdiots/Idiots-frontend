<template>
  <div id="main" class="container">
    <img class="obakuser" src="../components/images/prof_oh.png">
    <div class="border-box">
      <p>
        <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="link-container">
        <div>
          <a @mouseover="showLink1 = true" @mouseleave="showLink1 = false" @click="UpdateUserEmail">
            <span v-if="showLink1">▶</span><span v-else></span>&nbsp;등록된 이메일을 변경한다.</a>
          <a a @mouseover="showLink2 = true" @mouseleave="showLink2 = false" @click="UpdateUserPassword">
            <span v-if="showLink2">▶</span><span v-else></span>&nbsp;새로운 비밀번호로 변경한다.</a>
          <a @mouseover="showLink3 = true" @mouseleave="showLink3 = false" @click="UpdateUserName">
            <span v-if="showLink3">▶</span><span v-else></span>&nbsp;등록된 이름을 변경한다.</a>
        </div>
        <div>
          <a @mouseover="showLink4 = true" @mouseleave="showLink4 = false" @click="goBack">
            <span v-if="showLink4">▶</span><span v-else></span>&nbsp;돌아간다.</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';
import { ref } from 'vue';

const useStore = useUserStore();
const showLink1 = ref(false);
const showLink2 = ref(false);
const showLink3 = ref(false);
const showLink4 = ref(false);

const userName = ref(useStore.getUser().name);
const userId = ref(useStore.getUser().id);

const typedText = `${userName.value}은(는) 어떤 정보를 바꿀까?`;

const navigateTo = (route) => {
  window.location.href = route;
};

const UpdateUserEmail = () => {
  navigateTo(`/UpdateUserEmail/${userId.value}`);
};

const UpdateUserPassword = () => {
  navigateTo(`/UpdateUserPassword/${userId.value}`);
};

const UpdateUserName = () => {
  navigateTo(`/UpdateUserName/${userId.value}`);
}

const goBack = () => {
  navigateTo(`/main/${userId.value}`);
};

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

.link-container div a{
  color : black;
  width : 370px;
  margin-left : 30px;
  margin-right: 30px;
  margin-bottom : 10px;
}


p {
  margin-top: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  width: 100%;
  height: 100px;
  padding-top: 10px;
  font-size: 24px;
  /* margin-left: 30px; */
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}



.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 8px;
  border-radius: 15px;
}
.disabled {
  pointer-events: none; /* Disable click */
  color: grey; /* Optional: Change color to indicate disabled state */
}
</style>
