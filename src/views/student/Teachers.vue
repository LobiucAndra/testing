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
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.id"
            cols="12" md="3"
          >
            <!-- Card Component with Create Request Button -->
            <Card
              :title="item.nume"
              :subtitle="item.departament"
              :description="item.telefon"
              :butonName="'Create request'"
              @card-click="item.dialogVisible = true"
              :showButton="true"
            />
            
            <!-- DialogForm Component for Each Item -->
            <DialogForm
              v-model="item.dialogVisible"  
              :profesorId="item.id"        
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Card from '@/components/Card.vue';
import DialogForm from '@/components/DialogForm.vue';
import axiosInstance from '@/axios';

export default {
  name: 'TeacherPage',
  components: {
    Card,
    DialogForm,
  },
  data() {
    return {
      items: [], // Array of items with each item holding its own dialog visibility
      isLoading: false, 
    };
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        const response = await axiosInstance.get('/profesor');
        
        // Initialize items with dialogVisible set to false for each item
        this.items = response.data.map((profesor) => ({
          ...profesor,
          dialogVisible: false,  // Add dialogVisible to each item for independent control
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally{
        this.isLoading = false;
      }
    },
  },
};
</script>
