<script>
import Card from '@/components/Card.vue';
import axiosInstance  from '@/axios';
import AddAssistentDialog from '@/components/AddAssistentDialog.vue';

export default {
  name: 'ViewAssistents',
  components: {
    Card,
    AddAssistentDialog,

  },
  data() {
    return {
      items: [], // Initialize items as an empty array
      dialogVisible: false, // Manage dialog visibility
      isLoading: false,
      validationError: null,
    };
  },
  async created(){
  await  this.fetchData();
  },
  methods: {
    async fetchData() {
      this.isLoading = true;

      try {
        this.items = [];
        const id =  localStorage.getItem('id');
        const request =await axiosInstance.get('/asistenti/' + id);         
     
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
    async deleteItem(idAssistent) {
      this.isLoading = true;
      try {
        const id =  localStorage.getItem('id');
        console.log(id);
        console.log(idAssistent);
        const request =await axiosInstance.delete(`/asistenti/${idAssistent}/${id}`);         
         
        if(request.status == 200 || request.status ==201){
          await this.fetchData();
        }

      } catch (error) {
        if(request.status == 418){
          validationError= request.message;
        }else{
          console.error('Error fetching data:', error);
          validationError='Something went wrong';
          this.items = [];
        }
     
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
            Add New Asistent
          </v-btn>
        </v-row>
        <v-row>
          <v-col
            v-for="item in this.items"
            :key="item.id"
                 cols="12"  md="5" lg="4" xl="3"
          >
            <Card
              :title="item.nume"
              :subtitle="item.telefon"
              :description="item.departament"
              :buton-name="'Delete'"
              @card-click="deleteItem(item.id)"
              :showButton="true"
            />
          </v-col>
        </v-row>
       <v-alert v-if="validationError" type="error" class="mt-3">
              {{ validationError }}
            </v-alert>
        <AddAssistentDialog  v-model="dialogVisible"  
     />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Optional: Custom styles if needed */
</style>
