<template>
  <div id="chatroom">
    <div class="chat_room" v-show="(chatListIndex != null)">
      <div class="title">
        <div class="title_name" @click="controlMemberList">
          {{chat.name || chat.groupName}}
        </div>
        <div class="triangle" v-if="isGroup" @click="controlMemberList"></div>
        <div class="member_list" v-if="isGroup && isMemberListShow">
          <div class="member" v-for="(item, index) in member" :key="index">
            <img :src="(item.avatar && decodeURIComponent(item.avatar)) || defaultAvatar" @click="showMemberPop(item, $event)"/>
            <div class="member_name">{{item.name}}</div>
          </div>
        </div>
      </div>
      <!-- 聊天内容 -->
      <div class="content" id="content" ref="content" @scroll="handleContentScroll">
        <div v-for="(item, index) in chatMsg" :key="index">
          <div :class="[(item.fromID || item.fromId)==userInfo.userID ? 'flex_right' : 'flex_left', 'msg_wrap']">
            <div class="avatar"><img :src="getMsgAvatar(item)"/></div>
            <div :class="['msg_content_warp', isGroup ? 'margin_top' : '']">
              <div v-if="isGroup" class="msg_sender">{{getSenderName(item)}}</div>
              <div class="msg_content" v-if="item.type == MESSAGE_TYPE.TEXT">
                <span>{{ item.content }}</span>
              </div>
              <div class="msg_img" v-if="item.type == MESSAGE_TYPE.IMAGE">
                <img :src="decodeURIComponent(item.content)"/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 发送框 -->
      <div class="send">
        <div class="toolbar">
          <div class="file">
            <input type="file" ref="imageUpload" @change="sendImg"/>
            <div class="file_icon icon"></div>
          </div>
        </div>
        <div class="text_input">
          <textarea ref="inputBox" @keyup.enter="sendMsg"></textarea>
        </div>
        <div class="send_button">
          <div class="button" @click="sendMsg">发送</div>
        </div>
      </div>
    </div>

    <div class="default" v-if="chatListIndex == null">
      <img :src="defaultAvatar"/>
      <div class="text">未选择聊天</div>
    </div>
    <!-- memberList弹窗 -->
    <div class="member_pop" :style="memberPopStyle" v-if="isMemberPopShow">
      <div class="avatar"><img :src="(memberPopItem.avatar && decodeURIComponent(memberPopItem.avatar)) || defaultAvatar"/></div>
      <div class="info">
        <div class="name">{{memberPopItem.name}}</div>
        <div class="id">ID：{{ memberPopItem.userID}}</div>
        <div class="area">地区：{{ memberPopItem.area}}</div>
        <div class="kick" @click="kickMember(memberPopItem)" v-if="isGroupManager"><img :src="kickIcon"/></div>
      </div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE, MESSAGE_TYPE } from '../../constant';

