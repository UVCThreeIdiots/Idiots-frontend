<template>
  <div>
  <div v-if="showImageModal" class="choose-overlay">
    <div class="choose-content">
      <h2>선택</h2>
      <div>
        <a @mouseover="showLink1 = true" @mouseleave="showLink1 = false" @click="triggerFileUpload">
          <span v-if="showLink1">▶</span><span v-else></span>&nbsp; 이미지 업로드
        </a>
        <input type="file" ref="fileInput" @change="handleFileUpload" multiple accept=".png" style="display: none;" />
        <div v-if="imageUrls.length">
          <img v-for="(url, i) in imageUrls" :key="i" :src="url" alt="Uploaded Image Preview" />
        </div>
      </div>
      <div>
        <a @mouseover="showLink2 = true" @mouseleave="showLink2 = false" @click="openTakenPhotoModal">
          <span v-if="showLink2">▶</span><span v-else></span>&nbsp; 사진 찍기
        </a>
      </div>
      <div>
        <button class="btn-style" @click="closeImageModal">뒤로가기</button>
      </div>
    </div>
  </div>
  <div v-if="showTakenPhotoModal" class="modal-overlay">
    <div class="modal-content">
      <h2>사진 찍기</h2>
      <div v-if="!photoTaken">
        <video class="video" ref="video" autoplay playsinline></video>
        <button @click="takePhoto">사진 찍기</button>
      </div>
      <div v-else>
        <img class="capture-image" :src="photo" alt="Captured Photo" />
        <button @click="uploadPhoto">사진 업로드</button>
        <button @click="retakePhoto">다시 찍기</button>
      </div>
    </div>
    <button class="btn-style" @click="closeTakenPhotoModal">뒤로가기</button>
  </div>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const showImageModal = ref(true);
const showTakenPhotoModal = ref(false);
const showLink1 = ref(false);
const showLink2 = ref(false);
const video = ref(null);
const fileInput = ref(null);
const photo = ref(null);
const photoTaken = ref(false);
const imageUrls = ref([]);
let stream = null;

const startVideo = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  } catch (error) {
    console.error('Error accessing the camera', error);
  }
};

const stopVideo = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};

const triggerFileUpload = () => {
  fileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files.length + imageUrls.value.length > 10) {
    alert('최대 10개의 이미지만 업로드할 수 있습니다.');
    return;
  }
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrls.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const takePhoto = () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.value.videoWidth;
  canvas.height = video.value.videoHeight;
  const context = canvas.getContext('2d');
  context.drawImage(video.value, 0, 0, canvas.width, canvas.height);
  const capturedPhoto = canvas.toDataURL('image/png');
  if (imageUrls.value.length < 10) {
    imageUrls.value.push(capturedPhoto);
    photo.value = capturedPhoto;
    photoTaken.value = true;
  } else {
    alert('최대 10개의 이미지만 업로드할 수 있습니다.');
  }
  stopVideo();
};

const retakePhoto = () => {
  photo.value = null;
  photoTaken.value = false;
  startVideo();
};

const uploadPhoto = () => {
  // 업로드 로직 추가
  console.log('Uploading photos:', imageUrls.value);
};

const openTakenPhotoModal = () => {
  showImageModal.value = false;
  showTakenPhotoModal.value = true;
  startVideo();
};

const closeTakenPhotoModal = () => {
  showTakenPhotoModal.value = false;
  showImageModal.value = true;
  stopVideo();
};

const closeImageModal = () => {
  showImageModal.value = false;
};

onMounted(() => {
  startVideo();
});

onUnmounted(() => {
  stopVideo();
});
</script>


<style scoped>
.choose-overlay, .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}
.choose-content, .modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}
video {
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
  border: 1px solid #ccc;
}
img {
  width: 100%;
  max-width: 400px;
  margin: 10px 0;
  border: 1px solid #ccc;
}
button {
  display: block;
  margin: 10px 0;
  padding: 10px 20px;
  font-size: 16px;
}
</style>

