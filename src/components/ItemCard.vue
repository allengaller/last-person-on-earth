<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '../stores/user.js'
import { SKILLS } from '../data/skills.js'
import { SCENARIO_LABELS } from '../data/categories.js'

const props = defineProps({
  item: { type: Object, required: true },
})

const store = useUserStore()
const expanded = ref(false)

const owned = computed(() => !!store.owned[props.item.id])
const relatedSkills = computed(() =>
  SKILLS.filter((s) => s.requireItems.includes(props.item.id)),
)
const scenarioNames = computed(() =>
  props.item.scenarios.map((id) => SCENARIO_LABELS[id]).filter(Boolean),
)
</script>

<template>
  <article class="item-card" :class="{ 'is-owned': owned }">
    <div class="item-head">
      <button
        type="button"
        class="item-check"
        :aria-pressed="owned"
        :aria-label="`${owned ? '取消入库' : '标记入库'}：${item.name}`"
        @click.stop="store.toggleOwned(item.id)"
      >
        <span class="check-box" aria-hidden="true">
          <span v-if="owned" class="stamp-mark">√</span>
        </span>
      </button>

      <button
        type="button"
        class="item-main"
        :aria-expanded="expanded"
        @click="expanded = !expanded"
      >
        <span class="item-title">
          <span class="item-id mono">{{ item.id }}</span>
          <span class="item-name">{{ item.name }}</span>
        </span>
        <span class="item-amount">{{ item.amount }}</span>
        <span class="item-desc">{{ item.desc }}</span>
      </button>

      <div class="item-meta">
        <span class="prio-stamp mono" :class="`prio-${item.priority.toLowerCase()}`">{{ item.priority }}</span>
        <span v-if="owned" class="owned-flag mono">[已入库]</span>
      </div>
    </div>

    <div v-if="expanded" class="item-detail">
      <div v-if="item.tags.length" class="detail-row">
        <span class="detail-label mono">注意</span>
        <span v-for="tag in item.tags" :key="tag" class="chip chip-alert">{{ tag }}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label mono">场景</span>
        <span v-for="name in scenarioNames" :key="name" class="chip">{{ name }}</span>
      </div>
      <div v-if="relatedSkills.length" class="detail-row">
        <span class="detail-label mono">关联技能</span>
        <span v-for="skill in relatedSkills" :key="skill.id" class="chip">{{ skill.name }}</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
.item-card {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: var(--radius-card);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.item-card.is-owned {
  background: var(--rad-dim);
}

.item-head {
  display: flex;
  align-items: stretch;
}

/* 勾选框：44px 触控目标，视觉方框居中 */
.item-check {
  flex: none;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: inherit;
}

.check-box {
  width: 20px;
  height: 20px;
  border: 1px solid var(--border-strong);
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-btn);
  transition: border-color 0.15s ease;
}

.item-card.is-owned .check-box {
  border-color: var(--rad);
}

.stamp-mark {
  color: var(--rad);
  font-family: var(--font-mono);
  font-size: 15px;
  font-weight: 700;
  line-height: 1;
  transform: rotate(-3deg);
}

/* 卡主体：点击展开 */
.item-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 11px 8px 11px 0;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  font: inherit;
  color: inherit;
}

.item-title {
  display: flex;
  align-items: baseline;
  gap: 8px;
  min-width: 0;
}

.item-id {
  font-size: var(--fs-12);
  color: var(--text-dim);
}

.item-name {
  font-size: var(--fs-15);
  font-weight: 500;
  color: var(--text);
  transition: color 0.15s ease;
}

.item-card.is-owned .item-name {
  color: var(--text-dim);
}

.item-amount,
.item-desc {
  font-size: var(--fs-13);
  color: var(--text-dim);
  transition: color 0.15s ease;
}

/* 右侧元信息列：优先级章 + 已入库标记 */
.item-meta {
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  gap: 5px;
  padding: 10px 10px 0 0;
}

.prio-stamp {
  font-size: 11px;
  padding: 1px 5px;
  border: 1px solid currentColor;
  border-radius: 0;
  line-height: 1.4;
}

.prio-p1 { color: var(--alert); }
.prio-p2 { color: var(--warning); }
.prio-p3 { color: var(--gray-p3); }

.owned-flag {
  font-size: 11px;
  color: var(--rad);
}

/* 展开详情 */
.item-detail {
  background: var(--bg-raised);
  border-top: 1px solid var(--border);
  border-radius: 0 0 var(--radius-card) var(--radius-card);
  padding: 10px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 6px;
}

.detail-label {
  flex: none;
  font-size: 11px;
  color: var(--text-dim);
  min-width: 52px;
}

.chip {
  font-size: var(--fs-12);
  padding: 1px 7px;
  border: 1px solid var(--border-strong);
  border-radius: 0;
  color: var(--text-dim);
  background: var(--bg-panel);
}

.chip-alert {
  border-color: var(--alert);
  color: var(--alert);
  background: none;
}
</style>
