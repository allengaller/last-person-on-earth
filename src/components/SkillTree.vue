<script setup>
import { computed } from 'vue'
import { useUserStore } from '../stores/user.js'
import { SKILL_BRANCHES, SKILLS } from '../data/skills.js'

defineProps({
  selectedId: { type: String, default: null },
})

const emit = defineEmits(['select'])
const store = useUserStore()

const branches = computed(() =>
  SKILL_BRANCHES.map((branch) => ({
    ...branch,
    skills: SKILLS.filter((s) => s.branch === branch.id).sort((a, b) => a.tier - b.tier),
  })),
)

function stateOf(skill) {
  return store.skillsWithState(skill)
}

function nodeClass(skill) {
  const state = stateOf(skill)
  if (state.unlocked) return 'is-unlocked'
  if (state.itemsOwned >= skill.requireItemsCount) return 'is-ready'
  return 'is-locked'
}

function connectorActive(upper, lower) {
  return stateOf(upper).unlocked && stateOf(lower).unlocked
}
</script>

<template>
  <div class="tree-scroll">
    <div class="tree-grid">
      <div v-for="branch in branches" :key="branch.id" class="branch-col">
        <span class="branch-name">{{ branch.name }}</span>
        <div class="tier-stack">
          <template v-for="(skill, idx) in branch.skills" :key="skill.id">
            <span
              v-if="idx > 0"
              class="connector"
              :class="{ 'is-active': connectorActive(branch.skills[idx - 1], skill) }"
              aria-hidden="true"
            ></span>
            <button
              type="button"
              class="node"
              :class="[nodeClass(skill), { 'is-selected': selectedId === skill.id }]"
              :aria-label="`${skill.name}（${stateOf(skill).unlocked ? '已解锁' : '未解锁'}）`"
              @click="emit('select', skill)"
            >
              <span class="node-inner mono">{{ stateOf(skill).unlocked ? '✓' : skill.tier }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>

  <div class="legend mono">
    <span class="legend-item"><span class="dot is-locked" aria-hidden="true"></span>未解锁</span>
    <span class="legend-item"><span class="dot is-ready" aria-hidden="true"></span>可解锁</span>
    <span class="legend-item"><span class="dot is-unlocked" aria-hidden="true"></span>已解锁</span>
  </div>
</template>

<style scoped>
.tree-scroll {
  overflow-x: auto;
  scrollbar-width: none;
}

.tree-scroll::-webkit-scrollbar {
  display: none;
}

.tree-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(64px, 1fr));
  gap: 6px;
  min-width: 340px;
}

.branch-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.branch-name {
  font-size: 11px;
  color: var(--text-dim);
  text-align: center;
  min-height: 30px;
  display: flex;
  align-items: flex-end;
}

.tier-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}

/* 连线：1px 直线，已激活路径辐射绿 */
.connector {
  width: 1px;
  height: 16px;
  background: var(--border);
}

.connector.is-active {
  background: var(--rad);
}

/* 菱形节点：rotate 45° 方块 */
.node {
  width: 30px;
  height: 30px;
  transform: rotate(45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  background: transparent;
  border: 1px dashed var(--border);
  transition: border-color 0.15s ease, background-color 0.15s ease;
}

.node.is-locked {
  border: 1px dashed var(--border);
  color: var(--text-dim);
}

.node.is-ready {
  border: 1px solid var(--warning);
  color: var(--warning);
  background: var(--bg-panel);
}

.node.is-unlocked {
  border: 1px solid var(--rad);
  background: var(--rad);
  color: var(--bg);
}

.node.is-selected {
  box-shadow: 0 0 0 1px var(--rad);
}

.node-inner {
  transform: rotate(-45deg);
  font-size: 12px;
  font-weight: 700;
  line-height: 1;
}

.legend {
  display: flex;
  gap: 16px;
  margin-top: 18px;
  font-size: 11px;
  color: var(--text-dim);
}

.legend-item {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.dot {
  width: 9px;
  height: 9px;
  transform: rotate(45deg);
  display: inline-block;
}

.dot.is-locked {
  border: 1px dashed var(--border);
}

.dot.is-ready {
  border: 1px solid var(--warning);
}

.dot.is-unlocked {
  background: var(--rad);
  border: 1px solid var(--rad);
}
</style>
