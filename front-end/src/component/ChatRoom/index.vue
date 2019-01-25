<template>
  <div id="chatroom">
    <div class="title"></div>
    <div ></div>

    <div class="default" v-show="!queryIndex">
      <img :src="defaultAvatar"/>
      <div class="text">未选择聊天</div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

export default {
  data () {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    chatList() {
      return this.$store.state.chat.chatList;
    },
    chat() {
      if (!this.queryIndex) {
        return {};
      }
      return this.chatList[this.queryIndex];
    },
    queryIndex() {
      return this.$route.query.index;
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
  background: #eee;
  .title {
    margin: 0 19px;
    padding: 10px 0;
    border-bottom: 1px solid #d6d6d6;
    height: 30px;
  }
  .default {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    margin-top: 50px;
    img {
      border-radius: 4px;
    }
    .text {
      text-align: center;
      width: 100%;
      color: #ccc;
      font-size: 15px;
      margin-top: 8px
    }
  }
}
</style>
