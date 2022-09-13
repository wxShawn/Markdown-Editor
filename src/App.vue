<template>
  <div>
    <menu-bar
      class="no-print"
      :file-list="fileList"
      :selected-index="selectedIndex"
      @add="handleAdd"
    />
    <file-nav-bar
      class="no-print"
      :file-list="fileList"
      :selected-index="selectedIndex"
      @select="handleSelect"
      @delete="handleDelete"
    />
    <div class="editor">
      <markdown-editor
        v-show="fileList[selectedIndex]"
        :content="content"
        @dataChange="handleDataChange"
      />
      <div class="saying" v-show="!fileList[selectedIndex]"><div>只有在人群中间，才能认识自己。</div></div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue';
import MenuBar from './components/MenuBar.vue';
import FileNavBar from './components/FileNavBar.vue';
import MarkdownEditor from './components/MarkdownEditor';
import gMessage from './utils/globalMessage';

const fileList = reactive([]);
const selectedIndex = ref(0);

const content = computed(() => {
  const file = fileList[selectedIndex.value];
  return file ? file.content : '';
});

// 添加file
const handleAdd = (file) => {
  fileList.push(file);
  selectedIndex.value = fileList.length - 1;
}

// 选中file
const handleSelect = (index) => {
  selectedIndex.value = index;
}

// 删除file
const handleDelete = (data) => {
  const { newSelectedIndex, deleteIndex } = data;
  selectedIndex.value = newSelectedIndex;
  fileList.splice(deleteIndex, 1);
}

// 编辑器内容改变时触发
const handleDataChange = (data) => {
  const file = fileList[selectedIndex.value];
  if (file) {
    file.title = data.title;
    file.content = data.md;
    file.html = data.html;
  }
}

/**
 * ********** 本地存储 **********
 */

// 获取localStorage中的数据
const getData = () => {
  const fileListJson = localStorage.getItem('mdFileList');
  if (fileListJson && fileListJson !== '[]') {
    const data = JSON.parse(fileListJson);
    fileList.length = 0;
    fileList.push.apply(fileList, data);
    selectedIndex.value = Math.floor(localStorage.getItem('mdSelectedIndex'));
  } else {
    fileList.push({
      title: '欢迎使用 Markdown Editor',
      content: '# 欢迎使用 Markdown Editor\r\n- 点击 `新建` 或 `导入` 开始编辑文档💻。'
    });
    selectedIndex.value = 0;
  }
}
getData();

// 将数据保存在localStorage中
const saveData = () => {
  const fileListJson = JSON.stringify(fileList);
  localStorage.setItem('mdFileList', fileListJson);
  localStorage.setItem('mdSelectedIndex', selectedIndex.value);
}

// 页面关闭时保存
window.onbeforeunload = () => {
  saveData();
}

onMounted(() => {
  // 按下ctrl+s时保存
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key == 's') {
      saveData();
      gMessage.sucsses('保存成功');
      e.preventDefault();
    }
  });
})
</script>

<style scoped>
@media print {
  .no-print {
    display: none !important;
  }

  .editor {
    top: 0 !important;
  }
}

.editor {
  position: absolute;
  top: 65px;
  bottom: 0;
  left: 0;
  right: 0;
}

.saying {
  height: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #aaa;
}
</style>
