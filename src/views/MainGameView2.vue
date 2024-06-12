<template>
  <div class="container">
    <div class="game">
      <img src="../components/images/characterImages/map2.png" alt="Game Map" class="game-map"/>
      <div :style="characterStyle" id="character">
        <!-- 이미지 경로를 동적으로 설정 -->
        <img :src="currentCharacterImage" alt="Character" class="Character" />
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
const currentCharacter = ref(10);
const characterPosition = ref({ top: 350, left: 364 });
const step = 8; // 이동 속도 조절
const npc = ref(`${userName.value}! 오늘은 무엇을 할까?`);

// 장애물 영역 정의
const obstacles = [
  { x1: 20, y1: 30, x2: 570, y2: 170 },
];

// 특정 구역 정의
const capsuleZone = { x1: 280, y1: 160, x2: 340, y2: 194 };
const outZone = { x1: 290, y1: 400, x2: 440, y2: 420 };
const computerZone = { x1: 460, y1: 160, x2:532, y2 : 190};
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
    checkOutEntry(newPosition);
    checkCapsuleEntry(newPosition);
    checkComputerEntry(newPosition);
  }
}

// 충돌 여부 확인 함수
const isColliding = (position) => {
  return obstacles.some(obstacle => 
    position.left < obstacle.x2 &&
    position.left > obstacle.x1 && // 캐릭터의 너비 50px 가정
    position.top < obstacle.y2 &&
    position.top > obstacle.y1 // 캐릭터의 높이 50px 가정
  );
}

// 특정 구역 진입 여부 확인 함수
const checkOutEntry = (position) => {
  if (
    position.left < outZone.x2 &&
    position.left > outZone.x1 &&
    position.top < outZone.y2 &&
    position.top > outZone.y1
  ) {
    onOutZone();
  } else {
    npc.value = '';
  }
}

const checkCapsuleEntry = (position) => {
  if (
    position.left < capsuleZone.x2 &&
    position.left > capsuleZone.x1 &&
    position.top < capsuleZone.y2 &&
    position.top > capsuleZone.y1
  ) {
    onCapsuleZone();
  } else {
    npc.value = '';
  }
}
const checkComputerEntry = (position) => {
  if (
    position.left < computerZone.x2 &&
    position.left > computerZone.x1 &&
    position.top < computerZone.y2 &&
    position.top > computerZone.y1
  ) {
    onComputerZone();
  } else {
    npc.value = '';
  }
}
// 특정 구역에 들어갔을 때 실행되는 함수
const onOutZone = () => {
  console.log('Entered the target zone!');

  const handleOutKeydown = () => {
      navigateTo(`/maingameview3/${userPk.value}?initialPosition=center`);
      window.removeEventListener('keydown', handleOutKeydown);
    }


  window.addEventListener('keydown', handleOutKeydown, { once: true });
}

const onCapsuleZone = () => {
  console.log('Entered the capsule zone!');
  npc.value = '이곳에서는 캡슐을 생성하거나 전송할 수 있단다!! 진행할까?<br>(예 : ENTER)';

  const handleCapsuleKeydown = (event) => {
    if (event.key === 'Enter') {
      npc.value = '어떤 캡슐을 만들까??<br> [1] : 타임캡슐 , [2] : 골캡슐';

      const handleCapsuleTypeKeydown = (event) => {
        if (event.key === '1') {
          npc.value = '타임캡슐을 만들까?? 누구를 대상으로 할까?<br> [1] : 나에게 만들기 , [2] : 다른유저에게 전송하기';

          const handleMakeTimeKeydown = (event) => {
            if (event.key === '1') {
              navigateTo(`/maketime/${userPk.value}`);
            } else if (event.key === '2') {
              navigateTo(`/maketimetouser/${userPk.value}`);
            }
            window.removeEventListener('keydown', handleMakeTimeKeydown);
          };

          window.addEventListener('keydown', handleMakeTimeKeydown, { once: true });
        } else if (event.key === '2') {
          npc.value = '골캡슐을 만들까?? 누구를 대상으로 할까?<br> [1] : 나에게 만들기 , [2] : 다른유저에게 전송하기';

          const handleMakeGoalKeydown = (event) => {
            if (event.key === '1') {
              navigateTo(`/makegoal/${userPk.value}`);
            } else if (event.key === '2') {
              navigateTo(`/makegoaltouser/${userPk.value}`);
            }
            window.removeEventListener('keydown', handleMakeGoalKeydown);
          };

          window.addEventListener('keydown', handleMakeGoalKeydown, { once: true });
        }
        window.removeEventListener('keydown', handleCapsuleTypeKeydown);
      };

      window.addEventListener('keydown', handleCapsuleTypeKeydown, { once: true });
    }
    window.removeEventListener('keydown', handleCapsuleKeydown);
  };

  window.addEventListener('keydown', handleCapsuleKeydown, { once: true });
};

const onComputerZone = () => {
  console.log('Entered the target zone!');

  const handleComputerKeydown = (event) => {
    npc.value = '여기서는 도감 및 진척도를 확인 할 수 있단다. 무엇을 열어볼까??<br>[1] : 진척도를 확인한다 , [2] : 도감을 연다'
    if (event.key === '1') {
      navigateTo(`/progress/${userPk.value}`);
    } else if (event.key === '2') {
      navigateTo(`/complete/${userPk.value}`);
    }
      window.removeEventListener('keydown', handleComputerKeydown);
    }


  window.addEventListener('keydown', handleComputerKeydown, { once: true });
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

// 이미지 경로를 동적으로 설정
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
</style>
