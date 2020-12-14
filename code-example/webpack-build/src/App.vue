<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <input type="text">
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'


// if (module.hot) {
//   const api = require('vue-hot-reload-api')
//   const Vue = require('vue')
//   api.install(Vue)
//   if (!api.compatible) {
//     throw new Error('vue-hot-reload-api is not compatible with the version of Vue you are using.')
//   }
//   module.hot.accept()
//   if (!module.hot.data) {
//     api.createRecord('very-unique-id', HelloWorld)
//   } else {
//     api.rerender('very-unique-id', HelloWorld)
//   }
// }

export default {
  name: 'App',
  components: {
    HelloWorld
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>





