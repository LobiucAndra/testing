<script>
  export default {
    name: 'PromoteAlert',
    props: {
      message: {
        type: String,
        default: 'This is an alert message!',
      },
      color: {
        type: String,
        default: 'info', // Colors: info, success, warning, error, etc.
      },
      timeout: {
        type: Number,
        default: 5000, // Time in milliseconds before it disappears
      },
      multiLine: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        visible: false,
      };
    },
    methods: {
      showAlert() {
        this.visible = true;
      },
      closeAlert() {
        this.visible = false;
      },
    },
  };
  </script>
  
  <style scoped>
  .snackbar-alert {
    max-width: 600px;
  }
  </style>
  

<template>
    <v-snackbar
      v-model="visible"
      :timeout="timeout"
      :color="color"
      :multi-line="multiLine"
      class="snackbar-alert"
    >
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="closeAlert">Close</v-btn>
      </template>
    </v-snackbar>
  </template>
  
  