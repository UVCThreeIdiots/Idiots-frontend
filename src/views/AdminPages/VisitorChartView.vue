<template>
  <div class="chart-cont">
    <div class ="box">
      <h3>Daily New and Deleted Users (Last 7 Days)</h3>
      <Line class="t" v-if="chartData.datasets[0].data.length || chartData.datasets[1].data.length" :data="chartData" :options="chartOptions" />
    </div>
    <div class="box">
      <h3>Monthly New and Deleted Users (Last 12 Months)</h3>
      <Line class="t" v-if="chartDataMonthly.datasets[0].data.length || chartDataMonthly.datasets[1].data.length" :data="chartDataMonthly" :options="chartOptionsMonthly" />
    </div>
    <div class ="box">
      <h3>Daily New and Deleted Users by Day of the Week</h3>
      <Line class="t" v-if="chartDataWeekly.datasets[0].data.length || chartDataWeekly.datasets[1].data.length" :data="chartDataWeekly" :options="chartOptionsWeekly" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { Line } from 'vue-chartjs';
import axiosInstance from '@/config/axiosInstance.js';
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
      backgroundColor: 'rgba(75, 192, 192, 0.2)', 
      borderColor: 'rgba(75, 192, 192, 1)', 
      data: [],
      fill: true,
    },
    {
      label: 'Daily Deleted Users',
      backgroundColor: 'rgba(255, 99, 132, 0.2)', 
      borderColor: 'rgba(255, 99, 132, 1)', 
      data: [],
      fill: true,
    },
  ],
});

const chartDataWeekly = ref({
  labels: [],
  datasets: [
    {
      label: 'Weekly New Users',
      backgroundColor: 'rgba(75, 192, 192, 0.2)', 
      borderColor: 'rgba(75, 192, 192, 1)', 
      data: [],
      fill: true,
    },
    {
      label: 'Weekly Deleted Users',
      backgroundColor: 'rgba(255, 99, 132, 0.2)', 
      borderColor: 'rgba(255, 99, 132, 1)', 
      data: [],
      fill: true,
    },
  ],
});

const chartDataMonthly = ref({
  labels: [],
  datasets: [
    {
      label: 'Monthly New Users',
      backgroundColor: 'rgba(75, 192, 192, 0.2)', 
      borderColor: 'rgba(75, 192, 192, 1)', 
      data: [],
      fill: true,
    },
    {
      label: 'Monthly Deleted Users',
      backgroundColor: 'rgba(255, 99, 132, 0.2)', 
      borderColor: 'rgba(255, 99, 132, 1)', 
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
      text: 'Daily New and Deleted Users (Last 7 Days)',
    },
  },
};

const chartOptionsWeekly = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      text: 'Weekly New and Deleted Users (Last 8 Weeks)',
    },
  },
};

const chartOptionsMonthly = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      text: 'Monthly New and Deleted Users (Last 12 Months)',
    },
  },
};

const fetchUserData = async () => {
  try {
    const response = await axiosInstance.get('http://13.125.169.9:3000/user/all');
    users.value = response.data;
    updateChartData();
    updateChartDataWeekly();
    updateChartDataMonthly();
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
    console.log(dateString);
    dateCounts[dateString] = { newUsers: 0, deletedUsers: 0 };
  }
  console.log(dateCounts);
  users.value.forEach(user => {
    const userCreatedAt = new Date(user.createdAt);
    const createdAtDateString = userCreatedAt.toISOString().split('T')[0];

    if (dateCounts.hasOwnProperty(createdAtDateString)) {
      dateCounts[createdAtDateString].newUsers++;
    }

    if (user.deletedAt) {
      const userDeletedAt = new Date(user.deletedAt);
      const deletedAtDateString = userDeletedAt.toISOString().split('T')[0];

      if (dateCounts.hasOwnProperty(deletedAtDateString)) {
        dateCounts[deletedAtDateString].deletedUsers++;
      }
    }
  });

  chartData.value.labels = Object.keys(dateCounts).reverse(); 
  chartData.value.datasets[0].data = Object.values(dateCounts).map(date => date.newUsers).reverse();
  chartData.value.datasets[1].data = Object.values(dateCounts).map(date => date.deletedUsers).reverse();
};

const updateChartDataWeekly = () => {
  const dayOfWeekLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateCounts = {};
  const today = new Date();

  // Initialize the dateCounts with each day of the week
  for (let i = 0; i < 7; i++) {
    dateCounts[dayOfWeekLabels[i]] = { newUsers: 0, deletedUsers: 0 };
  }

  users.value.forEach(user => {
    const userCreatedAt = new Date(user.createdAt);
    const createdDayOfWeek = dayOfWeekLabels[userCreatedAt.getDay()];

    if (dateCounts.hasOwnProperty(createdDayOfWeek)) {
      dateCounts[createdDayOfWeek].newUsers++;
    }

    if (user.deletedAt) {
      const userDeletedAt = new Date(user.deletedAt);
      const deletedDayOfWeek = dayOfWeekLabels[userDeletedAt.getDay()];

      if (dateCounts.hasOwnProperty(deletedDayOfWeek)) {
        dateCounts[deletedDayOfWeek].deletedUsers++;
      }
    }
  });

  // Prepare chart data
  chartDataWeekly.value.labels = dayOfWeekLabels;
  chartDataWeekly.value.datasets[0].data = dayOfWeekLabels.map(day => {
    const data = dateCounts[day];
    return data ? data.newUsers : 0;
  });
  chartDataWeekly.value.datasets[1].data = dayOfWeekLabels.map(day => {
    const data = dateCounts[day];
    return data ? data.deletedUsers : 0;
  });
};


const updateChartDataMonthly = () => {
  const dateCounts = {};
  const today = new Date();

  // Initialize the dateCounts with the last 12 months
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dateCounts[dateString] = { newUsers: 0, deletedUsers: 0 };
  }

  users.value.forEach(user => {
    const userCreatedAt = new Date(user.createdAt);
    const monthCreatedAt = `${userCreatedAt.getFullYear()}-${String(userCreatedAt.getMonth() + 1).padStart(2, '0')}`;

    if (dateCounts.hasOwnProperty(monthCreatedAt)) {
      dateCounts[monthCreatedAt].newUsers++;
    }

    if (user.deletedAt) {
      const userDeletedAt = new Date(user.deletedAt);
      const monthDeletedAt = `${userDeletedAt.getFullYear()}-${String(userDeletedAt.getMonth() + 1).padStart(2, '0')}`;

      if (dateCounts.hasOwnProperty(monthDeletedAt)) {
        dateCounts[monthDeletedAt].deletedUsers++;
      }
    }
  });

  chartDataMonthly.value.labels = Object.keys(dateCounts).reverse();
  chartDataMonthly.value.datasets[0].data = Object.values(dateCounts).map(date => date.newUsers).reverse();
  chartDataMonthly.value.datasets[1].data = Object.values(dateCounts).map(date => date.deletedUsers).reverse();
};

onMounted(fetchUserData);

// chartData가 업데이트될 때 로그
watch(chartData, (newVal) => {
  console.log('ChartData updated:', newVal);
}, { deep: true });

watch(chartDataWeekly, (newVal) => {
  console.log('ChartDataWeekly updated:', newVal);
}, { deep: true });

watch(chartDataMonthly, (newVal) => {
  console.log('ChartDataMonthly updated:', newVal);
}, { deep: true });
</script>

<style scoped>
.chart-cont{
  display:flex;
  flex-direction: row;
}
.t {
  width: 860px;
}
h3 {
  text-align: center;
  margin: 10px;
  color: #254336;
  font-size: 24px;
}
</style>
