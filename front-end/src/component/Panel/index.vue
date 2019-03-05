<template>
  <div id="panel">
    <div class="user_info">
      <div class="avatar" @click="showMask"><img :src="userInfo.avatar ? decodeURIComponent(userInfo.avatar) : defaultAvatar"/></div>
      <div class="name">{{ userInfo.name }}</div>
      <div class="select">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link select_icon">
            123<!-- hack一下，el-dropdown的点击占位符 -->
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="pushRouter('/home/addFriend')">添加好友</el-dropdown-item>
            <el-dropdown-item divided @click.native="createGroup">发起群聊</el-dropdown-item>
            <el-dropdown-item divided @click.native="createMoment">发布动态</el-dropdown-item>
            <el-dropdown-item divided>退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="search_bar">
      <input class="search_input" placeholder="搜索"/>
    </div>
    <div class="tab">
      <div class="tab_item" @click="pushRouter('/home/chat')">
        <i class="chat_not_choose" v-show="!isChatRoute"></i>
        <i class="chat_choose" v-show="isChatRoute"></i>
      </div>
      <div class="tab_item" @click="pushRouter('/home/moment')">
        <i class="moment_not_choose" v-show="!isMomentRoute"></i>
        <i class="moment_choose" v-show="isMomentRoute"></i>
      </div>
      <div class="tab_item" @click="pushRouter('/home/friend')">
        <i class="friend_not_choose" v-show="!isFriendRoute"></i>
        <i class="friend_choose" v-show="isFriendRoute"></i>
        <div class="red_dot" v-show="applyFriend.length"></div>
      </div>
    </div>
    <keep-alive>
      <div class="list_wrap">
        <router-view name="list" class="list_view"></router-view>
      </div>
      
    </keep-alive>
    <!-- 个人信息修改浮层 -->
    <div class="mask_wrap" v-if="isMaskShow" @click="closeMask">
      <div class="mask_content" @click="preventClose">
        <div class="wrap avatar">
          <div class="title">头像</div>
          <div class="avatar_input">
            <img :src="getAvatar()"/>
            <input type="file" ref="imageUpload" @change="uploadImg"/>
          </div>
        </div>
        <div class="wrap">
          <div class="title">昵称</div>
          <div class="input">
            <input v-model="maskUserInfo.name"/>
          </div>
        </div>
        <div class="wrap">
          <div class="title">地区</div>
          <div class="input">
            <input v-model="maskUserInfo.area"/>
          </div>
        </div>
        <div class="wrap">
          <div class="title">签名</div>
          <div class="input">
            <input v-model="maskUserInfo.sign"/>
          </div>
        </div>
        <div class="wrap">
          <div class="title">性别</div>
          <div class="input">
            <el-select v-model="maskUserInfo.gender" size="mini" placeholder="请选择">
              <el-option
                :label="'男'"
                :value="1"
              ></el-option>
              <el-option
                :label="'女'"
                :value="0"
              ></el-option>
              <el-option
                :label="'无'"
                :value="null"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="button" @click="modifyInfo">保存</div>
      </div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE, CHAT_TYPE } from '../../constant';

