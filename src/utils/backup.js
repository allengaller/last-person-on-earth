// 备份导出/导入（doc/04 §5：JSON.stringify(state) 下载；导入做白名单 key + 类型检查）
import { ITEMS } from '../data/items.js'
import { SKILLS } from '../data/skills.js'

const SCHEMA_VERSION = 1
const ITEM_IDS = new Set(ITEMS.map((i) => i.id))
const SKILL_IDS = new Set(SKILLS.map((s) => s.id))

export function serializeState(state) {
  return {
    schemaVersion: SCHEMA_VERSION,
    createdAt: state.createdAt,
    owned: { ...state.owned },
    practiced: { ...state.practiced },
  }
}

// 白名单过滤：只保留已知物资/技能 id，值收敛为 true
function sanitizeMap(raw, allowed) {
  const result = {}
  for (const [key, value] of Object.entries(raw)) {
    if (allowed.has(key) && value) result[key] = true
  }
  return result
}

export function parseBackup(raw) {
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    return { ok: false, error: '文件不是有效 JSON' }
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, error: '备份结构不正确' }
  }
  if (parsed.schemaVersion !== SCHEMA_VERSION) {
    return { ok: false, error: `schemaVersion 不符（需要 ${SCHEMA_VERSION}）` }
  }
  if (parsed.owned === null || typeof parsed.owned !== 'object' || Array.isArray(parsed.owned)) {
    return { ok: false, error: 'owned 字段缺失或类型错误' }
  }
  if (parsed.practiced === null || typeof parsed.practiced !== 'object' || Array.isArray(parsed.practiced)) {
    return { ok: false, error: 'practiced 字段缺失或类型错误' }
  }
  const createdAt = typeof parsed.createdAt === 'number' && parsed.createdAt > 0 ? parsed.createdAt : Date.now()
  const owned = sanitizeMap(parsed.owned, ITEM_IDS)
  const practiced = sanitizeMap(parsed.practiced, SKILL_IDS)
  return { ok: true, data: { schemaVersion: SCHEMA_VERSION, createdAt, owned, practiced } }
}
