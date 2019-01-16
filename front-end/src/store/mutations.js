export default {
  // startLoading(state) {
  //   state.isLoading = true
  // }
  setToken(state, { token }) {
    state.user.token = token;
  },
  setUserInfo(state, { info }) {
    state.user.info = info;
  },
  setSocket(state, { socket }) {
    state.socket = socket;
  }
}
