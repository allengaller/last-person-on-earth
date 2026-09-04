// 场景库（doc/02 §二，3 场景 + v0.3 预留）
export const SCENARIOS = [
  {
    id: 'city',
    name: '城市避难',
    riskLevel: 'MEDIUM',
    color: 'warning',
    summary: '台风、内涝、长时间停电停水停网——最高概率发生的"末日"，也是大多数家庭真正的刚需。',
    principle: '居家避险为主（Bugging In），储备支撑 72 小时，等得起新闻里的下一步通知。',
    tips: ['远离窗户', '浴缸储水', '低楼层关注内涝', '电动车/电梯第一时间别用'],
    recommended: {
      P1: ['fw-01', 'fw-02', 'md-01', 'md-03', 'gt-01', 'gt-02', 'gt-03', 'gt-04', 'pc-01', 'pc-02', 'dc-01', 'dc-02'],
      P2: ['fw-04', 'fw-06', 'md-07', 'md-08', 'md-09', 'gt-05', 'gt-09', 'gt-14', 'pc-03', 'pc-04', 'dc-03', 'dc-04'],
      P3: ['gt-12', 'pc-07', 'pc-08'],
    },
  },
  {
    id: 'wild',
    name: '野外求生',
    riskLevel: 'MEDIUM',
    color: 'rad',
    summary: '徒步失联、自驾抛锚、露营遇变——远离补给线的 24-72 小时，考验的是随身装备（EDC/BOB）。',
    principle: '保持体温 > 补水 > 信号求救 > 等待救援，不做超出能力的移动。',
    tips: ['出发前留行程单给家人', '天黑前决策就地过夜', '颜色鲜艳的装备 = 空中的希望'],
    recommended: {
      P1: ['fw-01', 'fw-02', 'fw-03', 'md-01', 'gt-01', 'gt-02', 'gt-04', 'pc-01'],
      P2: ['fw-07', 'fw-08', 'md-05', 'md-06', 'gt-06', 'gt-08', 'gt-10', 'md-12'],
      P3: ['pc-06', 'fw-12'],
    },
  },
  {
    id: 'nuclear',
    name: '核污染区避险',
    riskLevel: 'HIGH',
    color: 'alert',
    summary: '核设施事故类极端场景。参考权威应急口径：室内隐蔽（Shelter-in-place）是第一动作，等待官方撤离指令。',
    principle: '时间换空间——在室内远离门窗，用墙体质量挡辐射，收音机等待指令。',
    tips: ['碘化钾仅在官方指导下服用', '胶带封窗缝', '收音机 > 手机（基站会挤爆）'],
    recommended: {
      P1: ['fw-01', 'fw-02', 'md-01', 'md-03', 'md-04', 'gt-02', 'pc-03', 'pc-01', 'dc-01'],
      P2: ['fw-03', 'fw-07', 'gt-07', 'gt-11', 'pc-04', 'md-10'],
      P3: ['gt-13', 'gt-14'],
    },
  },
]

export const SCENARIO_MAP = Object.fromEntries(SCENARIOS.map((s) => [s.id, s]))
