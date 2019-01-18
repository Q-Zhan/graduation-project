<template>
  <div id="chatroom">
    chatroom
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
#chatroom {
  width: 100%;
  height: 100%;
  background: white;
}
</style>
