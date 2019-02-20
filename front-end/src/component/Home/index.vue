<template>
  <div id="home">
    <div class="container">
      <div class="left">
        <panel />
      </div>
      <div class="right">
        <router-view name="detail"></router-view>
      </div>
    </div>
    
  </div>
</template>

<script>
import Panel from '../Panel';
import io from 'socket.io-client';

const ACTION_TYPE = {
  ACCEPT: 1,
  REFUSE: 0
}

export default {
  components: {
    Panel,
  },
  data () {
    return {
      a: '123'
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.user.info;
    },
    friend() {
      return this.$store.state.friend;
    },
    friendList() {
      return this.friend.friendList;
    }
  },
  mounted() {
    const socket = io(`http://localhost:8889?userId=${this.userInfo.userID}`);
    this.$store.commit('setSocket', { socket });
    this.initSocketEvent(socket);
  },
  methods: {
    // 这里做一些全局事件的监听
    initSocketEvent(socket) {
      // 他人的好友请求
      socket.on('applyFriend', (data) => {
        this.$store.commit('addApplyFriend', { applyFriend: data })
        this.$notify({
          title: '提示',
          message: '您收到一条好友请求',
          duration: 3000
        });
      });
      // 发出的好友请求被处理
      socket.on('applyFriendResult', (item, action) => {
        const message = `"${item.name}" 已${action == ACTION_TYPE.ACCEPT ? '接受' : '拒绝'}您的好友请求`;
        if (action == ACTION_TYPE.ACCEPT) {
          this.$store.commit('addFriend', { friend: item });
        }
        this.$notify({
          title: '提示',
          message,
          duration: 3000
        });
      });
      // 接受私聊消息
      socket.on('privateMessage', (userId, type, content) => {

      })


      // 静默删除好友(被他人删好友)
      // socket.on('deleteFriend', (userId) => {
      //   console.log('deteleFriend socket: ' + userId)
      //   const idx = this.friendList.findIndex((element, index) => {
      //     return element.userID == userId;
      //   });
      //   if (idx != -1) {
      //     this.$store.commit('deleteFriend', { index: idx})
      //     this.$router.replace('/home/friend');
      //   }
        
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
#home {
  width: 1000px;
  height: 757px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -500px;
  margin-top: -379px;
  overflow: hidden;
  .container {
    border-radius: 3px;
    width: 100%;
    height: 757px;
    overflow: hidden;
    display: flex;
  }
  .left {
    width: 280px;
    height: 100%;
  }
  .right {
    width: 720px;
    height: 100%;
  }
}
</style>
