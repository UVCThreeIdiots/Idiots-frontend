<template>
  <div class="container">
    <div class="viewport">
      <div class="game">
        <img src="../components/images/characterImages/map3.png" alt="Game Map" class="game-map"/>
        <div :style="characterStyle" id="character">
          <!-- 이미지 경로를 동적으로 설정 -->
          <img :src="currentCharacterImage" alt="Character" class="Character" />
        </div>
      </div>
    </div>
    <div class="border-box">
      <p>x: {{ characterPosition.left }}, y: {{ characterPosition.top }}</p>
      <p v-html="npc"></p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '../stores/user.js';
import { useRoute } from 'vue-router'; // 추가: 라우터 사용

console.log('hi');
const characterImages = [
  'character_0.png',
  'character_1.png',
  'character_2.png',
  'character_3.png',
  'character_4.png',
  'character_5.png',
  'character_6.png',
  'character_7.png',
  'character_8.png',
  'character_9.png',
  'character_10.png',
  'character_11.png',
];

// 추가: 라우터를 이용하여 초기 위치 및 좌표 값 가져오기
const route = useRoute();
const initialPosition = route.query.initialPosition; // 초기 위치
let initialX, initialY;
console.log(initialX, initialY);
// 초기 위치에 따라 캐릭터의 초기 위치 설정
if (initialPosition === 'home') {
  initialX = 350;
  initialY = 380;
} else if (initialPosition === 'center') {
  initialX = 878;
  initialY = 820;
}


const navigateTo = (route) => {
  window.location.href = route;
};
const useStore = useUserStore();
const userName = ref(useStore.getUser().name);
const userPk = ref(useStore.getUser().id);
const currentCharacter = ref(1);

const characterPosition = ref({
  top: initialY,
  left: initialX,
});

const step = 8; // 이동 속도 조절
const npc = ref(`${userName.value}! 오늘은 무엇을 할까?`);

// 장애물 영역 정의
const obstacles = [
  // { x1: 20, y1: 30, x2: 570, y2: 170 },
];

// 특정 구역 정의
const homeZone = { x1: 330, y1: 330, x2: 380, y2: 360 };
const centerZone = { x1: 855, y1: 780, x2: 905, y2: 800 };

const mapBoundaries = {
  top: 0,
  bottom: 1124,
  left: 40,
  right: 1330,
};

const characterStyle = computed(() => ({
  position: 'absolute',
  top: characterPosition.value.top + 'px',
  left: characterPosition.value.left + 'px',
}));

let interval;
const handleKeyDown = (event) => {
  if (!interval && ['ArrowDown'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3; // 0, 1, 2, 0, 1, 2 반복
    }, 80); // 0.5초마다 변경
  } else if (!interval && ['ArrowLeft'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3 + 3; // 0, 1, 2, 0, 1, 2 반복
    }, 80); // 0.5초마다 변경
  } else if (!interval && ['ArrowRight'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3 + 6; // 0, 1, 2, 0, 1, 2 반복
    }, 80); // 0.5초마다 변경
  } else if (!interval && ['ArrowUp'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3 + 9; // 0, 1, 2, 0, 1, 2 반복
    }, 80); // 0.5초마다 변경
  }

  const newPosition = { ...characterPosition.value };

  switch (event.key) {
    case 'ArrowUp':
      newPosition.top -= step;
      break;
    case 'ArrowDown':
      newPosition.top += step;
      break;
    case 'ArrowLeft':
      newPosition.left -= step;
      break;
    case 'ArrowRight':
      newPosition.left += step;
      break;
  }

  // 경계 확인
  if (
    newPosition.top >= mapBoundaries.top &&
    newPosition.top <= mapBoundaries.bottom &&
    newPosition.left >= mapBoundaries.left &&
    newPosition.left <= mapBoundaries.right &&
    !isColliding(newPosition)
  ) {
    characterPosition.value = newPosition;
    checkHomeEntry(newPosition);
    checkCenterEntry(newPosition);
    updateViewport(newPosition);
  }
}

const isColliding = (position) => {
  return obstacles.some(obstacle => 
    position.left < obstacle.x2 &&
    position.left > obstacle.x1 && 
    position.top < obstacle.y2 &&
    position.top> obstacle.y1 
  );
}

const checkHomeEntry = (position) => {
  if (
    position.left < homeZone.x2 &&
    position.left  > homeZone.x1 &&
    position.top < homeZone.y2 &&
    position.top  > homeZone.y1
  ) {
    onHomeZone();
  } else {
    npc.value = '';
  }
}
const checkCenterEntry = (position) => {
  if (
    position.left < centerZone.x2 &&
    position.left  > centerZone.x1 &&
    position.top < centerZone.y2 &&
    position.top  > centerZone.y1
  ) {
    onCenterZone();
  } else {
    npc.value = '';
  }
}

const onHomeZone = () => {
  console.log('Entered the target zone!');
  const handleHomeKeydown = () => {
      navigateTo(`/maingameview/${userPk.value}?initialPosition=fromOut`)
    }
  window.addEventListener('keydown', handleHomeKeydown, { once: true });
}
const onCenterZone = () => {
  console.log('Entered the target zone!');
  const handleCenterKeydown = () => {
      navigateTo(`/maingameview2/${userPk.value}`)
    }
  window.addEventListener('keydown', handleCenterKeydown, { once: true });
}

const updateViewport = (newPosition) => {
  const viewport = document.querySelector('.viewport');
  const characterPositionX = newPosition.left;
  const characterPositionY = newPosition.top;

  const viewportWidth = viewport.offsetWidth;
  const viewportHeight = viewport.offsetHeight;

  let currentScrollLeft = viewport.scrollLeft;
  let currentScrollTop = viewport.scrollTop;

  const targetScrollLeft = characterPositionX - viewportWidth / 2 + 50;
  const targetScrollTop = characterPositionY - viewportHeight / 2 + 50;

  const animateScroll = () => {
    const distanceX = targetScrollLeft - currentScrollLeft;
    const distanceY = targetScrollTop - currentScrollTop;

    const stepX = distanceX / 10;
    const stepY = distanceY / 10;

    if (Math.abs(distanceX) > 1 || Math.abs(distanceY) > 1) {
      viewport.scrollTo({
        left: currentScrollLeft + stepX,
        top: currentScrollTop + stepY,
        behavior: 'auto'
      });

      currentScrollLeft += stepX;
      currentScrollTop += stepY;
      requestAnimationFrame(animateScroll);
    }
  };

  animateScroll();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  updateViewport(characterPosition.value);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

window.addEventListener('keyup', () => {
  clearInterval(interval);
  interval = null;
});

const currentCharacterImage = computed(() => new URL(`../components/images/characterImages/${characterImages[currentCharacter.value]}`, import.meta.url).href);
</script>

<style scoped>
.container {
  font-family: 'CustomFont', Arial, sans-serif;
  width: 900px;
  height: 680px;
  padding: 10px;
  border: 2px solid black;
  background-color: white;
  box-shadow: 4px 4px 0 0 #888, 8px 8px 0 0 #aaa;
  border-radius: 15px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.viewport {
  width: 800px;
  height: 500px;
  overflow: hidden;
  position: relative;
  border: 2px solid black;
}
.game-map {
  width: 1500px;
  height: 1300px;
  position: absolute;
}
.Character {
  width: 100px;
  height: 100px;
  border: 2px solid black;
}
.border-box {
  border: 2px solid black;
  height: 200px;
  width: 800px;
  padding: 15px;
  margin: 10px;
  border-radius: 15px;
  font-size: 24px;
  color: black;
}
</style>
