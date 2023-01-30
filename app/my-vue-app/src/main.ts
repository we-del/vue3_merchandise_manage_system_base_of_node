import {createApp} from 'vue'
import App from '@/App.vue'
import {createPinia} from "pinia";
import router from "@/router";
// import "@/mock"; // 全局引入 mockServer ,此方法为全局引入，可能会影响element-ui的upload组件的接口调用

import "@/assets/reset.css";
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";

import "element-plus/es/components/message-box/style/css"; // 引入message-box 库

const app = createApp(App);
app.use(createPinia());
app.use(router);
// app.component('v-chart', ECharts)
app.mount('#app');
