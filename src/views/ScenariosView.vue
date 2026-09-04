<script setup>
import { SCENARIOS } from '../data/scenarios.js'
import ScenarioCard from '../components/ScenarioCard.vue'
</script>

<template>
  <section class="scenarios">
    <ul class="scenario-list">
      <li v-for="scenario in SCENARIOS" :key="scenario.id">
        <ScenarioCard :scenario="scenario" />
      </li>
    </ul>

    <div class="expand-slot mono">
      <p>&gt; 扩展区域建设中：台风暴雨 / 地震 / 疫情居家（v0.3）</p>
    </div>
  </section>
</template>

<style scoped>
.scenario-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expand-slot {
  margin-top: 20px;
  border: 1px dashed var(--border);
  border-radius: var(--radius-card);
  padding: 12px;
}

.expand-slot p {
  margin: 0;
  font-size: var(--fs-12);
  color: var(--text-dim);
}
</style>
