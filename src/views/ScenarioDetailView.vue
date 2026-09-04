<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import { SCENARIO_MAP } from '../data/scenarios.js'
import { ITEM_MAP } from '../data/items.js'
import RadiationGauge from '../components/RadiationGauge.vue'

const route = useRoute()
const store = useUserStore()

const scenario = computed(() => SCENARIO_MAP[route.params.id])
const stats = computed(() =>
  scenario.value ? store.scenarioStatsById[scenario.value.id] : null,
)
const colorVar = computed(() =>
  scenario.value ? `var(--${scenario.value.color})` : 'var(--text-dim)',
)
const riskColor = computed(() => {
  if (!scenario.value) return 'var(--text-dim)'
  return scenario.value.riskLevel === 'HIGH'
    ? 'var(--alert)'
    : scenario.value.riskLevel === 'MEDIUM'
      ? 'var(--warning)'
      : 'var(--text-dim)'
})

const PRIORITY_NAMES = { P1: 'P1 生死攸关', P2: 'P2 重要', P3: 'P3 加分' }
const groups = computed(() =>
  ['P1', 'P2', 'P3'].map((p) => {
    const ids = scenario.value?.recommended[p] ?? []
    const ownedCount = ids.filter((id) => store.owned[id]).length
    return { priority: p, label: PRIORITY_NAMES[p], ids, ownedCount, missing: ids.length - ownedCount }
  }),
)

// 缺口提示：按最高优先级报缺口，全部齐备则报达标
const gapLine = computed(() => {
  if (!stats.value) return ''
  const first = groups.value.find((g) => g.missing > 0)
  if (!first) return '> P1/P2/P3 全部入库，该场景已达标。'
  return `> 该场景还缺 ${first.missing} 件 ${first.priority} 物资。`
})

function isOwned(id) {
  return !!store.owned[id]
}
</script>

<template>
  <section v-if="scenario" class="scenario-detail">
    <RouterLink to="/scenarios" class="back-link mono">&lt; 返回场景列表</RouterLink>

    <header class="detail-head">
      <h1 class="detail-name">{{ scenario.name }}</h1>
      <span class="risk-stamp mono" :style="{ color: riskColor, borderColor: riskColor }">[RISK: {{ scenario.riskLevel }}]</span>
    </header>

    <p class="detail-summary">{{ scenario.summary }}</p>

    <div class="stat-block">
      <div class="stat-progress" aria-hidden="true">
        <div class="stat-fill" :style="{ width: `${Math.round(stats.rate * 100)}%`, background: colorVar }"></div>
      </div>
      <p class="stat-label mono">
        场景准备度 {{ stats.ownedCount }}/{{ stats.total }} · {{ Math.round(stats.rate * 100) }}%
      </p>
      <p class="gap-line mono" :class="{ 'is-ok': gapLine.includes('已达标') }">{{ gapLine }}</p>
    </div>

    <RadiationGauge v-if="scenario.id === 'nuclear'" :value="stats.rate" class="nuclear-gauge" />

    <div class="principle-card">
      <span class="card-label mono">首要原则</span>
      <p class="principle-text">{{ scenario.principle }}</p>
    </div>

    <div
      v-for="group in groups"
      :key="group.priority"
      class="rec-group"
    >
      <div class="rec-head">
        <h2 class="rec-title mono">{{ group.label }}</h2>
        <span
          class="rec-gap mono"
          :class="group.missing > 0 ? 'is-missing' : 'is-done'"
        >
          {{ group.missing > 0 ? `缺 ${group.missing} 件` : '已齐备' }}
        </span>
      </div>
      <ul class="rec-list">
        <li v-for="id in group.ids" :key="id">
          <button
            type="button"
            class="rec-row"
            :class="{ 'is-owned': isOwned(id) }"
            :aria-pressed="isOwned(id)"
            @click="store.toggleOwned(id)"
          >
            <span class="rec-check" :class="{ 'is-checked': isOwned(id) }" aria-hidden="true">
              <span v-if="isOwned(id)" class="stamp-mark">√</span>
            </span>
            <span class="rec-id mono">{{ id }}</span>
            <span class="rec-name">{{ ITEM_MAP[id]?.name ?? id }}</span>
            <span class="rec-prio mono" :class="`prio-${ITEM_MAP[id]?.priority.toLowerCase()}`">{{ ITEM_MAP[id]?.priority }}</span>
          </button>
        </li>
      </ul>
    </div>

    <div class="tips-card">
      <span class="card-label mono">场景专属提示</span>
      <ul class="tips-list mono">
        <li v-for="tip in scenario.tips" :key="tip">&gt; {{ tip }}</li>
      </ul>
    </div>
  </section>

  <section v-else class="empty-state mono">
    <p>&gt; 该区域辐射值过高，暂无数据。</p>
    <RouterLink to="/scenarios" class="back-link mono">&lt; 返回场景列表</RouterLink>
  </section>
