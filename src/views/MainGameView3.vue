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
      <!-- <p>x: {{ characterPosition.left }}, y: {{ characterPosition.top }}</p> -->
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
// 요일 배열
const daysOfWeek = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
// 오늘의 요일을 저장할 ref 변수
const dayOfWeek = ref('');
// 오늘의 요일을 계산하는 함수
const getDayOfWeek = () => {
  const today = new Date();
  const dayIndex = today.getDay();
  return daysOfWeek[dayIndex];
};
// 추가: 라우터를 이용하여 초기 위치 및 좌표 값 가져오기
const route = useRoute();
const initialPosition = route.query.initialPosition; // 초기 위치
let initialX, initialY;
console.log(initialX, initialY);
// 초기 위치에 따라 캐릭터의 초기 위치 설정
if (initialPosition === 'home') {
  initialX = 350;
  initialY = 420;
} else if (initialPosition === 'center') {
  initialX = 878;
  initialY = 836;
}


const navigateTo = (route) => {
  window.location.href = route;
};
const useStore = useUserStore();
const userName = ref(useStore.getUser().name);
const currentCharacter = ref(1);

const characterPosition = ref({
  top: initialY,
  left: initialX,
});

const step = 8; // 이동 속도 조절
const npc = ref(`${userName.value}! 오늘은 무엇을 할까?`);

// 장애물 영역 정의
const obstacles = [
  { x1: 662, y1: 476, x2: 1166, y2: 796 }, // center
  { x1: 206, y1: 564, x2: 582, y2: 660 }, // home아래 화단울타리
  { x1: 206, y1: 116, x2: 582, y2: 356 }, // home
  { x1: 126, y1: 268, x2: 278, y2: 356 }, // home 푯말
  { x1: 0, y1: 0, x2: 556, y2: 76 },//왼쪽 상단 엔드라인
  { x1: 654, y1: 0, x2: 2000, y2: 76 },//오른쪽 상단 엔드라인
  { x1: 806, y1: 116, x2: 1182, y2: 356 }, // 빈집
  { x1: 726, y1: 268, x2: 878, y2: 356 }, // 빈집 푯말
  { x1: 206, y1: 908, x2: 582, y2: 2000 }, // 강
  { x1: 662, y1: 852, x2: 1166, y2: 948 }, // center아래 화단울타리
];

// 특정 구역 정의
const homeZone = { x1: 330, y1: 330, x2: 380, y2: 360 };
const centerZone = { x1: 855, y1: 780, x2: 905, y2: 800 };
const hometagZone = { x1: 126, y1: 350, x2: 278, y2: 380 };
const emptytagZone = { x1: 726, y1: 350, x2: 878, y2: 380 };
const centertagZone = { x1: 910, y1: 940, x2: 998, y2: 964 };
const flowertagZone = { x1: 462, y1: 654, x2: 550, y2: 680 };
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
    checkTagEntry(newPosition);
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
const checkTagEntry = (position) => {
  if (
    position.left < emptytagZone.x2 &&
    position.left  > emptytagZone.x1 &&
    position.top < emptytagZone.y2 &&
    position.top  > emptytagZone.y1
  ) {
    npc.value = '[관리자의 집]<br권한이 있는 사람만 접근 가능합니다.'
  }
  else if (
    position.left < hometagZone.x2 &&
    position.left  > hometagZone.x1 &&
    position.top < hometagZone.y2 &&
    position.top  > hometagZone.y1
  ){
    npc.value = `[${userName.value}의 집]<br>로그아웃 및 유저정보 수정이 가능합니다.`;
  }
  else if (
    position.left < centertagZone.x2 &&
    position.left  > centertagZone.x1 &&
    position.top < centertagZone.y2 &&
    position.top  > centertagZone.y1
  ){
    npc.value = `[캡슐 센터]<br>캡슐의 생성 및 전송, 진척도 및 도감 확인이 가능합니다.`;
  }
  else if (
    position.left < flowertagZone.x2 &&
    position.left  > flowertagZone.x1 &&
    position.top < flowertagZone.y2 &&
    position.top  > flowertagZone.y1
  ){
    console.log(dayOfWeek.value);
    if(dayOfWeek.value === '월요일')
      npc.value = `[오늘의 팁] - 월요일<br>새로운 한 주가 시작되는 날입니다. 에너지를 충전하고, 이번 주 목표를 설정해보세요!!`;
    else if(dayOfWeek.value === '화요일')
      npc.value = `[오늘의 팁] - 화요일<br>월요일의 피로가 가시기 시작하는 날입니다. 운동이나 산책을 하며 활력을 되찾아보세요!!`;
    else if(dayOfWeek.value === '수요일')
      npc.value = `[오늘의 팁] - 수요일<br>한 주의 중간입니다. 이제 절반을 넘겼으니, 주말까지 조금만 더 힘내세요!!`;
    else if(dayOfWeek.value === '목요일')
      npc.value = `[오늘의 팁] - 목요일<br>주말이 다가오는 날입니다. 미뤄둔 일들을 정리하고, 주말 계획을 세워보세요!!`;
    else if(dayOfWeek.value === '금요일')
      npc.value = `[오늘의 팁] - 금요일<br>드디어 주말 전날입니다. 오늘 하루만 더 힘내면 즐거운 주말이 기다리고 있어요!!`;
    else if(dayOfWeek.value === '토요일')
      npc.value = `[오늘의 팁] - 토요일<br>휴식과 즐거움을 만끽하는 날입니다. 친구들과 만나거나, 좋아하는 취미를 즐겨보세요!!`;
    else if(dayOfWeek.value === '일요일')
      npc.value = `[오늘의 팁] - 일요일<br>새로운 한 주가 시작되는 날입니다. 에너지를 충전하고, 이번 주 목표를 설정해보세요!!`;
  }
  else {
    npc.value = '';
  }
}


const onHomeZone = () => {
  console.log('Entered the target zone!');
  const handleHomeKeydown = () => {
      navigateTo(`/maingameview/?initialPosition=fromOut`)
    }
  window.addEventListener('keydown', handleHomeKeydown, { once: true });
}
const onCenterZone = () => {
  console.log('Entered the target zone!');
  const handleCenterKeydown = () => {
      navigateTo(`/maingameview2/`)
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
  dayOfWeek.value = getDayOfWeek();
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
  height: 800px;
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
