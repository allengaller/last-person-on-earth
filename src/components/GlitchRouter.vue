<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const glitching = ref(false)
let timer = null

watch(
  () => route.path,
  () => {
    glitching.value = false
    requestAnimationFrame(() => {
      glitching.value = true
      clearTimeout(timer)
      timer = setTimeout(() => (glitching.value = false), 300)
    })
  },
)
</script>

<template>
  <div class="glitch-wrap" :class="{ 'is-glitching': glitching }">
    <router-view />
  </div>
</template>
