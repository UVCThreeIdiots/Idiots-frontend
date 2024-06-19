<template>
  <div class="container">
    <h2>Reset Password</h2>
    <form @submit.prevent="resetPassword" class="c">
      <div class="contents">
      <div>
        <label for="password">New Password : </label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password : </label>
        <input type="password" v-model="confirmPassword" required />
      </div>
    </div>
      <button type="submit">Reset PW</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import axiosInstance from '@/config/axiosInstance';

const password = ref('');
const confirmPassword = ref('');
const route = useRoute();

const navigateTo = (route) => {
  window.location.href = route;
};

const resetPassword = async () => {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match');
    return;
  }
  try {
    const token = route.params.token;
    await axiosInstance.post(`https://www.3idiots.xyz:3000/auth/reset-password/${token}`, { password: password.value });
    alert('Password has been reset');
    navigateTo('/'); // 비밀번호 재설정 후 로그인 페이지로 리디렉션
  } catch (error) {
    alert('Failed to reset password');
  }
};
</script>

<style scoped>
body {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}
.container {
  display:flex;
  flex-direction: column;
  background-color : white;
  color : black;
  width : 400px;
  height : 230px;
  padding: 16px;
  border-radius : 10px;
  margin : 10px;
  align-items:center;
}
.contents {
  display : flex;
  flex-direction : column;
  margin : 20px;
  align-items : end;
  width :300px;
  justify-items: center;
  font-size : 16px;
  

}
.c{
  display : flex;
  flex-direction: column;
  justify-items:center;
  align-items:center;
}
button{
  width : 100px;
  height : 40px;
  border-radius : 10px;
  border : none;
  background : lightgrey;
  cursor : pointer;
  margin-top : 20px;
}
</style>