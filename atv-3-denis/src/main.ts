import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import App from './App.vue'
import router from './router'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'labTheme',
    themes: {
      labTheme: {
        dark: false,
        colors: {
          primary: '#245b57',
          secondary: '#c95f3f',
          accent: '#4c7fba',
          background: '#f7f8f4',
          surface: '#ffffff',
          error: '#b3261e',
        },
      },
    },
  },
})

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
