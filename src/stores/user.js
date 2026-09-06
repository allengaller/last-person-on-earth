// 用户状态（唯一可变数据，localStorage 持久化，doc/04 §2/§4）
import { computed, reactive, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { SCENARIOS } from '../data/scenarios.js'
import {
  categoryRates,
  isSkillUnlocked,
  radarData,
  rankFor,
  scenarioStats,
  skillPracticedRate,
  totalReadiness,
} from './scoring.js'

const STORAGE_KEY = 'doomsday-state-v1'
const SCHEMA_VERSION = 1

function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  )
}

function loadPersisted() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.schemaVersion !== SCHEMA_VERSION) return null
    if (!isPlainObject(data.owned) || !isPlainObject(data.practiced)) return null
    return data
  } catch {
    return null
  }
}

export const useUserStore = defineStore('user', () => {
  const saved = loadPersisted()
  const owned = reactive(saved?.owned ?? {})
  const practiced = reactive(saved?.practiced ?? {})
  const createdAt = ref(saved?.createdAt ?? Date.now())

  watch(
    [owned, practiced, createdAt],
    () => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({
            schemaVersion: SCHEMA_VERSION,
            createdAt: createdAt.value,
            owned: { ...owned },
            practiced: { ...practiced },
          }),
        )
      } catch (err) {
        console.warn('[doomsday] 状态保存失败', err)
      }
    },
    { deep: true },
  )

  const readiness = computed(() => totalReadiness(owned, practiced))
  const rank = computed(() => rankFor(readiness.value))
  const radar = computed(() => radarData(owned, practiced))
  const catRates = computed(() => categoryRates(owned))
  const skillRate = computed(() => skillPracticedRate(practiced))
  const skillsWithState = computed(() => {
    // 视图所需的技能状态推导：unlocked 纯 getter，不落库
    return (skill) => ({
      unlocked: isSkillUnlocked(skill, owned, practiced),
      itemsOwned: skill.requireItems.filter((id) => owned[id]).length,
      practiced: !!practiced[skill.id],
    })
  })
  const scenarioStatsById = computed(() =>
    Object.fromEntries(
      SCENARIOS.map((s) => [s.id, scenarioStats(s, owned)]),
    ),
  )

  function toggleOwned(itemId) {
    if (owned[itemId]) delete owned[itemId]
    else owned[itemId] = true
  }

  function togglePracticed(skillId) {
    if (practiced[skillId]) delete practiced[skillId]
    else practiced[skillId] = true
  }

  function resetAll() {
    for (const key of Object.keys(owned)) delete owned[key]
    for (const key of Object.keys(practiced)) delete practiced[key]
    createdAt.value = Date.now()
  }

  function importState(data) {
    for (const key of Object.keys(owned)) delete owned[key]
    for (const key of Object.keys(practiced)) delete practiced[key]
    Object.assign(owned, data.owned)
    Object.assign(practiced, data.practiced)
    createdAt.value = data.createdAt
  }

  return {
    owned,
    practiced,
    createdAt,
    readiness,
    rank,
    radar,
    catRates,
    skillRate,
    skillsWithState,
    scenarioStatsById,
    toggleOwned,
    togglePracticed,
    resetAll,
    importState,
  }
})
