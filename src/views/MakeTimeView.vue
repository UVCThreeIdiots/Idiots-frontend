<template>
  <div id="maketime" class="container">
    <div class="border-box">
      <p class = "npc">
        <span v-for="(char, index) in typedText" :key="`${currentStep}-${index}`">
          <span :style="{'animation-delay': (index * 0.07) + 's'}" class="hidden-char">{{ char }}</span>
        </span>
      </p>
    </div>
    <div class="border-box">
      <div class="settings">
        <div v-if="currentStep === 0" class="textarea">
          <label for="title"></label>
          <textarea type="text" id="title" v-model="title" class="custom-textarea0" placeholder="이곳에 제목을 입력하자 ! ! !"></textarea>
          <label for="message"></label>
          <textarea type="text" id="message" v-model="message" class="custom-textarea" placeholder="이곳에 내용을 입력하자 ! ! !"></textarea>
          <div class="files">
            <button type="button" @click="openImageModal">
              <img src="../components/images/inputimage.png"/>
            </button>
            <button type="button" @click="openVideoModal">
              <img src="../components/images/video.png"/>
            </button>
            <button type="button" @click="openAudioModal">
              <img src="../components/images/mic.png"/>
            </button>
          </div>
          <!-- <div class="file-upload">
            <input type="file" @change="handleFileUpload" multiple class="choose-file" accept=".png">
          </div> -->
        </div>
        <div v-if="currentStep === 1" class="buttons-and-ment">
          <label for="dueDate"></label>
          <div class="date-picker">
            <div v-for="(unit, index) in dateUnits" :key="index" class="date-unit">
              <button class="date-button" @click="incrementDateUnit(index)">▲</button>
              <div class="date-value">{{ unit }}</div>
              <button class="date-button" @click="decrementDateUnit(index)">▼</button>
            </div>
          </div>
          <div class="warnings">
          <p v-if="!isValidDateType" class="warn">날짜의 형식이 잘못되었습니다! 날짜를 확인해주세요!</p>
          <p v-else-if="!isValidDueDate" class="warn">현재 혹은 과거로 캡슐을 보낼 수 없습니다! </p>
          <p v-else class="notwarn">해당 날짜로 캡슐을 보낼 수 있습니다!</p>
          </div>
        </div>
        <div v-if="currentStep === 2">
          <div class="loading">
            <label for="loading">Loading...</label>
            <img src="../components/images/loading.gif" class="loading-image"/>
          </div>
        </div>
        <div v-if="currentStep === 3">
          <label for="age">여기 사진 추가</label>
        </div>
      </div>
    </div>
    <div class="border-box">
      <div class="button-container">
        <button v-if="initialPosition === 'center'" @click="movegamemain" :disabled="currentStep===2">메인 메뉴</button>
        <button v-else @click="movemain" :disabled="currentStep===2">메인 메뉴</button>
        <button :disabled= "currentStep < 1 || currentStep >=2" @click="beforeStep">이전</button>
        <button v-if="currentStep === 1" @click="openModal" :disabled="!isValidDateType || !isValidDueDate">등록</button>
        <button v-else @click="nextStep" :disabled="currentStep >= 2">다음</button>
      </div>
    </div>

    <!-- Modal / 서버 연결 있어야함-->
    <!-- <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>To. 미래의 나</h2>
        <p>{{ message }}</p>
        <p>설정된 날짜: {{ formattedDate }}</p>
        <p>타임캡슐을 제작하시겠습니까?<br>주의 : 생성된 타임캡슐은 수정 삭제가 불가하며, 설정된 날짜까지 조회가 불가합니다.</p>
        <button @click="timecapsuleSubmit">확인</button>
        <button @click="closeModal">취소</button>
      </div>
    </div> -->

    <!-- Test용 Modal / 서버 연결 없이 다음 진행-->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>To. 미래의 나</h2>
        <textarea class = "modal-message" v-model="message" :disabled="true"></textarea>
        <p class = "modal-date">설정된 날짜: {{ formattedDate }}</p>
        <p class = "modal-warn">주의 : 생성된 타임캡슐은 수정 삭제가 불가하며, 설정된 날짜까지 조회가 불가합니다.</p>
        <p>타임캡슐을 생성하시겠습니까? YES:<input v-model="isChecked" type="checkbox" class="checkbox"/></p>
        <div class="modal-buttons">
          <button @click="closeModal">취소</button>
          <button @click="timeCapsuleSubmit" :disabled="!isChecked">확인</button>
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
          <a @mouseover="showLink2 = true" @mouseleave="showLink2 = false" @click="openTakenPhotoModal">
            <span v-if="showLink2">▶</span><span v-else></span>&nbsp; 사진 찍기
          </a>
        </div>
        <div class="modal-image-grid-container">
          <div >
            <input type="file" ref="imageFileInput" @change="handleFileUpload($event, 'image')" multiple accept=".png" style="display: none;" />
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

    <div v-if="showVideoModal" class="choose-overlay">
      <div class="choose-content">
        <div class="modal-header">
          <h2>선택</h2>
        </div>
        <div class="modal-body">
          <a @mouseover="showLink3 = true" @mouseleave="showLink3 = false" @click="triggerVideoFileUpload">
            <span v-if="showLink3">▶</span><span v-else></span>&nbsp; 동영상 업로드
            <input type="file" ref="videoFileInput" @change="handleFileUpload($event, 'video')" accept=".mp4" style="display: none;" />
          </a>
          <a @mouseover="showLink4 = true" @mouseleave="showLink4 = false" @click="openVideoCaptureModal">
            <span v-if="showLink4">▶</span><span v-else></span>&nbsp; 영상 찍기
          </a>
          <a @mouseover="showLink7 = true" @mouseleave="showLink7 = false" @click="clearVideoFile">
            <span v-if="showLink7">▶</span><span v-else></span>&nbsp; 영상 삭제
          </a>
        </div>
        <div class="upload-video-body">
            <video class="video-display" v-if="videoUrl" :src="videoUrl" controls></video>
        </div>
        <div class="upload-video-bottom">
          <button class="btn-style" @click="closeVideoModal">뒤로가기</button>
        </div>
      </div>
    </div>

    <div v-if="showVideoCaptureModal" class="take-photo-overlay">
      <div class="take-photo-content">
        <div class="modal-header">
          <h2>영상 찍기</h2>
        </div>
        <div class="video-body" >
          <video class="video-display" ref="videoRecorder" autoplay></video>
        </div>
        <div class="capture-check-bottom">
          <button class="btn-style" @click="startVideoRecording">녹화 시작</button>
          <button class="btn-style" @click="stopVideoRecording">녹화 종료</button>
          <button class="btn-style" @click="closeVideoCaptureModal">닫기</button>
        </div>
      </div>
    </div>

    <div v-if="showVideoPreviewModal" class="take-photo-overlay">
      <div class="take-photo-content">
        <div class="modal-header">
          <h2>영상 확인</h2>
        </div>
        <div class="video-body">
          <video class="recording-display" :src="recordedVideoUrl" controls></video>
        </div>
        <div class="capture-check-bottom">
          <button  class="btn-style" @click="closeVideoPreviewModal">닫기</button>
          <button class="btn-style" @click="retakeVideo">다시 녹화</button>
          <button class="btn-style" @click="confirmVideo">확인</button>
        </div>
      </div>
    </div>

    <div v-if="showAudioModal" class="choose-overlay">
      <div class="choose-content">
        <div class="modal-header">
          <h2>선택</h2>
        </div>
        <div class="modal-body">
          <a @mouseover="showLink5 = true" @mouseleave="showLink5 = false" @click="triggerAudioFileUpload">
            <span v-if="showLink5">▶</span><span v-else></span>&nbsp; 음성 업로드
          </a>
          <input type="file" ref="audioFileInput" @change="handleFileUpload($event, 'audio')" accept=".mp3" style="display: none;" />
          <a @mouseover="showLink6 = true" @mouseleave="showLink6 = false" @click="openRecordingModal">
            <span v-if="showLink6">▶</span><span v-else></span>&nbsp; 녹음 하기
          </a>
          <a @mouseover="showLink8 = true" @mouseleave="showLink8 = false" @click="clearAudioFile">
            <span v-if="showLink8">▶</span><span v-else></span>&nbsp; 음성 삭제
          </a>
        </div>
        <div class="audio-modal-body">
          <video class="audio-display" v-if="audioUrl" :src="audioUrl" controls></video>
        </div>
        <div class="modal-bottom">
          <button class="btn-style" @click="closeAudioModal">뒤로가기</button>
        </div>
      </div>
    </div>

      <div v-if="showRecordingModal" class="take-photo-overlay">
        <div class="take-photo-content">
          <div class="modal-header">
            <h2>음성 녹음</h2>
          </div>
          <div class="capture-check-bottom">
            <button class="btn-style" @click="startAudioRecording">녹음 시작</button>
            <button class="btn-style" @click="stopAudioRecording">녹음 종료</button>
            <button class="btn-style" @click="closeRecordingModal">닫기</button>
          </div>
        </div>
      </div>

      <div v-if="showAudioPreviewModal" class="take-photo-overlay">
        <div class="take-photo-content">
          <div class="modal-header">
            <h2>녹음 확인</h2>
          </div>
          <div class="audio-modal-body">
            <video class="audio-display" :src="recordedAudioUrl" controls></video>
          </div>
          <div class="capture-check-bottom">
            <button class="btn-style" @click="confirmAudio">확인</button>
            <button class="btn-style" @click="reRecordAudio">다시 녹음</button>
            <button class="btn-style" @click="closeAudioPreviewModal">닫기</button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup>

