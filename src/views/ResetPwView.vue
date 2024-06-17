<template>
  <div>
    <h2>Reset Password</h2>
    <form @submit.prevent="resetPassword">
      <div>
        <label for="password">New Password</label>
        <input type="password" v-model="password" required />
      </div>
      <div>
        <label for="confirmPassword">Confirm Password</label>
        <input type="password" v-model="confirmPassword" required />
      </div>
      <button type="submit">Reset Password</button>
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
    await axiosInstance.post(`http://localhost:3000/auth/reset-password/${token}`, { password: password.value });
    alert('Password has been reset');
    navigateTo('/'); // 비밀번호 재설정 후 로그인 페이지로 리디렉션
  } catch (error) {
    alert('Failed to reset password');
  }
};
</script>
