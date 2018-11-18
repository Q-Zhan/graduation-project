export default {
  // startLoading(state) {
  //   state.isLoading = true
  // }
  getToken(state, { token }) {
    state.user.token = token;
  }
}
