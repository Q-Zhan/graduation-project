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
    state.user.friendList = friendList;
  },
}
