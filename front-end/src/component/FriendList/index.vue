<template>
  <div id="friendList">
    <div class="title">好友请求</div>
    <div class="title">群组</div>
    <div class="title">好友</div>
    <div class="friend" v-for="(item, index) in friendList" :key="index" @click="pushRouter(`/home/friend?index=${index}`)">
      <div class="friend_avatar">
        <img :src="item.avatar || defaultAvatar"/>
      </div>
      <div class="friend_name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

export default {
  data() {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
    };
  },
  computed: {
    friendList() {
      return this.$store.state.friend.friendList;
    }
  },
  mounted() {
    this.getFriendList();
  },
  methods: {
    getFriendList() {
      this.$store.dispatch('getFriendList', {})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$store.commit('setFriendList', { friendList: data.list });
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    pushRouter(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped>
#friendList {
  overflow: auto;
  .title {
    font-size: 14px;
    background-color: #292d32;
    color: #787b87;
    padding: 1px 18px;
    overflow: hidden;
  }
  .friend {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 10px 18px 9px 18px;
    border-bottom: 1px solid #292c33;
    cursor: pointer;
    .friend_avatar {
      width: 30px;
      height: 30px;
      border-radius: 2px;
      overflow: hidden;
    }
    .friend_name {
      font-weight: 400;
      margin-left: 10px;
      color: white;
      line-height: 30px;
      font-size: 13px;
    }
  }
}
</style>
