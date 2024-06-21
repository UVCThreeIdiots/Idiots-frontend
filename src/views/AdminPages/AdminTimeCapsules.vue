<template>
  <div class="container">
    <Navigation />
    <div class="main-content">
      <div class="header-div">
        <div class="header">
          <h2>Time Capsules</h2>
          <div>
            <select v-model="searchKey" class="select">
              <option value="title">Title</option>
              <option value="expired">Expired</option>
              <option value="userLoginId">User ID</option>
              <option value="status">status</option>
            </select>
            <input class="search" type="text" v-model="searchQuery" placeholder="Search Users">
          </div>
        </div>
      </div>
      <div class="table-div">
        <table>
          <thead>
            <tr>
              <th class="id" @click="sortCapsules('id')">ID</th>
              <th class="title" @click="sortCapsules('title')">Title</th>
              <th class="expired" @click="sortCapsules('expired')">Expired</th>
              <th class="userId" @click="sortCapsules('userId')">User ID</th>
              <th class="status" @click="sortCapsules('status')">Status</th>
              <th class="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(capsule, index) in paginatedCapsules" :key="capsule.id">
              <td>{{ capsule.id }}</td>
              <td>{{ capsule.title }}</td>
              <td>{{ capsule.expired }}</td>
              <td>{{ capsule.userLoginId }}</td>
              <td>{{ capsule.status }}</td>
              <td>
                <button class="actionButton" @click="viewCapsuleDetails(capsule)">View</button>
                <button class="actionButton" @click="showDelCapsuleModal = true; selectedCapsuleId = capsule.id">Del</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1">Prev</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
      </div>

      <!-- Delete Capsule Modal -->
      <div v-if="showDelCapsuleModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showDelCapsuleModal = false">&times;</span>
          <div class="a">
            <p>Capsule ID : {{ selectedCapsuleId }}</p>
            <p>Title : {{ selectedCapsule.title }}</p>
            <p>해당 캡슐을 삭제하시겠습니까?</p>
            <button type="button" @click="cancelDeleteCapsule">Cancel</button>
            <button type="button" @click="deleteCapsule(selectedCapsuleId)">Del</button>
          </div>
        </div>
      </div>

      <!-- Capsule Details Modal -->
      <div v-if="showCapsuleDetailsModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showCapsuleDetailsModal = false">&times;</span>
          <h3>Capsule Details</h3>
          <div class="details-content">
            <p><strong>Capsule ID :</strong> {{ selectedCapsule.id }}</p>
            <p><strong>User ID :</strong> {{ selectedCapsule.userLoginId }}</p>
            <p v-if="selectedCapsule.otherId>0"><strong>To Whom :</strong> {{ selectedCapsule.otherId }}</p>
            <p v-else-if="selectedCapsule.otherEmail"><strong>To Whom :</strong> {{ selectedCapsule.otherEmail }}</p>
            <p v-else><strong>To Whom :</strong> Me</p>
            <p><strong>Title :</strong> {{ selectedCapsule.title }}</p>
            <textarea v-model="selectedCapsule.body"><strong>Body : </strong></textarea>
            <p><strong>Created At :</strong> {{ selectedCapsule.createdAt }}</p>
            <p><strong>Expired At :</strong> {{ selectedCapsule.expired }}</p>
            <p><strong>Status:</strong> {{ selectedCapsule.status }}</p>
            <!-- 추가적인 세부 정보를 여기에 표시할 수 있습니다. -->
          </div>
          <button type="button" @click="showCapsuleDetailsModal = false">Close</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosInstance from '@/config/axiosInstance.js';
import Navigation from './NavigationView.vue';

const searchQuery = ref('');
const searchKey = ref('title');
const capsules = ref([]);
const sortKey = ref('');
const sortOrder = ref('asc');
const showDelCapsuleModal = ref(false);
const showCapsuleDetailsModal = ref(false);
const selectedCapsuleId = ref(null);
const selectedCapsule = ref({});
const currentPage = ref(1);
const itemsPerPage = ref(10);