export default {
  data () {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      isMaskShow: false,
      maskUserInfo: {},
      avatar: '',
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    userInfo() {
      return this.$store.state.user.info;
    },
    applyFriend() {
      return this.$store.state.friend.applyFriend;
    },
    isChatRoute() {
      return this.$route.meta.listTabs == 'chat';
    },
    isFriendRoute() {
      return this.$route.meta.listTabs == 'friend';
    },
    isMomentRoute() {
      return this.$route.meta.listTabs == 'moment';
    },
  },
  mounted() {

  },
  methods: {
    modifyInfo() {
      let { name, area, sign, gender, avatar } = this.maskUserInfo;
      console.log(this.maskUserInfo)
      this.$store.dispatch('modifyInfo', { name, area, sign, gender, avatar })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$store.commit('modifyInfo', { name, area, sign, gender, avatar });
            this.$message.success('保存成功');
            this.isMaskShow = false;
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    getAvatar() {
      if (this.avatar) {
        return decodeURIComponent(this.avatar);
      } else {
        return this.userInfo.avatar || this.defaultAvatar
      }
    },
    closeMask() {
      this.isMaskShow = false;
    },
    showMask() {
      this.isMaskShow = true;
      this.maskUserInfo = Object.assign({}, this.userInfo);
    },
    preventClose(e) {
      e.stopPropagation();
    },
    createMoment() {
      this.$store.commit('showCreateMoment', {})
      this.pushRouter('/home/moment')
    },
    pushRouter(path) {
      this.$router.push(path);
    },
    createGroup() {
      this.$store.commit('setIsSelectingGroup', { status: true});
      this.pushRouter('/home/friend');
    },
    uploadImg(e) {
      let imgFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)/i;
      const file = e.target.files[0];
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
            // 如果图片大小大于50kb
            const MAX_SIZE = 50
            if (img_size >= MAX_SIZE) {
              let compress_proportion = MAX_SIZE / img_size
              cvs.width = img.width
              cvs.height = img.height
              ctx.drawImage(img, 0, 0, cvs.width, cvs.height)
              result = cvs.toDataURL('image/jpeg', compress_proportion)
            }
            result = encodeURIComponent(result);
            self.avatar = result;
            self.maskUserInfo.avatar = result;
            // 清空value以便传同一文件时可以触发input的change事件
            e.target.value = ''
          }
          img.src = result
        }

        reader.readAsDataURL(file)

        
      } else {
        this.$message.error('请选择图片');
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#panel {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: #2E3238;
  .mask_wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    .mask_content {
      width: 500px;
      height: 460px;
      background: white;
      .wrap {
        width: 480px;
        margin-left: 20px;
        height:60px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        display: flex;
        align-items: center;
      }
      .el-select {
        width: 100px !important;
        margin-right: 20px;
      }
      .avatar {
        height: 100px;
        .avatar_input {
          width: 380px;
          height: 100px;
          position: relative;
          input {
            width: 60px;
            height: 60px;
            opacity: 0;
            position: absolute;
            top: 20px;
            right: 20px;
            cursor: pointer;
          }
          img {
            width: 60px;
            height: 60px;
            cursor: pointer;
            position: absolute;
            top: 20px;
            right: 20px;
            border-radius: 4px;
          }
        }
      }
      .title {
        width: 100px;
      }
      .input {
        width: 380px;
        display: flex;
        flex-direction: row-reverse;
        input {
          color: gray;
          margin-right: 20px;
          font-size: 14px;
          text-align: right;
          border: 0;
          outline: 0;
        }
      }
      .button {
        width: 88px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border: 1px solid rgb(193, 193, 193);
        background-color: #42ac3e;
        color: white;
        cursor: pointer;
        border-radius: 4px;
        margin-top: 30px;
        margin-left: 390px;
      }
    }
  }
  .user_info {
    padding: 18px;
    display: flex;
    height: 40px;
    align-items: center;
    .avatar {
      width: 40px;
      height: 40px;
      border-radius: 3px;
      overflow: hidden;
      cursor: pointer;
    }
    img {
      width: 100%;
      height: 100%;
    }
    .name {
      width: 152px;
      margin-left: 10px;
      color: white;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
      font-size: 16px;
      font-weight: 400;
    }
    .select {
      width: 30px;
      height: 30px;
      background: url('../../assets/icons.png');
      background-position: -434px -398px;
      background-size: 487px 462px;
      cursor: pointer;
      .select_icon {
        width: 30px;
        height: 30px;
        opacity: 0;
        padding-bottom: 7px;
        padding-right: 4px;
      }
    }
  }
  .search_bar {
    margin-left: 18px;
    margin-right: 18px;
    margin-bottom: 6px;
    height: 32px;
    display: flex;
    align-items: center;
    .search_icon {
      width: 30px;
      height: 30px;
      flex-shrink: 0;
      background: url('../../assets/icons.png');
      background-position: -60px -432px;
      background-size: 487px 462px;
    }
    .search_input {
      height: 32px;
      flex-grow: 1;
      line-height: 32px;
      border: 0;
      outline: 0;
      background-color: #26292e;
      color: white;
      font-size: 12px;
      padding-left: 10px;
    }
  }
  .tab {
    height: 35px;
    padding-bottom: 4px;
    position: relative;
    display: flex;
    .tab_item {
      width: 33.3333%;
      position: relative;
      height: 100%;
      display: flex;
      justify-content: center;
      cursor: pointer;
      .red_dot {
        position: absolute;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: rgb(251, 43, 35);
        top: 4px;
        right: 30px;
      }
      i {
        width: 35px;
        height: 35px;
        background: url('../../assets/icons.png');
        background-size: 487px 462px;
      }
      .chat_choose {
        background-position: -185px -96px;
      }
      .chat_not_choose {
        background-position: -150px -96px;
      }
      .moment_choose {
        background-position: -304px -281px;
      }
      .moment_not_choose {
        background-position: -376px -322px;
      }
      .friend_choose {
        background-position: -304px -246px;
      }
      .friend_not_choose {
        background-position: -220px -96px;
      }
    }
    .tab_item:nth-child(1)::after, .tab_item:nth-child(2)::after {
      content: '';
      position: absolute;
      top: 7px;
      right: 0;
      width: 0;
      height: 20px;
      border-right: 1px solid #24272c;
    }
  }
  .tab:after {
    content: "";
    position: absolute;
    border-bottom: 1px solid #24272c;
    height: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .list_wrap {
    height: 604px;
    width: 100%;
    overflow-x: hidden;
  }
  .list_view {
    height: 604px;
    width: 100%;
  }
}
</style>
