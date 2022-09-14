<template>
  <button class="btn"
    :disabled="disabled"
    @click="showOptions = !showOptions"
    @blur="showOptions = false"
  >{{ title }}
    <transition name="fade">
      <div class="btn-options" v-show="showOptions">
        <div v-for="op in options" @click="op.click()">{{ op.value }}</div>
      </div>
    </transition>
  </button>
</template>

<script setup>
import { ref, toRefs } from 'vue';

const props = defineProps({
  disabled: Boolean,
  title: String,
  options: Array,
});
const { disabled, title, options } = toRefs(props);

const showOptions = ref(false);
</script>

<style scoped>
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