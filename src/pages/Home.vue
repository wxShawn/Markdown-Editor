<template>
  <div class="home">
    <div class="topbar">
      <n-button quaternary size="tiny" @click="newMd()">新建</n-button>
      <n-button quaternary size="tiny" @click="upLoadMarkdown">导入</n-button>
      <n-button
        quaternary
        size="tiny"
        @click="downloadAsMarkdown"
        :disabled="!exportAble"
      >导出
      </n-button>
      <n-button quaternary size="tiny" @click="openFullScreenReview">全屏预览</n-button>
    </div>
    <div class="main">
      <div class="tabbar">
        <div
          v-for="(md,index) in mdList"
          :key="md"
          :class="'tab'+(index==currentMdIndex?' active':'')"
          @click="selectMd(index)"
        >
          <div>{{ md.title }}</div>
          <n-icon size="18" @click.stop="deleteMd(index)">
            <cancel-filled />
          </n-icon>
        </div>
      </div>
      <editor v-if="hasMd" :md="mdList[currentMdIndex]" @save="getNewMd" />
      <div class="saying" v-else><div>只有在人群中间，才能认识自己。</div></div>
    </div>
  </div>
</template>

<script>
import { NButton, NIcon } from 'naive-ui';
import { CancelFilled } from '@vicons/material';
import Editor from '../components/Editor.vue'

export default {
  components: {
    NButton,
    CancelFilled,
    NIcon,
    Editor
  },
  data() {
    return {
      mdList: [//文档列表
        {
          title: '欢迎使用 Markdown Editor.md',
          content: `# 欢迎使用 Markdown Editor
- 点击 \`新建\` 或 \`导入\` 开始编辑文档💻。
- 点击 \`导出\` 可导出 ***markdown*** 文件 。
- 点击 \`全屏预览\` 将会打开一个新的浏览器标签页用于单独显示预览（内容非实时更新），然后可使用浏览器的打印功能导出为 ***pdf*** 文件。`
        }
      ],
      currentMdIndex: 0,//当前文档序号
    }
  },

  methods: {
    //将序号为index的文档设为当前文档
    selectMd: function(index) {
      this.currentMdIndex = index;
    },

    //新建文档
    newMd: function(md) {
      if (!md) {
        md = {
          title: '标题.md',
          content: '# 标题'
        }
      }
      this.mdList.push(md);
      //选择当前文档
      this.selectMd(this.mdList.length - 1);
    },

    //删除序号为index的文档
    deleteMd: function(index) {
      this.mdList.splice(index, 1);
      if (index <= this.currentMdIndex && this.currentMdIndex > 0) {//如果删除的文档为当前文档(序号>0)或前面的文档，则当前文档序号-1
        this.selectMd(this.currentMdIndex - 1);
      } else if (index == this.currentMdIndex == 0) {//如果删除的文档为当前文档且序号为0，则当前文档序号+1
        this.selectMd(this.currentMdIndex + 1);
      }
    },
    
    //Editor组件保存时获取其上传的文档对象
    getNewMd: function(md) {
      this.mdList[this.currentMdIndex] = md;
    },
    
    //导入markdown文件
    upLoadMarkdown: function() {
      let $this = this;
      let link = document.createElement('input');
      link.setAttribute('type', 'file');
      link.setAttribute('accept', '.md,.txt');
      link.style.display = 'none';
      document.body.appendChild(link);
      //当上传的文件改变时触发change事件，读取文件
      link.addEventListener('change', function() {
        if (link.value != '') {
          let file = link.files[0];
          let reader = new FileReader();
          reader.readAsText(file, 'UTF-8');
          reader.onload = function(e) {
            $this.newMd({
              title: file.name,
              content: e.target.result
            });
            document.body.removeChild(link);
            console.log(`成功导入${file.name}`);
          }
        }
      });
      link.click();
    },

    //导出markdown文件
    downloadAsMarkdown: function() {
      let link = document.createElement('a');
      link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.mdList[this.currentMdIndex].content));
      link.setAttribute('download', this.mdList[this.currentMdIndex].title);
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    //打开全屏预览
    openFullScreenReview: function() {
      let { href } = this.$router.resolve({
        path: '/previewFullScreen'
      });
      window.open(href, '_blank');
    },
  },

  computed: {
    //检测mdList是否有文档 (用于判断是否显示editor)
    hasMd: function() {
      return this.mdList.length == 0 ? false : true;
    },

    //是否可导出
    exportAble: function() {
      //列表中没有文档时返回false，不可导出
      return this.mdList.length > 0;
    }
  },
}
</script>

<style>
.home {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.topbar {
  padding: 0 10px;
  flex: 0 0 30px;
  display: flex;
  justify-content: left;
  align-items: center;
  background: #ccc;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 0;
  background: #fefefe;
}
.tabbar {
  flex: 0 0 36px;
  display: flex;
  flex-direction: row;
  background: #ddd;
  box-shadow: 2px 0 2px #aaa;
  z-index: 999;
}
.tabbar > .tab {
  position: relative;
  width: 130px;
  height: 100%;
  background: #d5d5d5;
  text-align: center;
  line-height: 36px;
  color: #575e55;
  cursor: pointer;
  user-select: none;
}
.tabbar > .tab.active {
  background: #eee;
  color: #83b56f;
}
.tabbar > .tab > div {
  margin-left: 16px;
  width: 100px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.tabbar > .tab > .n-icon {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}
.tabbar > .tab > .n-icon:hover {
  color: #555;
}
.editor {
  flex: 1;
  height: 0;
  background: #f9f9f9;
}
.saying {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
}
</style>