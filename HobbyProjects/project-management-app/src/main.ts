import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./styles/main.scss"; // Import global styles
import "material-design-icons-iconfont/dist/material-design-icons.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
