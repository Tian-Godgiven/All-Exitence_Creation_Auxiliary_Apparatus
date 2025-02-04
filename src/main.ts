import { createApp } from "vue";
import vueClickOutSide from "@/api/vue-clickOutSide"
import 'element-plus/dist/index.css'
import "vue-scroll-picker/lib/style.css";//滚动条组件


import App from "./App.vue";
import VueScrollPicker from "vue-scroll-picker";
import Vue3TouchEvents, {type Vue3TouchEventsOptions} from "vue3-touch-events";//touch事件组件



const app = createApp(App)
app.use<Vue3TouchEventsOptions>(Vue3TouchEvents, {
    disableClick: false
    // any other global options...
  })
app.mount('#app')
app.use(VueScrollPicker); // export default is plugin
app.directive("click-outside",vueClickOutSide)