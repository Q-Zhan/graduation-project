<template>
  <div id="panel">

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
    token() {
      return this.$store.state.user.token;
    }
  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
#panel {
  width: 100%;
  height: 100%;
  background: #2E3238;
}
</style>
