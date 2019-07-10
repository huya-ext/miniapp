<template>
  <div id="app" class="app_wrapper">
    <Index></Index>
  </div>
</template>

<script>
import Index from './components/index'

export default {
  name: 'app',
  components: {
    Index
  }
}

</script>

<style lang="scss">
  @import './assets/scss/partial/_reset';

  .app_wrapper{
    width: 100%;
    height: 100%;
  }
</style>
