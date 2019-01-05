<template>
  <div id="panel">
    <div class="user_info">
      <div class="avatar"><img src="../../../../assets/avatar.jpg"/></div>
      <div class="name">Z.</div>
      <i class="select"></i>
    </div>
    <div class="search_bar">
      <input class="search_input" placeholder="搜索"/>
    </div>
    <div class="tab">
      <div class="tab_item">
        <i class="chat_not_choose" v-show="false"></i>
        <i class="chat_choose"></i>
      </div>
      <div class="tab_item">
        <i class="public_not_choose"></i>
        <i class="public_choose" v-show="false"></i>
      </div>
      <div class="tab_item">
        <i class="friend_not_choose"></i>
        <i class="friend_choose" v-show="false"></i>
      </div>
    </div>
    <router-view name="list"></router-view>
  </div>
</template>

<script>


export default {
  data () {
    return {
      lists: [1,2,2,2,3,23,2,32,3,23,123]
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


#panel {
  display: inline-block;
  width: 100%;
  height: 100%;
  background: #2E3238;
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
      background: url('../../../../assets/icons.png');
      background-position: -434px -398px;
      background-size: 487px 462px;
      cursor: pointer;
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
      background: url('../../../../assets/icons.png');
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
      i {
        width: 35px;
        height: 35px;
        background: url('../../../../assets/icons.png');
        background-size: 487px 462px;
      }
      .chat_choose {
        background-position: -185px -96px;
      }
      .chat_not_choose {
        background-position: -150px -96px;
      }
      .public_choose {
        background-position: -304px -281px;
      }
      .public_not_choose {
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
}
</style>
