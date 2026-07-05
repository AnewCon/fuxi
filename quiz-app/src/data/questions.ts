export type QuestionType = 'single' | 'multiple' | 'judge'

export interface Question {
  id: number
  type: QuestionType
  content: string
  options: { label: string; text: string }[]
  answer: string
  analysis?: string
}

// 内置默认题库（思想政治）
export const defaultQuestions: Question[] = [
  {
    id: 1, type: 'single',
    content: '党的二十大报告指出，十年来，我们创立了习近平新时代中国特色社会主义思想，明确坚持和发展中国特色社会主义的基本方略，提出一系列治国理政新理念新思想新战略，实现了马克思主义（ ）新的飞跃，坚持不懈用这一创新理论武装头脑、指导实践、推动工作，为新时代党和国家事业发展提供了根本遵循。',
    options: [
      { label: 'A', text: '时代化大众化' },
      { label: 'B', text: '中国化时代化' },
      { label: 'C', text: '中国化现代化' },
      { label: 'D', text: '中国化大众化' },
    ],
    answer: 'B',
  },
  {
    id: 7, type: 'single',
    content: '习近平新时代中国特色社会主义思想坚持把马克思主义基本原理同（ ）相结合，不断夯实马克思主义中国化时代化的历史基础和群众基础。',
    options: [
      { label: 'A', text: '中国实际和时代特征' },
      { label: 'B', text: '中国革命文化' },
      { label: 'C', text: '中国式现代化' },
      { label: 'D', text: '中华优秀传统文化' },
    ],
    answer: 'D',
  },
  {
    id: 12, type: 'single',
    content: '必须坚持（ ）是第一生产力。',
    options: [
      { label: 'A', text: '人才' },
      { label: 'B', text: '资源' },
      { label: 'C', text: '科学技术' },
      { label: 'D', text: '环境' },
    ],
    answer: 'C',
  },
  {
    id: 15, type: 'single',
    content: '要按照"五位一体"总体布局的整体性目标要求，坚持以（ ）为中心，努力推动社会主义物质文明、政治文明、精神文明、社会文明、生态文明协调发展，不断推进和拓展中国式现代化，不断丰富和发展人类文明新形态。',
    options: [
      { label: 'A', text: '文化建设' },
      { label: 'B', text: '经济建设' },
      { label: 'C', text: '社会建设' },
      { label: 'D', text: '政治建设' },
    ],
    answer: 'D',
  },
  {
    id: 19, type: 'single',
    content: '（ ）是党的领导核心地位的必然反映和内在要求，明确了我国政治生活的领导关系、领导主体、领导对象，是中国特色社会主义制度体系的核心。',
    options: [
      { label: 'A', text: '不忘初心、牢记使命的制度' },
      { label: 'B', text: '人民当家作主制度' },
      { label: 'C', text: '全面从严治党制度' },
      { label: 'D', text: '党的领导制度' },
    ],
    answer: 'D',
  },
  {
    id: 21, type: 'single',
    content: '在当今中国，最高政治领导力量是（ ）。',
    options: [
      { label: 'A', text: '全国人民代表大会' },
      { label: 'B', text: '中国共产党' },
      { label: 'C', text: '中国人民政治协商会议' },
      { label: 'D', text: '无产阶级' },
    ],
    answer: 'B',
  },
  {
    id: 26, type: 'single',
    content: '新时代新征程，坚持马克思主义在意识形态领域指导地位的根本制度，必须牢牢掌握（ ），坚持以立为本、立破并举，提高政治自觉。',
    options: [
      { label: 'A', text: '马克思主义的科学理论' },
      { label: 'B', text: '网络空间的治理和引导' },
      { label: 'C', text: '党对意识形态工作领导权' },
      { label: 'D', text: '中国特色社会主义科学体系的构建' },
    ],
    answer: 'C',
  },
  {
    id: 36, type: 'single',
    content: '（ ）是全面建设社会主义现代化国家的重要目标，也是满足人民日益增长的优美生态环境需要的必然要求。',
    options: [
      { label: 'A', text: '建设美丽中国' },
      { label: 'B', text: '丰富精神生活' },
      { label: 'C', text: '改善居住环境' },
      { label: 'D', text: '提高人均收入' },
    ],
    answer: 'A',
  },
  {
    id: 37, type: 'single',
    content: '构建新发展格局必须发挥比较优势，以（ ）吸引全球资源要素。',
    options: [
      { label: 'A', text: '国内大循环' },
      { label: 'B', text: '国内小循环' },
      { label: 'C', text: '国际大循环' },
      { label: 'D', text: '国际小循环' },
    ],
    answer: 'A',
  },
  {
    id: 38, type: 'single',
    content: '新时代国家安全工作的基本遵循是（ ）。',
    options: [
      { label: 'A', text: '强化人民军队建设' },
      { label: 'B', text: '维护国家安全、主权、发展利益' },
      { label: 'C', text: '总体国家安全观' },
      { label: 'D', text: '实现祖国完全统一' },
    ],
    answer: 'C',
  },
  {
    id: 39, type: 'single',
    content: '宏观调控的主要任务是保持经济（ ）平衡，促进重大经济结构协调和生产力布局优化，减缓经济周期波动影响，防范区域性、系统性风险，稳定市场预期，实现经济持续健康发展。',
    options: [
      { label: 'A', text: '总量' },
      { label: 'B', text: '运行' },
      { label: 'C', text: '动态' },
      { label: 'D', text: '综合' },
    ],
    answer: 'A',
  },
  {
    id: 40, type: 'single',
    content: '（ ）是应对国家安全形势新变化新趋势的战略选择，是全面贯彻落实总体国家安全观的重大举措。',
    options: [
      { label: 'A', text: '统筹稳定和发展' },
      { label: 'B', text: '构建新发展格局' },
      { label: 'C', text: '构建新安全格局' },
      { label: 'D', text: '建立强大的军队' },
    ],
    answer: 'C',
  },
  {
    id: 44, type: 'single',
    content: '新时代强军目标的核心是（ ）。',
    options: [
      { label: 'A', text: '听党指挥' },
      { label: 'B', text: '能打胜仗' },
      { label: 'C', text: '作风优良' },
      { label: 'D', text: '全面建成世界一流军队' },
    ],
    answer: 'B',
  },
  {
    id: 47, type: 'single',
    content: '新时代新征程，要健全（ ），充分发挥国家作为重大科技创新组织者的作用。',
    options: [
      { label: 'A', text: '新型领导机制' },
      { label: 'B', text: '新型组织机制' },
      { label: 'C', text: '新型经济体制' },
      { label: 'D', text: '新型举国体制' },
    ],
    answer: 'D',
  },
  {
    id: 50, type: 'single',
    content: '中国特色大国外交以（ ）为总目标，始终坚持维护世界和平、促进共同发展的宗旨。',
    options: [
      { label: 'A', text: '和平发展' },
      { label: 'B', text: '推动构建人类命运共同体' },
      { label: 'C', text: '合作共赢' },
      { label: 'D', text: '美丽世界' },
    ],
    answer: 'B',
  },
  {
    id: 54, type: 'single',
    content: '（ ）是新时代党的建设的鲜明主题。',
    options: [
      { label: 'A', text: '群众路线' },
      { label: 'B', text: '依规治党' },
      { label: 'C', text: '调查研究' },
      { label: 'D', text: '全面从严治党' },
    ],
    answer: 'D',
  },
  {
    id: 68, type: 'single',
    content: '（ ）是中国共产党夺取革命、建设、改革事业胜利的重要法宝，也是实现中华民族伟大复兴的重要法宝。',
    options: [
      { label: 'A', text: '统一战线' },
      { label: 'B', text: '武装斗争' },
      { label: 'C', text: '独立自主' },
      { label: 'D', text: '群众路线' },
    ],
    answer: 'A',
  },
  {
    id: 74, type: 'single',
    content: '（ ）是科学帅才，是国家战略人才力量的"关键少数"。',
    options: [
      { label: 'A', text: '战略科学家' },
      { label: 'B', text: '科技领军人才和创新团队' },
      { label: 'C', text: '青年科技人才' },
      { label: 'D', text: '卓越工程师' },
    ],
    answer: 'A',
  },
  {
    id: 81, type: 'single',
    content: '构建新发展格局最本质的特征是实现高水平的自立自强。（ ）自立自强是我国经济生存和发展的基础，是畅通国内国际双循环、促进我国发展大局的关键。',
    options: [
      { label: 'A', text: '智能' },
      { label: 'B', text: '科技' },
      { label: 'C', text: '创新' },
      { label: 'D', text: '研究' },
    ],
    answer: 'B',
  },
  {
    id: 84, type: 'single',
    content: '推动高质量发展，要更好统筹质的有效提升和量的合理增长，始终坚持质量第一、（ ）优先。',
    options: [
      { label: 'A', text: '利益' },
      { label: 'B', text: '速度' },
      { label: 'C', text: '人才' },
      { label: 'D', text: '效益' },
    ],
    answer: 'D',
  },
  {
    id: 85, type: 'single',
    content: '（ ）是更基础、更广泛、更深厚的自信，是一个国家、一个民族发展中最基本、最深沉、最持久的力量。',
    options: [
      { label: 'A', text: '道路自信' },
      { label: 'B', text: '制度自信' },
      { label: 'C', text: '文化自信' },
      { label: 'D', text: '理论自信' },
    ],
    answer: 'C',
  },
  {
    id: 86, type: 'single',
    content: '要突出坚持和完善支撑中国特色社会主义制度的根本制度、基本制度、重要制度，着力固根基、扬优势、补短板、强弱项，构建（ ）的制度体系，让各方面制度更加成熟更加定型。',
    options: [
      { label: 'A', text: '科学规范、管理高效、运行有效' },
      { label: 'B', text: '系统完备、科学规范、管理高效' },
      { label: 'C', text: '系统完备、管理高效、运行有效' },
      { label: 'D', text: '系统完备、科学规范、运行有效' },
    ],
    answer: 'D',
  },
  {
    id: 87, type: 'single',
    content: '（ ）集中体现了一个国家基于文化而具有的凝聚力和生命力，以及由此产生的吸引力和影响力。',
    options: [
      { label: 'A', text: '文化软实力' },
      { label: 'B', text: '意识形态' },
      { label: 'C', text: '传统文化' },
      { label: 'D', text: '核心价值观' },
    ],
    answer: 'A',
  },
  {
    id: 89, type: 'single',
    content: '（ ）是我们坚持立党为公、执政为民的本质要求。',
    options: [
      { label: 'A', text: '增进民生福祉' },
      { label: 'B', text: '建立强大的国防' },
      { label: 'C', text: '全面依法治国' },
      { label: 'D', text: '思想政治教育' },
    ],
    answer: 'A',
  },
  {
    id: 90, type: 'single',
    content: '（ ）是推进党和人民事业发展的必然要求。',
    options: [
      { label: 'A', text: '人民当家作主' },
      { label: 'B', text: '坚持依法治国' },
      { label: 'C', text: '坚持党的领导' },
      { label: 'D', text: '改革开放永无止境' },
    ],
    answer: 'D',
  },
  {
    id: 91, type: 'single',
    content: '基层治理是国家治理的基石，（ ）是社会治理最基本的单元，是党和政府联系、服务居民群众的"最后一公里"。',
    options: [
      { label: 'A', text: '党支部' },
      { label: 'B', text: '村民自治' },
      { label: 'C', text: '城乡社区' },
      { label: 'D', text: '市域治理' },
    ],
    answer: 'C',
  },
  {
    id: 94, type: 'single',
    content: '（ ）是一个成熟的马克思主义执政党的重大建党原则。',
    options: [
      { label: 'A', text: '两个确立' },
      { label: 'B', text: '党的政治建设' },
      { label: 'C', text: '中国特色社会主义理论体系' },
      { label: 'D', text: '维护党中央权威和集中统一领导' },
    ],
    answer: 'D',
  },
  {
    id: 97, type: 'single',
    content: '每年（ ）被确定为全民国家安全教育日。',
    options: [
      { label: 'A', text: '4月15日' },
      { label: 'B', text: '5月17日' },
      { label: 'C', text: '6月15日' },
      { label: 'D', text: '7月30日' },
    ],
    answer: 'A',
  },
  {
    id: 98, type: 'single',
    content: '中国共产党的（ ）是中国特色社会主义制度优势的主要来源。',
    options: [
      { label: 'A', text: '政治优势' },
      { label: 'B', text: '自身优势' },
      { label: 'C', text: '组织优势' },
      { label: 'D', text: '领导优势' },
    ],
    answer: 'B',
  },
  {
    id: 100, type: 'single',
    content: '中国共产党是我国最高政治领导力量，党的领导制度在我国国家政治制度体系中居于（ ）地位。',
    options: [
      { label: 'A', text: '统领' },
      { label: 'B', text: '主导' },
      { label: 'C', text: '中心' },
      { label: 'D', text: '指挥' },
    ],
    answer: 'A',
  },
  {
    id: 102, type: 'single',
    content: '党的十九大概括的以（ ）为主要内容的基本方略，涵盖了坚持党的全面领导和全面从严治党，涵盖了"五位一体"总体布局和"四个全面"战略布局，涵盖了国防和军队建设、维护国家安全、"一国两制"和祖国统一、对外战略等方面，反映了我们党对建设中国特色社会主义的规律性认识。',
    options: [
      { label: 'A', text: '"十四个坚持"' },
      { label: 'B', text: '"十个明确"' },
      { label: 'C', text: '"六个必须坚持"' },
      { label: 'D', text: '"十三个方面成就"' },
    ],
    answer: 'A',
  },
  {
    id: 105, type: 'single',
    content: '（ ）是中国特色社会主义的伟大创举，是香港、澳门回归后保持长期繁荣稳定的最佳制度安排。',
    options: [
      { label: 'A', text: '高度自治' },
      { label: 'B', text: '落实"爱国者治港""爱国者治澳"原则' },
      { label: 'C', text: '"港人治港""澳人治澳"' },
      { label: 'D', text: '"一国两制"' },
    ],
    answer: 'D',
  },
  {
    id: 106, type: 'single',
    content: '科学社会主义在21世纪的中国焕发出新的蓬勃生机，（ ）为人类实现现代化提供了新的选择，中国共产党和中国人民为解决人类面临的共同问题提供更多更好的中国智慧、中国方案、中国力量，为人类和平与发展崇高事业作出新的更大的贡献！',
    options: [
      { label: 'A', text: '中国特色社会主义现代化' },
      { label: 'B', text: '中国式现代化' },
      { label: 'C', text: '中国现代化' },
      { label: 'D', text: '社会主义现代化' },
    ],
    answer: 'B',
  },
  {
    id: 110, type: 'single',
    content: '（ ）是对坚持和发展马克思主义作出的重大理论贡献，是我们党在探索中国特色社会主义道路中得出的规律性认识，是我们取得成功的最大法宝。',
    options: [
      { label: 'A', text: '"两个坚持"' },
      { label: 'B', text: '"两个结合"' },
      { label: 'C', text: '"两个维护"' },
      { label: 'D', text: '"两个确立"' },
    ],
    answer: 'B',
  },
  {
    id: 111, type: 'single',
    content: '无论国际形势如何变幻，（ ）这一我国对外工作的根本任务没有变，也不能变。',
    options: [
      { label: 'A', text: '维护国家利益' },
      { label: 'B', text: '维护世界和平' },
      { label: 'C', text: '促进共同发展' },
      { label: 'D', text: '实现经济发展' },
    ],
    answer: 'A',
  },
  {
    id: 114, type: 'single',
    content: '面对复杂多变的国际环境带来的新矛盾新挑战，以习近平同志为核心的党中央深刻把握中国和世界关系的历史性变化，深刻回答"（ ）"的历史之问。',
    options: [
      { label: 'A', text: '人类社会从何而来' },
      { label: 'B', text: '人类社会经济变化' },
      { label: 'C', text: '人类社会何去何从' },
      { label: 'D', text: '人类社会如何发展' },
    ],
    answer: 'C',
  },
  {
    id: 115, type: 'single',
    content: '马克思主义能不能在实践中发挥作用，关键在于能否把马克思主义基本原理同（ ）结合起来，关键在于能否运用其科学的世界观和方法论解决中国的问题。',
    options: [
      { label: 'A', text: '中国革命文化' },
      { label: 'B', text: '中国式现代化' },
      { label: 'C', text: '中华优秀传统文化' },
      { label: 'D', text: '中国实际和时代特征' },
    ],
    answer: 'D',
  },
  {
    id: 117, type: 'single',
    content: '提出构建人类命运共同体重大理念，提出共建"一带一路"倡议，提出全球发展倡议、全球安全倡议、全球文明倡议，深刻回答（ ）的时代课题。',
    options: [
      { label: 'A', text: '"共建人类家园"' },
      { label: 'B', text: '"什么是人类命运共同体"' },
      { label: 'C', text: '"人类向何处去"' },
      { label: 'D', text: '"世界怎么了、我们怎么办"' },
    ],
    answer: 'D',
  },
  {
    id: 118, type: 'single',
    content: '中国特色大国外交建立在正确的（ ）、大局观、角色观基础之上。',
    options: [
      { label: 'A', text: '民族观' },
      { label: 'B', text: '文化观' },
      { label: 'C', text: '价值观' },
      { label: 'D', text: '历史观' },
    ],
    answer: 'D',
  },
  {
    id: 121, type: 'multiple',
    content: '中国特色社会主义进入新时代的判断依据有（ ）。',
    options: [
      { label: 'A', text: '是我国社会主要矛盾发生新变化的反映' },
      { label: 'B', text: '是党的主要任务发生新变化的反映' },
      { label: 'C', text: '是中国和世界关系发生新变化的反映' },
      { label: 'D', text: '是我国经济发生新变化的反映' },
    ],
    answer: 'ABC',
  },
  {
    id: 126, type: 'multiple',
    content: '中国共产党作为最高政治领导力量是由（ ）决定的。',
    options: [
      { label: 'A', text: '人民群众的意愿' },
      { label: 'B', text: '各民主党派以及无党派民主人士' },
      { label: 'C', text: '中华民族伟大复兴事业' },
      { label: 'D', text: '我国国家性质和政治制度体系' },
    ],
    answer: 'CD',
  },
  {
    id: 127, type: 'multiple',
    content: '推动构建新型国际关系，就是要秉持（ ）原则，走出一条对话而不对抗、结伴而不结盟的国与国交往新路。',
    options: [
      { label: 'A', text: '公平正义' },
      { label: 'B', text: '相互尊重' },
      { label: 'C', text: '结盟互惠' },
      { label: 'D', text: '合作共赢' },
    ],
    answer: 'ABD',
  },
  {
    id: 129, type: 'multiple',
    content: '坚持人民至上，就要（ ）。',
    options: [
      { label: 'A', text: '坚持把人民对美好生活的向往作为党的奋斗目标' },
      { label: 'B', text: '把人民作为党的工作的最高裁决者和最终评判者' },
      { label: 'C', text: '充分调动和激发全体人民的积极性主动性创造性' },
      { label: 'D', text: '紧紧依靠人民创造新的历史伟业' },
    ],
    answer: 'ABCD',
  },
  {
    id: 131, type: 'multiple',
    content: '建设（ ）具有内在统一性和相互支撑性。',
    options: [
      { label: 'A', text: '教育强国' },
      { label: 'B', text: '科技强国' },
      { label: 'C', text: '人才强国' },
      { label: 'D', text: '文化强国' },
    ],
    answer: 'ABC',
  },
  {
    id: 133, type: 'multiple',
    content: '习近平新时代中国特色社会主义思想，把马克思主义基本原理同（ ）相结合，使马克思主义这个魂脉和中华优秀传统文化这个根脉内在贯通、相互成就，是中华民族的文化主体性最有力的体现，是中华文化和中国精神的时代精华。',
    options: [
      { label: 'A', text: '中国革命文化' },
      { label: 'B', text: '中华优秀传统文化' },
      { label: 'C', text: '中国具体实际' },
      { label: 'D', text: '社会主义核心价值观' },
    ],
    answer: 'BC',
  },
  {
    id: 135, type: 'multiple',
    content: '全过程人民民主是（ ）的民主。',
    options: [
      { label: 'A', text: '最成熟' },
      { label: 'B', text: '最广泛' },
      { label: 'C', text: '最真实' },
      { label: 'D', text: '最管用' },
    ],
    answer: 'BCD',
  },
  {
    id: 145, type: 'judge',
    content: '自我革命是新时代中国共产党找到的跳出治乱兴衰历史周期率的第一个答案。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '第一个答案是人民监督政府；自我革命是第二个答案。',
  },
  {
    id: 148, type: 'judge',
    content: '新时代全面深化改革开放，就是要使中国特色社会主义制度更加成熟更加定型，推进国家治理体系和治理能力现代化。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '对',
  },
  {
    id: 150, type: 'judge',
    content: '我国的国体是人民代表大会制度；我国的政体是工人阶级领导的、以工农联盟为基础的人民民主专政的社会主义国家。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '国体是人民民主专政，政体是人民代表大会制度，表述说反了。',
  },
  {
    id: 156, type: 'judge',
    content: '维护党中央权威和集中统一领导，同坚持党的民主集中制是完全一致的。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '对',
  },
  {
    id: 171, type: 'judge',
    content: '全面建设社会主义现代化国家，最艰巨最繁重的任务在农村。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '对',
  },
  {
    id: 173, type: 'judge',
    content: '新时代我国社会主要矛盾的变化，改变了对我国社会主义所处历史阶段的判断。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '社会主要矛盾的变化，没有改变对我国社会主义所处历史阶段的判断，我国仍处于并将长期处于社会主义初级阶段。',
  },
  {
    id: 176, type: 'judge',
    content: '社会主义发展道路从来都不是笔直的，始终充满着险阻曲折，需要依靠借鉴他国先进经验打开事业发展新天地。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '需要依靠顽强斗争打开事业发展新天地。',
  },
  {
    id: 177, type: 'judge',
    content: '我国进入新发展阶段的历史依据是我们已经拥有开启新征程、实现新的更高目标的雄厚物质基础。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
  },
  {
    id: 179, type: 'judge',
    content: '坚持和完善基本分配制度，要强化以增加管理价值为导向的收入分配政策。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '应强化以增加知识价值为导向的收入分配政策。',
  },
  {
    id: 181, type: 'judge',
    content: '江山就是人民、人民就是江山，这是由人民群众在党和国家中的地位决定的。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '这是由我们党的性质、宗旨决定的。',
  },
  {
    id: 188, type: 'judge',
    content: '我们党聚焦民生重点领域，促进收入分配更合理、更有序，推动形成金字塔型分配格局。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '推动形成橄榄型分配格局。',
  },
  {
    id: 192, type: 'judge',
    content: '把马克思主义基本原理同中华优秀传统文化相结合是"两个结合"中的"第一个结合"。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '第一个结合是同中国具体实际相结合；第二个结合是同中华优秀传统文化相结合。',
  },
  {
    id: 193, type: 'judge',
    content: '"物竞天择"思想是中华文明的鲜明特色和独特标识，代表着我们祖先对处理人与自然关系的重要认识。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '"天人合一"是中华文明的鲜明特色和独特标识。',
  },
  {
    id: 195, type: 'judge',
    content: '党在新时代的强军目标中，能打胜仗是保证，关系军队的性质、宗旨、本色。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '听党指挥是灵魂，能打胜仗是核心，作风优良是保证。',
  },
  {
    id: 198, type: 'judge',
    content: '"一国"之内的"两制"等量齐观、比肩并列。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '"一国"是实行"两制"的前提和基础，"两制"从属和派生于"一国"并统一于"一国"之内。',
  },
  {
    id: 200, type: 'judge',
    content: '中国积极参与全球治理体系改革和建设，践行共商共治共谋的全球治理观。（ ）',
    options: [
      { label: 'A', text: '对' },
      { label: 'B', text: '错' },
    ],
    answer: '错',
    analysis: '践行共商共建共享的全球治理观。',
  },
]
