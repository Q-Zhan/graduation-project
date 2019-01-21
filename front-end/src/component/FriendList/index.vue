<template>
  <div id="friendList">
    <div class="title" v-show="applyFriend.length > 0">好友请求</div>
    <div class="apply item" v-for="(item, index) in applyFriend" :key="index">
      <div class="avatar">
        <img :src="item.avatar || defaultAvatar"/>
      </div>
      <div class="name">{{ item.name }}</div>
      <div class="accept button" @click="handleApply(item, index, ACTION_TYPE.ACCEPT)">接受</div>
      <div class="refuse button" @click="handleApply(item, index, ACTION_TYPE.REFUSE)">拒绝</div>
    </div>

    <div class="title">群组</div>

    <div class="title">好友</div>
    <div class="friend item" v-for="(item, index) in friendList" :key="index" @click="pushRouter(`/home/friend?index=${index}`)">
      <div class="avatar">
        <img :src="item.avatar || defaultAvatar"/>
      </div>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

const ACTION_TYPE = {
  ACCEPT: 1,
  REFUSE: 0
}

export default {
  data() {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      ACTION_TYPE
    };
  },
  computed: {
    friendList() {
      return this.$store.state.friend.friendList;
    },
    applyFriend() {
      return this.$store.state.friend.applyFriend;
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
    handleApply(item, index, action) {
      this.$store.dispatch('handleApply', { id: item.userID, action })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$store.commit('deleteApplyFriend', { index: index });
            if (action == ACTION_TYPE.ACCEPT) {
              this.$store.commit('addFriend', { friend: item });
            }
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
  .item {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 10px 18px 9px 18px;
    border-bottom: 1px solid #292c33;
    cursor: pointer;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 2px;
      overflow: hidden;
    }
    .name {
      font-weight: 400;
      margin-left: 10px;
      color: white;
      line-height: 30px;
      font-size: 13px;
    }
  }
  .apply {
    cursor: auto;
    .name {
      width: 120px;
    }
    .button {
      width: 40px;
      height: 24px;
      border-radius: 4px;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      color: white;
      cursor: pointer;
    }
    .accept {
      background-color: #42ac3e;
    }
    .refuse {
      margin-left: 6px;
      background-color: rgb(239, 84, 89);
    }
  }
}
</style>
