<template>
  <div id="addFriend">
    <div class="title">搜索用户</div>
    <div class="search">
      <input placeholder="请输入chat号" @keyup.enter="search" v-model="searchValue"/>
    </div>
    <div class="user_list">
      <div class="user" v-for="item in userList" :key="item.userID">
        <div class="user_avatar">{{ item.avatar }}</div>
        <div class="user_name">{{ item.name }}</div>
        <div class="user_area">{{ item.area }}</div>
        <div class="add_button" @click="addFriend(item)">添加</div>
      </div>
    </div>
  </div>
</template>

<script>
import { responceCode } from '../../constant';

export default {
  data () {
    return {
      searchValue: '',
      userList: []
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
      this.$store.dispatch('searchUser', {
        id: this.searchValue
      })
      .then(data => {
        if (data.code == responceCode.success) {
          console.log(data)
          this.userList = data.users;
          console.log(this.userList[0].name)
        } else {
          this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    addFriend(item) {
      let { userID } = item;
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
  .user {
    border: 1px solid black;
  }
}
</style>
