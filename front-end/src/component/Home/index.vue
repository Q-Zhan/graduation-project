<template>
  <div id="home">
    <div class="container">
      <div class="left">
        <panel />
      </div>
      <div class="right">
        <router-view name="detail"></router-view>
      </div>
    </div>
    
  </div>
</template>

<script>
import Panel from './component/Panel';

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
  align-items: center;
  .container {
    border-radius: 3px;
    width: 100%;
    height: 757px;
    overflow: hidden;
    display: flex;
  }
  .left {
    width: 280px;
    height: 100%;
  }
  .right {
    width: 720px;
    height: 100%;
  }
}
</style>
