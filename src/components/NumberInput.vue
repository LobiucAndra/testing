<template>
    <v-text-field
      :label="label"
      v-model="inputValue"
      :rules="rules"
      outlined
      color="primary"
      type="number"
      @input="onInput"
    ></v-text-field>
  </template>
  
  <script>
  import { ref, watch } from 'vue';
  
  export default {
    name: 'NumberInput',
    props: {
      label: {
        type: String,
        default: 'Enter number',
      },
      modelValue: {
        type: [String, Number],
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
  
      // Watch for changes in inputValue and emit update to parent
      watch(inputValue, (newValue) => {
        emit('update:modelValue', newValue);
      });
  
      // Ensure the input contains only numbers
      const onInput = (event) => {
        const sanitizedValue = event.target.value.replace(/[^\d]/g, ''); // Remove non-numeric characters
        inputValue.value = sanitizedValue;
      };
  
      return {
        inputValue,
        onInput,
      };
    },
  };
  </script>
  