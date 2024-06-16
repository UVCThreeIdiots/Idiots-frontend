<template>
  <div class="container">
    <navigationView/>
    <div class="main-content">
      <div class="header-div">
      <div class="header">
        <h2>User Management</h2>
        <div>
          <select v-model="searchKey" class="select">
            <option value="userId">User ID</option>
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
            <option value="mode">Mode</option>
          </select>
          <input class="search" type="text" v-model="searchQuery" placeholder="Search Users">
        </div>
        <button class="header-button" @click="showAddUserModal = true">Add User</button>
      </div>
      </div>
      <div class="table-div">
        <table>
          <thead>
            <tr>
              <th class="id" @click="sortUsers('id')">ID</th>
              <th class="userId" @click="sortUsers('userId')">User ID</th>
              <th class="name" @click="sortUsers('name')">Name</th>
              <th class="age" @click="sortUsers('age')">Age</th>
              <th class="email" @click="sortUsers('email')">Email</th>
              <th class="role" @click="sortUsers('role')">Role</th>
              <th class="mode" @click="sortUsers('mode')">Mode</th>
              <th class="action">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in paginatedUsers" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.userId }}</td>
              <td>
                <template v-if="user.id === editUserId">
                  <input class="editBox" type="text" v-model="user.name" required>
                </template>
                <template v-else>
                  {{ user.name }}
                </template>
              </td>
              <td>
                <template v-if="user.id === editUserId">
                  <input class="editBox" type="text" v-model="user.age" required>
                </template>
                <template v-else>
                  {{ user.age }}
                </template>
              </td>
              <td>
                <template v-if="user.id === editUserId">
                  <input class="editBox" type="email" v-model="user.email" required>
                </template>
                <template v-else>
                  {{ user.email }}
                </template>
              </td>
              <td>
                <template v-if="user.id === editUserId">
                  <select class="editBox" v-model="user.role">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </template>
                <template v-else>
                  {{ user.role }}
                </template>
              </td>
              <td>
                <template v-if="user.id === editUserId">
                  <select class="editBox" v-model="user.mode">
                    <option value="normal">Normal</option>
                    <option value="game">Game</option>
                  </select>
                </template>
                <template v-else>
                  {{ user.mode }}
                </template>
              </td>
              <td>
                <template v-if="user.id === editUserId">
                  <button class="actionButton" @click="saveEditedUser(user)">Save</button>
                  <button class="actionButton cancel" @click="cancelEdit">Cancel</button>
                </template>
                <template v-else>
                  <button class="actionButton" @click="editUser(user)">Edit</button>
                  <button class="actionButton delete" @click="deleteUser(user.id)">Del</button>
                </template>
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
      <!-- Add User Modal -->
      <div v-if="showAddUserModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="showAddUserModal = false">&times;</span>
          <form class="modal-form" @submit.prevent="addUser">
            <h3>Add User</h3>
            <div class="form-items">
              <h4>User ID:</h4>
              <input type="text" v-model="newUser.userId" placeholder="User ID" required>
            </div>
            <div class="form-items">
              <h4>Password:</h4>
              <input type="password" v-model="newUser.password" placeholder="Password" required>
            </div>
            <div class="form-items">
              <h4>Name:</h4>
              <input type="text" v-model="newUser.name" placeholder="Name" required>
            </div>
            <div class="form-items">
              <h4>Age:</h4>
              <input type="number" v-model="newUser.age" placeholder="Age" required>
            </div>
            <div class="form-items">
              <h4>Email:</h4>
              <input type="email" v-model="newUser.email" placeholder="Email" required>
            </div>
            <div class="form-items">
              <h4>Role:</h4>
              <select v-model="newUser.role">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-items">
              <h4>Mode:</h4>
              <select v-model="newUser.mode">
                <option value="normal">Normal</option>
                <option value="game">Game</option>
              </select>
            </div>
            <div class="a">
              <p>이 정보로 계정을 생성하시겠습니까?</p>
              <button type="button" class="cancel" @click="cancel">Cancel</button>
              <button type="submit">Add</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axiosInstance from '@/config/axiosInstance.js';
