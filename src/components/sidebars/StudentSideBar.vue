

<template>
  <v-navigation-drawer  expand-on-hover
  rail permanent
 >
    <v-list>
      <!-- Profile Information -->
      <v-list>
      <v-list-item
        prepend-avatar="https://randomuser.me/api/portraits/women/85.jpg"
        :subtitle='this.email'
        :title='this.name'
      ></v-list-item>
    </v-list>

      <v-divider></v-divider>

      <!-- Sidebar Menu Items -->
      <v-list dense>
        <template v-if="type === 'student'">
      <v-list-item
        prepend-icon="mdi-star"
        title="View Exams"
        value="view_exams"
        to="/exams"
      ></v-list-item>
        </template>

        <template v-if="type === 'sef'">
          <v-list-item
        prepend-icon="mdi-account-multiple"
        title="View Teachers"
        value="view_teachers"
        to="/teachers"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-star"
        title="View Exams"
        value="view_exams"
        to="/exams"
      ></v-list-item>
  
        </template>

        <template v-else-if="type === 'profesor'">
          <v-list-item
        prepend-icon="mdi-account-multiple"
        title="View Requests"
        value="view_requests"
        to="/view_requests"
       ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="View Assistents"
        value="view_asistenti"
        to="/view_assistents"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="View Exams"
        value="view_exams"
        to="/view_approved_exams"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="View Materii"
        value="view_materii"
        to="/view_materii"
      ></v-list-item>
        </template>

        <template v-else-if="type === 'secretar'">
          <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Create Teacher"
        value="create_teacher"
        to="/create_teachers"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Create Students"
        value="create_students"
        to="/create_students"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="View Exams"
        value="view_all_exams"
        to="/view_all_exams"
      ></v-list-item>
        </template>

        <!-- Logout Button (common for all users) -->
        <v-list-item
        prepend-icon="mdi-folder"
        title="Logout"
        value="logout"
        @click="logout"
      ></v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>
</template>


<script>
import axiosInstance from '@/axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'vue-router';

export default {
  props: {
      type: {
        type: String,
        required: true,
      },
    },
  created() {
     this.fetchData();
   },
  setup() {
    const router = useRouter();

    const logout = () => {
      // Șterge token-ul de autentificare din localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('accountType');

      // Redirecționează utilizatorul la pagina de login
      router.push({ name: 'Login' });
    };
    return {
      logout,
    };
  },
  methods: {
    async fetchData() {
      try {
        const authToken = localStorage.getItem('authToken');
        const id = localStorage.getItem('id');
        const data = jwtDecode(authToken)
        const resonse = await axiosInstance.get('/user/info/' + id);
        this.name = resonse.data.nume;
        this.email = data.email;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  },
  
  data(){
   return {
    drawer: true,
    name: null,
    email: null,
    }
  }
}
</script>