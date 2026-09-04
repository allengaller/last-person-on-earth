import { createApp } from 'vue'
import { createPinia } from 'pinia'

import '@fontsource/orbitron/500.css'
import '@fontsource/orbitron/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/anim.css'

import App from './App.vue'
import router from './router'

createApp(App).use(createPinia()).use(router).mount('#app')
