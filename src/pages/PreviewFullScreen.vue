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
  }
}
</script>

<style>
.markdown-body {
  width: 1000px;
  margin: 30px auto 0;
}
</style>