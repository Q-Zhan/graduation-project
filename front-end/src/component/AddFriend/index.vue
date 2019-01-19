<template>
  <div id="addFriend">
    <div class="title">搜索用户</div>
    <div class="search">
      <input placeholder="请输入chat号" @keyup.enter="search" v-model="searchValue"/>
    </div>
    <div class="user_list">
      <div class="user" v-for="item in userList" :key="item.userID">
        <div class="user_avatar"><img :src="item.avatar || defaultAvatar"/></div>
        <div class="user_info">
          <div class="user_name_id">
            <span class="name">{{ item.name }}</span>
            <span class="id">({{ item.userID }})</span>
          </div>
          <div class="user_gender_area">
            <i :class="formatGender(item.gender)"></i>
            <div class="area">{{ item.area }}</div>
          </div>
        </div>
        <div class="add_button" @click="addFriend(item)">添加</div>
      </div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

export default {
  data () {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      searchValue: '',
      userList: []
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
    search() {
      this.$store.dispatch('searchUser', {
        id: this.searchValue
      })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.userList = data.users;
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    addFriend(item) {
      let { userID } = item;
      this.$store.dispatch('addFriend', {
        id: userID
      })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$message.success('发送请求成功')
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
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
#addFriend {
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
  .search {
      width: 100%;
      margin-top: 20px;
      input {
          width: 100%;
          border: 1px solid #d6d6d6;
          border-left: 0;
          border-right: 0;
          padding: 10px 0;
          padding-left: 20px;
          font-size: 16px;
      }
      ::-moz-placeholder { color: #d6d6d6; }
      ::-webkit-input-placeholder { color:#d6d6d6; }
      :-ms-input-placeholder { color:#d6d6d6; }
  }
  .user {
    border-bottom: 1px solid #e6e3e3;
    height: 70px;
    display: flex;
    position: relative;
    align-items: center;
    .user_avatar {
      width: 50px;
      height: 50px;
      margin-left: 20px;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .user_info {
      margin-left: 20px;
      .user_name_id {
        font-size: 16px;
        font-weight: 400;
        height: 20px;
        .id {
          color: gray;
        }
      }
      .user_gender_area {
        font-size: 14px;
        display: flex;
        align-items: center;
        height: 20px;
        margin-top: 8px;
        .area {
          color: gray;
          margin-left: 4px;
          padding-top: 2px;
        }
        i {
          width: 16px;
          height: 16px;
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
    }
    .add_button {
      cursor: pointer;
      position: absolute;
      top: 18px;
      right: 30px;
      width: 70px;
      height: 34px;
      background-color: rgb(52, 164, 41);
      color: white;
      border-radius: 4px;
      text-align: center;
      line-height: 34px;
      border: 1px solid rgb(26, 119, 18);
    }
  }
}
</style>
