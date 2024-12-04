<template>
  <v-dialog v-model="dialogVisible" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Teacher Form</span>
      </v-card-title>

      <v-card-text>
        <!-- Date Picker -->
        <v-date-picker v-model="selectedDate" label="Select Date"></v-date-picker>

        <!-- Subject Select -->
        <v-select
          v-model="selectedSubject"
          label="Select Subject"
          :items="items"
          item-title="nume"
          item-value="id"
          clearable
        ></v-select>

        <!-- Error Message -->
        <v-alert v-if="validationError" type="error" class="mt-3">
          {{ validationError }}
        </v-alert>

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
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm" :loading="loading" :disabled="loading">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axiosInstance from '@/axios';

export default {
  name: 'DialogForm',
  props: {
    modelValue: Boolean,
    profesorId: String,
  },
  emits: ['update:modelValue', 'submit'],
  data() {
    return {
      selectedDate: null,
      selectedSubject: null,
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

    convertToIsoDate(dateString) {
    // Parsează data folosind obiectul Date
    const date = new Date(dateString);

    // Formatează în YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Luna începe de la 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  },
    async fetchData() {
      this.loading = true;
      try {
        const id = localStorage.getItem('id');
        const response = await axiosInstance.get(`/materii/studentmateriifaraexamen/${this.profesorId}/${id}`);

        if (Array.isArray(response.data) && response.data.length > 0) {
          this.items = response.data.map((item) => ({
            id: item.subjectId,
            nume: item.nume,
          }));
        } else {
          console.warn('No subjects found for the provided professor ID.');
          this.items = [];
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
      console.log( this.convertToIsoDate(this.selectedDate))
      if (!this.selectedDate) {
        this.validationError = 'Please select a date.';
        return;
      }
      if (!this.selectedSubject) {
        this.validationError = 'Please select a subject.';
        return;
      }

      this.loading = true;
      const formData = {
        data: this.convertToIsoDate(this.selectedDate),
        materieid: this.selectedSubject,
        sefid: localStorage.getItem('id'),
        profesorid: this.profesorId,
      };
    

      try {
        const response = await axiosInstance.post('/examen/programaeazastudent', formData);
        if (response.status === 200 || response.status === 201) {
          this.$emit('submit', formData);
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
      this.selectedSubject = null;
      this.validationError = '';
      this.dataFetched = false; // Reset dataFetched so data can be fetched again next time
    },
  },
};
</script>

<style scoped>
/* Optionally, you can add styles here */
</style>
