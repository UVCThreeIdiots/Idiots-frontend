<template>
  <div id="makegoal" class="container">
    <div class="border-box">
      <p class="npc">
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.07) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="settings">
        <div v-if="currentStep === 0" class="textarea">
          <label for="title"></label>
          <textarea type="text" id="email" v-model="email" class="custom-textarea9" placeholder="이곳에 캡슐을 전송받을 유저의 이메일을 입력하자!!!"></textarea>
          <div class="button-div">
            <button class = "emailChecker" @click="emailCheck">이메일체크</button>
          </div>
          <div class="warnings" v-if="isEmailChecked">
            <p class = "info o" v-if="isEmailExists">해당 이메일정보로 가입된 {{ otherUserName }} 님에게 캡슐을 전송합니다.</p>
            <p class = "info x" v-else>해당 이메일정보로 가입된 유저가 없습니다.<br>가입된 유저에게만 골 캡슐을 전송할 수 있습니다.</p>
          </div>
        </div>
        <div v-if="currentStep === 1">
          <label for="goal"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input v-model="goal" placeholder="목표를 입력하세요.(16자 이내)">
            <p class="false" v-if="goal.length > 16"> 주의 : 원칙에 따라 최대 16자를 넘길 수 없습니다. </p>
            <p class="false" v-else-if="goal.length < 1"> 주의 : 목표는 공백으로 사용할 수 없습니다!</p>
            <p class="true" v-else> 주의 : 목표는 16자 이하로 설정해주십시오.</p>
          </div>
        </div>
        <div v-if="currentStep === 2">
          <label for="due"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input v-model="inputDue" placeholder="목표기간을 입력하세요.(숫자)">
            <p class="false" v-if="inputDue>52"> 주의 : 52주가 넘는 목표기간은 설정 할 수 없습니다. </p>
            <p class="false" v-else-if="inputDue.length < 1"> 주의 : 빈칸으로 둘 수 없습니다! </p>
            <p class="false" v-else-if="inputDue<1"> 주의 : 최소 1주 이상의 목표기간을 설정해야 합니다. </p>
            <p class="false" v-else-if="!isValidDue"> 주의 : 숫자를 입력해야 합니다!</p>
            <p class="true" v-else> 주의 : 최소 1주에서 52주 이내 선택 가능합니다.</p>
          </div>
        </div>
        <div v-if="currentStep === 3">
          <label for="reps"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input v-model="inputReps" placeholder="목표횟수를 입력하세요.(숫자)"> 
            <p class="false" v-if="inputReps>maxReps"> 주의 : 원칙에 따라 최대 {{ maxReps }}회를 넘길 수 없습니다. </p>
            <p class="false" v-else-if="inputReps.length < 1"> 주의 : 빈칸으로 둘 수 없습니다! </p>
            <p class="false" v-else-if="inputReps < 1"> 주의 : 최소 1회 이상의 횟수를 설정해야 합니다.</p>
            <p class="false" v-else-if="!isValidReps"> 주의 : 숫자를 입력해야 합니다! </p>
            <p class="true" v-else> 주의 : 목표는 하루에 최대 1회를 원칙으로 합니다.</p>
          </div>
        </div>
        <div v-if="currentStep === 4">
          <label for="reps"></label>
          <div class="blur">
            <div class="blurdiv1">{{ goal }}</div> 를
            <div class="blurdiv2">{{ inputDue }}</div> 주 동안
            <div class="blurdiv2">{{ inputReps }}</div> 회
          </div>
          <div class="unblur">
            <input placeholder="등록할 보상이 있다면 등록해주세요 ! ! !" disabled>
            <button class="gift-button" @click="openImageModal"><img src="../components/images/giftbox.png"></button> 
            <p style="color: red;"> 선택사항 : 등록하실 보상이 있다면 등록해주세요 ! ! !</p>
          </div>  
        </div>
        <div v-if="currentStep === 5">
          <div class="loading">
            <label for="loading">Loading...</label>
            <img src="../components/images/loading.gif" class="loading-image"/>
          </div>
        </div>
      </div>
    </div>
    <div class="border-box">
      <div class="button-container">
        <button v-if="initialPosition === 'center'" @click="movegame" :disabled="currentStep === 5">메인 메뉴</button>
        <button v-else @click="movemain" :disabled="currentStep === 5">메인 메뉴</button>
        <button :disabled= "currentStep < 1 || currentStep >=5" @click="beforeStep">이전</button>
        <button v-if="currentStep === 4" @click="openModal" :disabled="!isValidReps">등록</button>
        <button v-else @click="nextStep" :disabled="currentStep >=5 || (currentStep === 0 && !isEmailExists)||(currentStep === 1 && !isValidGoal) || (currentStep === 2 && !isValidDue ) || (currentStep === 3 && !isValidDue )">다음</button>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2> </h2>
        <p>목표 : {{ goal }}</p>
        <p>목표 기간 : {{ inputDue }}</p>
        <p>목표 횟수 : {{ inputReps }}</p>
        <p class="modal-warn">골 캡슐을 제작하시겠습니까?<br>주의 : 생성된 골 캡슐은 수정 삭제가 불가합니다.</p>
        <p>골 캡슐을 생성하시겠습니까? YES:<input v-model="isChecked" type="checkbox" class="checkbox"/></p>
        <div class="modal-buttons">
          <button @click="closeModal">취소</button>
          <button @click="goalCapsuleSubmit" :disabled="!isChecked">확인</button>
        </div>
      </div>
    </div>

    <div v-if="showImageModal" class="choose-overlay">
      <div class="choose-content">
        <div class="modal-header">
          <h2>선택</h2>
        </div>
        <div class="modal-body">
          <a @mouseover="showLink1 = true" @mouseleave="showLink1 = false" @click="triggerImageFileUpload">
            <span v-if="showLink1">▶</span><span v-else></span>&nbsp; 이미지 업로드
          </a>
          <input type="file" ref="imageFileInput" @change="handleFileUpload($event, 'image')" multiple accept=".png" style="display: none;" />
          <a @mouseover="showLink2 = true" @mouseleave="showLink2 = false" @click="openTakenPhotoModal">
            <span v-if="showLink2">▶</span><span v-else></span>&nbsp; 사진 찍기
          </a>
        </div>
        <div class="modal-image-grid-container">
          <div >
            <div v-if="imageUrls.length" class="image-items">
              <!-- <img class="image"  v-for="(url, i) in imageUrls" :key="i" :src="url" alt="Uploaded Image" /> -->
              <div v-for="(url, i) in imageUrls" :key="i" class="image-item">
                <img class="image" :src="url" alt="uploaded Image" /> 
                  <button class="delete-button" @click="removeImage(i)">X</button> 
              </div>
            </div>
          </div>
        </div>
        <div class="modal-bottom">
          <button class="btn-style" @click="closeImageModal">뒤로가기</button>
        </div>
      </div>
    </div>

    <div v-if="showTakenPhotoModal" class="take-photo-overlay">
      <div class="take-photo-content">
        <div class="modal-header">
          <h2>사진 찍기</h2>
        </div>
        <div class="video-body">
          <video class="video-display" ref="imageVideo" autoplay></video>
          <button @click="captureImage"><img src="../components/images/camera.png"></button>
        </div>
        <div class="video-bottom">
          <button class="btn-style" @click="closeTakenPhotoModal">뒤로가기</button>
        </div>
      </div>
    </div>

    <div v-if="showImagePreviewModal" class="take-photo-overlay">
      <div class="take-photo-content">
        <div class="modal-header">
          <h2>사진 확인</h2>
        </div>
        <div class="video-body">
          <img class="img-display" :src="photoUrl" alt="Capture Photo" />
        </div>
        <div class="capture-check-bottom">
          <button class="btn-style" @click="closeImagePreviewModal">닫기</button>
          <button class="btn-style" @click="retakeImage">다시 찍기</button>
          <button class="btn-style" @click="confirmImage">확인</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axiosInstance from '@/config/axiosInstance';