import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import axiosInstance from '@/config/axiosInstance';

import { useUserStore } from '../stores/user.js';
import { useRoute } from 'vue-router';

const useStore = useUserStore();
const title = ref('')
const message = ref('');
const typedText = ref('이곳에서는 새로운 타임캡슐을 만들 수 있단다!\n어떤 내용을 타임 캡슐에 담을까?');
const currentStep = ref(0);
const showModal = ref(false);
const stepsInfo = 4
const currentDate = new Date();
const year = currentDate.getFullYear().toString(); // 연도
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // 월 (0부터 시작하므로 +1, padStart로 2자리로 맞춤)
const date = currentDate.getDate().toString().padStart(2, '0');
const dateUnits = ref([year[0], year[1], year[2], year[3], month[0], month[1], date[0], date[1]]);
const isChecked = ref(false);

const showImageModal = ref(false);
const showTakenPhotoModal = ref(false);
const showVideoModal = ref(false);
const showAudioModal = ref(false);
const showRecordingModal = ref(false);
const showVideoCaptureModal = ref(false);

const showLink1 = ref(false);
const showLink2 = ref(false);
const showLink3 = ref(false);
const showLink4 = ref(false);
const showLink5 = ref(false);
const showLink6 = ref(false);
const showLink7 = ref(false);
const showLink8 = ref(false);

