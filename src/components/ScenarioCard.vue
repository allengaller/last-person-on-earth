<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user.js'

const props = defineProps({
  scenario: { type: Object, required: true },
})

const store = useUserStore()

const colorVar = computed(() => `var(--${props.scenario.color})`)
const stats = computed(() => store.scenarioStatsById[props.scenario.id])
const ratePct = computed(() => Math.round((stats.value?.rate ?? 0) * 100))
</script>

<template>
  <RouterLink :to="`/scenarios/${scenario.id}`" class="scenario-card">
    <span class="color-band" :style="{ background: colorVar }" aria-hidden="true"></span>
    <span class="card-body">
      <span class="card-head">
        <span class="scenario-name">{{ scenario.name }}</span>
        <span class="risk mono" :style="{ color: colorVar }">[RISK: {{ scenario.riskLevel }}]</span>
      </span>
      <span class="scenario-summary">{{ scenario.summary }}</span>
      <span class="mini-progress" aria-hidden="true">
        <span class="mini-fill" :style="{ width: `${ratePct}%`, background: colorVar }"></span>
      </span>
      <span class="mini-label mono">场景准备度 {{ ratePct }}%</span>
    </span>
  </RouterLink>
</template>

<style scoped>
.scenario-card {
  display: flex;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease;
}

.scenario-card:active {
  border-color: var(--border-strong);
}

.color-band {
  flex: none;
  width: 4px;
}

.card-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
}

.card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.scenario-name {
  font-size: var(--fs-17);
  font-weight: 600;
  color: var(--text);
}

.risk {
  flex: none;
  font-size: 11px;
}

.scenario-summary {
  font-size: var(--fs-13);
  color: var(--text-dim);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.mini-progress {
  display: block;
  height: 6px;
  margin-top: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  overflow: hidden;
}

.mini-fill {
  display: block;
  height: 100%;
  transition: width 0.3s ease;
}

.mini-label {
  font-size: 11px;
  color: var(--text-dim);
}
</style>
