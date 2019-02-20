<template>
  <div id="friendDetail">
    <div class="title">详细信息</div>
    <div class="friend" v-show="queryIndex">
      <div class="avatar"><img :src="friend.avatar || defaultAvatar"/></div>
      <div class="name">
        <span>{{ friend.name }}</span>
        <i :class="formatGender(friend.gender)"></i>
      </div>
      <div class="sign">{{ friend.sign }}</div>
      <div class="area">地区： {{ friend.area }}</div>
      <div class="button send" @click="turnToChat(friend)">发消息</div>
      <div class="button delete" @click="deleteFriend(friend.userID)">删除好友</div>
    </div>

    <div class="default" v-show="!queryIndex">
      <img :src="defaultAvatar"/>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE, CHAT_TYPE } from '../../constant';

export default {
  data () {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
    }
  },
  computed: {
    friend() {
      if (!this.queryIndex) {
        return {};
      }
      const friendList = this.$store.state.friend.friendList;
      return friendList[this.queryIndex];
    },
    chatList() {
      return this.$store.state.chat.chatList;
    },
    token() {
      return this.$store.state.user.token;
    },
    queryIndex() {
      return this.$route.query.index;
    },
    chatListIndex() {
      return this.$store.state.chat.chatListIndex;
    }
  },
  mounted() {

  },
  methods: {
    formatGender(gender) {
      if (gender === 0) {
        return 'women';
      } else if (gender === 1) {
        return 'men';
      } else {
        return 'hidden';
      }
    },
    deleteFriend(id) {
      this.$store.dispatch('deleteFriend', { id })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            // 删除对应的chat
            const friendId = this.friend.userID;
            let idx = -1;
            this.chatList.forEach((item, index) => {
              if (item.userID == friendId) {
                idx = index;
              }
            });
            if (idx != -1) {
              if (idx == this.chatListIndex) {
                this.$store.commit('updateChatListIndex', {index: null})
              }
              this.$store.commit('deleteChat', { index: idx})
            } 
            // 删除好友
            this.$store.commit('deleteFriend', { index: this.queryIndex });
            this.$message.success('删除成功');
            this.$router.push('/home/friend');
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    turnToChat(friend) {
      let idx = -1;
      this.chatList.forEach((item, index) => {
        if (item.userID == friend.userID) {
          idx = index;
        }
      })
      if (idx == -1) {
        // 若不存在于chatList中，则置入第一项
        
        this.$store.dispatch('addChat', { chatID: friend.userID, chatType: CHAT_TYPE.USER})
        .then(data => {
          const chatMsg = data.chatMsg;
          const friendItem = Object.assign(friend, { chatMsg: chatMsg });
          this.$store.commit('addChat', { friend: friendItem });
          this.$store.commit('updateChatListIndex', {index: 0})
          this.$router.push(`/home/chat`);
        })
        
      } else {
        this.$router.push(`/home/chat?index=${idx}`);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#friendDetail {
  width: 100%;
  height: 100%;
  background: #eee;
  .title {
    margin: 0 19px;
    padding: 10px 0;
    line-height: 30px;
    border-bottom: 1px solid #d6d6d6;
    text-align: center;
    font-size: 14px;
  }
  .default {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    margin-top: 50px;
    img {
      border-radius: 4px;
    }
  }
  .friend {
    .avatar {
      margin: 0 auto;
      width: 100px;
      height: 100px;
      margin-top: 80px;
      img {
        border-radius: 4px;
      }
    }
    .name {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 22px;
      span {
        font-size: 24px;
        height: 38px;
        margin-bottom: 10px;
      }
      i {
        width: 16px;
        height: 16px;
        margin-left: 4px;
        background: url('../../assets/icons.png') no-repeat;
      }
      .hidden {
        display: none;
      }
      .men {
        background-position: -384px -304px;
        background-size: 487px 462px;
      }
      .women {
        background-position: -368px -304px;
        background-size: 487px 462px;
      }
    }
    .sign {
      font-size: 14px;
      color: #888;
      width: 100%;
      text-align: center;
    }
    .area {
      margin-top: 30px;
      font-size: 12px;
      color: #888;
      width: 100%;
      text-align: center;
    }
    .button {
      margin: 0 auto;
      width: 200px;
      height: 40px;
      text-align: center;
      cursor: pointer;
      line-height: 40px;
      color: white;
      border-radius: 4px;
      font-size: 14px;
    }
    .send {
      margin-top: 40px;
      background-color: #42ac3e;
    }
    .delete {
      margin-top: 12px;
      background-color: rgb(239, 84, 89);
    }
  }
}
</style>
