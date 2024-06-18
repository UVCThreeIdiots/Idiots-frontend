import axios from 'axios';
import { useSessionStore } from '../stores/session';

const axiosInstance = axios.create({
  baseURL: 'http://13.125.169.9:80/', // 서버의 도메인
  withCredentials: true // 자격 증명 허용
});

// 인터셉터 추가
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      const sessionStore = useSessionStore();
      sessionStore.checkSession();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
