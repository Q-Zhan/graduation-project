export default {
  setToken(state, { token }) {
    state.user.token = token;
  },
  setUserInfo(state, { info }) {
    state.user.info = info;
  },
  setSocket(state, { socket }) {
    state.socket = socket;
  },
  setFriendList(state, { friendList }) {
    state.friend.friendList = friendList;
  },
  setFriendDetail(state, { friendDetail }) {
    state.friend.detail = friendDetail;
  },
  addApplyFriend(state, { applyFriend }) {
    state.friend.applyFriend.push(applyFriend);
  }
}
