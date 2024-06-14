import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/', // 서버의 도메인
  withCredentials: true // 자격 증명 허용
});

export default axiosInstance;
