<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'DialogForm',
  setup() {
    // Variabila reactivă pentru controlul vizibilității dialogului
    const dialog = ref(false);
    
    // Variabile pentru datele formularului
    const name = ref('');
    const email = ref('');
    const message = ref('');

    // Funcția de submit pentru formular
    const submitForm = () => {
      // Logica de trimitere a formularului
      console.log('Form submitted');
      console.log('Name:', name.value);
      console.log('Email:', email.value);
      console.log('Message:', message.value);
      
      // Închidem dialogul după trimiterea formularului
      dialog.value = false;
    };

    return {
      dialog,
      name,
      email,
      message,
      submitForm
    };
  },
});
</script>

<template>
  <div>
    <!-- Butonul care deschide dialogul -->
    <v-btn color="primary" @click="dialog = true">Open Form</v-btn>

    <!-- Dialogul cu formularul -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Contact Form</v-card-title>

        <v-card-subtitle>Please fill in the form below:</v-card-subtitle>

        <v-card-text>
          <v-form>
            <v-text-field
              v-model="name"
              label="Your Name"
              required
            ></v-text-field>
            
            <v-text-field
              v-model="email"
              label="Your Email"
              type="email"
              required
            ></v-text-field>

            <v-textarea
              v-model="message"
              label="Your Message"
              rows="4"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="dialog = false">Cancel</v-btn>
          <v-btn color="primary" @click="submitForm">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
/* Poti adauga stiluri personalizate pentru dialog */
</style>
