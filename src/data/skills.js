// 技能树（doc/02 §三，5 分支 × 3 级）
export const SKILL_BRANCHES = [
  { id: 'water', name: '净水与储水' },
  { id: 'first-aid', name: '急救与医疗' },
  { id: 'shelter', name: '庇护与保暖' },
  { id: 'navigation', name: '导航与规划' },
  { id: 'comms', name: '通讯与求救' },
]

export const SKILLS = [
  // 分支 1：净水与储水 water
  { id: 'water-1', branch: 'water', tier: 1, name: '认识净水', desc: '看懂净水片剂量与静置时间', requireItems: ['fw-03'], requireItemsCount: 1, requirePractice: false },
  { id: 'water-2', branch: 'water', tier: 2, name: '煮沸与储存', desc: '煮沸 1 分钟（高原 3 分钟）与容器管理', requireItems: ['fw-01', 'fw-03'], requireItemsCount: 2, requirePractice: true },
  { id: 'water-3', branch: 'water', tier: 3, name: '自然水源净化', desc: '纱布过滤→活性炭→煮沸的多层流程', requireItems: ['fw-07', 'fw-03'], requireItemsCount: 2, requirePractice: true },

  // 分支 2：急救与医疗 first-aid
  { id: 'first-aid-1', branch: 'first-aid', tier: 1, name: '止血与包扎', desc: '直接按压、加压包扎的规范动作', requireItems: ['md-01'], requireItemsCount: 1, requirePractice: false },
  { id: 'first-aid-2', branch: 'first-aid', tier: 2, name: '烧伤与固定', desc: '冲脱泡盖送 + 三角巾固定', requireItems: ['md-01', 'md-11'], requireItemsCount: 2, requirePractice: true },
  { id: 'first-aid-3', branch: 'first-aid', tier: 3, name: '药品管理', desc: '家庭药箱轮换、有效期台账', requireItems: ['md-04', 'md-07'], requireItemsCount: 2, requirePractice: true },

  // 分支 3：庇护与保暖 shelter
  { id: 'shelter-1', branch: 'shelter', tier: 1, name: '保住体温', desc: '保温毯正确裹法与地面隔热', requireItems: ['gt-01'], requireItemsCount: 1, requirePractice: false },
  { id: 'shelter-2', branch: 'shelter', tier: 2, name: '家庭加固', desc: '封窗、断水电总闸、安全屋选择', requireItems: ['gt-01', 'gt-05'], requireItemsCount: 2, requirePractice: true },
  { id: 'shelter-3', branch: 'shelter', tier: 3, name: '野外庇护所', desc: '背风、排水、隔地的三要素', requireItems: ['gt-05', 'gt-10'], requireItemsCount: 2, requirePractice: true },

  // 分支 4：导航与规划 navigation
  { id: 'navigation-1', branch: 'navigation', tier: 1, name: '地图与集合点', desc: '看懂纸质地图 + 家庭集合点制度', requireItems: ['dc-02'], requireItemsCount: 1, requirePractice: false },
  { id: 'navigation-2', branch: 'navigation', tier: 2, name: '方向判断', desc: '指北针用法与太阳/星辰备份方案', requireItems: ['dc-02', 'dc-04'], requireItemsCount: 2, requirePractice: true },
  { id: 'navigation-3', branch: 'navigation', tier: 3, name: '撤离路线规划', desc: '主路线 + 备用路线 + 步行修正', requireItems: ['dc-04', 'dc-05'], requireItemsCount: 2, requirePractice: true },

  // 分支 5：通讯与求救 comms
  { id: 'comms-1', branch: 'comms', tier: 1, name: 'SOS 与哨语', desc: '三短三长三短 + 哨音节奏', requireItems: ['gt-04'], requireItemsCount: 1, requirePractice: false },
  { id: 'comms-2', branch: 'comms', tier: 2, name: '灾时信息获取', desc: '收音机频段清单与信息甄别', requireItems: ['gt-02', 'pc-03'], requireItemsCount: 2, requirePractice: true },
  { id: 'comms-3', branch: 'comms', tier: 3, name: '远距求救', desc: '信号镜瞄准口诀与对讲机频道约定', requireItems: ['pc-05', 'pc-06'], requireItemsCount: 2, requirePractice: true },
]
