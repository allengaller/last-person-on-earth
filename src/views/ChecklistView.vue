<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user.js'
import { CATEGORIES } from '../data/categories.js'
import { ITEMS, MEDICAL_NOTICE } from '../data/items.js'
import RadarChart from '../components/RadarChart.vue'
import ItemCard from '../components/ItemCard.vue'
import { useTweened } from '../composables/useTweened.js'

const store = useUserStore()
const activeCat = ref('food-water')

const readinessDisplay = useTweened(computed(() => store.readiness))

const radarValues = computed(() => store.radar.axes.map((a) => a.value))

const catCounts = computed(() =>
  Object.fromEntries(
    CATEGORIES.map((cat) => {
      const items = ITEMS.filter((i) => i.category === cat.id)
      return [
        cat.id,
        `${items.filter((i) => store.owned[i.id]).length}/${items.length}`,
      ]
    }),
  ),
)

const catItems = computed(() => {
  const prioOrder = { P1: 0, P2: 1, P3: 2 }
  return ITEMS.filter((i) => i.category === activeCat.value).sort(
    (a, b) => prioOrder[a.priority] - prioOrder[b.priority] || a.id.localeCompare(b.id),
  )
})

const catStat = computed(() => {
  const items = ITEMS.filter((i) => i.category === activeCat.value)
  const ownedCount = items.filter((i) => store.owned[i.id]).length
  return {
    total: items.length,
    ownedCount,
    rate: items.length ? ownedCount / items.length : 0,
  }
})

const hasAnyOwned = computed(() => Object.keys(store.owned).length > 0)
</script>

<template>
  <section class="checklist">
    <header class="readiness-head">
      <div class="readiness-score">
        <span class="readiness-label mono">生存准备度</span>
        <span class="readiness-value mono" :style="{ color: store.rank.color }">{{ readinessDisplay }}</span>
        <span class="readiness-rank" :style="{ color: store.rank.color }">{{ store.rank.name }}</span>
      </div>
      <RadarChart class="readiness-radar" :values="radarValues" :size="40" />
    </header>

    <nav class="cat-tabs mono" aria-label="物资分类">
      <button
        v-for="cat in CATEGORIES"
        :key="cat.id"
        type="button"
        class="cat-tab"
        :class="{ 'is-active': activeCat === cat.id }"
        @click="activeCat = cat.id"
      >
        {{ cat.name }}
        <span class="cat-count">{{ catCounts[cat.id] }}</span>
      </button>
    </nav>

    <p v-if="activeCat === 'medical'" class="medical-notice">⚠ {{ MEDICAL_NOTICE }}</p>

    <div class="progress-block">
      <div
        class="progress"
        role="progressbar"
        :aria-valuenow="Math.round(catStat.rate * 100)"
        aria-valuemin="0"
        aria-valuemax="100"
        :aria-label="`分类完成度`"
      >
        <div class="progress-fill" :style="{ width: `${catStat.rate * 100}%` }"></div>
      </div>
      <p class="progress-label mono">
        {{ catStat.ownedCount }}/{{ catStat.total }} · 完成度 {{ Math.round(catStat.rate * 100) }}%
      </p>
    </div>

    <p v-if="!hasAnyOwned" class="first-run mono">&gt; 从 P1 开始，先活下来。</p>

    <ul class="item-list">
      <li v-for="item in catItems" :key="item.id">
        <ItemCard :item="item" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* 顶部准备度 */
.readiness-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 4px 2px 14px;
}

.readiness-score {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.readiness-label {
  font-size: var(--fs-12);
  color: var(--text-dim);
  letter-spacing: 0.15em;
}

.readiness-value {
  font-size: var(--fs-28);
  font-weight: 700;
  line-height: 1.15;
}

.readiness-rank {
  font-size: var(--fs-13);
}

.readiness-radar {
  flex: none;
}

/* 分类 tab：横向可滚动 */
.cat-tabs {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}

.cat-tabs::-webkit-scrollbar {
  display: none;
}

.cat-tab {
  flex: none;
  font-family: var(--font-mono);
  font-size: var(--fs-12);
  color: var(--text-dim);
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  padding: 8px 10px;
  cursor: pointer;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.cat-tab.is-active {
  color: var(--rad);
  border-color: var(--border-strong);
}

.cat-count {
  margin-left: 4px;
  font-size: 11px;
}

/* 医疗合规提示 */
.medical-notice {
  margin-top: 10px;
  font-size: var(--fs-12);
  color: var(--alert);
  border: 1px solid var(--alert);
  border-radius: var(--radius-card);
  padding: 8px 10px;
  background: var(--bg-panel);
}

/* 分类完成度进度条 */
.progress-block {
  margin-top: 12px;
}

.progress {
  height: 8px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rad-dim), var(--rad));
  transition: width 0.3s ease;
}

.progress-label {
  margin-top: 5px;
  font-size: 11px;
  color: var(--text-dim);
}

/* 首次引导 */
.first-run {
  margin-top: 16px;
  font-size: var(--fs-13);
  color: var(--warning);
}

/* 物资列表 */
.item-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
