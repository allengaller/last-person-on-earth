<script setup>
import { computed, ref } from 'vue'
import { ITEMS } from '../data/items.js'
import { CATEGORIES, CATEGORY_WEIGHTS } from '../data/categories.js'
import { useUserStore } from '../stores/user.js'
import { useTweened } from '../composables/useTweened.js'
import RadarChart from '../components/RadarChart.vue'

const store = useUserStore()

const radarValues = computed(() => store.radar.axes.map((a) => a.value))
const radarLabels = computed(() => store.radar.axes.map((a) => a.label))

const tweenedScore = useTweened(computed(() => store.readiness))

const pct = (v) => `${Math.round(v * 100)}%`

const catRows = computed(() =>
  CATEGORIES.map((c) => ({
    ...c,
    rate: store.catRates[c.id] ?? 0,
    ownedCount: ITEMS.filter((i) => i.category === c.id && store.owned[i.id]).length,
    totalCount: ITEMS.filter((i) => i.category === c.id).length,
  })),
)

const confirming = ref(false)
let confirmTimer = null
function onResetClick() {
  if (!confirming.value) {
    confirming.value = true
    clearTimeout(confirmTimer)
    confirmTimer = setTimeout(() => (confirming.value = false), 3000)
    return
  }
  clearTimeout(confirmTimer)
  confirming.value = false
  store.resetAll()
}
</script>

<template>
  <section class="profile-page">
    <header class="profile-head">
      <div class="head-score">
        <span class="mono head-label">&gt; 生存准备度</span>
        <span class="head-number mono" :style="{ color: store.rank.color }">{{ tweenedScore }}</span>
        <span class="head-rank" :style="{ color: store.rank.color }">{{ store.rank.name }}</span>
      </div>
      <div class="head-radar">
        <RadarChart :values="radarValues" :labels="radarLabels" :size="240" />
      </div>
    </header>

    <div class="block">
      <h2 class="block-title mono">&gt; 分类明细</h2>
      <ul class="cat-list">
        <li v-for="cat in catRows" :key="cat.id" class="cat-row">
          <div class="cat-top">
            <span class="cat-name">{{ cat.name }}</span>
            <span class="mono cat-count">{{ cat.ownedCount }}/{{ cat.totalCount }}</span>
            <span class="mono cat-weight">权重 {{ Math.round(CATEGORY_WEIGHTS[cat.id] * 100) }}%</span>
            <span class="mono cat-rate">{{ pct(cat.rate) }}</span>
          </div>
          <div class="cat-bar">
            <div class="cat-bar-fill" :style="{ width: pct(cat.rate) }" />
          </div>
        </li>
      </ul>
      <div class="mono formula">总准备度 = Σ(分类权重 × 拥有率) × 0.7 + 技能练习率 × 0.3</div>
    </div>

    <div class="block">
      <h2 class="block-title mono">&gt; 数据管理</h2>
      <p class="data-note">入库与练习记录仅保存在本机浏览器，可随时重置。</p>
      <button
        type="button"
        class="reset-btn"
        :class="{ 'is-armed': confirming }"
        @click="onResetClick"
      >
        {{ confirming ? '再次点击确认重置' : '重置全部数据' }}
      </button>
    </div>

    <div class="block about">
      <h2 class="block-title mono">&gt; 关于与免责声明</h2>
      <ul class="about-list mono">
        <li>&gt; 本应用为一般性家庭应急科普，不构成专业救援或医疗建议。</li>
        <li>&gt; 药品使用请遵医嘱及说明书，处方药在医生指导下备存。</li>
        <li>&gt; 隐私说明：所有数据仅存于本机浏览器（localStorage），不采集、不上传。</li>
        <li>&gt; 产品定位：家庭应急准备科普，非军事化或极端生存指导。</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  padding: 16px 0 24px;
  display: grid;
  gap: 24px;
}

.profile-head {
  display: flex;
  align-items: center;
  gap: 16px;
}

.head-score {
  flex: 1;
  display: grid;
  gap: 6px;
}

.head-label {
  color: var(--text-dim);
  font-size: var(--fs-13);
}

.head-number {
  font-size: var(--fs-28);
  line-height: 1.1;
}

.head-rank {
  font-size: var(--fs-15);
  font-weight: 600;
}

.head-radar {
  flex-shrink: 0;
}

.block-title {
  color: var(--text-dim);
  font-size: var(--fs-13);
  font-weight: 400;
  margin: 0 0 12px;
}

.cat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.cat-top {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 6px;
}

.cat-name {
  color: var(--text);
  font-size: var(--fs-15);
  font-weight: 600;
}

.cat-count {
  color: var(--text-dim);
  font-size: var(--fs-12);
}

.cat-weight {
  flex: 1;
  text-align: right;
  color: var(--text-dim);
  font-size: var(--fs-12);
}

.cat-rate {
  color: var(--rad);
  font-size: var(--fs-13);
}

.cat-bar {
  height: 8px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
}

.cat-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rad-dim), var(--rad));
  transition: width 0.35s ease-out;
}

.formula {
  margin-top: 14px;
  color: var(--text-dim);
  font-size: var(--fs-12);
}

.data-note {
  color: var(--text-dim);
  font-size: var(--fs-13);
  margin: 0 0 12px;
}

.reset-btn {
  min-height: 44px;
  width: 100%;
  background: transparent;
  border: 1px dashed var(--alert);
  color: var(--alert);
  font-size: var(--fs-15);
  cursor: pointer;
}

.reset-btn.is-armed {
  border-style: solid;
  background: var(--alert);
  color: var(--bg);
}

.about-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
  color: var(--text-dim);
  font-size: var(--fs-12);
  line-height: 1.7;
}
</style>
