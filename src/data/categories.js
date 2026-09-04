// 分类元数据（doc/02 §一 · 权重见 doc/04 §3.1）
export const CATEGORIES = [
  { id: 'food-water', name: '食物饮水', weight: 0.25 },
  { id: 'medical', name: '医疗急救', weight: 0.25 },
  { id: 'gear-tools', name: '防护工具', weight: 0.2 },
  { id: 'power-comm', name: '能源通讯', weight: 0.2 },
  { id: 'docs', name: '文件身份', weight: 0.1 },
]

export const CATEGORY_WEIGHTS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.weight]),
)

export const SCENARIO_LABELS = {
  city: '城市避难',
  wild: '野外求生',
  nuclear: '核污染区',
}
