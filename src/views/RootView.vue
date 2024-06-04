<template>
  <div id="root" class="container">
    <img class="img" src="../components/images/prof_oh.png">
    <div class="border-box">
      <div class="npc">
        <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.1) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </div>
    </div>
    <div class="userData.userId;-box">
      <div class="input-container">
        <div>
          <label for="id">ID :</label>
          <input type="text" id="id" v-model="userId" class="custom-input">
        </div>
        <div>
          <label for="pw">PW :</label>
          <input type="password" id="pw" v-model="password" class="custom-input">
        </div>
      </div>
      <div class="button-container">
        <button @click="navigateTo('/signup')">회원가입</button>
        <button @click="navigateTo('/findinfo')">아이디 / 비밀번호 찾기</button>
        <button @click="loginSubmit">로그인</button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '../stores/user.js';  // User 스토어를 import
import { ref } from 'vue';
import axios from 'axios';

const userId = ref('');
const password = ref('');
const typedText = ref('캡슐의 세계에 잘 왔단다! \n이 곳에서 너의 캡슐을 만들어보자! ');
const useStore = useUserStore();
const navigateTo = (route) => {
  window.location.href = route;
};

// const loginSubmit = () => {
//   const saveData = {
//     userId: userId.value,
//     password: password.value
//   };

//   axios.post("http://localhost:3000/auth/login", JSON.stringify(saveData), {
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//     .then((res) => {
//       res.body = {
//         "id": 9,
//         "userId": "jun",
//         "password": "KA0oeAchXMBTfnzkx8ia6tUxObadZa0ytmPLjPinRMlgHl83mPVlioNv/u4vRpFalvjF9ya189D+biHjnwlG3Q==.13ebe6b2c0cad23e2747746847f14d2a36523e93b0cb849e51f74f2f3328419d3cb04076c8054090767f79306ce2288fc30956abde4dcdb74e3117b2c1ea03ce",
//         "name": "junseob",
//         "age": 20,
//         "email": "userbruce@naver.com",
//         "updatedAt": "2024-05-30T08:05:50.691Z",
//         "createdAt": "2024-05-30T08:05:50.691Z",
//         "deletedAt": null
//       }
//       // if (res.status === 200) {
//         // 로그인 성공시 처리해줘야할 부분
//         const loginedId = res.body.id;
//         const loginedName = res.body.name;
//         useUserStore.setUser(loginedId, loginedName);
//         navigateTo('/about')
//         console.log("로그인 성공");
//         console.log(`${loginedId, loginedName}`)
//       // }
//     })
//     .catch((error) => {
//       console.error(error);
//     });
// };


const loginSubmit = () => {

// if (res.status === 200) {
  // 로그인 성공시 처리해줘야할 부분
  const loginedId = 9;
  const loginedName = "junseob";
  useStore.setUser(loginedId, loginedName);
  navigateTo(`/main/${loginedId}`)
  console.log("로그인 성공");
  console.log("loginedId:", loginedId);
  console.log("loginedName:", loginedName);      // }
  console.log(`test : ${useStore.id} ${useStore.name}`);
};
</script>

<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}

label{
  width: 65px;
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

.img {
  width: 250px;
  height: 250px;
  display: block;
  margin: 0 auto 20px;
}

.input-container {
  display: flex;
  justify-content: space-around;
  margin: 15px;
  margin-bottom: 30px;
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

.npc {
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
</style>
