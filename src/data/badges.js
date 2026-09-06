// 成就徽章（doc/01 §4.5，v0.2）：判定为纯函数，不落库
import { ITEMS } from './items.js'
import { CATEGORIES } from './categories.js'
import { SKILLS, SKILL_BRANCHES } from './skills.js'
import { SCENARIOS } from './scenarios.js'
import { isSkillUnlocked, ownedRateOf, scenarioStats, totalReadiness } from '../stores/scoring.js'

const P1_IDS = ITEMS.filter((i) => i.priority === 'P1').map((i) => i.id)

export const BADGES = [
  {
    id: 'first-steps',
    name: '初出茅庐',
    desc: '总准备度达到 20，告别纯脆皮段位。',
    test: (owned, practiced) => totalReadiness(owned, practiced) >= 20,
  },
  {
    id: 'p1-complete',
    name: '有备无患',
    desc: `${P1_IDS.length} 件生死攸关物资全部入库，72 小时内有得打。`,
    test: (owned) => P1_IDS.every((id) => owned[id]),
  },
  {
    id: 'category-full',
    name: '弹药充足',
    desc: '任一分类物资拥有率 100%。',
    test: (owned) => CATEGORIES.some((c) => ownedRateOf(ITEMS.filter((i) => i.category === c.id), owned) >= 1),
  },
  {
    id: 'branch-novice',
    name: '三足鼎立',
    desc: '3 个技能分支各有节点解锁。',
    test: (owned, practiced) => {
      const litBranches = new Set(
        SKILLS.filter((s) => isSkillUnlocked(s, owned, practiced)).map((s) => s.branch),
      )
      return litBranches.size >= Math.min(3, SKILL_BRANCHES.length)
    },
  },
  {
    id: 'scenario-ready',
    name: '全境预案',
    desc: '任一场景推荐组合全部入库。',
    test: (owned) => SCENARIOS.some((s) => scenarioStats(s, owned).rate >= 1),
  },
  {
    id: 'practiced-five',
    name: '勤学苦练',
    desc: '标记练习 5 项技能。',
    test: (_owned, practiced) => Object.keys(practiced).length >= 5,
  },
  {
    id: 'veteran',
    name: '老练幸存者',
    desc: '总准备度达到 61。',
    test: (owned, practiced) => totalReadiness(owned, practiced) >= 61,
  },
  {
    id: 'legend',
    name: '废土传说',
    desc: '总准备度达到 81，段位天花板。',
    test: (owned, practiced) => totalReadiness(owned, practiced) >= 81,
  },
]

export function earnedBadges(owned, practiced) {
  return BADGES.map((b) => ({ ...b, earned: !!b.test(owned, practiced) }))
}
