<template>
  <div class="container">
    <NavigationView/>
    <div class="main-content">
      <div class="header-div">
        <div class="header">
          <h2>Dashboard</h2>
        </div>
      </div>
      <div class="chartBox">
        <div id="carouselExampleIndicators" class="carousel slide" data-bs-ride="carousel">
          <div class="carousel-indicators">
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2"></button>
            <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3"></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <VisitorChartView/>
            </div>
            <div class="carousel-item">
              <VisitorChartView/>
            </div>
            <div class="carousel-item">
              <VisitorChartView/>
            </div>
          </div>
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Previous</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavigationView from './NavigationView.vue';
import { ref, computed, onMounted } from 'vue';
import axiosInstance from '@/config/axiosInstance.js';
import VisitorChartView from './VisitorChartView.vue';
const users = ref([]);

</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: black;
}
.main-content {
  width: 1200px;
  background-color: #DAD3BE;
  margin: 20px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2{font-size:40px;color:white;margin-left:40px;}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin : 10px;
  height : 90px;
  background-color : #6B8A7A;
  width : 1080px;
}
.header-div{
  display:flex;
  justify-content: center;
}
.chartBox{
  width: 1080px;
  height : 720px;
  display:flex;
  background-color:#6B8A7A;
  justify-content: center;
  flex-direction: column;


}
.t{
  display:flex;
  margin:20px;
}
.chartSidebar{
  width : 200px;
  background-color : grey;
}
.chart{
  width:700px;
  background-color : white;
}
.carousel-inner{
  display:flex;

}
</style>
