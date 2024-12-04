<script>
import { defineComponent, ref } from "vue";
import InputField from "../components/InputField.vue";
import SubmitButton from "../components/SubmitButton.vue";
import axiosInstance from "@/axios";

export default defineComponent({
  name: "RefuzeExam",
  components: {
    InputField,
    SubmitButton,
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
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
      reason: null,
      dialogVisible: this.modelValue,
      loading: false,
      validationError: "",
      isFormValid: false,
      selectedValue: null,

    };
  },
  watch: {
    modelValue(newValue) {
      this.dialogVisible = newValue;

    },
  },

  methods: {
 
    async rejectOffer() {
        this.loading = true;
        try {
          const data = {
            "motiv": this.reason
          };
          console.log(this.id);
          console.log(data);
          const response =this.isTeacher ? await axiosInstance.delete(`/examen/refuzaexamen/${this.id}`, {
            data: data
          }):await axiosInstance.delete(`/examen/stergeexamen/${this.id}`, {
            data: data
          });

          console.log(response.status);
          if (response.status === 200 || response.status === 201) {
         
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
      this.$emit("update:modelValue", false);
    },

    resetForm() {
      this.reason = null;
    },
  },
  setup() {
    const reasonRules = [
      (v) => !!v || "Name is required",
      (v) => v.length >= 10 || "Name must be at least 3 characters long",
    ];

    return {
      reasonRules,
    };
  },
});
</script>

<template>
  <v-dialog v-model="dialogVisible" persistent max-width="400px">
    <v-card>
      <v-card-title class="text-center">Reject Offer</v-card-title>
      <v-card-item>
        <v-form ref="form" v-model="isFormValid" @submit.prevent="rejectOffer">
          <InputField
            id="reason"
            label="Reason"
            type="reason"
            v-model="reason"
            :rules="reasonRules"
            autocomplete="on"
          />
          <!-- Error message if there's any validation failure -->
          <v-alert v-if="validationError" type="error" dense>
            {{ validationError }}
          </v-alert>
        </v-form>
      </v-card-item>
      <v-card-actions >
            <v-btn text @click="closeDialog" :disabled="loading">Cancel</v-btn>
            <v-btn
              color="primary"
              @click="rejectOffer"
              :loading="loading"
              :disabled="!isFormValid"
              >Submit</v-btn
            >
          </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
/* Ensure the card is centered both horizontally and vertically */
.v-container {
  height: 100vh;
}



.v-alert {
  margin-top: 10px;
}
</style>
