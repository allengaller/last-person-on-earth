<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const emit = defineEmits(['done'])

const LINES = ['> 启动生存终端…', '> 加载物资数据库 [OK]', '> 校验准备度… [OK]']

const lines = ref([])
const leaving = ref(false)
let timers = []

function finish() {
  if (leaving.value) return
  leaving.value = true
  timers.push(setTimeout(() => emit('done'), 350))
}

onMounted(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
    emit('done')
    return
  }
  LINES.forEach((line, i) => {
    timers.push(setTimeout(() => (lines.value = LINES.slice(0, i + 1)), 250 + i * 300))
  })
  timers.push(setTimeout(finish, 1200))
})

onUnmounted(() => timers.forEach(clearTimeout))
</script>

<template>
  <div class="boot" :class="{ 'boot-leaving': leaving }" role="status" @click="finish">
    <div class="sweep">
      <div class="sweep-beam"></div>
      <span class="mono boot-tag">SURVIVAL TERMINAL v0.1</span>
    </div>
    <div class="boot-lines mono">
      <p v-for="line in lines" :key="line" class="boot-line">{{ line }}</p>
      <span v-if="!leaving" class="caret"></span>
    </div>
    <span class="mono boot-skip">点击任意处跳过</span>
  </div>
</template>

<style scoped>
.boot {
  position: fixed;
  inset: 0;
  z-index: 300;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  cursor: pointer;
}

.sweep {
  position: relative;
  width: 140px;
  height: 140px;
  border: 1px solid var(--rad);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sweep::before,
.sweep::after {
  content: '';
  position: absolute;
  background: var(--rad-dim);
}

.sweep::before {
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
}

.sweep::after {
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
}

.sweep-beam {
  position: absolute;
  inset: 0;
  background: conic-gradient(from 0deg, transparent 0 300deg, rgba(143, 190, 79, 0.4) 360deg);
  animation: radar-spin 1.2s linear 1 both;
}

.boot-tag {
  position: relative;
  z-index: 1;
  color: var(--rad);
  font-size: var(--fs-12);
  letter-spacing: 0.15em;
  background: var(--bg);
  padding: 2px 6px;
  white-space: nowrap;
}

.boot-lines {
  min-height: 66px;
  display: grid;
  align-content: start;
  gap: 6px;
  font-size: var(--fs-13);
  color: var(--text-dim);
}

.boot-line {
  margin: 0;
}

.boot-line:last-child {
  color: var(--rad);
}

.boot-skip {
  position: absolute;
  bottom: calc(var(--tabbar-h) + 24px);
  color: var(--text-dim);
  font-size: var(--fs-12);
  opacity: 0.6;
}
</style>
