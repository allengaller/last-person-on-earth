<script setup>
import { computed, ref, watch } from 'vue'
import { useTweened } from '../composables/useTweened.js'

const props = defineProps({
  value: { type: Number, required: true }, // 0..1 防护完整度
})

const CX = 100
const CY = 96
const R = 76
const NEEDLE_LEN = 62

const tweened = useTweened(computed(() => Math.round(props.value * 100)), 600)

const status = computed(() => {
  const v = props.value
  if (v >= 1) return { color: 'var(--rad)', text: '[完成] 防护体系达标' }
  if (v >= 0.6) return { color: 'var(--rad)', text: '[良好] 关键防护就位' }
  if (v > 0) return { color: 'var(--warning)', text: '[部分] 基础遮蔽就位' }
  return { color: 'var(--alert)', text: '[危险] 遮蔽防护不足' }
})

const litCount = computed(() => Math.round(props.value * 12))

function pointAt(t, r) {
  const rad = ((-90 + t * 180) * Math.PI) / 180
  return { x: CX + r * Math.sin(rad), y: CY - r * Math.cos(rad) }
}

function arcPath(t0, t1, r) {
  const p0 = pointAt(t0, r)
  const p1 = pointAt(t1, r)
  return `M ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${r} ${r} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)}`
}

const zones = [
  { from: 0, to: 0.25, cls: 'zone-alert' },
  { from: 0.25, to: 0.6, cls: 'zone-warning' },
  { from: 0.6, to: 1, cls: 'zone-rad' },
].map((z) => ({ d: arcPath(z.from, z.to, R), cls: z.cls }))

const ticks = Array.from({ length: 11 }, (_, i) => {
  const t = i / 10
  const major = i % 5 === 0
  const outer = pointAt(t, major ? 64 : 62)
  const inner = pointAt(t, 56)
  return { ...outer, x2: inner.x, y2: inner.y, major }
})

const needle = computed(() => {
  const p = pointAt(tweened.value / 100, NEEDLE_LEN)
  return { x: p.x, y: p.y }
})

const justFull = ref(false)
let glitchTimer = null
watch(
  () => props.value,
  (v) => {
    if (v >= 1) {
      justFull.value = true
      clearTimeout(glitchTimer)
      glitchTimer = setTimeout(() => (justFull.value = false), 300)
    }
  },
)
</script>

<template>
  <div class="gauge-shell" :class="{ 'is-glitching': justFull }">
    <span class="gauge-title mono">SHELTER INTEGRITY METER</span>

    <svg class="gauge-svg" viewBox="0 0 200 106" aria-hidden="true">
      <path v-for="z in zones" :key="z.cls" :d="z.d" class="zone" :class="z.cls" />
      <line
        v-for="(t, i) in ticks"
        :key="i"
        :x1="t.x" :y1="t.y" :x2="t.x2" :y2="t.y2"
        class="tick"
        :class="{ 'tick-major': t.major }"
      />
      <line :x1="CX" :y1="CY" :x2="needle.x" :y2="needle.y" class="needle" />
      <circle :cx="CX" :cy="CY" r="5" class="pivot" />
    </svg>

    <div class="readout">
      <span class="readout-num mono" :style="{ color: status.color }">
        {{ String(tweened).padStart(3, '0') }}<span class="readout-unit">%</span>
      </span>
      <span class="readout-status mono" :style="{ color: status.color }">{{ status.text }}</span>
    </div>

    <div class="led-row" aria-hidden="true">
      <span
        v-for="i in 12"
        :key="i"
        class="led"
        :class="{ 'is-lit': i <= litCount, 'is-last': i === litCount && litCount > 0 }"
        :style="{ '--led': status.color }"
      />
    </div>

    <p class="gauge-note mono">&gt; 读数由物资入库推算 · 非真实辐射剂量</p>
  </div>
</template>

<style scoped>
.gauge-shell {
  border: 1px solid var(--border-strong);
  background: var(--bg-panel);
  border-radius: var(--radius-card);
  padding: 14px 14px 12px;
  display: grid;
  justify-items: center;
  gap: 6px;
}

.gauge-title {
  align-self: flex-start;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--text-dim);
}

.gauge-svg {
  width: 200px;
  height: 106px;
}

.zone {
  fill: none;
  stroke-width: 6;
}

.zone-alert { stroke: var(--alert); opacity: 0.75; }
.zone-warning { stroke: var(--warning); opacity: 0.75; }
.zone-rad { stroke: var(--rad); opacity: 0.75; }

.tick {
  stroke: var(--text-dim);
  stroke-width: 1;
}

.tick-major {
  stroke: var(--text);
  stroke-width: 1.5;
}

.needle {
  stroke: var(--text);
  stroke-width: 2.5;
  stroke-linecap: square;
}

.pivot {
  fill: var(--bg);
  stroke: var(--text);
  stroke-width: 1.5;
}

.readout {
  display: grid;
  justify-items: center;
  gap: 2px;
}

.readout-num {
  font-size: var(--fs-28);
  line-height: 1.1;
  font-weight: 700;
}

.readout-unit {
  font-size: var(--fs-15);
  margin-left: 2px;
}

.readout-status {
  font-size: var(--fs-12);
}

.led-row {
  display: flex;
  gap: 5px;
}

.led {
  width: 10px;
  height: 6px;
  border: 1px solid var(--border-strong);
  background: transparent;
}

.led.is-lit {
  background: var(--led);
  border-color: var(--led);
}

@media (prefers-reduced-motion: no-preference) {
  .led.is-last {
    animation: led-blink 0.6s steps(2, end) infinite;
  }

  @keyframes led-blink {
    50% { opacity: 0.2; }
  }
}

.gauge-note {
  font-size: 10px;
  color: var(--text-dim);
  margin: 2px 0 0;
}
</style>
