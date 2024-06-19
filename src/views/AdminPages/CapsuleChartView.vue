<template>
  <div class="chart-cont">
    <div class="box">
      <h3>Daily New TimeCapsules and GoalCapsules (Last 7 Days)</h3>
      <Line class="t" v-if="chartData.datasets[0].data.length || chartData.datasets[1].data.length" :data="chartData" :options="chartOptions" />
    </div>
    <div class="box">
      <h3>Monthly New TimeCapsules and GoalCapsules (Last 12 Months)</h3>
      <Line class="t" v-if="chartDataMonthly.datasets[0].data.length || chartDataMonthly.datasets[1].data.length" :data="chartDataMonthly" :options="chartOptionsMonthly" />
    </div>
    <div class="box">
      <h3>Daily New TimeCapsules and GoalCapsules by Day of the Week</h3>
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

const timeCapsules = ref([]);
const goalCapsules = ref([]);
const chartData = ref({
  labels: [],
  datasets: [
    {
      label: 'Daily New TimeCapsules',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [],
      fill: true,
    },
    {
      label: 'Daily New GoalCapsules',
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
      label: 'Monthly New TimeCapsules',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [],
      fill: true,
    },
    {
      label: 'Monthly New GoalCapsules',
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
      label: 'New TimeCapsules by Day of the Week',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      data: [],
      fill: true,
    },
    {
      label: 'New GoalCapsules by Day of the Week',
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
      display: true,
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
      display: true,
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
      display: true,
    },
  },
};

const fetchCapsuleData = async () => {
  try {
    const response = await axiosInstance.get('https://www.3idiots.xyz:3000/time/allTCapsules');
    timeCapsules.value = response.data;
    const response2 = await axiosInstance.get('https://www.3idiots.xyz:3000/goal/all');
    goalCapsules.value = response2.data;
    updateData();
    updateDataWeekly();
    updateDataMonthly();
  } catch (error) {
    console.error('Error fetching Capsule data:', error);
  }
};

const updateData = () => {
  const dateCounts = {};
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    dateCounts[dateString] = { newTimeCapsules: 0, newGoalCapsules: 0 };
  }

  timeCapsules.value.forEach(timeCapsule => {
    const timeCapsuleCreatedAt = new Date(timeCapsule.createdAt);
    const createdAtDateString = timeCapsuleCreatedAt.toISOString().split('T')[0];

    if (dateCounts.hasOwnProperty(createdAtDateString)) {
      dateCounts[createdAtDateString].newTimeCapsules++;
    }
  });

  goalCapsules.value.forEach(goalCapsule => {
    const goalCapsuleCreatedAt = new Date(goalCapsule.createdAt);
    const createdAtDateString = goalCapsuleCreatedAt.toISOString().split('T')[0];

    if (dateCounts.hasOwnProperty(createdAtDateString)) {
      dateCounts[createdAtDateString].newGoalCapsules++;
    }
  });

  const labels = Object.keys(dateCounts).reverse();
  const data = Object.values(dateCounts).map(date => date.newTimeCapsules).reverse();
  const data2 = Object.values(dateCounts).map(date => date.newGoalCapsules).reverse();

  chartData.value.labels = labels;
  chartData.value.datasets[0].data = data;
  chartData.value.datasets[1].data = data2;
};

const updateDataWeekly = () => {
  const dayOfWeekLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dateCounts = {};
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    dateCounts[dayOfWeekLabels[i]] = { newTimeCapsules: 0, newGoalCapsules: 0 };
  }

  timeCapsules.value.forEach(timeCapsule => {
    const timeCapsuleCreatedAt = new Date(timeCapsule.createdAt);
    const createdDayOfWeek = dayOfWeekLabels[timeCapsuleCreatedAt.getDay()];

    if (dateCounts.hasOwnProperty(createdDayOfWeek)) {
      dateCounts[createdDayOfWeek].newTimeCapsules++;
    }
  });

  goalCapsules.value.forEach(goalCapsule => {
    const goalCapsuleCreatedAt = new Date(goalCapsule.createdAt);
    const createdDayOfWeek = dayOfWeekLabels[goalCapsuleCreatedAt.getDay()];

    if (dateCounts.hasOwnProperty(createdDayOfWeek)) {
      dateCounts[createdDayOfWeek].newGoalCapsules++;
    }
  });

  chartDataWeekly.value.labels = dayOfWeekLabels;
  chartDataWeekly.value.datasets[0].data = dayOfWeekLabels.map(day => {
    const data = dateCounts[day];
    return data ? data.newTimeCapsules : 0;
  });
  chartDataWeekly.value.datasets[1].data = dayOfWeekLabels.map(day => {
    const data = dateCounts[day];
    return data ? data.newGoalCapsules : 0;
  });
};

const updateDataMonthly = () => {
  const dateCounts = {};
  const today = new Date();

  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setMonth(today.getMonth() - i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    dateCounts[dateString] = { newTimeCapsules: 0, newGoalCapsules: 0 };
  }

  timeCapsules.value.forEach(timeCapsule => {
    const timeCapsuleCreatedAt = new Date(timeCapsule.createdAt);
    const monthCreatedAt = `${timeCapsuleCreatedAt.getFullYear()}-${String(timeCapsuleCreatedAt.getMonth() + 1).padStart(2, '0')}`;

    if (dateCounts.hasOwnProperty(monthCreatedAt)) {
      dateCounts[monthCreatedAt].newTimeCapsules++;
    }
  });

  goalCapsules.value.forEach(goalCapsule => {
    const goalCapsuleCreatedAt = new Date(goalCapsule.createdAt);
    const monthCreatedAt = `${goalCapsuleCreatedAt.getFullYear()}-${String(goalCapsuleCreatedAt.getMonth() + 1).padStart(2, '0')}`;

    if (dateCounts.hasOwnProperty(monthCreatedAt)) {
      dateCounts[monthCreatedAt].newGoalCapsules++;
    }
  });

  chartDataMonthly.value.labels = Object.keys(dateCounts).reverse();
  chartDataMonthly.value.datasets[0].data = Object.values(dateCounts).map(date => date.newTimeCapsules).reverse();
  chartDataMonthly.value.datasets[1].data = Object.values(dateCounts).map(date => date.newGoalCapsules).reverse();
};

onMounted(fetchCapsuleData);

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
