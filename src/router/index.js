import { createRouter, createWebHashHistory } from 'vue-router'

import ChecklistView from '../views/ChecklistView.vue'
import ScenariosView from '../views/ScenariosView.vue'
import ScenarioDetailView from '../views/ScenarioDetailView.vue'
import SkillsView from '../views/SkillsView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'checklist', component: ChecklistView },
    { path: '/scenarios', name: 'scenarios', component: ScenariosView },
    { path: '/scenarios/:id', name: 'scenario-detail', component: ScenarioDetailView },
    { path: '/skills', name: 'skills', component: SkillsView },
    { path: '/profile', name: 'profile', component: ProfileView },
  ],
})

export default router
