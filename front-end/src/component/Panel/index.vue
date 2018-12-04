<template>
  <div id="panel">
    <div class="user_info">
      <div class="avatar"><img src="../../assets/avatar.jpg"/></div>
      <div class="name">Z.</div>
      <div class="select"></div>
    </div>
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
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 2px;
  overflow: hidden;
}
img {
  width: 100%;
  height: 100%;
}

#panel {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: #2E3238;
  .user_info {
    margin-top: 18px;
    margin-left: 18px;
    display: flex;
    height: 40px;
    align-items: center;
    .name {
      width: 152px;
      margin-left: 10px;
      color: white;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      font-size: 16px;
      font-weight: 400;
    }
    .select {
      width: 30px;
      height: 30px;
      background: url('../../assets/icons.png');
      background-position: -434px -398px;
      background-size: 487px 462px;
      cursor: pointer;
    }
  }
}
</style>
