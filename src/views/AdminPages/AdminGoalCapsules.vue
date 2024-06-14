<template>
  <div class="container">
    <div class="sidebar">
      <img class="profile-pic" src="../../components/images/ThreeIdiots.png" alt="Profile Picture">
      <div class="greeting">{{ userName }}님<br>안녕하세요!</div>
      <button class="menu-item">Main</button>
      <button class="menu-item">Users</button>
      <button class="menu-item" @click="toggleCapsuleLinks">Capsules</button>
      <div v-if="showCapsuleLinks" class="capsule-links">
        <a href="/admin/timecapsules">Time Capsule</a>
        <a href="/admin/goalcapsules">Goal Capsule</a>
      </div>
      <button class="menu-item">Game</button>
    </div>
    <div class="main-content">
      <div class="header">
        <h2>T-Capsules</h2>
        <div>
          <select v-model="searchKey" class="select">
            <option value="title">Title</option>
            <option value="expired">Expired</option>
            <option value="userId">User ID</option>
          </select>
          <input class="search" type="text" v-model="searchQuery" placeholder="Search Time Capsules">
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
            <p>이 정보로 캡슐을 삭제하시겠습니까?</p>
            <button type="button" @click="cancelDeleteCapsule">Cancel</button>
            <button type="button" @click="deleteCapsule(selectedCapsuleId)">Del</button>
          </div>
        </div>
      </div>

      <!-- Capsule Details Modal 생략 -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useUserStore } from '../../stores/user.js';

const userStore = useUserStore();
const userName = ref(userStore.getUser().name);
const searchQuery = ref('');
const searchKey = ref('title');
const capsules = ref([]);
const sortKey = ref('');
const sortOrder = ref('asc');
const showDelCapsuleModal = ref(false);
const selectedCapsuleId = ref(null);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showCapsuleLinks = ref(false);

const paginatedCapsules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCapsules.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredCapsules.value.length / itemsPerPage.value));

const capsulesData = () => {
  axios.get(`http://localhost:3000/time/allTCapsules`)
    .then(response => {
      console.log(response.data);
      capsules.value = response.data.map(capsule => ({
        ...capsule,
        userLoginId: capsule.user ? capsule.user.userId : null // user 객체가 null이 아닌 경우 userId를 userLoginId로 저장
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
    await axios.delete(`http://localhost:3000/time/deleteTcapsule/${id}`);
    capsulesData(); // 삭제 후 목록을 다시 불러와서 업데이트
    showDelCapsuleModal.value = false; // 모달 닫기
  } catch (error) {
    console.error('Failed to delete capsule:', error);
  }
};

const viewCapsuleDetails = (capsule) => {
  // 여기서 selectedCapsule을 사용하지 않고, 세부 정보를 보여주는 다른 처리를 하도록 구현하셨을 것입니다.
  console.log('View capsule details:', capsule);
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

const changePage = computed(() => (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
});

const toggleCapsuleLinks = () => {
  showCapsuleLinks.value = !showCapsuleLinks.value;
};

onMounted(() => {
  capsulesData();
});
</script>



<style scoped>
.container {
  display: flex;
  height: 100vh;
  background-color: #ccc;
}

.sidebar {
  width: 200px;
  background-color: #e0e0e0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.profile-pic {
  width: 100%;
  height: 160px;
  background-color: #b0b0b0;
  margin-bottom: 30px;
}

.greeting {
  background-color: #d0d0d0;
  padding: 10px;
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
  color: black;
  font-size: 18px;
}

.menu-item {
  background-color: #808080;
  color: white;
  padding: 15px;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  height: 60px;
  cursor: pointer;
  font-size: 16px;
}

.menu-item:hover {
  background-color: #606060;
}

.main-content {
  width: 1200px;
  background-color: #d0d0d0;
  margin: 20px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
}
h2{font-size:40px;color:white;margin-left:40px;}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  height : 100px;
}

.select {
  height: 30px;
  font-size: 16px;
  margin-left : 295px;
}

.search {
  height: 30px;
  font-size: 16px;
  padding: 5px;
  margin-right: 10px;
  width : 216px;
}

.header-button {
  padding: 5px 10px;
  margin-right : 40px;
  font-size : 16px;
}

table {
  width: 1080px;
  border-collapse: collapse;
  border: 2px solid black;
  color: black;
  font-size: 16px;
}

th,
td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  border: 1px solid black;
  height: 40px;
  text-align : center;
}

th {
  cursor: pointer;
  background: white;
  font-size: 18px;
  color: lightcoral;
  text-align: center;
}

th.id {
  width: 40px;
  text-justify : center;
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
  width: 50%;
  height: 30px;
  font-size: 16px;
}
.modal h3{color : black;margin : 10px 20px;text-align : center}
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
  font-size: 18px;
  justify-content: center;
  flex-direction : column;
}
.modal-form input, .modal-form select, .modal-form textarea {
  font-size: 16px;
  margin-left: 20px;
  width: 200px;
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



.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  padding: 5px 10px;
  margin: 0 5px;
  font-size: 16px;
}

.pagination span {
  font-size: 16px;
}

</style>
