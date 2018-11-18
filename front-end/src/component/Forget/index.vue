<template>
  <div id="forget">
    <div class="container">
      <el-form label-position='top' label-width="80px" :model="userInfo" class="form">
        <el-form-item label="账号">
          <el-input v-model="userInfo.account"></el-input>
        </el-form-item>
        <el-form-item label="注册邮箱">
          <el-input v-model="userInfo.mail"></el-input>
        </el-form-item>
        <el-form-item label="新密码" v-show="isVerified">
          <el-input v-model="userInfo.password" placeholder="仅限6-10位英文字母或数字"></el-input>
        </el-form-item>
      </el-form>
      <div class="button">
        <el-button type="primary" v-if="isVerified" @click="modifyPassword">修改密码</el-button>
        <el-button type="primary" v-else @click="verifyMail">验证邮箱</el-button>
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
        mail: ''
      },
      isVerified: false
    };
  },
  computed: {

  },
  mounted() {

  },
  methods: {
    verifyMail() {
      let { account, password, mail } = this.userInfo;
      if (!mail || !account) {
        this.$message('请输入完整信息');
        return;
      }
      this.$store.dispatch('verifyMail', {
        account,
        mail
      })
      .then(data => {
        if (data.code == responceCode.error) {
          this.$message.error('邮箱验证失败');
        } else {
          this.$message.success('邮箱验证成功');
          this.isVerified = true;
        }
      })
    },
    modifyPassword() {
      let { account, password, mail } = this.userInfo;
      if (!password || !account) {
        this.$message('请输入完整信息');
        return;
      }
      this.$store.dispatch('modifyPassword', {
        account,
        password
      })
      .then(data => {
        if (data.code == responceCode.error) {
          this.$message.error('修改密码失败');
        } else {
          this.$message.success('修改密码成功');
          this.$router.push('/login');
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
#forget {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.container {
  width: 500px;
  height: 400px;
  background: white;
  border-radius: 5px;
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
