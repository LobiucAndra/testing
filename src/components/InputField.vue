<!-- src/components/TextInput.vue -->
<template>
  <v-text-field
    :label="label"
    v-model="inputValue"
    :rules="rules"
    outlined
    color="primary"
  ></v-text-field>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  name: 'TextInput',
  props: {
    label: {
      type: String,
      default: 'Enter text',
    },
    modelValue: {
      type: String,
      default: '',
    },
    rules: {
      type: Array,
      default: () => [],
    },

  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const inputValue = ref(props.modelValue);

    watch(inputValue, (newValue) => {
      emit('update:modelValue', newValue);
    });

    return {
      inputValue,
    };
  },
};
</script>

