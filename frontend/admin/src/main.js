import Vue from 'vue'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import 'bootstrap/dist/js/bootstrap.bundle'

import 'primevue/resources/themes/mdc-light-indigo/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'bootstrap/dist/css/bootstrap-grid.css'
// import 'bootstrap/dist/css/bootstrap-reboot.css'
import 'bootstrap/dist/css/bootstrap-utilities.css'

Vue.config.productionTip = false

new Vue({
  router,
  PrimeVue,
  render: h => h(App)
}).$mount('#app')
