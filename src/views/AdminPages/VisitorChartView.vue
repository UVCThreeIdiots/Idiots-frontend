<template>
  <div class="chart-container">
    <Line v-if="chartData.datasets[0].data.length || chartData.datasets[1].data.length" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Line } from 'vue-chartjs';
import axios from 'axios';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
} from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler
);

const users = ref([]);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Daily New Users',
      backgroundColor: 'rgba(75, 192, 192, 0.2)', // 수정된 배경색
      borderColor: 'rgba(75, 192, 192, 1)', // 수정된 테두리색
      data: [],
      fill: true,
    },
    {
      label: 'Daily Deleted Users',
      backgroundColor: 'rgba(255, 99, 132, 0.2)', // 삭제된 유저의 배경색
      borderColor: 'rgba(255, 99, 132, 1)', // 삭제된 유저의 테두리색
      data: [],
      fill: true,
    },
  ],
});
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Daily New and Deleted Users (Last 7 Days)',
    },
  },
};

const fetchUserData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/user/all');
    users.value = response.data;
    console.log(response.data);
    updateChartData();
  } catch (error) {
    console.error('Error fetching user data:', error);
  }
};

const updateChartData = () => {
  const dateCounts = {};
  const today = new Date();
  
  // Initialize the dateCounts with the last 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    dateCounts[dateString] = { newUsers: 0, deletedUsers: 0 };
  }

  // Loop through the users and count registrations and deletions by date
  users.value.forEach(user => {
    const userCreatedAt = new Date(user.createdAt);
    const createdAtDateString = userCreatedAt.toISOString().split('T')[0];

    if (dateCounts.hasOwnProperty(createdAtDateString)) {
      dateCounts[createdAtDateString].newUsers++;
    }
    console.log(user.deletedAt);
    console.log(user.createdAt);
    if (user.deletedAt) {
      const userDeletedAt = new Date(user.deletedAt);
      const deletedAtDateString = userDeletedAt.toISOString().split('T')[0];

      if (dateCounts.hasOwnProperty(deletedAtDateString)) {
        dateCounts[deletedAtDateString].deletedUsers++;
        
      }
    }
  });

  // Prepare chart data
  chartData.value.labels = Object.keys(dateCounts).reverse(); // 날짜 배열
  chartData.value.datasets[0].data = Object.values(dateCounts).map(date => date.newUsers).reverse(); // 가입자 수 배열
  chartData.value.datasets[1].data = Object.values(dateCounts).map(date => date.deletedUsers).reverse(); // 삭제자 수 배열

  console.log(chartData.value); // 차트 데이터 로그
};

onMounted(fetchUserData);

// chartData가 업데이트될 때 로그
watch(chartData, (newVal) => {
  console.log('ChartData updated:', newVal);
}, { deep: true });
</script>

<style scoped>
.chart-container {
  height : 720px;
  width:  1080px; /* 차트가 채워질 너비 설정 */
  background-color: white;
}
</style>
