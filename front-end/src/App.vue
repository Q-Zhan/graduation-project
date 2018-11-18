<template>
  <div id="app">
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  },
  mounted() {
    // document.getElementsByTagName('body')[0].contentEditable = false
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  user-select:  none !important;
}
body {
  background: url('./assets/bg.jpg');
}
#app {
  height: 100%;
  width: 1000px;
  margin: 0 auto;
  border-radius: 5px;
}
a {
  text-decoration: none;
  color: black;
}
.clear {
  clear: both;
  height: 0px;
  font-size: 0;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}

</style>
