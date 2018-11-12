<template>
  <div id="home">
    123321
    <div>{{isLoading}}</div>
  </div>
</template>

<script>


export default {
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

}
</style>
