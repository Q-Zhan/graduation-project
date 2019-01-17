<template>
  <div id="friendList">
    friendList
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

export default {
  data() {
    return {
      userInfo: {
        account: "",
        password: "",
        mail: ''
      }
    };
  },
  computed: {

  },
  mounted() {
    this.getFriendList();
  },
  methods: {
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
    }
  }
};
</script>

<style lang="scss" scoped>
#friendList {
  overflow: auto;
}
</style>
