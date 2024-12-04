<!-- src/layouts/AuthenticatedLayout.vue -->
<script>
import Sidebar from "@/components/sidebars/StudentSideBar.vue";


export default {
  components: {
    Sidebar,
  },
  computed: {
    accountType() {
      console.log(localStorage.getItem('accountType'));
      return localStorage.getItem('accountType');
    },
  },
};

</script>


<template>
  <v-app>
  <v-container fluid class="d-flex">
    <Sidebar v-if="accountType === 'student'" type="student" />
    <Sidebar v-else-if="accountType === 'profesor'" type="profesor" />
    <Sidebar v-else-if="accountType === 'secretar'" type="secretar" />
    <Sidebar v-else-if="accountType === 'sef'" type="sef" />
   <v-main>
    <router-view />
    </v-main> 
    </v-container>
   </v-app>
</template>