const imageFileInput = ref(null);
const videoFileInput = ref(null);
const audioFileInput = ref(null);

const imageUrls = ref([]);
const videoUrl = ref(null);
const audioUrl = ref(null);
const photoUrl = ref(null);
const recordedVideoUrl = ref(null);
const recordedAudioUrl = ref(null);
const showImagePreviewModal = ref(false);
const showVideoPreviewModal = ref(false);
const showAudioPreviewModal = ref(false);
const imageVideo = ref(null);
const videoRecorder = ref(null);
let videoStream = null;
let audioStream = null;
let videoRecorderInstance = null;
let audioRecorderInstance = null;
const videoChunks = [];
const audioChunks = [];
const files = ref([]);

const handleFileUpload = (event, type) => {
  const uploadedFiles = event.target.files;
  if (type === 'image' && (uploadedFiles.length + imageUrls.value.length) > 10) {
    alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
    return;
  }
  if (type === 'video' && videoUrl.value != null ) {
    alert('동영상은 최대 1개까지 업로드할 수 있습니다.');
    return;
  }
  if (type === 'audio' && uploadedFiles.length > 1 && audioUrl.value != null) {
    alert('음성은 최대 1개까지 업로드할 수 있습니다.');
    return;
  }

  for (let file of uploadedFiles) {
    const url = URL.createObjectURL(file);
    files.value.push(file);
    if (type === 'image') {
      imageUrls.value.push(url);
    } else if (type === 'video') {
      videoUrl.value = url;
    } else if (type === 'audio') {
      audioUrl.value = url;
    }
  }
};

