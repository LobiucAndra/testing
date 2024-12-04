<template>
  <v-card >
  
    <v-card-title>{{ title }}</v-card-title>
    <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
    <v-card-text> {{ description }}</v-card-text>
    <v-card-actions >
    <v-btn v-if="showButton" color="primary" @click="handleCardClick">  {{ butonName }}</v-btn>

    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Card',
  props: {
    title: String,
    subtitle: String,
    description: String,
    butonName: String,
    showButton: true,
  },
  methods: {
    handleCardClick() {
      this.$emit('card-click');  // Emit the event to trigger the dialog
    },
  },
};
</script>

<style scoped>
.v-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 200px; /* Setează o înălțime minimă pentru uniformitate */
  padding: 5px;
}

.v-card-title {
  font-weight: bold;
  font-size: 18px;
}

.v-card-subtitle {
  font-size: 14px;
  color: gray;
}

.v-card-text {
  flex-grow: 1; /* Împinge textul să ocupe spațiul disponibil */
  font-size: 14px;
}
</style>
