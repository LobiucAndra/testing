<script>
import axiosInstance from "@/axios";
import { TipExamen } from "@/assets/const";
import InputField from "./InputField.vue";
import NumberInput from "./NumberInput.vue";
export default {
  name: "AddMaterieDialog",
  props: {
    modelValue: Boolean,
  },
  components: {
    InputField,
    NumberInput
  },
  emits: ["update:modelValue", "submit"],
  data() {
    return {
      dialogVisible: this.modelValue,
      items: [],
      loading: false,
      validationError: "",
      nume: "",
      abreviere: "",
      dataFetched: false, // Track if data has been fetched to prevent redundant calls
      currentStatus: null,
      numberValue: null,
      examOptions: [],
    };
  },
  watch: {
    modelValue(newValue) {
      this.dialogVisible = newValue;

      
    },
  },

  computed: {
    // Obținem eticheta status-ului selectat
    selectedExamLabel() {
      const status = Object.values(TipExamen).find((s) => s.value === this.currentStatus);
      return status ? status.label : "No Status Selected";
    },
  },
  methods: {
    // async fetchData() {
    //   this.loading = true;
    //   try {
    //     const profesorId = localStorage.getItem("id");
    //     const response = await axiosInstance.get(`/asistentineasignati/${profesorId}`);

    //     for (var i = 0; i < response.data.length; i++) {
    //       this.items.push(response.data[i]);
    //     }

    //     this.dataFetched = true; // Mark data as fetched
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //     this.items = [];
    //   } finally {
    //     this.loading = false;
    //   }
    // },

    async submitForm() {
      this.validationError = "";

      if (!this.nume) {
        this.validationError = "Please select a name.";
        return;
      }
      if (!this.abreviere) {
        this.validationError = "Please select a abreviere.";
        return;
      }
      if (!this.currentStatus) {
        this.validationError = "Please select a exam type.";
        return;
      } if (!this.numberValue && this.numberValue > 0 && this.numberValue < 7) {
        this.validationError = "Please select a number.";
        return;
      }

      this.loading = true;
        
      // "nume": "string",
      // "abreviere": "string",
      // "tipevaluare": "string",
      // "numarcredite": 0,
      // "profesorid": "string"
      try {
        const formData = {
          nume: this.nume,
          abreviere: this.abreviere,
          tipevaluare: this.currentStatus,
          numarcredite: this.numberValue,
          profesorid: localStorage.getItem("id"),
        };
        const response = await axiosInstance.post(
          "/materii",formData
        );
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
  created() {
    this.examOptions = Object.values(TipExamen).map((exam) => exam.label);
  },
  setup() {
    // Validation rules
  
    const nameRules = [
      (v) => !!v || "Name is required",
      (v) => v.length >= 3 || "Name must be at least 3 characters long",
    ];
    const abreviereRules = [
      (v) => !!v || "Abreviere is required",
      (v) => v.length >= 2 || "Abreviere must be at least 3 characters long",
    ];
    const numberRules = [
      (v) => !!v || "Abreviere is required",
      (v) => v >= 1 || "Number must be higher than 0",
      (v) => v < 7 || "Number must be lower than 7",
    ];
    return {
      abreviereRules,
      nameRules,
      numberRules,
    };
  },
};
</script>


<template>
  <v-dialog v-model="dialogVisible" persistent max-width="400px">
    <v-card>
      <v-card-title>
        <span class="headline">Add New Materie</span>
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
   
        <InputField
            id="nume"
            label="Nume"
            type="nume"
            v-model="nume"
            :rules="nameRules"
            autocomplete="on"
          />
          <InputField
            id="abreviere"
            label="Abreviere"
            type="abreviere"
            v-model="abreviere"
            :rules="abreviereRules"
            autocomplete="on"
          />
       
         
        <v-select
          v-model="currentStatus"
          :items="examOptions"
          item-text="value"
          label="Select Status"
          outlined
          clearable
        />
        <NumberInput 
        v-model="numberValue"
        :rules="numberRules"
        label="Number"
        />
      
        <!-- Error Message -->
        <v-alert v-if="validationError" type="error" class="mt-3">
          {{ validationError }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
        <v-btn color="primary" @click="submitForm" :loading="loading" :disabled="loading"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
