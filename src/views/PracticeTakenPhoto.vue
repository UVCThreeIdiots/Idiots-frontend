<template>
  <div>
    <a @mouseover="showLink1 = true" @mouseleave="showLink1 = false" @click="triggerImageFileUpload">
      <span v-if="showLink1">▶</span><span v-else></span>&nbsp; 이미지 업로드
    </a>
    <input type="file" ref="imageFileInput" @change="handleFileUpload" multiple accept=".png,.jpg,.jpeg" style="display: none;" />
    <div v-if="imageUrls.length" class="image-items">
      <div v-for="(url, i) in imageUrls" :key="i" class="image-item">
        <img class="image" :src="url" alt="Uploaded Image" />
        <button class="delete-button" @click="removeImage(i)">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showLink1 = ref(false);
const imageUrls = ref([]);
const imageFileInput = ref(null);

const triggerImageFileUpload = () => {
  imageFileInput.value.click();
};

const handleFileUpload = (event) => {
  const files = event.target.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const reader = new FileReader();
    reader.onload = (e) => {
      imageUrls.value.push(e.target.result);
    };
    reader.readAsDataURL(file);
  }
};

const removeImage = (index) => {
  imageUrls.value.splice(index, 1);
};
</script>

<style>
.image-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.image-item {
  position: relative;
  display: inline-block;
}
.image {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

</style>
