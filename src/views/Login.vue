<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import InputField from "../components/InputField.vue";
import SubmitButton from "../components/SubmitButton.vue";
import axiosInstance from "@/axios";
import { jwtDecode } from "jwt-decode";

export default defineComponent({
  name: "Login",
  components: {
    InputField,
    SubmitButton,
  },

  setup() {
    const email = ref("");
    const password = ref("");
    const errorMessage = ref(null);
    const isFormValid = ref(false);
    const router = useRouter();
    const isLoading = ref(false);


    // Validation rules
    const emailRules = [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ];
    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => v.length >= 4 || "Password must be at least 6 characters long",
    ];

    const handleLogin = async () => {
      isLoading.value = true;

      // Reset the error message on each attempt
      errorMessage.value = null;

      const isValid =
        emailRules.every((rule) => rule(email.value) === true) &&
        passwordRules.every((rule) => rule(password.value) === true);

      if (!isValid) {
        errorMessage.value = "Please fix the errors above.";
        return;
      }

      try {
        const response = await axiosInstance.post("/login", {
          username: email.value,
          parola: password.value,
        });
        if (response.data["Authentication successful"]) {
          localStorage.setItem("authToken", response.data["Authentication successful"]);
          const decoded = jwtDecode(response.data["Authentication successful"]);
          localStorage.setItem("accountType", decoded.rol);
          localStorage.setItem("id", decoded.id);
          console.log(decoded.rol);
          switch (decoded.rol) {
            case "student":
              router.push({ name: "Exams" });
              break;
            case "profesor":
              router.push({ name: "ViewRequests" });
              break;
            case "secretar":
              router.push({ name: "CreateTeachers" });
              break;
            case "sef":
              router.push({ name: "Teachers" });
              break;
            default:
              break;
          }
        }
      } catch (error) {
        console.log(error);
        errorMessage.value = "An unexpected error occurred. Please try again.";
      }finally {
        isLoading.value = false;
      };
    };

    return {
      email,
      password,
      errorMessage,
      isFormValid,
      handleLogin,
      emailRules,
      passwordRules,
      isLoading,
    };
  },
  methods:{
    
  }
});
</script>

<template>
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

    <v-container fluid  v-if="!isLoading">
      <v-row justify="center">
        <v-col md="4">
          <v-card class="pa-4">
            <v-card-title class="text-center">Login</v-card-title>
            <v-card-item>
              <v-form ref="form" v-model="isFormValid" @submit.prevent="handleLogin">
                <!-- Email input with validation rules -->
                <InputField
                  id="email"
                  label="Email"
                  type="email"
                  v-model="email"
                  :rules="emailRules"
                  autocomplete="on"
                />

                <!-- Password input with validation rules -->
                <InputField
                  id="password"
                  label="Password"
                  type="password"
                  v-model="password"
                  :rules="passwordRules"
                  autocomplete="on"
                />

                <!-- Submit Button -->
                <SubmitButton :handleLogin="handleLogin" :disabled="!isFormValid" :text="'Login'" />

                <!-- Error message if there's any validation failure -->
                <v-alert v-if="errorMessage" type="error" dense>
                  {{ errorMessage }}
                </v-alert>
              </v-form>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
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
