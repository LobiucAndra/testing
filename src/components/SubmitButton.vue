<script>
export default {
  name: 'SubmitButton',
  props: {
    handleLogin: {
      type: Function,
      required: true,
    },
    disabled: {
      type: Boolean,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <v-btn
    color="primary"
    @click="handleLogin"
    :disabled="disabled"
    type="submit"
    class="mt-4"
    block
  >
    {{ text }} 
  </v-btn>
</template>


<style scoped>
/* Custom styles for the button */
</style>
