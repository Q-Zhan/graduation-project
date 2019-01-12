<template>
  <div id="addFriend">
    <div class="title">搜索用户</div>
    <div class="search">
        <input placeholder="请输入chat号" @keyup.enter="search" v-model="searchValue"/>
    </div>
  </div>
</template>

<script>


export default {
  data () {
    return {
      searchValue: ''
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
    search() {
      console.log('search')
    }
  }
}
</script>

<style lang="scss" scoped>
#addFriend {
  width: 100%;
  height: 100%;
  background: #eee;
  .title {
      padding: 10px 0;
      padding-left: 20px;
      border-bottom: 1px solid #d6d6d6;
      color: rgb(122, 120, 120);
      font-size: 18px;
  }
  .search {
      width: 100%;
      margin-top: 20px;
      input {
          width: 100%;
          border: 1px solid #d6d6d6;
          border-left: 0;
          border-right: 0;
          padding: 10px 0;
          padding-left: 20px;
          font-size: 16px;
      }
      ::-moz-placeholder { color: #d6d6d6; }
      ::-webkit-input-placeholder { color:#d6d6d6; }
      :-ms-input-placeholder { color:#d6d6d6; }
  }
}
</style>