import { useUserStore } from '../stores/user.js';
import { useRoute } from 'vue-router';

const email = ref('')
const otherUserid = ref('');
const otherUserName = ref('');
const isEmailChecked = ref(false);
const isEmailExists = ref(false);
const typedText = ref('이곳에서는 새로운 골 캡슐을 만들 수 있단다!\n어떤 유저에게 골 캡슐을 전달할까?');
const currentStep = ref(0);
const showModal = ref(false);
const stepsInfo = 6;
const goal = ref('');
const inputDue = ref('');
const inputReps = ref('');
const maxReps = computed(() => inputDue.value * 7);
const isChecked = ref(false);

const showLink1 = ref(false);
const showLink2 = ref(false);

const photoUrl = ref(null);
const imageVideo = ref(null);
const showImageModal = ref(false);
const showImagePreviewModal = ref(false);
const showTakenPhotoModal = ref(false);
const imageFileInput = ref(null);
const imageUrls = ref([]);
const files = ref([]);

const nextStep = () => {
  if (currentStep.value < stepsInfo) {
    currentStep.value++;
    if (currentStep.value <= 0)
      typedText.value = '이곳에서는 새로운 골 캡슐을 만들 수 있단다!\n어떤 유저에게 골 캡슐을 전달할까?';
    else if (currentStep.value === 1)
      typedText.value = '어떤 목표를 세울까? (예 : 운동, 독서, 프로그래밍 공부)';
    else if (currentStep.value === 2)
      typedText.value = '목표는 몇 주동안 진행할까?';
    else if (currentStep.value === 3)
      typedText.value = '기간동안 목표는 몇번 수행할까?\n목표는 하루에 한번까지 수행할 수 있단다!';
    else if (currentStep.value === 4)
      typedText.value = '보상이 있다면 목표 달성에 분명 큰 도움이 될꺼란다!\n어떤 보상을 추가할까?';
    else if (currentStep.value === 5)
      typedText.value = '포켓몬들이 골 캡슐을 땅속 깊숙히 묻고 있단다!';
    else if (currentStep.value === 6)
      typedText.value = `${otherUserName.value}의 새로운 골 캡슐이 성공적으로 저장되었단다.\n목표를 위해 모험을 시작하자!`;
  }
};

