<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'

const props = defineProps({
  values: { type: Array, required: true }, // 0..1，六维
  labels: { type: Array, default: () => [] },
  size: { type: Number, default: 200 },
})

const hasLabels = computed(() => props.labels.length > 0)
const pad = computed(() => (hasLabels.value ? Math.max(26, props.size * 0.16) : 6))
const cx = computed(() => props.size / 2)
const cy = computed(() => props.size / 2)
const radius = computed(() => props.size / 2 - pad.value)

function angle(i) {
  return ((-90 + i * (360 / props.values.length)) * Math.PI) / 180
}

function pointAt(i, ratio) {
  const a = angle(i)
  return {
    x: cx.value + radius.value * ratio * Math.cos(a),
    y: cy.value + radius.value * ratio * Math.sin(a),
  }
}

const rings = [0.25, 0.5, 0.75, 1]

const ringPolys = computed(() =>
  rings.map((r) =>
    props.values.map((_, i) => {
      const p = pointAt(i, r)
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    }).join(' '),
  ),
)

const axisLines = computed(() =>
  props.values.map((_, i) => {
    const p = pointAt(i, 1)
    return { x1: cx.value, y1: cy.value, x2: p.x, y2: p.y }
  }),
)

const displayed = ref(props.values.map(() => 0))
let rafId = null

watch(
  () => props.values,
  (target) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayed.value = target.slice()
      return
    }
    cancelAnimationFrame(rafId)
    const from = displayed.value.slice()
    const start = performance.now()
    const duration = 400
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      displayed.value = target.map((v, i) => (from[i] ?? 0) + (v - (from[i] ?? 0)) * ease)
      if (t < 1) rafId = requestAnimationFrame(step)
    }
    rafId = requestAnimationFrame(step)
  },
  { immediate: true },
)

onBeforeUnmount(() => cancelAnimationFrame(rafId))

const dataPoints = computed(() =>
  displayed.value.map((v, i) => {
    const p = pointAt(i, Math.min(Math.max(v, 0.02), 1))
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' '),
)

const dataVertices = computed(() =>
  displayed.value.map((v, i) => pointAt(i, Math.min(Math.max(v, 0.02), 1))),
)

const labelPositions = computed(() =>
  props.labels.map((label, i) => {
    const p = pointAt(i, 1)
    const a = angle(i)
    const lx = p.x + 10 * Math.cos(a)
    const ly = p.y + 10 * Math.sin(a)
    const anchor = Math.abs(Math.cos(a)) < 0.3 ? 'middle' : Math.cos(a) > 0 ? 'start' : 'end'
    return { label, lx, ly, anchor }
  }),
)
</script>

<template>
  <svg
    class="radar"
    :width="size"
    :height="size"
    :viewBox="`0 0 ${size} ${size}`"
    role="img"
    aria-label="准备度雷达图"
  >
    <polygon
      v-for="(poly, i) in ringPolys"
      :key="`ring-${i}`"
      :points="poly"
      fill="none"
      :stroke="i === rings.length - 1 ? 'var(--border-strong)' : 'var(--border)'"
      stroke-width="1"
    />
    <line
      v-for="(line, i) in axisLines"
      :key="`axis-${i}`"
      :x1="line.x1"
      :y1="line.y1"
      :x2="line.x2"
      :y2="line.y2"
      stroke="var(--border)"
      stroke-width="1"
    />
    <polygon :points="dataPoints" fill="#8FBE4F" fill-opacity="0.08" stroke="var(--rad)" stroke-width="1.5" />
    <circle
      v-for="(v, i) in dataVertices"
      :key="`dot-${i}`"
      :cx="v.x"
      :cy="v.y"
      r="2"
      fill="var(--rad)"
    />
    <template v-if="hasLabels">
      <text
        v-for="(l, i) in labelPositions"
        :key="`label-${i}`"
        :x="l.lx"
        :y="l.ly"
        :text-anchor="l.anchor"
        dominant-baseline="middle"
        class="radar-label"
      >{{ l.label }}</text>
    </template>
  </svg>
</template>

<style scoped>
.radar {
  display: block;
}

.radar-label {
  font-family: var(--font-body);
  font-size: 11px;
  fill: var(--text-dim);
}
</style>