const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
  files.value.splice(index, 1);
  console.log(files.value);
};

const clearVideoFile = () => {
  const extensionsToRemove = [ '.mp4' , '.mpeg']
    if( videoUrl.value != null ) {
      videoUrl.value = null;
      files.value = files.value.filter( file => !extensionsToRemove.some(ext => !file.name.endsWith(ext)));
      console.log(files.value);
      return;
    } else {
      alert('등록하신 비디오가 없습니다')
      return;
    }
  }

  const clearAudioFile = () => {
    const extensionsToRemove = ['.webm', '.mp3', '.mpeg' ]
    if ( audioUrl.value != null ) {
      audioUrl.value = null;
      files.value = files.value.filter( file => !extensionsToRemove.some(ext => file.name.endsWith(ext)));
      console.log(files.value);
      return;
    }else {
      alert('등록하신 음성이 없습니다')
      return;
    }
  }

const isValidDueDate = computed(()=> {
  let year = dateUnits.value[0] + dateUnits.value[1] + dateUnits.value[2] + dateUnits.value[3];
  let month = dateUnits.value[4] + dateUnits.value[5];
  let date = dateUnits.value[6] + dateUnits.value[7];
  let dueDate = new Date(year, month - 1, date);
  return dueDate > currentDate;
})
//메인메뉴로 갈지 게임메뉴로 갈지 선택
const route = useRoute();
const initialPosition = route.query.initialPosition; // 초기 위치

const isValidDateType = computed(() => {
  const year = parseInt(dateUnits.value.slice(0, 4).join(''));
  const month = parseInt(dateUnits.value.slice(4, 6).join(''));
  const day = parseInt(dateUnits.value.slice(6, 8).join(''));

  // 각 부분이 숫자인지 확인
  const isYearNumeric = !isNaN(year);
  const isMonthNumeric = !isNaN(month);
  const isDayNumeric = !isNaN(day);

  // 각 부분의 범위를 확인
  const isYearValid = year >= 1000 && year <= 9999;
  const isMonthValid = month >= 1 && month <= 12;
  const isDayValid = day >= 1 && day <= 31;

  // 각 월의 일 확인 함수
  const isMonthDayValid = (year, month, day) => {
    if (month === 1 || month === 3 || month === 5 || month === 7 || month === 8 || month === 10 || month === 12)
      return day <= 31;
    else if (month === 4 || month === 6 || month === 9 || month === 11)
      return day <= 30;
    else if (month === 2) {
      if (year % 4 === 0) {
        if (year % 100 === 0) {
          if (year % 400 === 0)
            return day <= 29;
          else
            return day <= 28;
        } else {
          return day <= 29;
        }
      } else {
        return day <= 28;
      }
    }
    return false; // month가 1-12가 아니면 false 반환
  };

  // 모든 조건이 충족되면 true 반환
  return isYearNumeric && isMonthNumeric && isDayNumeric && isYearValid && isMonthValid && isDayValid && isMonthDayValid(year, month, day);
});

const triggerVideoFileUpload = () => {
  videoFileInput.value.click();
}

const triggerImageFileUpload = () => {
  imageFileInput.value.click();
}

const triggerAudioFileUpload = () => {
  audioFileInput.value.click();
}

const openImageModal = () => {
  showImageModal.value = true;
}
const closeImageModal = () => {
  showImageModal.value = false;
}

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

//동영상 모달 열기
const openVideoModal = () => {
  showVideoModal.value = true;
}

const closeVideoModal = () => {
  showVideoModal.value = false;
}

//닫기
const closeVideoCaptureModal = () => {
  stopStream(videoStream);
  showVideoCaptureModal.value = false;
}

