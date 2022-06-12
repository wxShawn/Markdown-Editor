<template>
  <div class="markdown-body" v-html="mdHtml"></div>
</template>

<script>
import "github-markdown-css/github-markdown.css"
import 'highlight.js/styles/default.css'

export default {
  data() {
    return  {
      mdHtml: localStorage.getItem('mdHtml'),
    }
  },

  mounted() {
    document.title = localStorage.getItem('mdTitle');
    window.print();
    //确认打印或取消打印时关闭当前窗口
    window.onafterprint = () => {
      window.close();
    };
  }
}
</script>

<style>
.markdown-body {
  width: 1000px;
  margin: 30px auto 0;
}
</style>