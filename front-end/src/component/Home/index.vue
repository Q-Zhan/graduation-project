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
import { RESPONCE_CODE, CHAT_TYPE } from '../../constant';

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
    },
    groupList() {
      return this.friend.groupList;
    },
    chatList() {
      return this.$store.state.chat.chatList;
    },
    chat() {
      if (this.chatListIndex == null) {
        return {};
      }
      return this.$store.state.chat.chatList[this.chatListIndex]
    },
    chatMsg() {
      return this.chat.chatMsg || [];
    },
    chatListIndex() {
      return this.$store.state.chat.chatListIndex;
    }
  },
  mounted() {
    const socket = io(`http://localhost:8889?userId=${this.userInfo.userID}`);
    this.$store.commit('setSocket', { socket });
    this.initSocketEvent(socket);
    this.getFriendList();
    this.getGroupList();
  },
  methods: {
    getGroupList() {
      this.$store.dispatch('getGroupList', {})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$store.commit('setGroupList', { groupList: data.list })
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
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
    holdChatListIndex() {
      const nowChatId = this.chat.userID || this.chat.groupId;
      if (this.chatListIndex != null) {
        let nowChatIndex = null;
        for (let i = 0; i < this.chatList.length; i++) {
          const item = this.chatList[i];
          if ((item.userID && item.userID== nowChatId) || (item.groupId && item.groupId == nowChatId)) {
            nowChatIndex = i;
          }
        }
        this.$store.commit('updateChatListIndex', { index: nowChatIndex});
      }
    },
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
      // 新增群聊
      socket.on('addGroup', (groupId, groupName, member, chatMsg) => {
        this.$store.commit('addGroup', {groupId, groupName, member, chatMsg});
      });

      // 接受群聊消息
      socket.on('groupMessage', (groupId, messageType, content, fromId) => {
        const nowChatId = this.chat.userID || this.chat.groupId;
        const idx = this.chatList.findIndex((element, index) => {
          return element.groupId == groupId;
        });
        if (idx == -1) {
          // chatList未存在
          this.$store.dispatch('addChat', { chatID: groupId, chatType: CHAT_TYPE.GROUP})
          .then(data => {
            const chatMsg = data.chatMsg;
            const groupList = this.groupList;
            const groupIndex = groupList.findIndex((element, index) => {
              return element.groupId == groupId;
            });
            const groupItem = groupList[groupIndex];
            groupItem.chatMsg = chatMsg;
            this.$store.commit('addChat', { item: groupItem});
            // 添加未读,并全局提醒
            this.$store.commit('addChatUnread', { index: 0});
            const notifyMessage = content.length > 35 ? (content.slice(0, 35) + '...') : content;
            this.$notify({
              title: '收到一条新消息',
              message: notifyMessage,
              duration: 3000
            });
            // 保持当前聊天chatListIndex对应的chat不变
            this.holdChatListIndex();
          })
        } else {
          // 已存在
          // 添加未读
          if ((this.chat.groupId && (nowChatId != groupId)) || this.chat.userID || this.chatListIndex == null) { // 如果是当前是群组，要进一步比对id是否一致。如果当前是用户，则id一定不相同
            this.$store.commit('addChatUnread', { index: idx});
            const notifyMessage = content.length > 35 ? (content.slice(0, 35) + '...') : content;
            this.$notify({
              title: '收到一条新消息',
              message: notifyMessage,
              duration: 3000
            });
          }

          // 更新消息，将其置顶
          this.$store.commit('addChatMessage', {
            index: idx,
            item: {"groupID": groupId, "fromId":fromId, "content":content, "type": messageType}
          });
          this.$store.dispatch('topChat', { chatID: groupId});
          this.$store.commit('topChat', { index: idx});
          
          // 保持当前聊天chatListIndex对应的chat不变
          this.holdChatListIndex();
        }

      });
      // 接受私聊消息
      socket.on('privateMessage', (userId, type, content) => {
        const nowChatId = this.chat.userID || this.chat.groupId;
        const idx = this.chatList.findIndex((element, index) => {
          return element.userID == userId;
        });
        if (idx == -1) {
          // chatList未存在该好友
          this.$store.dispatch('addChat', { chatID: userId, chatType: CHAT_TYPE.USER})
          .then(data => {
            const chatMsg = data.chatMsg;
            const friendList = this.friendList;
            const friendIndex = this.friendList.findIndex((element, index) => {
              return element.userID == userId;
            });
            const friendItem = this.friendList[friendIndex];
            friendItem.chatMsg = chatMsg;
            this.$store.commit('addChat', { item: friendItem });
            // 添加未读
            this.$store.commit('addChatUnread', { index: 0 });
            const notifyMessage = content.length > 35 ? (content.slice(0, 35) + '...') : content;
            this.$notify({
              title: '收到一条新消息',
              message: notifyMessage,
              duration: 3000
            });
            // 保持当前聊天chatListIndex对应的chat不变
            this.holdChatListIndex();
          })
        } else {
          // 已存在
          // 添加未读
          if ((this.chat.userID && (nowChatId != userId)) || this.chat.groupId || this.chatListIndex == null) {
            this.$store.commit('addChatUnread', { index: idx});
            const notifyMessage = content.length > 35 ? (content.slice(0, 35) + '...') : content;
            this.$notify({
              title: '收到一条新消息',
              message: notifyMessage,
              duration: 3000
            });
          }

          // 更新消息，将其置顶
          this.$store.commit('addChatMessage', {
            index: idx,
            item: {type, fromID: userId, toID: this.userInfo.userID, content}
          });
          this.$store.dispatch('topChat', { chatID: userId});
          this.$store.commit('topChat', { index: idx});
          
          // 保持当前聊天chatListIndex对应的chat不变
          this.holdChatListIndex();
       
        }
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
