<template>
  <div id="friendDetail">
    <div class="title">详细信息</div>
    <div class="friend">
      <div class="avatar"><img :src="defaultAvatar"/></div>
      <div class="name">
        <span>Another</span>
        <i></i>
      </div>
      <div class="sign">水流东去归大海 日转西向恩故人</div>
      <div class="area">地区： 广东</div>
      <div class="button">发消息</div>
    </div>
  </div>
</template>

<script>


export default {
  data () {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.jpeg'),
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    }
  },
  mounted() {

  },
  methods: {

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
      margin-top: 22px;
      span {
        font-size: 24px;
        height: 38px;
        margin-bottom: 10px;
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
      margin-top: 40px;
      width: 200px;
      height: 40px;
      text-align: center;
      cursor: pointer;
      line-height: 40px;
      color: white;
      background-color: #42ac3e;
      border-radius: 4px;
      font-size: 14px;
    }
  }
}
</style>
