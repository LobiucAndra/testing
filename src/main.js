import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { loadFonts } from './plugins/webfontloader'
import { createVuetify } from 'vuetify'
import 'vuetify/styles'; // Ensure Vuetify styles are imported
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Optional icon set

import '@mdi/font/css/materialdesignicons.css';
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { VNumberInput } from 'vuetify/labs/VNumberInput'
loadFonts()

const vuetify = createVuetify({
  components: {
    VNumberInput,
  },
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomTheme', // Set your default theme
    themes: {
      myCustomTheme: {
        dark: false, // Set to `true` if you want a dark theme
        colors: {
          primary: '#4caf50',  // Customize the primary color
          secondary: '#ff5722', // Customize the secondary color
          accent: '#03a9f4',
          error: '#f44336',
          warning: '#ffeb3b',
          info: '#2196f3',
          success: '#4caf50',
          background: '#f5f5f5',
          surface: '#ffffff',
        },
      },
      myDarkTheme: {
        dark: true,
        colors: {
          primary: '#1e88e5',
          secondary: '#c2185b',
          background: '#121212',
          surface: '#1f1f1f',
          error: '#cf6679',
          success: '#81c784',
          // Other colors as needed
        },
      },
    },
  },
  
})

createApp(App)
  .use(router)
  .use(vuetify)
  .mount('#app')
