<template>
  <div class="file-nav-bar" ref="fileNavBar">
    <transition-group name="sort">
      <div
        class="file"
        :class="{ active: index === selectedIndex }"
        :title="`${file.title}.md`"
        v-for="(file, index) in fileList"
        :key="file"
        @click="handleFileCLick(index)"
        @dragstart="handleDragStart(file)"
        @dragenter="handleDragEnter(file, $event)"
        @dragend="handleDragEnd"
        @dragover="handleDragOver"
      >
        <div class="file-title">{{ file.title }}.md</div>
        <svg
          v-show="index === selectedIndex"
          class="icon"
          aria-hidden="true"
          @click.stop="handleDeleteClick(index)"
        >
          <use xlink:href="#icon-closefill"></use>
        </svg>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { onMounted, ref, toRefs } from 'vue';
import '../assets/iconfont';

const props = defineProps({
  fileList: Array,
  selectedIndex: Number,
});
const { fileList, selectedIndex } = toRefs(props);

const emits = defineEmits(['select', 'delete']);

// 处理文件导航的点击
const handleFileCLick = (index) => {
  emits('select', index);
}

// 处理删除文件的点击
const handleDeleteClick = (index) => {
  const data = {
    newSelectedIndex: index,
    deleteIndex: index,
  }
  if (index === fileList.value.length - 1) {
    data.newSelectedIndex = index - 1;
  }
  emits('delete', data);
}

/**
 * ********** DOM交互 **********
 */

const fileNavBar = ref(null);

/**
 * 鼠标滚轮控制横向滚动
 */
onMounted(() => {
  // 滚动距离
  let scrollDistance = 0;
  // 定时器
  let timer = null;
  // 监听鼠标滚动
  fileNavBar.value.addEventListener('wheel', (e) => {
    // 最大滚动距离
    let maxDistance = fileNavBar.value.scrollWidth - fileNavBar.value.offsetWidth;
    if (scrollDistance + e.deltaY < 0) {
      scrollDistance = 0;
    } else if (scrollDistance + e.deltaY > maxDistance) {
      scrollDistance = maxDistance;
    } else {
      scrollDistance += e.deltaY;
    }
    // 清除延时器，使滚动更顺滑
    clearTimeout(timer);
    timer = setTimeout(() => {
      fileNavBar.value.scrollLeft = scrollDistance;
    }, 50);
  });
});

/**
 * 拖拽排序
 */
let dragFile = null;
let targetFile = null;

const handleDragStart = (file) => {
  dragFile = file;
}

const handleDragEnter = (file, e) => {
  if (e.target === e.currentTarget) {
    targetFile = file;
  }
}

const handleDragEnd = () => {
  const dragIndex = fileList.value.indexOf(dragFile);
  const targetIndex = fileList.value.indexOf(targetFile);
  fileList.value.splice(dragIndex, 1);
  fileList.value.splice(targetIndex, 0, dragFile);
  emits('select', targetIndex);
}

const handleDragOver = (e) => {
  e.dataTransfer.dropEffect = 'move';
  e.preventDefault();
}

</script>

<style scoped>
/* 1. 声明过渡效果 */
.sort-move,
.sort-enter-active,
.sort-leave-active {
  transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. 声明进入和离开的状态 */
.sort-enter-from,
.sort-leave-to {
  opacity: 0;
  transform: translate(0, -60px);
}

/* 3. 确保离开的项目被移除出了布局流
      以便正确地计算移动时的动画效果。 */
.sort-leave-active {
  position: absolute !important;
  display: none;
}

.file-nav-bar {
  position: relative;
  display: flex;
  height: 35px;
  background: #ddd;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  box-shadow: 2px 0 2px #aaa;
}

.file-nav-bar::-webkit-scrollbar {
  height: 2px;
}

.file-nav-bar::-webkit-scrollbar-thumb {
  background: #aaa;
}

.file {
  position: relative;
  padding: 0 30px 0 10px;
  background: #e5e5e5;
  border-left: 1px solid #ddd;
  font-size: 14px;
  color: #888;
  line-height: 35px;
  text-align: center;
  cursor: pointer;
  user-select: none;
  -webkit-user-drag: element;
}

.file.active {
  background: #f5f5f5;
}

.file-title {
  min-width: 80px;
  max-width: 180px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.icon {
  position: absolute;
  top: 50%;
  right: 5px;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}

.icon:hover {
  color: #555;
}

</style>