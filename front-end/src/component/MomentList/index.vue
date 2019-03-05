<template>
  <div id="momentList">
    <div class="title">好友动态</div>
    <div class="list">
      <div class="moment" v-for="(item, index) in momentList" :key="index" @click="turnToDetail(index)">
        <div class="avatar"><img :src="item.avatar || defaultAvatar"/></div>
        <div class="detail">
          <div class="name">{{ item.name }}</div>
          <div class="content">{{ item.momentText }}</div>
          <div class="img_list" v-if="item.momentImgList">
            <div v-for="(picture, picIndex) in item.momentImgList" :key="picIndex">
              <img :src="decodeURIComponent(picture)" v-if="picture" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

export default {
  data() {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      isVerified: false
    };
  },
  computed: {
    momentList() {
      return this.$store.state.moment.momentList
    }
  },
  mounted() {
    this.getMomentList()
  },
  methods: {
    getMomentList() {
      this.$store.dispatch('getMomentList', { })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            console.log(data)
            const momentList = data.momentList;
            this.$store.commit('setMomentList', { momentList})
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    turnToDetail(index) {
      this.$store.commit('showMomentDetail', {});
      this.$store.commit('updateMomentIndex', { index})
    }
  }
};
</script>

<style lang="scss" scoped>
#momentList {
  overflow-x: hidden;
  overflow-y: auto;
  width: 110% !important;
  .title {
    font-size: 14px;
    background-color: #292d32;
    color: #787b87;
    padding: 2px 18px;
    overflow: hidden;
    position: relative;
  }
  .moment {
    width: 100%;
    display: flex;
    border-bottom: 1px solid rgba(180, 177, 177, 0.2);
    padding-top: 5px;
    padding-bottom: 12px;
    cursor: pointer;
    .avatar {
      width: 30px;
      height: 30px;
      margin-top: 10px;
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 2px;
      overflow: hidden;
    }
    .detail {
      width: 220px;
      .name {
        color: rgb(95, 104, 143);
        font-size: 15px;
        font-weight: 600;
        margin-top: 8px;
      }
      .content {
        font-size: 14px;
        color: #eee;
        margin-top: 5px;
      }
      .img_list {
        margin-top: 8px;
        display: flex;
        img {
          width: 50px;
          height: 50px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
