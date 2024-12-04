<script>
import Card from '@/components/Card.vue';
import axiosInstance  from '@/axios';
import AddUserDialog from '@/components/AddUserDialog.vue';

export default {
  name: 'CreateTeachers',
  components: {
    Card,
    AddUserDialog,

  },
  data() {
    return {
      items: [], // Initialize items as an empty array
      dialogVisible: false, // Manage dialog visibility
      isLoading: false,
    };
  },
  async created(){
    await this.fetchData();
  },
  methods: {
    handleCardClick(item) {
      this.$router.push({ name: 'CreateExams', params: { id: item.id } });
    },
    async fetchData() {
      this.isLoading = true;
      try {
        const request =await axiosInstance.get('/profesor');         
     
       for( var i = 0; i < request.data.length; i++ )
         {
           this.items.push(request.data[i]);
         }
    

      } catch (error) {
        console.error('Error fetching data:', error);
        this.items = [];
      }
      this.isLoading = false;
    }, 
  },
};
</script>



<template>
  <v-app>
    <!-- Main Content -->
    <v-main>
      <v-container v-if="isLoading">
        <v-row justify="center">
          <v-col cols="auto">
            <v-progress-circular
              indeterminate
              color="primary"
              size="64"
              width="4"
            ></v-progress-circular>
          </v-col>
        </v-row>
      </v-container>
      <v-container v-if="!isLoading">
        <v-row justify="end">
          <v-btn color="primary" @click="dialogVisible = true">
            Add New Teacher
          </v-btn>
        </v-row>
        <v-row>
          <v-col
            v-for="item in this.items"
            :key="item.id"
                 cols="12"  md="5" lg="4" xl="3"
          >
            <Card
              class="card-container"
              :title="item.nume"
              :subtitle="item.telefon"
              :description="item.departament"
              :buton-name="'Add Exam'"
              @card-click="handleCardClick(item)"
              :showButton="true"
            />
          </v-col>
        </v-row>
        <AddUserDialog  v-model="dialogVisible" :isTeacher='true' />
      </v-container>
    </v-main>
  </v-app>
</template>


