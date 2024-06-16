<template>
  <div class="container">
    <NavigationView />
    <div class="main-content">
      <div class="header-div">
        <div class="header">
          <h2>Dashboard</h2>
        </div>
      </div>
      <div class="chartBox">
        <div class="prev-button prev-button-1">〈</div>
        <div class="carousel-container carousel-container-1">
          <div class="carousel carousel-1">
              <VisitorChartView />
          </div>
        </div>
        <div class="next-button next-button-1">〉</div>
      </div>
      <div class="chartBox">
        <div class="prev-button prev-button-2">〈</div>
        <div class="carousel-container carousel-container-2">
          <div class="carousel carousel-2">
              <CapsuleChartView/>
          </div>
        </div>
        <div class="next-button next-button-2">〉</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavigationView from './NavigationView.vue';
import { ref, onMounted } from 'vue';
import VisitorChartView from './VisitorChartView.vue';
import CapsuleChartView from './CapsuleChartView.vue';
const users = ref([]);

onMounted(() => {
  setupCarousel(1);
  setupCarousel(2);
});

function setupCarousel(carouselNumber) {
  const CAROUSEL_LENGTH = 2;
  let current = 0;

  const $carousel = document.querySelector(`.carousel-${carouselNumber}`);
  const $prevButton = document.querySelector(`.prev-button-${carouselNumber}`);
  const $nextButton = document.querySelector(`.next-button-${carouselNumber}`);

  const nextEvent = () => {
    if (current !== CAROUSEL_LENGTH) {
      $carousel.style.transform = `translateX(${(current + 1) * -860}px)`;
      current++;
    } else {
      current = 0;
      $carousel.style.transform = `translateX(0px)`;
    }
  };

  const prevEvent = () => {
    if (current !== 0) {
      current--;
      $carousel.style.transform = `translateX(${current * -860}px)`;
    } else {
      current = CAROUSEL_LENGTH;
      $carousel.style.transform = `translateX(${CAROUSEL_LENGTH * -860}px)`;
    }
  };

  $nextButton.addEventListener('click', nextEvent);
  $prevButton.addEventListener('click', prevEvent);
}
</script>

<style scoped>
.container {
  display: flex;
  background-color: black;
  width : 100vw;
  min-width: 1500px;
  justify-content: center;
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
  min-height: 1000px;
  overflow: auto;
  overflow-x : hidden;
  overflow-y : hidden;
}
h2 {
  font-size: 40px;
  color: white;
  margin-left: 40px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 10px;
  height: 90px;
  background-color: #6B8A7A;
  width: 1080px;
  border-radius:10px;
}
.header-div {
  display: flex;
  justify-content: center;
}
.chartBox {
  width: 1080px;
  height: 560px;
  display: flex;
  background-color: white;
  justify-content: center;
  align-items: center;
  margin: 20px 20px 60px 20px;
  border-radius: 10px;
}
.carousel-container {
  width: 900px;
  height: 500px;
  overflow: hidden;
}
.carousel {
  display: flex;
  transition: all 0.5s;
}
.prev-button,
.next-button {
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  width: 113px;
  height: 100px;
  color: rgb(181, 181, 181);
  text-align: center;
  justify-content: center;
  align-items: center;
  font-size: 100px;
}
</style>
