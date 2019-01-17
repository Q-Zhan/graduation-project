<template>
  <div id="friendDetail">
    friendDetail
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
#friendDetail {
  width: 100%;
  height: 100%;
  background: blue;
}
</style>