//메인메뉴로 갈지 게임메뉴로 갈지 선택
const route = useRoute();
const initialPosition = route.query.initialPosition; // 초기 위치

const isValidDue = computed(()=>{
  if (inputDue.value.length <1) return false;
  if (inputDue.value < 1) return false;
  if (inputDue.value >52) return false;
  const regex = /^[0-9]*$/;
  return regex.test(inputDue.value);
});
const isValidReps = computed(()=>{
  if (inputReps.value.length <1) return false;
  if (inputReps.value < 1) return false;
  if (inputReps.value > maxReps.value) return false;
  const regex = /^[0-9]*$/;
  return regex.test(inputReps.value);
});
const isValidGoal = computed(()=>{
  return (goal.value.length >= 1 && goal.value.length <= 16)
});

const useStore = useUserStore();

const userId = ref(useStore.getUser().id);

const handleFileUpload = (event, type) => {
  const uploadedFiles = event.target.files;
  if (type === 'image' && (uploadedFiles.length + imageUrls.value.length) > 10) {
    alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
    return;
  }
  for (let file of uploadedFiles) {
    const url = URL.createObjectURL(file);
    files.value.push(file);
    if (type === 'image') {
      imageUrls.value.push(url);
    }
  }
};

const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
  files.value.splice(index, 1);
  console.log(files.value);
};

const openImageModal = () => {
  showImageModal.value = true;
}
const closeImageModal = () => {
  showImageModal.value = false;
}
const triggerImageFileUpload = () => {
  imageFileInput.value.click();
}

const navigateTo = (route) => {
  window.location.href = route;
};
const movemain = () => {
  navigateTo(`/main/`);
}
const movegame = () => {
  navigateTo(`/maingameview2/?initialPosition=capsule`);
}
const beforeStep = () => {
  currentStep.value -= 2;
  nextStep();
};

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};

// 사진찍기 모달 열기
const openTakenPhotoModal = async () => {
  showTakenPhotoModal.value = true;
  startVideoStream(imageVideo);
};

// 시진찍기 모달 닫기
const closeTakenPhotoModal = () => {
  stopStream(imageVideo.value.secObject);
  showTakenPhotoModal.value = false;
};

// 촬영
const captureImage = () => {
  const canvas = document.createElement('canvas');
  canvas.width = imageVideo.value.videoWidth;
  canvas.height = imageVideo.value.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(imageVideo.value, 0, 0, canvas.width, canvas.height);
  photoUrl.value = canvas.toDataURL('image/png');
  closeTakenPhotoModal();
  showImagePreviewModal.value = true;
};

// 이미지 확인 모달 닫기
const closeImagePreviewModal = () => {
  showImagePreviewModal.value = false;
}
//이미지 확인 모달
const confirmImage = () => {
  if ( imageUrls.value.length > 9 ) {
    alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
    return;
  }
  urlToFile(photoUrl.value, `capturedImage${imageUrls.value.length}.png`, 'image/png').then(file => {
    files.value.push(file);
    imageUrls.value.push(photoUrl.value);
  });
  closeImagePreviewModal();
};
//이미지 재촬영
const retakeImage = () => {
  closeImagePreviewModal();
  openTakenPhotoModal();
}

