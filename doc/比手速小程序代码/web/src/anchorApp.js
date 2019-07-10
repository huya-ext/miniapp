import Vue from 'vue'
import App from './anchor/App.vue'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#root')