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
    // document.getElementsByTagName('body')[0].contentEditable = false;
  }
}
</script>

<style lang="scss">
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  user-select:  none !important;
}
body {
  background: url('./assets/bg.jpg');
  background-size: cover;
}
#app {
  height: 100%;
  width: 100%;
  overflow: auto;
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
img {
  width: 100%;
  height: 100%;
}
input {
  outline: none;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}


</style>
