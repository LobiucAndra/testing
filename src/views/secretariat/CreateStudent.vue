<script>
import Card from '@/components/Card.vue';
import axiosInstance from '@/axios';
import AddUserDialog from '@/components/AddUserDialog.vue';
import PromoteAlert from '@/components/PromoteAlert.vue';

export default {
  name: 'CreateStudents',
  components: {
    Card,
    AddUserDialog,
    PromoteAlert,
  },

  data() {
    return {
      dropdownItems: [], // Data for v-autocomplete dropdown
      items: [], // Data for the card list
      dialogVisible: false,
      isLoading: false,
      selectedValue: null,
      promotionStatus: null,
 
    };
  },
  watch: {
    // Watch for changes on `selectedValue`
    selectedValue(newValue) {
        console.log(newValue);
        this.fetchData(newValue);
    },
  },

  methods: {
    async fetchGrupe(newSelectedValue) {
        this.dropdownItems = [];
        if (!newSelectedValue) {
            return;
        }
        try {
            const request = await axiosInstance.get(`/grupe/${newSelectedValue}`);
            this.dropdownItems = request.data; // Update the items with the fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
            this.dropdownItems = []; // Clear items if there's an error
        } 
     },
     async fetchData(newSelectedValue) {
        this.items = [];
        if (!newSelectedValue) {
            return;
        }
        console.log(newSelectedValue);
        try {
            const request = await axiosInstance.get(`/secretariat/studentidingrupa/${newSelectedValue}`);
            this.items = request.data; // Update the items with the fetched data
        } catch (error) {
            console.error('Error fetching data:', error);
            this.items = []; // Clear items if there's an error
        } 
     },
     async handleCardClick(item) {
      try {
        const grupaId = this.selectedValue;
        const studentId = item.id;
        const request = await axiosInstance.put(`/student/promovare/${grupaId}/${studentId}`);
        if (request.status >= 200 && request.status < 300) {
          this.promotionStatus = "Studentul a fost promovat cu succes!";
          this.fetchData(this.selectedValue);
        } else {
          this.promotionStatus = "Studentul nu a putut fi promovat!";
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        this.promotionStatus = "A apărut o eroare la promovarea studentului!";
      }

      // Hide alert after 2 seconds
      setTimeout(() => {
        this.promotionStatus = null;
      }, 2000);
    },
  },
};
</script>

<template>
    <v-app>
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
          <v-row justify="space-between" align="center">
            <!-- Align the autocomplete to the left with a minimum width -->
            <v-col cols="auto">
              <v-autocomplete
                v-model="selectedValue"
                clearable
                label="Select Group"
                :items="dropdownItems"
                item-title="nume"
                item-value="id"
                @update:search="fetchGrupe"
                class="min-width-200" 
              ></v-autocomplete>
            </v-col>
  
            <!-- Align the button to the end with a minimum width -->
            <v-col cols="auto" class="text-right">
              <v-btn
                color="primary"
                @click="dialogVisible = true"
                class="min-width-150"     
              >
                Add New Student
              </v-btn>
            </v-col>
          </v-row>
  
          <!-- Cards display -->
          <v-row>
            <v-col
              v-for="item in items"
              :key="item.id"
              cols="12"
              md="5"
              lg="4"
              xl="3"
            >
            <Card
              class="card-container"
              :title="item.nume"
              :subtitle="item.telefon"
              :description="item.isSef ? 'Group Leader' : 'Student'"
              :buton-name="'Promote'"
              :showButton="!item.isSef"
              @card-click="handleCardClick(item)"
            />
            </v-col>
          </v-row>
  
          <AddUserDialog v-model="dialogVisible" :isTeacher="false" />
          <v-alert v-if="promotionStatus" type="info" class="mt-3">
            {{ promotionStatus }}
          </v-alert>
  
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <style scoped>
  /* Custom minimum width for autocomplete and button */
  .min-width-200 {
    min-width: 200px; /* Set minimum width for v-autocomplete */
  }
  
  .min-width-150 {
    min-width: 150px; /* Set minimum width for the button */
  }
  </style>
  