export default {
  data () {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      kickIcon: require('../../assets/kick.png'),
      MESSAGE_TYPE: MESSAGE_TYPE,
      isMemberListShow: false,
      isMemberPopShow: false,
      memberPopStyle: {
        top: '0px',
        left: '0px'
      },
      memberPopItem: {}
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    userInfo() {
      return this.$store.state.user.info;
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
    },
    isGroup() {
      return this.chat.groupId; // 只有group才有groupId
    },
    member() {
      return this.isGroup && this.chat.member;
    },
    isGroupManager() {
      if (!this.isGroup) {
        return false;
      } else {
        return this.userInfo.userID == this.member[0].userID; // member第一个是管理员
      }
    }
    // queryIndex() {
    //   return this.$route.query.index;
    // },
  },
  watch: {
    chatListIndex(newValue, oldValue) {
      this.scrollToOldPosition();
    },
    chatMsg(newValue, oldValue) {
      this.scrollToOldPosition();
    }
  },
  mounted() {
    this.scrollToOldPosition(true);
    this.initMemberPopCancel();
  },
  methods: {
    kickMember(item) {
      const { userID } = item;
      this.$store.dispatch('kickGroup', { userId: userID, groupId: this.chat.groupId})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$message.success('成功移出群聊')
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    showMemberPop(item, e) {
      let x = e.clientX;
      let y = e.clientY;
      this.memberPopStyle = {
        top: `${y}px`,
        left: `${x}px`
      }
      this.memberPopItem = item;
      this.isMemberPopShow = true;
      e.stopPropagation();
    },
    initMemberPopCancel() {
      window.addEventListener('click', () => {
        this.isMemberPopShow = false;
      })
    },
    handleContentScroll(e) {
      const contentElement = this.$refs.content;
      const scrollHeight = contentElement.scrollTop;
      this.$store.commit('setScrollHeight', {
        value: scrollHeight,
        index: this.chatListIndex
      })
    },
    controlMemberList() {
      this.isMemberListShow = !this.isMemberListShow
    },
    sendImg(e) {
      let imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)/i;
      const file = e.target.files[0];
      console.log(file);
      if (file && imgFilter.test(file.type)) {
        let img_size = e.target.files[0].size / 1024;
        let reader = new FileReader();
        let prefixReg = /^data:image\/(bmp|cis\-cod|gif|ief|jpeg|png|tiff);base64,/gi;
        let self = this;
        reader.onload = function() {
          let result = this.result
          // 压缩图片
          let cvs = document.createElement('canvas')
          let ctx = cvs.getContext('2d')
          let img = new Image()
          img.onload = () => {
            // 如果图片大小大于100kb
            if (img_size >= 100) {
              let compress_proportion = 100 / img_size
              cvs.width = img.width
              cvs.height = img.height
              ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
              result = cvs.toDataURL('image/jpeg', compress_proportion)
            }
            result = encodeURIComponent(result)
            self.$store.dispatch('sendPrivateMessage', { 
              id: self.chat.userID,
              message: result,
              type: MESSAGE_TYPE.IMAGE
            })
            .then(data => {
              switch(data.code) {
                case RESPONCE_CODE.unAuth:
                  self.$message.error('登录状态失效');
                  self.$router.push('/login');
                  break;
                case RESPONCE_CODE.success:
                  const isSuccess = data.isSuccess;
                  if (isSuccess) {
                    self.$store.commit('addChatMessage', {
                      index: parseInt(self.chatListIndex),
                      item: {type: MESSAGE_TYPE.IMAGE, fromID: self.userInfo.userID, toID: self.chat.userID, content: result}
                    });
                    // 发送成功后置顶
                    self.$store.dispatch('topChat', { chatID: self.chat.userID});
                    self.$store.commit('topChat', { index: parseInt(self.chatListIndex) });
                    self.$store.commit('updateChatListIndex', { index: 0 })
                  } else {
                    self.$message.error('您与对方已不是好友关系，请重新添加好友');
                  }
                  break;
                default:
                  self.$message.error('服务出错，请稍后重试');
              }
            })

            // 清空value以便传同一文件时可以触发input的change事件
            e.target.value = ''
          }
          img.src = result
        }

        reader.readAsDataURL(file)

        
      } else {
        this.$message.error('请选择图片');
      }
    },
    sendMsg() {
      let inputBoxValue = this.$refs.inputBox.value;
      let message = inputBoxValue.slice(0, inputBoxValue.length - 1);
      if (message.length == 0) {
        this.$refs.inputBox.value = '';
        return;
      }
      if (this.chat.userID) {
        // 发送私聊
        this.$store.dispatch('sendPrivateMessage', { 
          id: this.chat.userID,
          message: message,
          type: MESSAGE_TYPE.TEXT
        })
        .then(data => {
          switch(data.code) {
            case RESPONCE_CODE.unAuth:
              this.$message.error('登录状态失效');
              this.$router.push('/login');
              break;
            case RESPONCE_CODE.success:
              const isSuccess = data.isSuccess;
              if (isSuccess) {
                this.$store.commit('addChatMessage', {
                  index: parseInt(this.chatListIndex),
                  item: {type: MESSAGE_TYPE.TEXT, fromID: this.userInfo.userID, toID: this.chat.userID, content: message}
                });
                // 发送成功后置顶
                this.$store.dispatch('topChat', { chatID: this.chat.userID});
                this.$store.commit('topChat', { index: parseInt(this.chatListIndex) });
                this.$store.commit('updateChatListIndex', { index: 0 })
              } else {
                this.$message.error('您与对方已不是好友关系，请重新添加好友');
              }
              this.$refs.inputBox.value = '';
              break;
            default:
              this.$message.error('服务出错，请稍后重试');
          }
        })
      } else {
        // 发送群聊
        this.$store.dispatch('sendGroupMessage', { 
          groupId: this.chat.groupId,
          message: message,
          type: MESSAGE_TYPE.TEXT
        })
        .then(data => {
          switch(data.code) {
            case RESPONCE_CODE.unAuth:
              this.$message.error('登录状态失效');
              this.$router.push('/login');
              break;
            case RESPONCE_CODE.success:
              const isSuccess = data.isSuccess;
              if (isSuccess == 1 || isSuccess == 2) {
                if (isSuccess == 2) {
                  message = data.message;
                  this.$message.error('您发送的信息中含有敏感词，多次发现将被处罚')
                }
                this.$store.commit('addChatMessage', {
                  index: parseInt(this.chatListIndex),
                  item: { 
                    content: message,
                    fromId: this.userInfo.userID,
                    groupID: this.chat.groupId,
                    type: MESSAGE_TYPE.TEXT
                  }
                });
                // 发送成功后置顶
                this.$store.dispatch('topChat', { chatID: this.chat.groupId});
                this.$store.commit('topChat', { index: parseInt(this.chatListIndex) });
                this.$store.commit('updateChatListIndex', { index: 0 })
              } else if (isSuccess == 0){
                this.$message.error('您已被踢出该群聊');
              }
              this.$refs.inputBox.value = '';
              break;
            default:
              this.$message.error('服务出错，请稍后重试');
          }
        })
      }
    },
    scrollToOldPosition(toBottom) {
      if (this.chatListIndex != null) {
        // watch路由的query变化情况下，query已变而dom未更新完毕
        this.$nextTick(() => {
          const contentElement = this.$refs.content;
          if (toBottom) {
            contentElement.scrollTop = contentElement.scrollHeight;
            this.$store.commit('setScrollHeight', {
              value: contentElement.scrollHeight,
              index: this.chatListIndex
            })
          } else {
            const scrollHeight = this.chat.scrollHeight ? this.chat.scrollHeight : contentElement.scrollHeight;
            contentElement.scrollTop = scrollHeight;
          }
        })
      }
    },
    getMsgAvatar(item) {
      const fromId = item.fromID || item.fromId;
      let avatar;
      if (this.chat.userID) {
        // 用户
        avatar = (fromId == this.userInfo.userID) ? this.userInfo.avatar : this.chat.avatar;
      } else {
        this.chat.member.forEach(element => {
          if (element.userID == fromId) {
            avatar = element.avatar;
          }
        });
      }
      return (avatar && decodeURIComponent(avatar)) || this.defaultAvatar;
    },
    getSenderName(item) {
      if (this.chat.userID) {
        return;
      }
      const fromId = item.fromID || item.fromId;
      let name;
      this.chat.member.forEach(element => {
        if (element.userID == fromId) {
          name = element.name;
        }
      });
      return name || '已被踢出群聊';
    }
  }
}
</script>

