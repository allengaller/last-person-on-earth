<script setup>
const tabs = [
  { to: '/', label: '清单', icon: 'list' },
  { to: '/scenarios', label: '场景', icon: 'pin' },
  { to: '/skills', label: '技能', icon: 'node' },
  { to: '/profile', label: '我的', icon: 'user' },
]
</script>

<template>
  <div class="app-shell">
    <main class="app-main">
      <router-view />
    </main>

    <nav class="tabbar" aria-label="主导航">
      <router-link
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="tabbar-item"
        :class="{ active: $route.path === tab.to || (tab.to !== '/' && $route.path.startsWith(tab.to)) }"
      >
        <svg
          class="tab-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="square"
          aria-hidden="true"
        >
          <template v-if="tab.icon === 'list'">
            <rect x="5" y="4" width="14" height="17" />
            <path d="M9 9.5h6M9 13h6M9 16.5h4" />
          </template>
          <template v-else-if="tab.icon === 'pin'">
            <path d="M12 21c-4-3.8-6-7-6-9.8A6 6 0 0 1 18 11.2C18 14 16 17.2 12 21Z" />
            <circle cx="12" cy="11" r="2" />
          </template>
          <template v-else-if="tab.icon === 'node'">
            <path d="M12 3l7 4v10l-7 4-7-4V7z" />
            <path d="M12 8.5v7M9 10.2l6 3.6M15 10.2l-6 3.6" />
          </template>
          <template v-else>
            <circle cx="12" cy="8.5" r="3.5" />
            <path d="M5 20c1.4-3.4 3.9-5 7-5s5.6 1.6 7 5" />
          </template>
        </svg>
        <span class="tab-label mono">{{ tab.label }}</span>
      </router-link>
    </nav>
  </div>

  <div class="fx-scanlines" aria-hidden="true"></div>
  <div class="fx-noise" aria-hidden="true"></div>
</template>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: var(--shell-max);
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom));
  padding-bottom: env(safe-area-inset-bottom);
  display: flex;
  background: var(--bg-panel);
  border-top: 1px solid var(--border);
  z-index: 100;
}

@media (min-width: 520px) {
  .tabbar {
    border-left: 1px solid var(--border);
    border-right: 1px solid var(--border);
  }
}

.tabbar-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: var(--text-dim);
  position: relative;
  min-height: var(--tabbar-h);
}

.tabbar-item.active {
  color: var(--rad);
}

.tabbar-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 28px;
  height: 2px;
  background: var(--rad);
}

.tab-icon {
  width: 22px;
  height: 22px;
}

.tab-label {
  font-size: var(--fs-12);
  letter-spacing: 0.1em;
}
</style>
