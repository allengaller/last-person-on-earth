import { onBeforeUnmount, ref, watch } from 'vue'

// 数字滚动（rAF 缓动，reduced-motion 直接呈现终态）
export function useTweened(source, duration = 350) {
  const display = ref(Number(source.value) || 0)
  let rafId = null

  watch(source, (target) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      display.value = target
      return
    }
    cancelAnimationFrame(rafId)
    const from = display.value
    const start = performance.now()
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      display.value = Math.round(from + (target - from) * (1 - Math.pow(1 - t, 3)))
      if (t < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
  })

  onBeforeUnmount(() => cancelAnimationFrame(rafId))
  return display
}