// 스트림 시작 (사진, 비디오)
const startVideoStream = async (videoElement) => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  videoElement.value.srcObject = stream;
};

//스트림 중지
const stopStream = (stream) => {
  if(stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};

// 데이터 URL을 File 객체로 변환하는 함수
const urlToFile = async (url, filename, mimeType) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: mimeType });
  return file;
};

const emailCheck = () => {
  const data = {email : email.value};
  axiosInstance.post("http://localhost:3000/other/email", JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then((res) => {
    if (res.status === 200) {
      console.log("🚀 ~ .then ~ res.data:", res.data)
      if(res.data) {
      console.log("조회 성공");
      isEmailChecked.value = true;
      isEmailExists.value = true;
      otherUserName.value = res.data.name;
      otherUserid.value = res.data.id;
      }
      else{
      isEmailChecked.value = true;
      isEmailExists.value = false;
      otherUserName.value = null;
      otherUserid.value = null;
      }
    }

  })
  .catch((error) => {
    console.error(error);
  });

};

// const goalCapsuleSubmit = () => {
//   const saveData = {
//     title : goal.value,
//     body : null,
//     goalCount : inputReps.value,
//     goalTerm : inputDue.value,
//     otherId : otherUserid.value,
//     otherEmail : email.value,
//   };

//   axiosInstance.post("http://localhost:3000/goal", JSON.stringify(saveData), {
//     headers: {
//       "Content-Type": "application/json",
//     },
//   })
//   .then((res) => {
//     if (res.status === 200) {
//       console.log("등록 성공");
//       closeModal();
//       nextStep();
//       setTimeout(() => {
//         nextStep();
//       }, 5000);
//     }
//   })
//   .catch((error) => {
//     console.error(error);
//   });
// };

// formData 변환
const goalCapsuleSubmit = () => {
  const formData = new FormData();

  files.value.forEach(file => {
    formData.append('files', file);
  });

  formData.append("title", goal.value);
  formData.append("body", null); // null 값을 보내는 경우 서버에서 처리 방법 확인 필요
  formData.append("goalCount", inputReps.value);
  formData.append("goalTerm", inputDue.value);
  formData.append("otherId", otherUserid.value);
  formData.append("otherEmail", email.value);

  axiosInstance.post("http://localhost:3000/goal", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  })
  .then((res) => {
    if (res.status === 200) {
      console.log("등록 성공");
      closeModal();
      nextStep();
      setTimeout(() => {
        nextStep();
      }, 5000);
    }
  })
  .catch((error) => {
    console.error(error);
  });
};

</script>




<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}

.img-display {
  width: 72%;
  height: 96%;
}

.video-bottom {
  width: 100%;
}
.upload-video-bottom {
  width: 100%;
  /* border: 2px solid #000; */
  display: flex;
  justify-content: center;
}
.video-body {
  /* border: 2px solid red; */
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
  /* margin-bottom: 8px; */
}
.video-display {
  width: 72%;
  height: 96%;
}

.image-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.image-item {
  position: relative;
}

.image-items .image {
  width: 92%;
  height: 96%;
  border: 2px solid #eee;
  box-sizing: border-box;
  background-size: cover;
  object-fit: cover; /* 이미지 비율을 유지하면서 그리드 셀을 완전히 채우도록 설정 */
}

