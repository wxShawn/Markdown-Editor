<template>
  <div class="editor">
    <div class="source">
      <textarea
        v-model="mdText"
        @input="emitMd"
      >
      </textarea>
    </div>
    <div class="resize"></div>
    <div class="review">
      <div class="markdown-body" v-html="mdHtml.html"></div>
    </div>
  </div>
</template>

<script>
import "github-markdown-css/github-markdown.css"
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
const opts = {
  level: 1,//默认1，按级别查找标题，使用0取第一个出现的标题
  excerpt: 0,//默认0，提取段落用于页面摘录
}
const md = require('markdown-it')({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {
        console.log(false);
      }
    }

    return ''; // 使用额外的默认转义
  }
}).use(require('markdown-it-title'), opts);//使用提取标题的markdown-it插件

export default {
  props: [
    'md',
  ],

  data() {
    return {
      mdText: '',
    }
  },

  methods: {
    //拖拽改变div大小
    dragControllerDiv: function() {
      let editor = document.getElementsByClassName('editor')[0]
      let resize = document.getElementsByClassName('resize')[0];
      let leftDiv = document.getElementsByClassName('source')[0];
      resize.onmousedown = function() {
        document.onmousemove = function(e) {
          let moveLen = 0;
          moveLen = e.clientX < 400 ? 400 : e.clientX;//设置左侧最小宽度
          moveLen = e.clientX > editor.clientWidth - 400 ? editor.clientWidth - 400 : moveLen;//设置右侧最小宽度
          leftDiv.style.flex = `0 0 ${moveLen}px`;
        }

        document.onmouseup = function() {
          document.onmousemove = null;
          document.onmouseup = null;
        }
      }
    },

    //上传md至父组件
    emitMd: function() {
      let md = {
        //如果mdHtml没有解析出标题则使用最近一个有效标题
        title: this.mdHtml.env.title ? this.mdHtml.env.title + '.md' : this.md.title,
        content: this.mdText
      }
      this.$emit('save', md);
    }
  },

  mounted() {
    //拖拽改变div大小
    this.dragControllerDiv();

    //将父组件的md.content赋值给mdText
    this.mdText = this.md.content;

    //将解析完成的文档和标题暂存在localStorage中，用于全屏预览
    localStorage.setItem('mdHtml', this.mdHtml.html);
    localStorage.setItem('mdTitle', this.mdHtml.env.title ? this.mdHtml.env.title + '.md' : this.md.title);
  },

  watch: {
    //监听md的变化
    md: function() {
      //将父组件的md.content赋值给mdText
      this.mdText = this.md.content;

      //将解析完成的文档暂存在localStorage中，用于全屏预览
      localStorage.setItem('mdHtml', this.mdHtml.html);
      localStorage.setItem('mdTitle', this.mdHtml.env.title ? this.mdHtml.env.title + '.md' : this.md.title);
    }
  },

  computed: {
    //解析md
    mdHtml() {
      let env = {};
      let mdHtml = md.render(this.mdText, env);
      return {
        html: mdHtml,//全文
        env: env,//包含标题（env.title）、摘录(env.excerpt[x])
      };
    },
  }
}
</script>

<style>
.editor {
  display: flex;
  flex-direction: row;
}
.source {
  flex: 0 0 50%;
}
.source > textarea {
  padding: 10px;
  width: 100%;
  height: calc(100% - 6px);
  box-sizing: border-box;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-family: '华文细黑';
  resize: none;
  background: #f9f9f9;
}
.resize {
  flex: 0 0 5px;
  background: #ddd;
  user-select: none;
  cursor: col-resize;
}
.resize:hover {
  background: #ccc;
}
.review {
  flex: 1;
  overflow-y: scroll;
}
.review > .markdown-body {
  padding: 20px;
  min-height: 100%;
  box-sizing: border-box;
}
</style>