<template>
  <div id="chatList">
    <div class="title">
      <span>聊天</span>
      <!-- <div class="triangle down"></div> -->
    </div>
    <div class="chatList">
      <div v-for="(item, index) in chatList" :key="index" class="chat" @click="turnToChat(index)" @contextmenu="showContextMenu(index, $event)">
        <div class="avatar">
          <img :src="getChatAvatar(item)" />
          <div class="dot" v-show="item.unreadNum > 0">{{ item.unreadNum }}</div>
        </div>
        <div class="name_msg">
          <div class="name">{{ item.name || item.groupName }}</div>
          <div class="msg">{{ getLastMsg(item.chatMsg)}}</div>
        </div>
      </div>
    </div>
    <div class="contextMenu" v-show="isContextMenuShow" :style="contextMenuStyle">
      <div class="menu_item" @click="deleteChat">删除</div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE, MESSAGE_TYPE, CHAT_TYPE } from '../../constant';

export default {
  data() {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      defaultGroupAvatar: require('../../assets/group.png'),
      contextMenuStyle: {
        top: '0px',
        left: '0px'
      },
      isContextMenuShow: false,
      contentMenuSelected: 0, // 右键选中的index
    };
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    chat() {
      if (this.chatListIndex == null) {
        return {};
      }
      return this.$store.state.chat.chatList[this.chatListIndex]
    },
    chatList() {
      return this.$store.state.chat.chatList;
    },
    chatListIndex() {
      return this.$store.state.chat.chatListIndex;
    },
    friendList() {
      return this.$store.state.friend.friendList;
    },
    groupList() {
      return this.$store.state.friend.groupList;
    },
    // queryIndex() {
    //   return this.$route.query.index;
    // },
  },
  mounted() {
    this.initChatList()
    .then(data => {
      this.initOfflineMessage();
    })
    this.initContextMenuCancel();
  },
  methods: {
    initOfflineMessage() {
      this.$store.dispatch('getOfflineMessage', {})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            const offlineList = data.result;
            offlineList.forEach(offlineItem => {
              const chatType = offlineItem.chatType;
              let idx = -1;
              if (chatType == CHAT_TYPE.USER) {
                idx = this.chatList.findIndex(element => {
                  return element.userID == offlineItem.fromId;
                });
              } else {
                idx = this.chatList.findIndex(element => {
                  return element.groupId == offlineItem.fromId;
                });
              }

              if (idx != -1) {
                this.$store.commit('setChatUnread', { index: idx, value: offlineItem.messageNum });
              } else {
                // 添加chat
                let chatItem;
                if (chatType == CHAT_TYPE.USER) {
                  // 在好友中找到相应信息去addChat
                  const friendIndex = this.friendList.findIndex(element => {
                    return element.userID == offlineItem.fromId;
                  });
                  chatItem = this.friendList[friendIndex];
                  chatItem.chatMsg = offlineItem.chatMsg;
                } else {
                  // 在群组中找到相应信息
                  const groupIndex = this.groupList.findIndex(element => {
                    return element.groupId == offlineItem.fromId;
                  });
                  chatItem = this.groupList[groupIndex];
                  chatItem.chatMsg = offlineItem.chatMsg;
                }
                this.$store.commit('addChat', { item: chatItem});
                this.$store.commit('updateChatListIndex', {index: 0})
              }
            });
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    initContextMenuCancel() {
      window.addEventListener('click', () => {
        this.isContextMenuShow = false;
      })
    },
    initChatList() {
      return this.$store.dispatch('getChatList', {})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            const chatList = data.chatList;
            this.$store.commit('setChatList', { chatList });
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
        return true;
      })
      
    },
    turnToChat(index) {
      this.$store.commit('setChatUnread', { index, value: 0})
      this.$store.commit('updateChatListIndex', {index})
      this.$forceUpdate()
    },
    getLastMsg(chatMsg) {
      if (chatMsg.length > 0) {
        const content = chatMsg[chatMsg.length - 1].content;
        const type = chatMsg[chatMsg.length - 1].type;
        if (type == MESSAGE_TYPE.TEXT) {
          return chatMsg[chatMsg.length - 1].content;
        } else {
          return '[图片消息]'
        }
        
      } else {
        return '';
      }
    },
    deleteChat() {
      const index = this.contentMenuSelected;
      const chatItem = this.chatList[index];
      const chatID = chatItem.userID ? chatItem.userID : chatItem.groupId;
      const chatType = chatItem.userID ? CHAT_TYPE.USER : CHAT_TYPE.GROUP;
      this.$store.dispatch('deleteChat', { chatID, chatType})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            if (index == this.chatListIndex) {
              this.$store.commit('updateChatListIndex', {index: null})
            } else if (index < this.chatListIndex) {
              this.$store.commit('updateChatListIndex', { index: this.chatListIndex - 1})
            }
            this.$store.commit('deleteChat', { index });
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    showContextMenu(index, e) {
      this.contentMenuSelected = index;
      let x = e.clientX;
      let y = e.clientY;
      this.isContextMenuShow = true;
      this.contextMenuStyle = {
        top: `${y}px`,
        left: `${x}px`
      }
      e.preventDefault();
    },
    getChatAvatar(item) {
      if (item.groupId) {
        // 群组
        return this.defaultGroupAvatar;
      } else {
        // 用户
        return item.avatar || this.defaultAvatar;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#chatList {
  overflow: auto;
  position: relative;
  ::-webkit-scrollbar {//滚动条的宽度
    width: 0;
  }
  .contextMenu {
    position: fixed;
    width: 90px;
    border-radius: 4px;
    background-color: white;
    .menu_item {
      height: 36px;
      line-height: 36px;
      text-align: center;
      color: black;
      font-size: 14px;
      cursor: pointer;
    }
  }
  .title {
    font-size: 14px;
    background-color: #292d32;
    color: #787b87;
    padding: 2px 18px;
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
  .chatList {
    position: relative;
    
    
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
      position: relative;
      background-color: rgb(240,240,240);
      .dot {
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-color: rgb(236, 85, 85);
        top: -6px;
        right: -6px;
        text-align: center;
        line-height: 16px;
        font-size: 12px;
        color: white;
      }
    }
    .name_msg {
      margin-left: 10px;
      .name {
        font-size: 13px;
        font-weight: 400;
        color: white;
        line-height: 20px;
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }
      .msg {
        color: #989898;
        font-size: 13px;
        height: 1.5em;
        width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
      }
    }
  }
}
</style>