<style lang="scss" scoped>
#chatroom {
  width: 100%;
  height: 100%;
  background: #eee;
  overflow: hidden;
  .member_pop {
    position: fixed;
    z-index: 199;
    border-radius: 4px;
    width: 220px;
    overflow: hidden;
    .avatar {
      width: 220px;
      height: 220px;
    }
    .info {
      width: 200px;
      height: 90px;
      padding-left: 20px;
      padding-top: 20px;
      background-color: white;
      position: relative;
      .name {
        font-weight: 400;
        font-size: 18px;
        max-width: 140px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-wrap: normal;
        margin-bottom: 8px;
      }
      .id, .area {
        font-size: 12px;
        color: #888;
      }
      .kick {
        width: 24px;
        height: 24px;
        position: absolute;
        top: 64px;
        right: 20px;
        cursor: pointer;
      }
    }

  }
  .title {
    display: flex;
    position: relative;
    justify-content: center;
    margin: 0 19px;
    padding: 10px 0;
    line-height: 30px;
    border-bottom: 1px solid #d6d6d6;
    text-align: center;
    font-size: 14px;
    .title_name {
      position: relative;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      cursor: pointer;
    }
    .triangle {
      margin-left: 5px;
      margin-top: 10px;
      width: 10px;
      height: 10px;
      cursor: pointer;
      background: url('../../assets/icons.png') no-repeat;
      background-position: -477px -65px;
      background-size: 487px 462px;
    }
    .member_list {
      position: absolute;
      z-index: 99;
      left: 0;
      top: 51px;
      width: 660px;
      display: flex;
      flex-wrap: wrap;
      overflow-y: auto;
      max-height: 250px;
      padding: 10px 4px 8px 27px;
      border-bottom: 1px solid #d6d6d6;
      background-color: #eee;
      .member {
        margin-right: 25px;
        margin-bottom: 10px;
        img {
          width: 55px;
          height: 55px;
          cursor: pointer;
        }
        .member_name {
          width: 55px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-wrap: normal;
          text-align: center;
        }
       
      }
    }
  }
  .content {
    height: 525px;
    padding: 0 20px;
    overflow-y: auto;
    
    .msg_wrap {
      display: flex;
      margin: 16px 0;
    }
    .avatar {
      width: 40px;
      height: 40px;
    }
    .msg_content_warp {
      position: relative;
    }
    .margin_top {
      margin-top: 18px;
    }
    .msg_content {
      position: relative;
      display: flex;
      align-items: center;
      padding: 9px 13px;
      word-wrap: break-word;
      word-break: break-all;
      font-size: 14px;
      max-width: 420px;
      border-radius: 3px;
      margin: 0 10px;
      line-height: 18px;
    }
    .msg_sender {
      position: absolute;
      top: -20px;
      color: #989898;
      font-size: 13px;
      max-width: 420px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }
    .msg_img {
      width: 100px;
      height: 100px;
    }
    .msg_content:after {
      content: ' ';
      width: 0px;
      height: 0px;
      position: absolute;
      top: 14px;
      border: 6px solid transparent;
    }
    .flex_left {
      flex-direction: row;
      .msg_sender {
        left: 10px;
        text-align: left;
      }
      .msg_content {
        background-color: white;
      }
      .msg_content:after {
        left: -10px;
        border-right: 4px solid white;
      }
      .msg_img {
        margin-left: 10px;
      }
    }
    .flex_right {
      flex-direction: row-reverse;
      .msg_sender {
        right: 10px;
        text-align: right;
      }
      .msg_content {
        background-color: #b2e281;
      }
      .msg_content:after {
        right: -10px;
        border-left: 4px solid #b2e281;
      }
      .msg_img {
        margin-right: 10px;
      }
    }
  }
  .send {
    height: 180px;
    margin-right: 20px;
    border-top: 1px solid rgb(214, 214, 214);
    .toolbar {
      height: 30px;
      padding: 5px 17px;
      display: flex;
      input {
        width: 30px;
        height: 30px;
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
      }
      .icon {
        cursor: pointer;
        width: 30px;
        height: 30px;
        background: url('../../assets/icons.png');
        background-size: 487px 462px;
      }
      .file {
        width: 30px;
        height: 30px;
        cursor: pointer;
        position: relative;
        .file_icon {
          background-position: -120px -432px;
        }
      }
    }
    
    .text_input {
      padding-left: 20px;
      height: 84px;
      textarea {
        width: 100%;
        height: 84px;
        resize: none;
        overflow-y: hidden;
        outline: none;
        border: 0;
        background: #eee;
        padding: 0;
        font-size: 14px;
      }
    }

    .send_button {
      height: 30px;
      margin-top: 5px;
      .button {
        width: 88px;
        height: 28px;
        line-height: 28px;
        text-align: center;
        border: 1px solid rgb(193, 193, 193);
        background-color: white;
        color: #222;
        border-radius: 4px;
        float: right;
        cursor: pointer;
      }
    }
    
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