const paginatedCapsules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCapsules.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredCapsules.value.length / itemsPerPage.value));

const capsulesData = () => {
  axiosInstance.get(`http://localhost:3000/time/allTCapsules`)
    .then(response => {
      console.log(response.data);
      capsules.value = response.data.map(capsule => ({
        ...capsule,
        userLoginId: capsule.user ? capsule.user.userId : null
        // user 객체가 null이 아닌 경우 userId를 userLoginId로 저장
      }));
    })
    .catch(error => {
      console.error('capsule[Get]Error : ', error);
    });
};

const cancelDeleteCapsule = () => {
  showDelCapsuleModal.value = false;
};

const deleteCapsule = async (id) => {
  try {
    await axiosInstance.delete(`http://localhost:3000/time/deleteTcapsule/${id}`);
    capsulesData(); // 삭제 후 목록을 다시 불러와서 업데이트
    showDelCapsuleModal.value = false; // 모달 닫기
  } catch (error) {
    console.error('Failed to delete capsule:', error);
  }
};

const viewCapsuleDetails = (capsule) => {
  selectedCapsule.value = capsule;
  showCapsuleDetailsModal.value = true;
};

const sortCapsules = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }

  capsules.value.sort((a, b) => {
    const result = a[key] > b[key] ? 1 : (a[key] < b[key] ? -1 : 0);
    return sortOrder.value === 'asc' ? result : -result;
  });
};

const filteredCapsules = computed(() => {
  return capsules.value.filter(capsule =>
    capsule[searchKey.value].toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const changePage = (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

onMounted(() => {
  capsulesData();
});
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
  margin : 10px;
  height : 90px;
  background-color : #6B8A7A;
  width : 1080px;
  border-radius :10px;
  }

.select {
  height: 30px;
  font-size: 16px;
  margin-left: 295px;
}

.search {
  height: 30px;
  font-size: 16px;
  padding: 5px;
  margin-right: 10px;
  width: 216px;
}

.header-button {
  padding: 8px 8px;
  margin-right: 30px;
  font-size: 16px;
}

.header-div {
  display: flex;
  justify-content: center;
}

table {
  width: 1080px;
  border-collapse: collapse;
  border: 2px solid black;
  color: black;
  font-size: 14px;
  margin: 20px;
  background-color: white;
}

th,
td {
  padding: 8px;
  text-align: left;
  border: 1px solid black;
  height: 40px;
  text-align: center;
}

th {
  cursor: pointer;
  background: #7a7861;
  font-size: 18px;
  color: white;
  text-align: center;
}

th.id {
  width: 40px;
  text-justify: center;
}

th.title {
  width: 150px;
}

th.expired {
  width: 130px;
}

th.userId {
  width: 100px;
}

th.status {
  width: 60px;
}

th.action {
  width: 100px;
}

.actionButton {
  width: 45%;
    height: 27px;
    font-size: 14px;
    background-color: #6B8A7A;
    border: none;
    margin: 0px 3px;
    border-radius: 10px;
    color: white;
}

.modal h3 {
  color: black;
  margin: 10px 20px;
  text-align: center;
}

.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 500px;
    display: flex;
    height: 550px;
    position: relative;
    color: black;
    font-size: 14px;
    justify-content: center;
    flex-direction: column;
    align-items: center;
}


.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.form-items {
  display: flex;
  margin: 20px;
  justify-content: flex-end;
}

.modal-content button {
  font-size: 16px;
  width: 80px;
  height: 30px;
  margin: 20px;
}

.a {
  margin-top: 50px;
  text-align: center;
}

.table-div {
  display: flex;
  justify-content: center;
}

.details-content p {
  margin: 10px 0;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination button {
  padding: 5px 10px;
    margin: 0 5px;
    background-color: #6B8A7A;
    font-size: 16px;
    border-radius: 10px;
    border: none;
    color: white;
    width: 70px;
    height: 35px;
}

.pagination span {
  font-size: 16px;
}
textarea{
  width : 450px;
  height : 160px;
}
</style>
