
<script>
import axiosInstance from '@/axios';

export default {
  name: 'AddAssistentDialog',
  props: {
    modelValue: Boolean,
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      selectedAssistent: null,
      dialogVisible: this.modelValue,
      items: [],
      loading: false,
      validationError: '',
      dataFetched: false, // Track if data has been fetched to prevent redundant calls
    };
  },
  watch: {
    modelValue(newValue) {
      this.dialogVisible = newValue;

      // Call fetchData only if dialog is opening and data hasn’t been fetched yet
      if (newValue && !this.dataFetched) {
        this.fetchData();
      }
    },
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
          const profesorId = localStorage.getItem('id');
          const response = await axiosInstance.get(`/asistentineasignati/${profesorId}`);
          
          for( var i = 0; i < response.data.length; i++ )
            {
              this.items.push(response.data[i]);
            }

        this.dataFetched = true; // Mark data as fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.validationError = '';
 
      if (!this.selectedAssistent) {
        this.validationError = 'Please select a subject.';
        return;
      }

      this.loading = true;
    

      try {
         const id = localStorage.getItem('id')
        const response = await axiosInstance.post('/asistenti/'+id+'/'+this.selectedAssistent);
        if (response.status === 200 || response.status === 201) {
          this.$emit('submit');
          this.closeDialog();
        }         
      } catch (error) {
        console.error('Error submitting form:', error);
        this.validationError = 'Failed to submit the form. Please try again.';
      } finally {
        this.loading = false;
     
      }
    },

    closeDialog() {
      this.resetForm();
      this.$emit('update:modelValue', false);
    },

    resetForm() {
      this.selectedDate = null;
      this.selectedAssistent = null;
      this.validationError = '';
      this.dataFetched = false; // Reset dataFetched so data can be fetched again next time
    },
  },
};
</script>

<style scoped>
/* Optionally, you can add styles here */
</style>


<template>
    <v-dialog v-model="dialogVisible" persistent max-width="400px">
      <v-card>
        <v-card-title>
          <span class="headline">Add New Assistent</span>
        </v-card-title>
  
        <v-card-text>
            <!-- Loading Spinner -->
            <v-row v-if="loading" justify="center">
            <v-col cols="auto">
              <v-progress-circular
                indeterminate
                color="primary"
                size="64"
                width="4"
              ></v-progress-circular>
            </v-col>
          </v-row>

          <v-autocomplete
          v-model="selectedAssistent"
          clearable
          label="Select Assistent"
          :items="items"
          item-title="nume"
          item-value="id"
          ></v-autocomplete>

          <!-- Error Message -->
          <v-alert v-if="validationError" type="error" class="mt-3">
            {{ validationError }}
          </v-alert>
  
        
        </v-card-text>
  
        <v-card-actions>
          <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
          <v-btn color="primary" @click="submitForm" :loading="loading" :disabled="loading">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </template>
  