.delete-button {
  position: absolute;
  top: -8px;
  right: 8px;
  background-color: #eee;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.take-photo-overlay{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.take-photo-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 600px;
  height: 480px;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.take-photo-content img {
  background-color: white;
}

.take-photo-content button {
  background-color: white;
  border: 1px solid white;
}

.take-photo-content img:hover {
  cursor: pointer;
  background-color: #eee;
  border-radius: 4px;
}
.video {
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
  border: 1px solid #ccc;
}
.capture-image {
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
  border: 1px solid #ccc;
}

.btn-style{
  padding: 8px 16px;
  /* border: 2px solid black; */
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
  color: black;;
}
.capture-check-bottom .btn-style {
  margin-top: 16px;
}

.btn-style:hover {
  cursor: pointer;
  background-color: #eee;
}

.modal-body {
  margin-bottom: 8px;
  width: 91%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: black;
  padding: 8px;
  margin-left: 16px;
  border-bottom: 2px solid #eee;
}

.modal-body a {
  color: black;
}

.modal-bottom {
  /* border: 2px solid black; */
  display: flex;
  justify-content: center;
}

.modal-image-grid-container {
  display: grid;
  gap: 8px; /* 아이템 간격 설정 */
  overflow-y: auto; /* 세로 스크롤 활성화 */
  padding: 10px; /* 컨테이너 패딩 */
  max-height: 100vh; /* 컨테이너의 최대 높이 설정 */
  height: 100%;
}

.modal-image-grid-container::-webkit-scrollbar {
  width: 8px;
}

.modal-image-grid-container::-webkit-scrollbar-thumb { 
    background-color: #cbcbcbbd;
    border-radius: 15px;
}

.modal-image-grid-container::-webkit-scrollbar-button {
    display: none;
}

.modal-header {
  /* border: 2px solid black; */
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
  color: black;
}

.choose-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.choose-overlay .choose-content {
  background: white;
  padding: 16px;
  border-radius: 8px;
  /* text-align: center; */
  width: 500px;
  height: 456px;
  /* color: black; */
  display: flex;
  flex-direction: column;
}

.id-pw {
  width: 40px;
}

body {
  background-color: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
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
}

.settings {
  display: flex;
  flex-direction: column;
  align-items: center;
  height : 300px;
  justify-content: flex-start;
  gap:20px;
}
.settings div{
  margin: 10px;
}
.emailChecker{
  padding: 10px 20px;
    border: 2px solid grey;
    border-radius: 5px;
    background-color: #f0f0f0;
    cursor: pointer;
    font-family: 'CustomFont', Arial, sans-serif;
    font-size: 20px;
}
.blur {
  align-items: center;
  margin: 10px;
  color: black;
  font-size : 20px;
}
.unblur {
  align-items: center;
  margin: 10px;
  color: black;
  font-size : 20px;
}
.blur{
  display: flex;
  flex-direction:row;

}
.unblur input{
margin-right:10px;
font-size : 20px;
}
.unblur img {
  width: 24px;
  height: 24px;
}
.gift-button {
  width: 40px;
  height: 40px;
}
.blurdiv1{
  background : lightgrey;
  width : 430px;
  height : 50px;
  padding-top : 10px;
  padding-left : 15px;
}
.blurdiv2{
  background : lightgrey;
  width : 70px;
  height : 50px;
  padding-top : 10px;
  padding-left : 15px;

}


.settings label {
  margin-right: 10px;
  font-size: 24px;
  color: black;
}

.settings input {
  align-items: middle;
  border: 2px solid black;
  width : 600px;
  height : 50px;
  border-radius: 5px;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
  background : white;
  margin : 10px;
  padding-left : 15px;
}

.button-container {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 20px;
}

.button-container button {
  padding: 10px 20px;
  border: 2px solid black;
  border-radius: 5px;
  background-color: #f0f0f0;
  cursor: pointer;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
}

p {
  margin-top: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  width: 100%;
  height: 100px;
  font-family: 'CustomFont', Arial, sans-serif;
}

.true {
  color: green;
  
}
.false {
  color: red;
}
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

.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 20px;
  border-radius: 15px;
}

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
}
.textarea{
  align-items: center;
    margin: 10px;
    color: black;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
}
.custom-textarea {
  height: 330px;
  width : 750px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 24px;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 600px;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  color: black;
}
.modal-warn {
  height: 120px;
  color:red;
}
.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: black; /* Ensure heading color is black */
}

.modal-content p {
  margin-bottom: 5px; /* Reduce gap between paragraphs */
  font-size: 20px;
  width: 100%;
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



.date-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-unit div {
  width: 60px; /* Width increased by 1.5x */
  height: 60px; /* Height increased by 1.5x */
  text-align: center;
  font-size: 36px; /* Font size increased by 1.5x */
  color: black; /* Text color changed to black */
}
.custom-textarea9{
  height: 50px;
  width : 550px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
  margin-bottom : 20px;
  margin-top:30px;
  padding : 15px;
}
.info.o{
  font-size: 20px;
  color : green;
}
.info.x{
  font-size: 20px;
  color : red;
}

.loading-image {
  width : 300px;
  height : 300px;
}
.loading{
  margin-left : 150px;
  display: flex;
}
.npc{
  padding: 8px 24px;
  font-size : 24px;
}
button:disabled {
  background-color: #f0f0f0;
  color: grey; /* 비활성화 상태 버튼의 글자색 */
  cursor: not-allowed; /* 커서 모양 */
  opacity: 0.4; /* 불투명도 */
}
.loading-image {
  width : 300px;
  height : 300px;
}
.loading label{
  font-size : 20px;
  font-family: 'CustomFont', Arial, sans-serif;
  color : black;
}
</style>