import navigationView from './NavigationView.vue';
const searchQuery = ref('');
const searchKey = ref('userId'); // 기본 검색 기준 설정
const users = ref([]);
const sortKey = ref('');
const sortOrder = ref('asc');
const showAddUserModal = ref(false);
const newUser = ref({
  name: '',
  age: 0,
  userId: '',
  password: '',
  email: '',
  role: 'user',
  mode: 'normal'
});
const editUserId = ref(null);

// const navigateTo = (route) => {
//   window.location.href = route;
// };

const usersData = () => {
  axiosInstance.get(`http://localhost:3000/user/all`)
  .then(response => {
    console.log(response.data);
    users.value = response.data;
  })
  .catch(error => {
    console.error('user[Get]Error : ', error);
  });
};

const addUser = async () => {
  try {
    await axiosInstance.post('http://localhost:3000/user', newUser.value);
    usersData();
    showAddUserModal.value = false;
  } catch (error) {
    console.error('Failed to add user:', error);
  }
};

const cancel = async () => {
  showAddUserModal.value = false;
};

const editUser = (user) => {
  editUserId.value = user.id;
};

const saveEditedUser = async (user) => {
  try {
    const {password, gCapsules, ...newUser} = user;
    
    await axiosInstance.put(`http://localhost:3000/user/${user.id}`,newUser);

    editUserId.value = null;
  } catch (error) {
    console.error('Failed to save edited user:', error);
  }
};

const cancelEdit = () => {
  editUserId.value = null;
};

const deleteUser = async (id) => {
  try {
    await axiosInstance.delete(`http://localhost:3000/user/${id}`);
    usersData();
  } catch (error) {
    console.error('Failed to delete user:', error);
  }
};

const sortUsers = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }

  users.value.sort((a, b) => {
    const result = a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
    return sortOrder.value === 'asc' ? result : -result;
  });
};

const filteredUsers = computed(() => {
  return users.value.filter((user) =>
    user[searchKey.value].toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const currentPage = ref(1);
const itemsPerPage = ref(10);
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredUsers.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value));
const changePage = computed(() => (page) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
});

onMounted(() => {
  usersData();
});
</script>

<style scoped>
/* 복사 해갈 부분*/
.container {
  display: flex;
  background-color: black;
  width : 100vw;
  min-width: 1500px;
  justify-content: center;
} 
.main-content {
  width: 1200px;
  background-color: #DAD3BE;
  margin: 20px;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 500px;
  overflow: auto;
  overflow-x : hidden;
  overflow-y : hidden;
}

h2{font-size:40px;color:white;margin-left:40px;}
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
        padding: 8px 8px;
    margin-right: 30px;
    font-size: 16px;
    border-radius: 10px;
    border: none;
    background-color: #254336;
    color: white;
        }
        /* 여기 까지*/
        
        
        table {
          width: 1080px;
          border-collapse: collapse;
          color: black;
          font-size: 14px;
          margin : 20px;
          }
            .header-div{
              display:flex;
              justify-content: center;
            }

th,
td {
  padding: 8px;
  text-align: center;
  border: 1px solid black;
  height: 40px;
  text-align : center;
  background-color : white;
}

th {
  cursor: pointer;
  background: #7a7861;
  font-size: 18px;
  color: white;
  text-align: center;
}

th.id {
  width: 5%; /* 수정한 부분 */
}

th.userId {
  width: 12%; /* 수정한 부분 */
}

th.name {
  width: 12%; /* 수정한 부분 */
}

th.age {
  width: 7%; /* 수정한 부분 */
}

th.email {
  width: 26%; /* 수정한 부분 */
}

th.role {
  width: 9%; /* 수정한 부분 */
}

th.mode {
  width: 9%; /* 수정한 부분 */
}

th.action {
  width: 16%; /* 수정한 부분 */
}

.editBox {
  width: 90%;
  font-size: 14px;
  height: 90%;
  text-align: center;
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
}
.modal-form input, .modal-form select{
  font-size : 16px;
  margin-left : 20px;
  width : 200px;
}
.close {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.form-items {
  display : flex;
  margin : 20px;
  justify-content: flex-end;
}
.modal-content button{
  font-size : 16px;
  width : 80px;
  height : 30px;
  margin : 20px;
}
.a{
  margin-top : 50px;
  text-align : center;
}
.table-div{
  display:flex;
  justify-content: center;
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
</style>
