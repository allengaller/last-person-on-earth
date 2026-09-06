<script setup>
import { ref } from 'vue'
import { GLOSSARY } from '../data/glossary.js'

const openTerm = ref(null)

function toggleTerm(term) {
  openTerm.value = openTerm.value === term ? null : term
}
</script>

<template>
  <div class="glossary-block">
    <h2 class="glossary-title mono">&gt; 生存圈术语词典 <span class="glossary-count">{{ GLOSSARY.length }} 条</span></h2>
    <ul class="glossary-list">
      <li v-for="g in GLOSSARY" :key="g.term">
        <button
          type="button"
          class="term-row"
          :class="{ 'is-open': openTerm === g.term }"
          :aria-expanded="openTerm === g.term"
          @click="toggleTerm(g.term)"
        >
          <span class="term-name mono">{{ g.term }}</span>
          <span class="term-meaning">{{ g.meaning }}</span>
          <span class="term-caret mono" aria-hidden="true">{{ openTerm === g.term ? '−' : '+' }}</span>
        </button>
        <p v-if="openTerm === g.term" class="term-note mono">&gt; {{ g.note }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.glossary-block {
  margin-top: 20px;
}

.glossary-title {
  margin: 0 0 10px;
  font-size: var(--fs-13);
  font-weight: 400;
  color: var(--text-dim);
}

.glossary-count {
  color: var(--rad);
}

.glossary-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--border);
}

.term-row {
  width: 100%;
  min-height: 44px;
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 10px 8px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--border);
  color: var(--text);
  font-size: var(--fs-13);
  text-align: left;
  cursor: pointer;
}

.term-row.is-open {
  background: var(--bg-panel);
}

.term-name {
  flex: none;
  min-width: 96px;
  color: var(--rad);
  font-size: var(--fs-13);
}

.term-meaning {
  flex: 1;
}

.term-caret {
  flex: none;
  color: var(--text-dim);
}

.term-note {
  margin: 0;
  padding: 8px 8px 10px;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
  font-size: var(--fs-12);
  color: var(--text-dim);
}
</style>
