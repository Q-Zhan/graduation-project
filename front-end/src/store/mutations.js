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
  delteFriend(state, { index }) {
    let arr = state.friend.friendList.slice(0);
    arr.splice(index, 1);
    state.friend.friendList = arr;
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
  addChat(state, { friend }) {
    state.chat.chatList.unshift(friend);
  }
}
