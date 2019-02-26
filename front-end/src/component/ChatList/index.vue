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
      <div v-for="(item, index) in chatList" :key="index" class="chat" @click="turnToChat(index)" @contextmenu="showContextMenu(index, $event)">
        <div class="avatar">
          <img :src="item.avatar || defaultAvatar" />
          <div class="dot" v-show="item.unreadNum > 0">{{ item.unreadNum }}</div>
        </div>
        <div class="name_msg">
          <div class="name">{{ item.name }}</div>
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
import { RESPONCE_CODE, MESSAGE_TYPE } from '../../constant';

export default {
  data() {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
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
    chatList() {
      return this.$store.state.chat.chatList;
    },
    chatListIndex() {
      return this.$store.state.chat.chatListIndex;
    }
    // queryIndex() {
    //   return this.$route.query.index;
    // },
  },
  mounted() {
    this.initChatList();
    this.initContextMenuCancel();
  },
  methods: {
    initContextMenuCancel() {
      window.onclick = () => {
        this.isContextMenuShow = false;
      }
    },
    initChatList() {
      this.$store.dispatch('getChatList', {})
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
      })
    },
    turnToChat(index) {
      this.$store.commit('setChatUnread', { index})
      this.$store.commit('updateChatListIndex', {index})
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
      const id = this.chatList[index].userID;

      
      this.$store.dispatch('deleteChat', { chatID: id})
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
    }
  }
};
</script>

<style lang="scss" scoped>
#chatList {
  overflow: auto;
  position: relative;
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
