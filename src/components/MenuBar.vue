<template>
  <div class="menu-bar">
    <button class="btn" @click="handleAddClick">新建</button>
    <button class="btn" @click="handleImport">导入</button>
    <dropdown
      :disabled="!selectedFile"
      title="导出"
      :options="exportOptions"
    />
    <button class="btn" disabled>查看</button>
    <dropdown title="帮助" :options="helpOptions" />
  </div>
</template>

<script setup>
import { computed, reactive, ref, toRefs } from 'vue';
import Dropdown from './common/Dropdown.vue';

const props = defineProps({
  fileList: Array,
  selectedIndex: Number,
});
const { fileList, selectedIndex } = toRefs(props);
const emits = defineEmits(['add']);

// 添加file
const handleAddClick = () => {
  const file = {
    title: '新建文章.md',
    content: '# 新建文章'
  }
  emits('add', file);
}

// 导入file
const handleImport = () => {
  const link = document.createElement('input');
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
        const newfile = {
          title: file.name,
          content: e.target.result
        }
        emits('add', newfile);
        document.body.removeChild(link);
        console.log(`成功导入${file.name}`);
      }
    }
  });
  link.click();
}

// 当前选中file
const selectedFile = computed(() => {
  const file = fileList.value[selectedIndex.value];
  return file ? file : null;
});

/**
 * ********** 导出 **********
 */

 const exportOptions = [
  {
    value: '导出为 Markdown',
    click() {
      handleExportMarkdown();
    }
  },
  {
    value: '导出为 PDF',
    click() {
      handleExportPdf();
    }
  }
 ]

// 导出为markdown
const handleExportMarkdown = () => {
  const { title, content } = selectedFile.value;
  const link = document.createElement('a');
  link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
  link.setAttribute('download', title + '.md');
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// 导出为PDF
const handleExportPdf = () => {
  window.print();
}

/**
 * ********** 帮助 **********
 */
const helpOptions = reactive([
  {
    value: '使用说明',
    click() {
      openUsersManual()
    }
  },
  { 
    value: '关于', 
    click() {
      openAbout();
    }
  }
]);

// 打开关于页面
const openAbout = async () => {
  const about = await (await import('../doc/about')).default;
  emits('add', about);
}

// 打开使用说明页面
const openUsersManual = async () => {
  const usersManual = await (await import('../doc/usersManual')).default;
  emits('add', usersManual);
}
</script>

<style scoped>
.menu-bar {
  padding: 0 8px;
  display: flex;
  align-items: center;
  height: 30px;
  background: #ccc;
}

.btn {
  position: relative;
  border: none;
  background: none;
  font-size: 14px;
  color: #555;
  cursor: pointer;
}

.btn:disabled, .btn:disabled.btn:hover {
  background: none;
  border-radius: 0;
  color: #999;
  cursor: not-allowed;
}

.btn:hover, .btn:focus {
  background: rgba(0, 0, 0, .05);
  border-radius: 4px;
}

.btn-options {
  z-index: 999;
  position: absolute;
  top: 26px;
  left: 0;
  padding: 5px;
  background: #fff;
  border-radius: 6px;
  box-shadow: 1px 1px 8px #aaa;
  white-space: nowrap;
}

.btn-options > div {
  padding: 5px;
  border-radius: 5px;
  text-align: left;
}

.btn-options > div:hover {
  background: #eee;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>