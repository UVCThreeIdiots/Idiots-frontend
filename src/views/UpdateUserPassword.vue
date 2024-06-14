<template>
  <div class="container">
    <div class="top">
      <img class="obakuser" src="../components/images/prof_oh.png">
      <span v-for="(char, index) in typedText" :key="index">
          <span :style="{'animation-delay': (index * 0.05) + 's'}" class="hidden-char">{{ char }}</span>
      </span>
    </div>

    <div class="middle">
      <div class="input-container">
        <label for="pw">PW :</label>
        <input type="password" id="pw" v-model="newPassword" class="custom-input" placeholder="새로운 비밀번호">
        <div class="newPasswordCheck">
          <input type="password" id="pw" v-model="newPasswordCheck" class="custom-input" placeholder="비밀번호 확인">
        </div>
      </div>
      <div class="comment">
          <p v-if="!isValidPassword" class="warn">비밀번호는 4자리 이상 설정해야 합니다!</p>
        </div>
    </div>

    <div class="bottom">
      <button class="btn-style" @click="goBack">뒤로가기</button>
      <button class="btn-style" @click="updatePassword" :disabled="!isValidPassword">변경하기</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useUserStore } from '../stores/user.js';
import axiosInstance from '@/config/axiosInstance';
import { useRoute } from 'vue-router';
const route = useRoute();
const initialPosition = route.query.initialPosition;
const typedText = ref('강력한 암호로 설정 해주렴 ! ! !');

const newPassword = ref('');
const newPasswordCheck = ref('');

const isValidPassword = computed(()=>{
  const minLen = 4;
  if (newPassword.value.length < minLen) return false;
  else return true;
});

const useStore = useUserStore();
const userLoginId = ref(useStore.getUser().userId);

const navigateTo = (route) => {
  window.location.href = route;
};

const goBack = () => {
  if (initialPosition === 'home'){
    navigateTo(`/updateuserinfo/?initialPosition=home`);
  }else navigateTo(`/updateuserinfo/`);
};

const updatePassword = () => {
  const saveData = {
    password: newPassword.value,
  };
  if ( newPassword.value !== newPasswordCheck.value ) {
    alert('변경하려는 비밀번호와 확인 비밀번호가 서로 일치하지 않습니다.');
    return;
  }

  // 비밀번호 변경 시 login post 요청하여 사용자가 새로 변경할 비밀번호로 로그인이 성공적으로 진행된다면
  // 기존의 비밀번호와 동일하기 때문에 동일하다는 얼럿 메세지 출력 후 리턴
  // 만일 로그인이 되지 않는다면 catch구문에서 오히려 비밀번호를 변경해주는 로직
  axiosInstance.post(`http://localhost:3000/auth/info`, JSON.stringify(saveData), {
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
        if( res.status === 200) {
          alert('변경하려는 비밀번호와 기존의 비밀번호가 동일합니다.');
          return;
        }}).catch((error) => {
          if (error.response && error.response.status === 400){
            axiosInstance.put(`http://localhost:3000/user/`, JSON.stringify(saveData), {
              headers: {
                'Content-Type': 'application/json',
              },
            }).then(() => {
                console.log('비밀번호 변경 성공');
                alert('비밀번호가 변경되었습니다.');
                axiosInstance.post(`http://localhost:3000/auth/logout/`)
                .then(response => {
                  console.log(response.data);
                  useStore.logout();
                  navigateTo('/');
                })
                .catch(error => {
                  console.log(error);
                })
            }).catch((error) => {
              console.log('비밀번호 변경 실패', error);
            });
          }
        })
      }
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

.comment{
  /* border: 2px solid #000; */
  margin-top: 20px;
  height: 20px;
}

.newPasswordCheck {
  /* border: 2px solid #000; */
  margin-left: 16px;
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
  font-size: 24px;
  display: ruby;
  white-space: pre-wrap;
  overflow: hidden;
  font-size: 24px;
}


.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
}

.obakuser {
  width: 100px;
}

.container {
  font-family: 'CustomFont', Arial, sans-serif;
  width: 900px;
  height: 680px;
  border: 2px solid black;
  background-color: white;
  box-shadow: 4px 4px 0 0 #888, 8px 8px 0 0 #aaa;
  border-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.top{
  flex: 0.2;
  border: 2px solid #000;
  border-radius: 15px;
  height: 300px;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.middle{
  flex: 0.7;
  border: 2px solid #000;
  border-radius: 15px;
  height: 300px;
  margin: 16px 0 0 0;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.bottom{
  flex: 0.15;
  /* border: 2px solid #000;
  border-radius: 15px; */
  height: 300px;
  display: flex;
  justify-content: space-between;
}

.btn-style {
  padding: 10px 20px;
  border: 2px solid #000;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  margin: 8px 16px 8px 16px;
}

.input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
}

.input-container input {
  align-items: middle;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
}

label {
  width:56px;
  font-size: 24px;
  color: black;
}

.custom-input{
  width:250px;
}

.warn{
  color : red;
  font-size : 18px;
}

</style>
