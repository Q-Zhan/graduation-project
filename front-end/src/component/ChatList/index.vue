<template>
  <div id="chatList">
    chatList
  </div>
</template>

<script>
import { responceCode } from '../../constant';

export default {
  data() {
    return {
      userInfo: {
        account: "",
        password: "",
        mail: ''
      },
      isVerified: false
    };
  },
  computed: {

  },
  mounted() {

  },
  methods: {
   
  }
};
</script>

<style lang="scss" scoped>
#chatList {
    color: white;
}
</style>
