import { createApp } from "vue";
import 'element-plus/dist/index.css'
import App from "./App.vue";
import Vue3TouchEvents, {type Vue3TouchEventsOptions} from "vue3-touch-events";
  
const app = createApp(App)
app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
    disableClick: false
    // any other global options...
  })
app.mount('#app')
