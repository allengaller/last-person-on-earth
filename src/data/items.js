// 物资数据库（doc/02 §一，5 分类 51 条）
export const ITEMS = [
  // 1. 食物与饮水 food-water
  { id: 'fw-01', name: '瓶装饮用水', priority: 'P1', amount: '人均 3L/天 × 3 天', desc: '生命底线，断水第一资源', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-02', name: '军用压缩饼干', priority: 'P1', amount: '人均 2 块/天', desc: '体积小热量高，应急口粮之王', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-03', name: '净水片', priority: 'P1', amount: '50 片装', desc: '不确定水源的安全兜底', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-04', name: '应急罐头', priority: 'P2', amount: '4-6 罐', desc: '无需加热开罐即食，轮换着吃', category: 'food-water', scenarios: ['city', 'wild'], tags: [] },
  { id: 'fw-05', name: '能量棒', priority: 'P2', amount: '1 箱', desc: '便携快速能量补剂', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-06', name: '口服补液盐/电解质粉', priority: 'P2', amount: '1 盒', desc: '腹泻/高温脱水时的续命水', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-07', name: '便携滤水器', priority: 'P2', amount: '1 只', desc: '野外水源直接饮用的底气', category: 'food-water', scenarios: ['wild', 'nuclear'], tags: [] },
  { id: 'fw-08', name: '固体燃料 + 便携炉头', priority: 'P2', amount: '1 套', desc: '没有燃气也能烧热水', category: 'food-water', scenarios: ['wild'], tags: [] },
  { id: 'fw-09', name: '冻干蔬菜包', priority: 'P3', amount: '数包', desc: '长期避险的营养补充', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-10', name: '复合维生素', priority: 'P3', amount: '1 瓶', desc: '食物单一期的营养兜底', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-11', name: '蜂蜜', priority: 'P3', amount: '1 罐', desc: '天然抗菌、几乎永不过期的甜品', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'fw-12', name: '保温壶', priority: 'P3', amount: '1 只', desc: '热水是心理安慰更是体温保障', category: 'food-water', scenarios: ['city', 'wild', 'nuclear'], tags: [] },

  // 2. 医疗急救 medical
  { id: 'md-01', name: '基础急救包', priority: 'P1', amount: '1 套', desc: '创可贴/纱布/胶带/消毒片，一切急救的起点', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-02', name: '碘伏棉签', priority: 'P1', amount: '2 盒', desc: '单支独立包装，伤口消毒首选', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-03', name: '医用口罩 + 手套', priority: 'P1', amount: '各 1 盒', desc: '防感染也防粉尘，废土硬通货', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-04', name: '个人处方药', priority: 'P1', amount: '3-7 天量', desc: '慢性病药断供才是最大风险，遵医嘱定期轮换', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: ['处方药遵医嘱'] },
  { id: 'md-05', name: '以色列绷带', priority: 'P2', amount: '2 条', desc: '加压止血一体式，急救界明星单品', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-06', name: '止血粉', priority: 'P2', amount: '1 瓶', desc: '大出血的紧急手段，配合按压使用', category: 'medical', scenarios: ['wild', 'nuclear'], tags: [] },
  { id: 'md-07', name: '布洛芬/对乙酰氨基酚', priority: 'P2', amount: '1 盒', desc: '退烧止痛 OTC 双雄，按说明书使用', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-08', name: '止泻药', priority: 'P2', amount: '1 盒', desc: '灾后饮水安全的第一道威胁', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-09', name: '抗过敏药', priority: 'P2', amount: '1 盒', desc: '应急食物里万一有你不认识的蛋白', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-10', name: '抗生素类', priority: 'P2', amount: '—', desc: '处方药：遵医嘱备存，勿自行服用，标注适应症与有效期', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: ['处方药遵医嘱'] },
  { id: 'md-11', name: '镊子/剪刀/体温计', priority: 'P2', amount: '1 套', desc: '清创与监测的基础工具', category: 'medical', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'md-12', name: '骨折夹板/三角巾', priority: 'P3', amount: '1 套', desc: '意外跌落的进阶保障', category: 'medical', scenarios: ['wild'], tags: [] },

  // 3. 防护与工具 gear-tools
  { id: 'gt-01', name: '应急保温毯', priority: 'P1', amount: '人均 1 张', desc: '失温是野外头号杀手，一张银毯挡住体温流失', category: 'gear-tools', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'gt-02', name: '手摇手电/头灯', priority: 'P1', amount: '1 支', desc: '不依赖电池的光源才是真光源', category: 'gear-tools', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'gt-03', name: '备用电池', priority: 'P1', amount: '按设备配', desc: '常用型号各备一组，定期检查电量', category: 'gear-tools', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'gt-04', name: '求救哨', priority: 'P1', amount: '人均 1 只', desc: '哨音传播距离是喊叫的数倍，省力救命', category: 'gear-tools', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'gt-05', name: '多功能工兵铲', priority: 'P2', amount: '1 把', desc: '铲/镐/锯/刀合一，加固与脱困两用', category: 'gear-tools', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'gt-06', name: '多功能刀', priority: 'P2', amount: '1 把', desc: '切割开罐钻孔，工具界的万能钥匙', category: 'gear-tools', scenarios: ['wild'], tags: [] },
  { id: 'gt-07', name: '防刺手套', priority: 'P2', amount: '1 副', desc: '废墟搬运和破拆时的第二层皮肤', category: 'gear-tools', scenarios: ['city', 'nuclear'], tags: [] },
  { id: 'gt-08', name: '防水火柴 + 打火石', priority: 'P2', amount: '1 套', desc: '火种冗余原则：重要的事准备两套方案', category: 'gear-tools', scenarios: ['wild'], tags: [] },
  { id: 'gt-09', name: '一次性雨衣', priority: 'P2', amount: '人均 2 件', desc: '保持干燥=保持体温=活下去', category: 'gear-tools', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'gt-10', name: '应急绳索 10m', priority: 'P2', amount: '1 捆', desc: '固定/捆绑/下降，绳子的用法只受想象力限制', category: 'gear-tools', scenarios: ['wild'], tags: [] },
  { id: 'gt-11', name: '防毒面罩 + 备用滤芯', priority: 'P2', amount: '1 套', desc: '粉尘烟雾环境防护，滤芯定期检查', category: 'gear-tools', scenarios: ['nuclear', 'city'], tags: [] },
  { id: 'gt-12', name: '战术笔', priority: 'P3', amount: '1 支', desc: '破窗、书写、应急自卫三合一', category: 'gear-tools', scenarios: ['city'], tags: [] },
  { id: 'gt-13', name: '碳纤维防刺服', priority: 'P3', amount: '按需', desc: '轻量防护装备，高危环境按需配置', category: 'gear-tools', scenarios: ['nuclear'], tags: [] },
  { id: 'gt-14', name: '折叠水桶', priority: 'P3', amount: '1 只', desc: '储水接水，断水期的硬需求', category: 'gear-tools', scenarios: ['city', 'nuclear'], tags: [] },

  // 4. 能源与通讯 power-comm
  { id: 'pc-01', name: '充电宝 20000mAh', priority: 'P1', amount: '1 只', desc: '手机=手电=通讯=地图，保它就是保一切', category: 'power-comm', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'pc-02', name: '现金零钞', priority: 'P1', amount: '小面额为主', desc: '断网时代移动支付归零，现金为王', category: 'power-comm', scenarios: ['city'], tags: [] },
  { id: 'pc-03', name: '手摇发电收音机', priority: 'P2', amount: '1 台', desc: '灾时信息就是命，FM/AM 广播最可靠', category: 'power-comm', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'pc-04', name: '大容量储能电源', priority: 'P2', amount: '1 台', desc: '断电期撑起照明充电与小型电器', category: 'power-comm', scenarios: ['city', 'nuclear'], tags: [] },
  { id: 'pc-05', name: '对讲机 ×2', priority: 'P3', amount: '1 对', desc: '手机网络瘫痪时的近距离通讯备份', category: 'power-comm', scenarios: ['city', 'wild'], tags: [] },
  { id: 'pc-06', name: '信号镜/反光镜', priority: 'P3', amount: '1 面', desc: '阳光下反射信号，野外求救冷门硬技能', category: 'power-comm', scenarios: ['wild'], tags: [] },
  { id: 'pc-07', name: '荧光棒', priority: 'P3', amount: '1 把', desc: '免电池光源，安抚小孩也很有用', category: 'power-comm', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'pc-08', name: '应急蜡烛', priority: 'P3', amount: '1 盒', desc: '长照明兜底，注意明火安全', category: 'power-comm', scenarios: ['city'], tags: [] },

  // 5. 文件与身份 docs
  { id: 'dc-01', name: '证件复印件/电子备份', priority: 'P1', amount: '1 套', desc: '身份恢复与理赔的起点，防水袋密封', category: 'docs', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'dc-02', name: '家庭应急联系卡', priority: 'P1', amount: '人均 1 张', desc: '集合点/紧急联系人，写下来比记在手机里可靠', category: 'docs', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'dc-03', name: '防水袋/密封袋', priority: 'P2', amount: '若干', desc: '文件与电子设备的最后防线', category: 'docs', scenarios: ['city', 'wild', 'nuclear'], tags: [] },
  { id: 'dc-04', name: '家庭应急计划表', priority: 'P2', amount: '1 份', desc: '谁接孩子/去哪集合/关哪总闸，一次讨论终身受益', category: 'docs', scenarios: ['city'], tags: [] },
  { id: 'dc-05', name: '重要合同/保单备份', priority: 'P3', amount: '1 套', desc: '灾后理赔少跑一半腿', category: 'docs', scenarios: ['city'], tags: [] },
]

export const ITEM_MAP = Object.fromEntries(ITEMS.map((item) => [item.id, item]))

export const MEDICAL_NOTICE = '药品使用请遵医嘱及说明书；处方药在医生指导下备存'
