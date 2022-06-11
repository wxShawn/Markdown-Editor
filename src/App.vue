<template>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App',
  components: {
    
  },

  mounted() {
    //屏蔽s键，防止误操作ctrl+s保存网页
    document.onkeydown = function (e) {
      if (e.ctrlKey && e.key == 's') return false;
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
