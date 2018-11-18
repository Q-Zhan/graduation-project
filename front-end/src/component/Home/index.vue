<template>
  <div id="home">
    <div class="left">
      <panel />
    </div>
    <div class="right">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Panel from '../Panel';

export default {
  components: {
    Panel,
  },
  data () {
    return {
      a: '123'
    }
  },
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#home {
  width: 100%;
  height: 100%;
  display: flex;
  border-radius: 5px;
  overflow: hidden;
  .left {
    width: 280px;
    height: 100%;
  }
  .right {
    width: 780px;
    height: 100%;
  }
}
</style>
