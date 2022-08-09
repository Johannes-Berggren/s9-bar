import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'

loadFonts()

import LogRocket from 'logrocket';
LogRocket.init('i77qy0/s9-bar');

createApp(App)
  .use(vuetify)
  .mount('#app')
