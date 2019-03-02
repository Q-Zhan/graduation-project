<template>
  <div id="friendList">
    <div class="title" v-show="applyFriend.length > 0">好友请求</div>
    <div class="apply item" v-for="(item, index) in applyFriend" :key="index">
      <div class="avatar">
        <img :src="item.avatar || defaultAvatar"/>
      </div>
      <div class="name">{{ item.name }}</div>
      <div class="accept button" @click="handleApply(item, index, ACTION_TYPE.ACCEPT)">接受</div>
      <div class="refuse button" @click="handleApply(item, index, ACTION_TYPE.REFUSE)">拒绝</div>
    </div>

    <div class="title">群组</div>
    <div class="item" v-for="(item, index) in groupList" :key="item.groupId" @click="pushRouter(`/home/friend?index=${index}&type=group`)">
      <div class="avatar">
        <img :src="defaultGroupAvatar"/>
      </div>
      <div class="name">{{ item.groupName }}</div>
    </div>

    <div class="title">
      <span>好友</span>
      <div class="group" v-if="isSelectingGroup">
        <div class="accept group_button" @click="createGroup">确定</div>
        <div class="refuse group_button" @click="cancelCreateGroup">取消</div>
      </div>
    </div>
    <div class="friend item" v-for="(item, index) in friendList" :key="item.userID" @click="pushRouter(`/home/friend?index=${index}&type=user`)">
      <div class="avatar">
        <img :src="item.avatar || defaultAvatar"/>
      </div>
      <div class="name">{{ item.name }}</div>
      <div class="select_button" v-if="isSelectingGroup"><input type="checkbox" @change="handleSelectChange(index, $event)"/></div>
    </div>
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

const ACTION_TYPE = {
  ACCEPT: 1,
  REFUSE: 0
}

export default {
  data() {
    return {
      defaultAvatar: require('../../assets/defaultAvatar.png'),
      defaultGroupAvatar: require('../../assets/group.png'),
      ACTION_TYPE,
      groupSelectedList: [], // 选中的index为true
    };
  },
  computed: {
    friendList() {
      return this.$store.state.friend.friendList;
    },
    groupList() {
      return this.$store.state.friend.groupList;
    },
    applyFriend() {
      return this.$store.state.friend.applyFriend;
    },
    isSelectingGroup() {
      return this.$store.state.friend.isSelectingGroup;
    },
    userInfo() {
      return this.$store.state.user.info;
    },
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
    },
    handleApply(item, index, action) {
      this.$store.dispatch('handleApply', { id: item.userID, action })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            this.$store.commit('deleteApplyFriend', { index: index });
            if (action == ACTION_TYPE.ACCEPT) {
              this.$store.commit('addFriend', { friend: item });
            }
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })
    },
    pushRouter(path) {
      this.$router.push(path);
    },
    handleSelectChange(index, e) {
      const checked = e.target.checked;
      this.groupSelectedList[index] = checked;
    },
    createGroup() {
      let member = [];
      member.push(this.userInfo);
      for (let i = 0; i < this.groupSelectedList.length; i++) {
        if (this.groupSelectedList[i]) {
          member.push(this.friendList[i]);
        }
      }
      this.$store.dispatch('createGroup', { member })
      .then(data => {
        switch(data.code) {
          case RESPONCE_CODE.unAuth:
            this.$message.error('登录状态失效');
            this.$router.push('/login');
            break;
          case RESPONCE_CODE.success:
            const groupItem = data.groupItem;
            const { groupId, groupName, member, chatMsg } = groupItem;
            // 取消选择
            this.$store.commit('setIsSelectingGroup', { status: false});
            // 添加group
            // this.$store.commit('addGroup', {groupId, groupName, member, chatMsg});
            break;
          default:
            this.$message.error('服务出错，请稍后重试');
        }
      })

    },
    cancelCreateGroup() {
      this.$store.commit('setIsSelectingGroup', { status: false});
    }
  }
};
</script>

<style lang="scss" scoped>
#friendList {
  overflow: auto;
  .title {
    font-size: 14px;
    background-color: #292d32;
    color: #787b87;
    padding: 2px 18px;
    overflow: hidden;
    position: relative;
    .group {
      position: absolute;
      right: 16px;
      top: 4px;
      display: flex;
      .group_button {
        width: 40px;
        height: 18px;
        border-radius: 4px;
        text-align: center;
        line-height: 18px;
        font-size: 12px;
        color: white;
        cursor: pointer;
      }
      .accept {
        background-color: #42ac3e;
      }
      .refuse {
        margin-left: 6px;
        background-color: rgb(239, 84, 89);
      }
    }
  }
  .item {
    display: flex;
    align-items: center;
    height: 30px;
    padding: 10px 18px 9px 18px;
    border-bottom: 1px solid #292c33;
    cursor: pointer;
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 2px;
      overflow: hidden;
      background-color: rgb(240,240,240);
    }
    .name {
      font-weight: 400;
      margin-left: 10px;
      color: white;
      line-height: 30px;
      font-size: 13px;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }
    .select_button {
      margin-left: 10px;
      input {
        width: 14px;
        height: 14px;
      }
    }
  }
  .apply {
    cursor: auto;
    .name {
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-wrap: normal;
    }
    .button {
      width: 40px;
      height: 24px;
      border-radius: 4px;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      color: white;
      cursor: pointer;
    }
    .accept {
      background-color: #42ac3e;
    }
    .refuse {
      margin-left: 6px;
      background-color: rgb(239, 84, 89);
    }
  }
}
</style>
