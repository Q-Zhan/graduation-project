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
      <div class="button send">发消息</div>
      <div class="button delete">删除好友</div>
    </div>

    <div class="default" v-show="!queryIndex">
      <img :src="defaultAvatar"/>
    </div>
  </div>
</template>

<script>


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
    token() {
      return this.$store.state.user.token;
    },
    queryIndex() {
      return this.$route.query.index;
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