</template>

<style scoped>
.back-link {
  display: inline-block;
  font-size: var(--fs-12);
  color: var(--text-dim);
  text-decoration: none;
  padding: 6px 0;
}

.back-link:active {
  color: var(--rad);
}

.detail-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
  margin-top: 4px;
}

.detail-name {
  font-size: var(--fs-22);
  font-weight: 700;
  color: var(--text);
  margin: 0;
}

.risk-stamp {
  flex: none;
  font-size: 11px;
  border: 1px solid;
  padding: 2px 6px;
  border-radius: 0;
}

.detail-summary {
  margin: 8px 0 0;
  font-size: var(--fs-13);
  color: var(--text-dim);
  line-height: 1.6;
}

/* 准备度 + 缺口 */
.stat-block {
  margin-top: 14px;
}

.stat-progress {
  height: 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.stat-label {
  margin: 5px 0 0;
  font-size: 11px;
  color: var(--text-dim);
}

.gap-line {
  margin: 6px 0 0;
  font-size: var(--fs-13);
  color: var(--warning);
}

.gap-line.is-ok {
  color: var(--rad);
}

.nuclear-gauge {
  margin-top: 16px;
}

/* 首要原则 */
.principle-card {
  margin-top: 16px;
  background: var(--bg-panel);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-card);
  padding: 10px 12px;
}

.card-label {
  display: block;
  font-size: 11px;
  color: var(--text-dim);
  letter-spacing: 0.15em;
  margin-bottom: 4px;
}

.principle-text {
  margin: 0;
  font-size: var(--fs-13);
  color: var(--text);
  line-height: 1.6;
}

/* 推荐物资分组 */
.rec-group {
  margin-top: 18px;
}

.rec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid var(--border);
}

.rec-title {
  margin: 0;
  font-size: var(--fs-13);
  font-weight: 700;
  color: var(--text);
  letter-spacing: 0.1em;
}

.rec-gap {
  font-size: 11px;
}

.rec-gap.is-missing {
  color: var(--alert);
}

.rec-gap.is-done {
  color: var(--rad);
}

.rec-list {
  list-style: none;
  margin: 8px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* 可勾选行：整行按钮，≥44px 触控 */
.rec-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 6px 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  cursor: pointer;
  font: inherit;
  color: inherit;
  text-align: left;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.rec-row.is-owned {
  background: var(--rad-dim);
  border-color: var(--border);
}

.rec-check {
  flex: none;
  width: 18px;
  height: 18px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-btn);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color 0.15s ease;
}

.rec-check.is-checked {
  border-color: var(--rad);
}

.rec-check .stamp-mark {
  color: var(--rad);
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-3deg);
}

.rec-id {
  flex: none;
  font-size: 11px;
  color: var(--text-dim);
}

.rec-name {
  flex: 1;
  min-width: 0;
  font-size: var(--fs-13);
  color: var(--text);
  transition: color 0.15s ease;
}

.rec-row.is-owned .rec-name {
  color: var(--text-dim);
}

.rec-prio {
  flex: none;
  font-size: 10px;
  padding: 0 4px;
  border: 1px solid currentColor;
}

.prio-p1 { color: var(--alert); }
.prio-p2 { color: var(--warning); }
.prio-p3 { color: var(--gray-p3); }

/* 场景专属提示：描边锈红 */
.tips-card {
  margin-top: 20px;
  border: 1px solid var(--alert);
  border-radius: var(--radius-card);
  padding: 10px 12px;
  background: var(--bg-panel);
}

.tips-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: var(--fs-13);
  color: var(--text);
}

.empty-state {
  padding: 24px 0;
  font-size: var(--fs-13);
  color: var(--text-dim);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
