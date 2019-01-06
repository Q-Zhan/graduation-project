<template>
  <div id="register">
    <div class="container">
      <el-form label-position='top' label-width="80px" :model="userInfo" class="form">
        <el-form-item label="账号">
          <el-input v-model="userInfo.account" placeholder="仅限6-10位英文字母或数字"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userInfo.password" placeholder="仅限6-10位英文字母或数字"></el-input>
        </el-form-item>
         <el-form-item label="邮箱">
          <el-input v-model="userInfo.mail" placeholder="用于找回密码"></el-input>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button type="primary" @click="register">注册</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { responceCode } from '../../constant';

export default {
  data() {
    return {
      userInfo: {
        account: "",
        password: "",
        mail: ""
      }
    };
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    register() {
      let { account, password, mail } = this.userInfo;
      if (!account || !password || !mail) {
        this.$message('请输入完整信息');
        return;
      }
      this.$store.dispatch('register', {
        account,
        password,
        mail
      })
      .then(data => {
        switch(data.code) {
          case responceCode.error:
            this.$message.error('注册失败：系统错误');
            break;
          case responceCode.dbRepeat:
            this.$message.error('注册失败：该用户名已被注册');
            break;
          case responceCode.success:
            this.$message.success('注册成功');
            this.$router.push('/login');
            break;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#register {
  width: 500px;
  height: 400px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.container {
  width: 500px;
  height: 400px;
  background: white;
  border-radius: 5px;
  overflow: hidden;
  .form {
    margin: 0 50px;
    margin-top: 20px;
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .button {
    float: right;
    margin-right: 50px;
    margin-top: 30px;
  }
}

</style>
