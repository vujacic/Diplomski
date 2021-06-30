import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import PrimeVue from 'primevue/config'
import 'bootstrap/dist/js/bootstrap.bundle'
import ToastService from "primevue/toastservice";


import 'primevue/resources/themes/mdc-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
// import 'bootstrap/dist/css/bootstrap-reboot.css'
import 'bootstrap/dist/css/bootstrap-utilities.css'


const app = createApp(App)
// app.component('ProgressSpinner', ProgressSpinner)
app.use(store).use(router).use(PrimeVue, {ripple: true}).use(ToastService).mount('#app');