// 동영상 촬영 모달 열기
const openVideoCaptureModal = async () => {
  if (videoUrl.value != null) {
    alert('비디오는 최대 1개 업로드 가능합니다.')
    return;
  }
  showVideoCaptureModal.value = true;
  startVideoStream(videoRecorder);
}

//촬영한 영상 확인 모달 닫기
const closeVideoPreviewModal = () => {
  showVideoPreviewModal.value = false;
}

//촬영한 영상 확인 모달
const confirmVideo = async () => {
  urlToFile(recordedVideoUrl.value, 'recordedVideo.mp4', 'video/mp4').then(file => {
    files.value.push(file);
    videoUrl.value = recordedVideoUrl.value;
  });
  closeVideoPreviewModal();
  }


//영상 재촬영
const retakeVideo = () => {
  closeVideoPreviewModal();
  openVideoCaptureModal();
}

//동영상 녹화 시작 시
const startVideoRecording = async () => {
  videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  videoRecorder.value.srcObject = videoStream;
  videoRecorderInstance = new MediaRecorder(videoStream);
  videoRecorderInstance.ondataavailable = (event) => {
    videoChunks.push(event.data);
  };
  videoRecorderInstance.start();
}

//동영상 녹화 중지 시
const stopVideoRecording = () => {
  videoRecorderInstance.stop();
  videoRecorderInstance.onstop = () => {
    const blob = new Blob(videoChunks, { type: 'video/mp4' });
    recordedVideoUrl.value = URL.createObjectURL(blob);
    videoChunks.length = 0;
    closeVideoCaptureModal();
    showVideoPreviewModal.value = true;
  };
}

// 오디오 업로드 모달 열기
const openAudioModal = () => {
  showAudioModal.value = true;
}

// 오디오 업로드 모달 닫기
const closeAudioModal = () => {
  showAudioModal.value = false;
}

// 녹음 모달 열기
const openRecordingModal = () => {
  if (audioUrl.value != null) {
    alert('녹음 파일은 한개만 업로드 할 수 있습니다.');
    return;
  }
  showRecordingModal.value = true;
}

// 녹음 모달 닫기
const closeRecordingModal = () => {
  stopStream(audioStream);
  showRecordingModal.value = false;
}

// 녹음 확인 모달 닫기
const closeAudioPreviewModal = () => { 
  showAudioPreviewModal.value = false;
}

// 녹음 확인
const confirmAudio = () => {
  urlToFile(recordedAudioUrl.value, 'recordedAudio.webm', 'audio/webm').then(file => {
    files.value.push(file);
    audioUrl.value = recordedAudioUrl.value;
  });
  closeAudioPreviewModal();
}

// 재녹음
const reRecordAudio = () => {
  closeAudioPreviewModal();
  openRecordingModal();
}

// 음성 녹음 시작
const startAudioRecording = async () => {
  audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioRecorderInstance = new MediaRecorder(audioStream);
  audioRecorderInstance.ondataavailable = (event) => {
    audioChunks.push(event.data);
  };
  audioRecorderInstance.start();
}

