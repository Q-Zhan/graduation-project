<template>
  <div id="chatList">
    <div class="title">
      <span>公共聊天室</span>
      <div class="triangle up"></div>
    </div>
    <div class="title">
      <span>聊天</span>
      <div class="triangle down"></div>
    </div>
    <div class="chatList">
      <div v-for="(item, index) in chatList" :key="index" class="chat">
        <div class="avatar"><img :src="item.avatar || defaultAvatar" /></div>
        <div class="name_msg">
          <div class="name">{{ item.name }}</div>
          <div class="msg">{{ item.lastMsg }}</div>
        </div>
      </div>
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
    token() {
      return this.$store.state.user.token;
    },
    chatList() {
      return this.$store.state.chat.chatList;
    },
    queryIndex() {
      return this.$route.query.index;
    }
  },
  mounted() {

  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>
#chatList {
  overflow: auto;
  .title {
    font-size: 14px;
    background-color: #292d32;
    color: #787b87;
    padding: 1px 18px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    .triangle {
      position: absolute;
      width: 0;
      height: 0;
      top: 5px;
      right: 16px;
    }
    .down {
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 10px solid rgb(78, 78, 78);
    }
    .up {
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 10px solid rgb(78, 78, 78);
    }
  }
  .chat {
    padding: 12px 18px 11px 18px;
    height: 40px;
    border-bottom: 1px solid #292c23;
    cursor: pointer;
    display: flex;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 2px;
      overflow: hidden;
    }
    .name_msg {
      margin-left: 10px;
      .name {
        font-size: 13px;
        font-weight: 400;
        color: white;
        line-height: 20px;
      }
      .msg {
        color: #989898;
        font-size: 13px;
        height: 1.5em;
      }
    }
  }
}
</style>
