<script>
import { defineComponent, ref } from "vue";
import InputField from "../components/InputField.vue";
import SubmitButton from "../components/SubmitButton.vue";
import axiosInstance from "@/axios";
import axios from "axios";

export default defineComponent({
  name: "AddUserDialog",
  components: {
    InputField,
    SubmitButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    isTeacher: {
      type: Boolean,
      required: true,
    },
  },

  emits: ["update:modelValue", "submit"],
  data() {
    return {
      nume: null,
      email: null,
      parola: null,
      telefon: null,
      departament: null,
      facultatea: null,
      specializarea: null,
      idgrupa: null,
      dialogVisible: this.modelValue,
      dropdownItems: [], // Data for v-autocomplete dropdown
      items: [], // Data for v-autocomplete dropdown
      loading: false,
      validationError: "",
      isFormValid: false,
      dataFetched: false, // Track if data has been fetched to prevent redundant calls
      selectedValue: null,
    };
  },
  watch: {
    modelValue(newValue) {
      this.dialogVisible = newValue;

      // Call fetchData only if dialog is opening and data hasn’t been fetched yet
      //   if (newValue && !this.dataFetched) {
      //     this.fetchData();
      //   }
    },
    selectedValue(newValue) {
      console.log(newValue);
      this.fetchData(newValue);
    },
  },
  created() {
     this.fetchData();
   },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
          const axiosInstance1 = axios.create({
            baseURL: 'https://orar.usv.ro/orar/vizualizare/data/facultati.php?json', // Replace with your API's base URL
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const response = await axiosInstance1.get();

          for (var i = 1; i < response.data.length; i++) {
            this.items.push(response.data[i].shortName);
          }
        console.log(response.data);
        this.dataFetched = true; // Mark data as fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        this.items = [];
      } finally {
        this.loading = false;
      }
    },

    async submitForm() {
      this.loading = true;
      var formData;
      if (this.isTeacher) {
        formData = {
          nume: this.nume,
          email: this.email,
          parola: this.parola,
          telefon: this.telefon,
          departament: this.departament,
        };
      } else {
        formData = {
          nume: this.nume,
          email: this.email,
          parola: this.parola,
          telefon: this.telefon,
          facultatea: this.facultatea,
          specializarea: this.specializarea,
          idgrupa: this.selectedValue,
        };
      }
      console.log(formData);
      try {
        const response = this.isTeacher
          ? await axiosInstance.post("/user/profesor", formData)
          : await axiosInstance.post("/user/student", formData);
        if (response.status === 200 || response.status === 201) {
          this.$emit("submit");
          this.closeDialog();
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        this.validationError = "Failed to submit the form. Please try again.";
      } finally {
        this.loading = false;
      }
    },
    async fetchGrupe(newSelectedValue) {
      this.dropdownItems = [];
      if (!newSelectedValue) {
        return;
      }
      try {
        const request = await axiosInstance.get(`/grupe/${newSelectedValue}`);
        this.dropdownItems = request.data; // Update the items with the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        this.dropdownItems = []; // Clear items if there's an error
      }
    },

    closeDialog() {
      this.resetForm();
      this.$emit("update:modelValue", false);
    },

    resetForm() {
      this.selectedDate = null;
      this.selectedAssistent = null;
      this.validationError = "";
      this.dataFetched = false; // Reset dataFetched so data can be fetched again next time
    },
  },
  setup() {
    // Validation rules
    const emailRules = [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ];
    const nameRules = [
      (v) => !!v || "Name is required",
      (v) => v.length >= 3 || "Name must be at least 3 characters long",
    ];
    const telefonRules = [
      (v) => !!v || "Phone Number is required",
      (v) => v.length === 10 || "Number must be 10 characters long",
    ];
    const departamentRules = [(v) => !!v || "Departament is required"];

    const facultateaRules = [(v) => !!v || "Facultatea is required"];
    const specializareaRules = [(v) => !!v || "Specializarea is required"];

    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => v.length >= 4 || "Password must be at least 6 characters long",
    ];

    return {
      emailRules,
      passwordRules,
      nameRules,
      telefonRules,
      departamentRules,
      facultateaRules,
      specializareaRules,
    };
  },
});
</script>

<template>
  <v-dialog v-model="dialogVisible" persistent max-width="400px">
    <v-card>
      <v-card-title class="text-center">Create</v-card-title>
      <v-card-item>
        <v-form ref="form" v-model="isFormValid" @submit.prevent="submitForm">
          <InputField
            id="nume"
            label="Nume"
            type="nume"
            v-model="nume"
            :rules="nameRules"
            autocomplete="on"
          />
          <InputField
            id="email"
            label="Email"
            type="email"
            v-model="email"
            :rules="emailRules"
            autocomplete="on"
          />
          <InputField
            id="password"
            label="Password"
            type="password"
            v-model="parola"
            :rules="passwordRules"
            autocomplete="on"
          />
          <InputField
            id="telefon"
            label="Telefon"
            type="telefon"
            v-model="telefon"
            :rules="telefonRules"
            autocomplete="on"
          />
          <InputField
            id="departament"
            label="Departament"
            type="departament"
            v-model="departament"
            :rules="departamentRules"
            autocomplete="on"
            v-if="isTeacher"
          />
          <v-select
          v-if="!isTeacher"
          v-model="facultatea"
          label="Facultatea"         
          :items="items"
          item-title="nume"
          :rules="facultateaRules"
          clearable
        ></v-select>
         
          <InputField
            id="specializarea"
            label="Specializarea"
            type="specializarea"
            v-model="specializarea"
            :rules="specializareaRules"
            autocomplete="on"
            v-if="!isTeacher"
          />
          <v-autocomplete
              v-if="!isTeacher"
            v-model="selectedValue"
            clearable
            label="Select Group"
            :items="dropdownItems"
            item-title="nume"
            item-value="id"
            @update:search="fetchGrupe"
            class="min-width-200"
          ></v-autocomplete>
          <v-card-actions>
            <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
            <v-btn
              color="primary"
              @click="submitForm"
              :loading="loading"
              :disabled="!isFormValid"
              >Submit</v-btn
            >
          </v-card-actions>

          <!-- Error message if there's any validation failure -->
          <v-alert v-if="validationError" type="error" dense>
            {{ validationError }}
          </v-alert>
        </v-form>
      </v-card-item>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Ensure the card is centered both horizontally and vertically */
.v-container {
  height: 100vh;
}

.v-card {
  min-height: 300px; /* Ensure a minimum height for the login card */
}

.v-alert {
  margin-top: 10px;
}
</style>