// 녹음 중지
const stopAudioRecording = () => {
  audioRecorderInstance.stop();
  audioRecorderInstance.onstop = () => {
    const blob = new Blob(audioChunks, { type: 'audio/webm' });
    recordedAudioUrl.value = URL.createObjectURL(blob);
    audioChunks.length = 0;
    closeRecordingModal();
    showAudioPreviewModal.value = true;
  };
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

const nextStep = () => {
  if (currentStep.value < stepsInfo) {
    currentStep.value++;
    if (currentStep.value <= 0)
      typedText.value = '이곳에서는 새로운 타임캡슐을 만들 수 있단다!\n어떤 내용을 타임 캡슐에 담을까?';
    else if (currentStep.value === 1){
      typedText.value = '그렇다면, 타임 캡슐을 언제 전달할까?';
      console.log(files.value);
    }
    else if (currentStep.value === 2){
      typedText.value = '포켓몬들이 타임 캡슐을 땅속 깊숙히 묻고 있단다!';
      console.log(files.value);
    }
    else if (currentStep.value === 3)
      typedText.value = `새로운 타임 캡슐이 성공적으로 저장되었단다.\n포켓몬들이 너의 타임 캡슐을 ${formattedDate.value}에 가져다 준단다! `;
  }
};
const navigateTo = (route) => {
  window.location.href = route;
};
const movemain = () => {
  navigateTo(`/main/`);
};
const movegamemain = () => {
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

// 데이터 URL을 File 객체로 변환하는 함수
const urlToFile = async (url, filename, mimeType) => {
  const response = await fetch(url);
  const blob = await response.blob();
  const file = new File([blob], filename, { type: mimeType });
  return file;
};


const incrementDateUnit = (index) => {
  let unit = dateUnits.value[index];

  // 각 자릿수에 따른 최대 값 설정
  const maxValues = [9, 9, 9, 9, 1, 9, 3, 9];

  // 현재 값과 최대 값 비교하여 조정
  if (parseInt(unit) < maxValues[index]) {
    dateUnits.value.splice(index, 1, String(parseInt(unit) + 1));
  } else {
    // 최대 값이면 0으로 조정
    dateUnits.value.splice(index, 1, '0');
  }
};

const decrementDateUnit = (index) => {
  let unit = dateUnits.value[index];

  // 각 자릿수에 따른 최소 값 설정
  const minValues = [2, 0, 0, 0, 0, 0, 0, 0];

  // 현재 값과 최소 값 비교하여 조정
  if (parseInt(unit) > minValues[index]) {
    dateUnits.value.splice(index, 1, String(parseInt(unit) - 1));
  } else {
    // 최소 값이면 최대 값으로 조정
    const maxValues = [3, 9, 9, 9, 1, 2, 3, 9];
    dateUnits.value.splice(index, 1, String(maxValues[index]));
  }
};


const formattedDate = computed(() => {
  const year = dateUnits.value.slice(0, 4).join('');
  const month = dateUnits.value.slice(4, 6).join('');
  const day = dateUnits.value.slice(6, 8).join('');
  return `${year}-${month}-${day}`;
});
const userId = ref(useStore.getUser().id);


// 제출
const timeCapsuleSubmit = () => {
  const formData = new FormData(); // FormData 객체 생성
  files.value.forEach(file => {
    formData.append('files', file);
  });

  // 데이터 추가
  formData.append('title', title.value);
  formData.append('expired', `${formattedDate.value}T00:00:00+09:00`);
  formData.append('body', message.value);

  // axios를 사용하여 요청 보내기
  try {
    axiosInstance.post('http://localhost:3000/time', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res) => {
    if (res.status === 200) {
      console.log(res);
      console.log("등록 성공");
      closeModal();
      nextStep();
      setTimeout(() => {
        nextStep();
      }, 5000);
    }
  }).catch((error) => {
    console.error(error);
  });
  } catch (error) {
    console.error('Error submitting the post', error);
  }
};
// const testtimecapsulesubmit = () => {
//   closeModal();
//   nextStep();
//   let postDate = `${formattedDate.value}`+"T00:00:00+09:00"
//   console.log(`${postDate}`)
//   setTimeout(() => {
//         nextStep();
//       }, 5000);
// }
</script>




<style scoped>
@font-face {
  font-family: 'CustomFont';
  src: url('../components/fonts/DOSSaemmul.ttf') format('truetype');
}
@keyframes reveal {
  0% {
    visibility: hidden;
  }
  100% {
    visibility: visible;
  }
}

.audio-modal-body {
  /* border: 2px solid #000; */
  display: flex;
  justify-content: center;
  height: 100%;
}

.audio-display {
    width: 300px;
    height: 160px;
}
.capture-check-bottom .btn-style {
  margin-top: 16px;
}

.capture-check-bottom {
  width: 100%;
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
}

.video-bottom {
  width: 100%;
}

.upload-video-body {
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  align-items: center;
  height: 100%;
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

.recording-display {
  width: 72%;
  height: 96%;
}

.video-display {
  width: 72%;
  height: 96%;
}

.img-display {
  width: 72%;
  height: 96%;
}

.modal-header {
  /* border: 2px solid black; */
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  justify-content: center;
  color: black;
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
  top: 4px;
  right: 0px;
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

.btn-style:hover {
  cursor: pointer;
  background-color: #eee;
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

.choose-content img {
  width: 100px;
  height: 100px;
  margin: 10px;
}

.files {
  /* border: 2px solid #000; */
  /* border-top: 2px double #000; */
  display: flex;
  padding: 0px 0px 8px 8px;
}

.files button {
  margin: 0px 8px 0px 0px;
  background: white;
  border: 0px solid white;
  width: 40px;
  height: 40px;
}

.files button:hover {
  cursor: pointer;
  background-color: #eee;
  border-radius: 8px;
}

.files button img {
  width: 20px;
  height: 20px;
}

.file-upload input {
  background-image: url('../components/images/inputimage.png');
}

.file-upload{
  /* border: 2px solid #000; */
  color: black;
  font-family: 'CustomFont', Arial, sans-serif;
  
}

.file-upload .choose-file {
  border: 1px solid #787878;
  border-radius: 5px;
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


.settings div {
  display: flex;
  margin: 8px 0;
  align-items: flex-start;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
}


.modal-overlay input {
  align-items: middle;
  padding: 5px;
  border: 2px solid black;
  border-radius: 5px;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
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
button:disabled {
  background-color: #f0f0f0;
  color: grey; /* 비활성화 상태 버튼의 글자색 */
  cursor: not-allowed; /* 커서 모양 */
  opacity: 0.4; /* 불투명도 */
}
p {
  margin-top: 10px;
  white-space: pre-wrap;
  overflow: hidden;
  width: 100%;
  height: 100px;
  font-family: 'CustomFont', Arial, sans-serif;
  color: black;
}

.hidden-char {
  visibility: hidden;
  animation: reveal 3s steps(40, end) forwards;
  color: black;
}

.border-box {
  border: 2px solid black;
  padding: 5px;
  margin: 16px;
  border-radius: 15px;
}

.settings {
  height: 370px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
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
  /* border: 2px solid #000; */
  display: flex;
  flex-direction: column;
}

.npc{
  padding: 8px 24px;
  font-size : 24px;
}

.custom-textarea0 {
  height: 50px;
  width : 750px;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
  margin-bottom : 20px;
  padding: 15px;
  overflow: hidden;
}
.custom-textarea {
  height: 240px;
  width: 100%;
  resize: none;
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
  padding: 15px;
}
.file-input {
  height: 250px;
  width : 100%;
  resize: none; /* 사용자가 크기를 조절할 수 없도록 설정 */
  font-family: 'CustomFont', Arial, sans-serif;
  font-size: 20px;
  padding: 15px;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  width: 600px;
  height: 700px;
  color: black; /* Set text color to black */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.modal-content h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: black; /* Ensure heading color is black */
}

.modal-content p {
  margin-bottom: 5px; /* Reduce gap between paragraphs */
  font-size: 20px;
  width: 470px;
  
}
.modal-message {
  height: 400px;
  width : 470px;
  resize : none;
  font-size : 20px;
  font-family: 'CustomFont', Arial, sans-serif;

}
.modal-date {
  height: 40px
}
.modal-warn {
  height: 120px;
  color:red;
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

.date-picker {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.date-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-unit div {
  width: 60px; /* Width increased by 1.5x */
  height: 30px; /* Height increased by 1.5x */
  text-align: center;
  font-size: 30px; /* Font size increased by 1.5x */
  color: black;
  margin-bottom: 10px /* Text color changed to black */
}

.date-button {
  width: 60px; /* Width increased by 1.5x */
  height: 30px; /* Height increased by 1.5x */
  font-size: 24px; /* Font size increased by 1.5x */
  color: black; /* Text color changed to black */
  background-color: #f0f0f0;
  border: 2px solid black;
  border-radius: 5px;
  cursor: pointer;
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
.warn{
  color: red;
  font-size : 20px;
}
.notwarn{
  color:green;
  font-size : 20px;
}

</style>