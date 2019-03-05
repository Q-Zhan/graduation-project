<template>
  <div id="momentDetail">
    <!-- 发布动态 -->
    <section v-if="isCreateShow">
      <div class="title">发布动态</div>
      <div class="release">
        <div class="text_input"><textarea v-model="momentText" autofocus maxlength="200" placeholder="分享这一刻瞬间 ~"></textarea></div>
        <div class="img_input">
          <div v-for="(item, index) in imgList" :key="index" class="upload">
            <input type="file" ref="imageUpload" @change="uploadImg(index, $event)"/>
            <img :src="getImgSrc(item)"/>
          </div>
        </div>
        <div class="release_button" @click="createMoment">发布</div>
      </div>
    </section>
    <!-- 动态详情 -->
    <section v-if="isDetailShow">
      <div class="moment" v-if="momentIndex != null">
        <div class="avatar"><img :src="moment.avatar || defaultAvatar"/></div>
        <div class="detail">
          <div class="name">{{ moment.name }}</div>
          <div class="content">{{ moment.momentText }}</div>
          <div class="img_list" v-if="moment.momentImgList.length > 0">
            <div v-for="(picture, picIndex) in moment.momentImgList" :key="picIndex">
              <img :src="decodeURIComponent(picture)" v-if="picture" @click="openMask(picture)"/>
            </div>
          </div>
        </div>
      </div>
      <!-- 未选择 -->
      <div class="default" v-if="momentIndex == null">
        <img :src="defaultAvatar"/>
        <div class="text">未选择动态</div>
      </div>
    </section>
    <!-- 详情图片浮层 -->
    <div class="mask_wrap" v-if="isMaskShow" @click="closeMask">
      <div class="mask_content">
        <img :src="maskImg"/>
      </div>
      <!-- <div class="close_button"></div> -->
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE, MESSAGE_TYPE } from '../../constant';

export default {
  data () {
    return {
      momentText: '',
      uploadIcon: require('../../assets/upload.jpg'),
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      imgList: [false, false, false], // 
      isMaskShow: false,
      maskImg: ''
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token;
    },
    userInfo() {
      return this.$store.state.user.info;
    },
    isDetailShow() {
      return this.$store.state.moment.isDetailShow;
    },
    isCreateShow() {
      return this.$store.state.moment.isCreateShow;
    },
    momentIndex() {
      return this.$store.state.moment.momentIndex;
    },
    moment() {
      return this.$store.state.moment.momentList[this.momentIndex]
    }
  },
  mounted() {
    
  },
  methods: {
    closeMask() {
      this.isMaskShow = false;
    },
    openMask(item) {
      this.maskImg = decodeURIComponent(item);
      this.isMaskShow = true;
    },
    createMoment() {
      this.$store.dispatch('createMoment', { text: this.momentText, imgList: this.imgList})
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$message.success('发布成功');
            
            // 添加新发布的，并跳转到detail
            let item = Object.assign(this.userInfo, { momentText: this.momentText, momentImgList: this.imgList, timeStamp: (+new Date())});
            this.$store.commit('addMoment', { item })

            this.momentText = '';
            this.imgList = [false, false, false];
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    getImgSrc(item) {
      if (item == false) {
        return this.uploadIcon;
      } else {
        return decodeURIComponent(item);
      }
    },
    uploadImg(index, e) {
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
            self.imgList.splice(index, 1, result)
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
#momentDetail {
  width: 100%;
  height: 100%;
  background: #eee;
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
      width: 300px;
      height: 300px;
      background: white;
    }
    .close_button {
      width: 34px;
      height: 34px;
      cursor: pointer;
      position: absolute;
      top: 30px;
      right: 30px;
      background: url('../../assets/close.png') no-repeat;
      background-size: 34px 34px;
    }
  }
  .title {
    margin: 0 19px;
    padding: 10px 0;
    line-height: 30px;
    border-bottom: 1px solid #d6d6d6;
    text-align: center;
    font-size: 14px;
  }
  .release {
    width: 600px;
    margin: 0 auto;
    margin-top: 50px;
    .text_input {
      textarea {
        width: 100%;
        height: 180px;
        resize: none;
        overflow-y: hidden;
        outline: none;
        border: 0;
        background: #eee;
        padding: 0;
        font-size: 15px;
      }
    }
    .img_input {
      display: flex;
      margin-top: 20px;
      .upload {
        width: 140px;
        height: 140px;
        margin-right: 30px;
        cursor: pointer;
        position: relative;
        input {
          width: 140px;
          height: 140px;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          cursor: pointer;
        }
        img {
          cursor: pointer;
        }
      }
    }
    .release_button {
      width: 80px;
      height: 30px;
      margin-top: 30px;
      border-radius: 4px;
      text-align: center;
      line-height: 30px;
      font-size: 13px;
      color: white;
      cursor: pointer;
      background-color: #42ac3e;
    }
  }
  .default {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    padding-top: 100px;
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
  .moment {
    width: 100%;
    display: flex;
    padding-top: 70px;
    padding-left: 10px;
    .avatar {
      width: 60px;
      height: 60px;
      margin-top: 40px;
      margin-left: 40px;
      margin-right: 20px;
      border-radius: 4px;
      overflow: hidden;
    }
    .detail {
      width: 500px;
      .name {
        color: rgb(95, 104, 143);
        font-size: 20px;
        font-weight: 600;
        margin-top: 36px;
      }
      .content {
        font-size: 18px;
        color: black;
        margin-top: 10px;
      }
      .img_list {
        margin-top: 22px;
        display: flex;
        img {
          width: 140px;
          height: 140px;
          margin-right: 14px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
