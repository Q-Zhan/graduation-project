<template>
  <div id="friendList">
    friendList
  </div>
</template>

<script>
import { RESPONCE_CODE } from '../../constant';

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
#friendList {
    color: white;
}
</style>
