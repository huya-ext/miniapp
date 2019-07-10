<template>
  <div id="app">
    <Index></Index>
    <Toast></Toast>
  </div>
</template>

<script>
import Index from './components/index';
import Toast from './components/toast';

export default {
  name: 'app',
  components: {
    Index,
    Toast
  }
}


</script>

<style lang="scss">
  html,
  body {
      position: relative;
      // font-family: "微软雅黑", "Helvetica Neue", Helvetica, STHeiTi, sans-serif;
      font-family: "Microsoft YaHei";
      margin: 0;
      padding: 0;
      height: 100%;
      background:transparent;
      overflow-x:hidden;
  }

  @import './assets/scss/partial/_reset';
</style>