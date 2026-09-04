<script setup>
import { computed, ref, watch } from 'vue'
import { ITEM_MAP } from '../data/items.js'
import { SKILLS, SKILL_BRANCHES } from '../data/skills.js'
import { useUserStore } from '../stores/user.js'
import SkillTree from '../components/SkillTree.vue'

const store = useUserStore()

const BRANCH_MAP = Object.fromEntries(SKILL_BRANCHES.map((b) => [b.id, b]))

const selectedId = ref(null)
const selected = computed(() => SKILLS.find((s) => s.id === selectedId.value) || null)
const state = computed(() => (selected.value ? store.skillsWithState(selected.value) : null))

const practicedCount = computed(() => Object.keys(store.practiced).length)

function select(skill) {
  selectedId.value = selectedId.value === skill.id ? null : skill.id
}

const justUnlocked = ref(false)
let glitchTimer = null
watch(
  () => state.value?.unlocked,
  (now, before) => {
    if (now && before === false) {
      justUnlocked.value = true
      clearTimeout(glitchTimer)
      glitchTimer = setTimeout(() => (justUnlocked.value = false), 300)
    }
  }
)
</script>

<template>
  <section class="skills-page">
    <header class="skills-head">
      <span class="mono head-label">&gt; 技能练习</span>
      <span class="mono head-count">{{ practicedCount }}/{{ SKILLS.length }}</span>
      <div class="head-bar">
        <div class="head-bar-fill" :style="{ width: `${(practicedCount / SKILLS.length) * 100}%` }" />
      </div>
    </header>

    <SkillTree :selected-id="selectedId" @select="select" />

    <div v-if="!selected" class="empty-hint mono">&gt; 点击菱形节点查看技能详情。</div>

    <article
      v-else
      class="skill-detail"
      :class="{ 'is-glitching': justUnlocked }"
    >
      <div class="detail-head">
        <h2 class="detail-name">{{ selected.name }}</h2>
        <span class="mono detail-meta">{{ BRANCH_MAP[selected.branch]?.name }} · T{{ selected.tier }}</span>
      </div>

      <span
        v-if="state"
        class="mono state-chip"
        :class="state.unlocked ? 'is-unlocked' : state.itemsOwned >= selected.requireItemsCount ? 'is-ready' : 'is-locked'"
      >
        {{ state.unlocked ? '[已解锁]' : state.itemsOwned >= selected.requireItemsCount ? '[可解锁]' : '[未解锁]' }}
      </span>

      <p class="detail-desc">{{ selected.desc }}</p>

      <div class="cond mono">
        解锁条件：拥有 {{ selected.requireItemsCount }} 件关联物资{{ selected.requirePractice ? ' + 标记一次练习' : '' }}
      </div>

      <ul class="req-list">
        <li v-for="itemId in selected.requireItems" :key="itemId">
          <button
            type="button"
            class="req-item"
            :class="{ 'is-owned': !!store.owned[itemId] }"
            :aria-pressed="!!store.owned[itemId]"
            @click="store.toggleOwned(itemId)"
          >
            <span class="mono req-mark">{{ store.owned[itemId] ? '✓' : '✗' }}</span>
            <span class="req-name">{{ ITEM_MAP[itemId]?.name || itemId }}</span>
            <span class="mono req-id">{{ itemId }}</span>
          </button>
        </li>
      </ul>

      <button
        v-if="selected.requirePractice"
        type="button"
        class="practice-btn"
        :class="{ 'is-done': state?.practiced }"
        :aria-pressed="!!state?.practiced"
        @click="store.togglePracticed(selected.id)"
      >
        <span v-if="state?.practiced" class="stamp-mark">✓ 已练习</span>
        <span v-else>标记已练习</span>
      </button>
    </article>
  </section>
</template>

<style scoped>
.skills-page {
  padding: 16px 0 24px;
}

.skills-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 14px;
}

.head-label {
  color: var(--text-dim);
  font-size: var(--fs-13);
}

.head-count {
  color: var(--rad);
  font-size: var(--fs-13);
}

.head-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
}

.head-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--rad-dim), var(--rad));
  transition: width 0.35s ease-out;
}

.empty-hint {
  color: var(--text-dim);
  font-size: var(--fs-13);
  padding: 20px 0;
}

.skill-detail {
  border: 1px solid var(--border-strong);
  background: var(--bg-panel);
  padding: 16px;
  margin-top: 16px;
}

.detail-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.detail-name {
  font-size: var(--fs-17);
  color: var(--text);
  margin: 0;
  font-weight: 600;
}

.detail-meta {
  color: var(--text-dim);
  font-size: var(--fs-12);
}

.state-chip {
  display: inline-block;
  font-size: var(--fs-12);
  padding: 2px 8px;
  margin-top: 10px;
  border: 1px solid var(--border);
}

.state-chip.is-unlocked {
  color: var(--rad);
  border-color: var(--rad);
}

.state-chip.is-ready {
  color: var(--warning);
  border-color: var(--warning);
}

.state-chip.is-locked {
  color: var(--text-dim);
}

.detail-desc {
  color: var(--text);
  font-size: var(--fs-15);
  margin: 10px 0 0;
  line-height: 1.6;
}

.cond {
  color: var(--text-dim);
  font-size: var(--fs-12);
  margin-top: 10px;
}

.req-list {
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.req-item {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--bg-raised);
  border: 1px solid var(--border);
  color: var(--text);
  font-size: var(--fs-13);
  text-align: left;
  cursor: pointer;
}

.req-item.is-owned {
  border-color: var(--rad);
  background: var(--rad-dim);
  color: var(--text);
}

.req-mark {
  width: 14px;
  color: var(--alert);
  flex-shrink: 0;
}

.req-item.is-owned .req-mark {
  color: var(--rad);
}

.req-name {
  flex: 1;
}

.req-id {
  color: var(--text-dim);
  font-size: var(--fs-12);
}

.practice-btn {
  width: 100%;
  min-height: 44px;
  margin-top: 12px;
  background: transparent;
  border: 1px dashed var(--border-strong);
  color: var(--text);
  font-size: var(--fs-15);
  cursor: pointer;
}

.practice-btn.is-done {
  border: 1px solid var(--rad);
  color: var(--rad);
  background: var(--bg-raised);
}
</style>
