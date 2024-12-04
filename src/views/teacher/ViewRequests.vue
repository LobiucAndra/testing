<script>
import Card from '@/components/Card.vue';
import DialogForm from '@/components/DialogForm.vue';
import axiosInstance from '@/axios';
import { jwtDecode } from 'jwt-decode';

export default {
  name: 'ViewRequests',
  components: {
    Card,
    DialogForm,
  },

  data() {
    return {
      items: [], // Initialize items as an empty array
      dialogVisible: false, // Manage dialog visibility
      isLoading: true, // Track loading state
    };
  },

  async created() {
    await this.fetchData();
  },

  methods: {
    handleCardClick(data, id) {
      console.log(id);
      this.$router.push({ name: 'FillRequests', params: { date: data, id: id } });
    },

    async fetchData() {
      this.isLoading = true;
      try {
        const authToken = localStorage.getItem('authToken');
        const teacher = jwtDecode(authToken);
        const id = teacher.id;
        console.log(id);
        const response = await axiosInstance.get('/examen/' + id);

        for (var i = 0; i < response.data.length; i++) {
          const student = await response.data[i].sef;
          const materie = response.data[i].materie;
          this.items.push({
            numeMaterie: materie.nume,
            numeElev: student.nume,
            id: response.data[i].id,
            data: response.data[i].data,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      this.isLoading = false;
    },

    // Noua metodă pentru a refuza cererile
    async rejectRequest(id) {
      try {
        const confirm = window.confirm('Ești sigur că vrei să refuzi această cerere?');
        if (!confirm) return;

        this.isLoading = true;
        const response = await axiosInstance.delete(`/examen/refuza/${id}`);
        if (response.status === 200 || response.status === 204) {
          this.items = this.items.filter(item => item.id !== id); // Elimină cererea refuzată
          this.$toast?.success('Cererea a fost refuzată cu succes!');
        } else {
          this.$toast?.error('A apărut o eroare. Încearcă din nou.');
        }
      } catch (error) {
        console.error('Error rejecting request:', error);
        this.$toast?.error('A apărut o eroare. Verifică logurile pentru detalii.');
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<template>
  <v-app>
    <!-- Main Content -->
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
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.id"
            cols="12"
            md="6"
            lg="5"
            xl="3"
          >
            <Card
              :title="item.numeMaterie"
              :subtitle="item.numeElev"
              :description="item.data"
              :buton-name="'Check out'"
              @card-click="handleCardClick(item.data, item.id)"
              :showButton="true"

            >
              <!-- Slot pentru butonul Refuză -->
              <template #actions>
                <v-btn color="error" @click="rejectRequest(item.id)">Refuză</v-btn>
              </template>
            </Card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Optional: Custom styles if needed */
</style>