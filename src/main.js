import Vue from 'vue';
import App from './App.vue';

import store from './store';
import "./styles/app.scss";

console.log('store', store);
new Vue({
  el: '#app',
  store,
  render: h => h(App)
});