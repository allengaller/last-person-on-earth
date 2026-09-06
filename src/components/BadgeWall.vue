<script setup>
import { computed } from 'vue'

const props = defineProps({
  badges: { type: Array, required: true },
})

const earnedCount = computed(() => props.badges.filter((b) => b.earned).length)
</script>

<template>
  <div class="badge-block">
    <h2 class="badge-title mono">&gt; 成就徽章墙 <span class="badge-count">{{ earnedCount }}/{{ badges.length }}</span></h2>
    <ul class="badge-grid">
      <li v-for="badge in badges" :key="badge.id" class="badge-cell" :class="badge.earned ? 'is-earned' : 'is-locked'">
        <span v-if="badge.earned" class="stamp-mark badge-mark">✓</span>
        <span class="badge-name mono">{{ badge.earned ? badge.name : '？？？？' }}</span>
        <span class="badge-desc">{{ badge.desc }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.badge-block {
  margin-top: 20px;
}

.badge-title {
  margin: 0 0 10px;
  font-size: var(--fs-13);
  font-weight: 400;
  color: var(--text-dim);
}

.badge-count {
  color: var(--rad);
}

.badge-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.badge-cell {
  position: relative;
  min-height: 44px;
  padding: 8px 10px 8px 26px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border: 1px solid var(--border);
  background: var(--bg-panel);
}

.badge-cell.is-earned {
  border-color: var(--rad);
  background: var(--rad-dim);
}

.badge-mark {
  position: absolute;
  left: 8px;
  top: 8px;
  color: var(--rad);
  font-size: 13px;
  line-height: 1;
  transform: rotate(-3deg);
}

.badge-name {
  font-size: var(--fs-13);
  color: var(--text);
}

.badge-cell.is-locked .badge-name {
  color: var(--text-dim);
}

.badge-desc {
  font-size: 11px;
  line-height: 1.5;
  color: var(--text-dim);
}
</style>
