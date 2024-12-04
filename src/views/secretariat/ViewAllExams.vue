<script>
import Card from '@/components/Card.vue';
import axiosInstance from '@/axios';

import RefuzeExam from '@/components/RefuzeExam.vue';

export default {
  name: 'ViewAllExams',
  components: {
    Card,
    RefuzeExam
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
        try {
            const request = await axiosInstance.get(`/examen/grupaexamene/${newSelectedValue}`);
            for( var i = 0; i < request.data.length; i++ )
         {
            const student = await request.data[i].sef;
            const materie = request.data[i].materie;
            this.items.push({
            numeMaterie: materie.nume,
            numeElev: student.nume,
            id: request.data[i].id,
            data: request.data[i].data,
            oraStart: request.data[i].orastart,
            oraStop: request.data[i].orafinal,
           });
         }
            console.log(request.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            this.items = []; // Clear items if there's an error
        } 
     },
  
     handleCardClick() {
      this.dialogVisible = true;
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
             :title="item.numeMaterie"
              :subtitle="item.numeElev"
              :description="item.data + ' ' + item.oraStart + ' - ' + item.oraStop"
              :buton-name="'Delete'"
              :showButton='true'
             @card-click="handleCardClick"
            />       
            <RefuzeExam v-model="dialogVisible" :id="item.id" :is-teacher="false"
            />    
            </v-col>
          </v-row>
          <v-alert v-if="promotionStatus" type="info" class="mt-3">
            {{ promotionStatus }}
          </v-alert>
         
        </v-container>
      </v-main>
    </v-app>
  </template>
  
  <style scoped>
  .min-width-200 {
    min-width: 200px; /* Set minimum width for v-autocomplete */
  }
  
  .min-width-150 {
    min-width: 150px; /* Set minimum width for the button */
  }
  </style>
  