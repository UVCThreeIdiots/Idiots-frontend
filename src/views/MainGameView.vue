<template>
  <div class="container">
    <div class="game">
      <img src="../components/images/characterImages/map.png" alt="Game Map" class="game-map"/>
      <div :style="characterStyle" id="character">
        <img :src="currentCharacterImage" alt="Character" class="Character" />
      </div>
    </div>
    <div class="border-box">
      <p>x: {{ characterPosition.left }}, y: {{ characterPosition.top }}</p>
      <!-- <p class="npc">
        <span v-for="(char, index) in npc" :key="index">
          <span :style="{'animation-delay': (index * 0.07) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p> -->
      <p v-html="npc"></p>
    </div>
  </div>
  <div v-if="showUserUpdateModal" class="modal-overlay">
    <div class="modal-content">
      <h2>계정 확인</h2>
      <div class="pass-check">
        <input type="password" class="password-check" v-model="passwordCheck" placeholder="*비밀번호확인*"/>
        <div>
          <button @click="passCheck" class="check-btn">확인</button>
        </div>
      </div>
      <p class="warn">확인을 위해 비밀번호를 입력해주세요</p>
      <button @click="closeUserUpdateModal">취소</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useUserStore } from '../stores/user.js';
import axios from 'axios';
import { useRoute } from 'vue-router';
const route = useRoute();
const initialPosition = route.query.initialPosition; // 초기 위치
let initialX, initialY;
console.log(initialX, initialY);
// 초기 위치에 따라 캐릭터의 초기 위치 설정
if (initialPosition === 'fromOut') {
  initialX = 732;
  initialY = 92;
} else {
  initialX = 300;
  initialY = 300;
}
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
});const step = 8;
const npc = ref(`${userName.value}! 오늘은 무엇을 할까?`);
const obstacles = [
  { x1: 148, y1: 30, x2: 620, y2: 116 },
  { x1: 20, y1: 244, x2: 120, y2: 420 },
  { x1: 348, y1: 244, x2: 620, y2: 388 }
];
const logoutZone = { x1: 120, y1: 300, x2: 150, y2: 410 };
const moveZone = { x1: 700, y1: 30, x2: 750, y2: 50 };
const userInfoZone = { x1: 210, y1: 110, x2: 270, y2: 130 };
const mapBoundaries = {
  top: 36,
  bottom: 410,
  left: 28,
  right: 750,
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
      currentCharacter.value = (currentCharacter.value + 1) % 3;
    }, 80);
  } else if (!interval && ['ArrowLeft'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3 + 3;
    }, 80);
  } else if (!interval && ['ArrowRight'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3 + 6;
    }, 80);
  } else if (!interval && ['ArrowUp'].includes(event.key)) {
    interval = setInterval(() => {
      currentCharacter.value = (currentCharacter.value + 1) % 3 + 9;
    }, 80);
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

  if (
    newPosition.top >= mapBoundaries.top &&
    newPosition.top <= mapBoundaries.bottom &&
    newPosition.left >= mapBoundaries.left &&
    newPosition.left <= mapBoundaries.right &&
    !isColliding(newPosition)
  ) {
    characterPosition.value = newPosition;
    checkZones(newPosition);
  }
}

const isColliding = (position) => {
  return obstacles.some(obstacle =>
    position.left < obstacle.x2 &&
    position.left > obstacle.x1 &&
    position.top < obstacle.y2 &&
    position.top > obstacle.y1
  );
}

const checkZones = (position) => {
  if (isInZone(position, logoutZone)) {
    onLogoutZone();
  } else if (isInZone(position, moveZone)) {
    onMoveZone();
  } else if (isInZone(position, userInfoZone)) {
    onUserInfoZone();
  } else {
    npc.value = `${userName.value}! 오늘은 무엇을 할까?`;
  }
}

const isInZone = (position, zone) => {
  return position.left < zone.x2 &&
    position.left > zone.x1 &&
    position.top < zone.y2 &&
    position.top > zone.y1;
}

const onLogoutZone = () => {
  console.log('Entered the logout zone!');
  npc.value = '로그아웃할까?<br>예 : ENTER';
  const handleLogoutKeydown = (event) => {
    if (event.key === 'Enter') {
      useStore.logout();
      navigateTo('/');
    }
  };

  window.addEventListener('keydown', handleLogoutKeydown, { once: true });
}

const onMoveZone = () => {
  console.log('Entered the move zone!');
  const handleMoveKeydown = () => {
    navigateTo(`/maingameview3/${userPk.value}?initialPosition=home`);
  };

  window.addEventListener('keydown', handleMoveKeydown, { once: true });
}

const onUserInfoZone = () => {
  console.log('Entered the user info zone!');
  npc.value = '유저 정보를 수정할까?<br>예 : ENTER';
  const handleUserInfoKeydown = (event) => {
    if (event.key === 'Enter') {
      openUserUpdateModal();
    }
  };

  window.addEventListener('keydown', handleUserInfoKeydown, { once: true });
}


onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});

window.addEventListener('keyup', () => {
  clearInterval(interval);
  interval = null;
});

const showUserUpdateModal = ref(false);
const passwordCheck = ref('');
const userLoginId = ref(useStore.getUser().userId);
const userId = ref(useStore.getUser().id);

const openUserUpdateModal = () => {
  showUserUpdateModal.value = true;
}

const closeUserUpdateModal = () => {
  showUserUpdateModal.value = false;
  npc.value = 1;
}

const passCheck = () => {
  const saveData = {
    userId: userLoginId.value,
    password: passwordCheck.value,
  };

  axios.post(`http://localhost:3000/auth/login`, JSON.stringify(saveData), {
    headers: {
      'Content-Type': 'application/json'
    },
  }).then((response) => {
    if (response.status === 200) {
      navigateTo(`/updateuserinfo/${userId.value}`);
    } else {
      alert('비밀번호가 일치하지 않습니다.');
    }
  }).catch((error) => {
    console.log('비밀번호 불일치', error);
    alert('비밀번호가 일치하지 않습니다.');
  });
}

const currentCharacterImage = computed(() => new URL(`../components/images/characterImages/${characterImages[currentCharacter.value]}`, import.meta.url).href);
</script>

<style scoped>
.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}
@keyframes reveal {
  0% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}
.npc {
  margin-top: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  font-family: 'CustomFont', Arial, sans-serif;
  color: black;
  font-size: 24px;
  padding : 8px 24px;
}
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
  display : flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.game-map {
  position: relative;
  width: 800px;
  height: 500px;
}
.Character {
  width: 100px;
  height: 100px;
  border : 2px solid black;
}
.border-box {
  border: 2px solid black;
  height : 200px;
  width : 800px;
  padding: 15px;
  margin: 10px;
  border-radius: 15px;
  font-size : 24px;
  color : black;
}

/* userinfo modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'CustomFont', Arial, sans-serif;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 600px;
  height: 450px;
  color: black; /* Set text color to black */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.modal-content button {
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  margin: 10px;
  color: black; /* Ensure button text color is black */
}
.modal-content h2 {
  margin-bottom: 11px;
  /* border: 2px solid black; */
  padding: 16px;
}
.pass-check {
  display: flex;
  align-items: center;
  /* border: 2px solid #000; */
}
.password-check {
  font-family: 'CustomFont';
  font-size: 16px;
  width: 240px;
  height: 40px;
}
.check-btn {
  height: 40px;
}
.warn{
  color:red;
  font-size: 20px;
  padding: 16px;
}
</style>
