import Vue from 'vue'

export default {
  // user
  setToken(state, { token }) {
    state.user.token = token;
  },
  setUserInfo(state, { info }) {
    state.user.info = info;
  },
  modifyInfo(state, { name, area, sign, gender, avatar }) {
    state.user.info = Object.assign(state.user.info, { name, area, sign, gender, avatar })
  },

  // socket
  setSocket(state, { socket }) {
    state.socket = socket;
  },

  // friend
  setFriendList(state, { friendList }) {
    state.friend.friendList = friendList;
  },
  addFriend(state, { friend }) {
    state.friend.friendList.push(friend);
  },
  deleteFriend(state, { index }) {
    // 删除好友
    state.friend.friendList.splice(index, 1);
  },
  addApplyFriend(state, { applyFriend }) {
    state.friend.applyFriend.push(applyFriend);
  },
  setApplyFriend(state, { applyFriend }) {
    state.friend.applyFriend = applyFriend;
  },
  deleteApplyFriend(state, { index }) {
    let arr = state.friend.applyFriend.slice(0);
    arr.splice(index, 1);
    state.friend.applyFriend = arr;
  },
  setIsSelectingGroup(state, { status }) {
    state.friend.isSelectingGroup = status;
  },
  addGroup(state, { groupId, groupName, member, chatMsg}) {
    state.friend.groupList.push({ groupId, groupName, member, chatMsg});
  },
  setGroupList(state, { groupList}) {
    state.friend.groupList = groupList;
  },
  deleteGroup(state, { index }) {
    // 删除好友
    state.friend.groupList.splice(index, 1);
  },
  deleteMember(state, { groupId, userId }) {
    const chatList = state.chat.chatList;
    const groupList = state.friend.groupList;
    // 删除chatList中的指定member
    const chatIndex = chatList.findIndex(element => {
      return element.groupId == groupId;
    });
    if (chatIndex != -1) {
      const chatMember = chatList[chatIndex].member;
      const memberIndex = chatMember.findIndex(element => {
        return element.userID == userId;
      })
      if (memberIndex != -1) {
        state.chat.chatList[chatIndex].member.splice(memberIndex, 1);
      }
    }
    // 删除groupList中的指定member
    const groupIndex = groupList.findIndex(element => {
      return element.groupId == groupId;
    });
    if (groupIndex != -1) {
      const groupMember = groupList[groupIndex].member;
      const memberIndex = groupMember.findIndex(element => {
        return element.userID == userId;
      })
      if (memberIndex != -1) {
        state.friend.groupList[groupIndex].member.splice(memberIndex, 1);
      }
    }
  },

  // chat
  setChatList(state, { chatList }) {
    state.chat.chatList = chatList
  },
  topChat(state, { index }) {
    // 将index项移至第一项
    const item = state.chat.chatList[index];
    state.chat.chatList.splice(index, 1);
    state.chat.chatList.unshift(item);
  },
  addChat(state, { item }) {
    // user和group共用
    const newItem = Object.assign({}, item)
    Vue.set(newItem, 'chatMsg', item.chatMsg);
    state.chat.chatList.unshift(newItem);
  },
  addChatUnread(state, { index }) {
    const chat = state.chat.chatList[index];
    chat.unreadNum = chat.unreadNum ? chat.unreadNum + 1 : 1;
  },
  setChatUnread(state, { index, value }) {
    const chat = state.chat.chatList[index];
    Vue.set(chat, 'unreadNum', value);
  },
  updateChatListIndex(state, { index }) {
    state.chat.chatListIndex = index;
  },
  deleteChat(state, { index }) {
    state.chat.chatList.splice(index, 1);
  },
  addChatMessage(state, { index, item}) {
    state.chat.chatList[index].chatMsg.push(item);
  },
  setScrollHeight(state, { value, index }) {
    state.chat.chatList[index].scrollHeight = value;
  },

  // moment
  showCreateMoment(state, { }) {
    state.moment.isDetailShow = false;
    state.moment.isCreateShow = true;
  },
  showMomentDetail(state, {}) {
    state.moment.isDetailShow = true;
    state.moment.isCreateShow = false;
  },
  addMoment(state, { item }) {
    const arr = state.moment.momentList.slice(0);
    arr.unshift(item);
    state.moment.momentList = arr;
  },
  setMomentList(state, { momentList}) {
    state.moment.momentList = momentList;
  },
  updateMomentIndex(state, { index }) {
    state.moment.momentIndex = index;
  }

}
