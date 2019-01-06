<template>
  <div id="login">
    <div class="container">
      <el-form label-position='top' label-width="80px" :model="userInfo" class="form">
        <el-form-item label="账号">
          <el-input v-model="userInfo.account"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userInfo.password"></el-input>
        </el-form-item>
      </el-form>
      <div class="operation">
        <div class="skip">
          <div class="forget" @click="turnToForget">忘记密码?</div>
          <div class="register" @click="turnToRegister">注册</div>
        </div>
        <el-button type="primary" @click="login" class="button">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {responceCode} from '../../constant';

export default {
  data() {
    return {
      userInfo: {
        account: "",
        password: ""
      }
    };
  },
  computed: {
    // isLoading() {
    //   return this.$store.state.isLoading
    // }
  },
  mounted() {

  },
  methods: {
    turnToForget() {
      this.$router.push('/forget');
    },
    turnToRegister() {
      this.$router.push('/register');
    },
    login() {
      let { account, password } = this.userInfo;
      if (!account || !password) {
        this.$message('请输入完整信息');
        return;
      }
      this.$store.dispatch('login', {
        account,
        password
      })
      .then(data => {
        switch(data.code) {
          case responceCode.error:
            this.$message.error('账号密码错误');
            break;
          case responceCode.success:
            this.$message.success('登录成功');
            this.$router.push('/home');
            break;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
#login {
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
    margin-top: 30px;
  }
  .operation {
    width: 400px;
    margin-left: 50px;
    margin-top: 20px;
    .button {
      float: right;
      margin-top: 5px;
    }
    .skip {
      float: left;
      font-size: 15px;
      color: #44C3FB;
      .forget, .register {
        cursor: pointer;
      }
      .forget {
        margin-bottom: 5px;
      }
    }
  }
}
</style>
