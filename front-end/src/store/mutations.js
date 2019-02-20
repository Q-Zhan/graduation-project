import Vue from 'vue'

export default {
  // user
  setToken(state, { token }) {
    state.user.token = token;
  },
  setUserInfo(state, { info }) {
    state.user.info = info;
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
  addChat(state, { friend }) {
    const friendItem = Object.assign({}, friend)
    Vue.set(friendItem, 'chatMsg', friend.chatMsg);
    state.chat.chatList.unshift(friendItem);
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

}
