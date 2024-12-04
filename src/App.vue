<!-- src/App.vue -->
<template>
  <v-app>
    <router-view /> <!-- This dynamically renders the layouts and components based on the route -->
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
/* Global styles can be defined here */
body {
  margin: 0;
}
</style>
