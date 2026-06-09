import { Injectable } from '@nestjs/common';

export interface PlantCharacteristic {
  name: string;
  description: string;
}

export interface PlantUsage {
  category: string;
  description: string;
}

export interface SimilarPlant {
  name: string;
  chineseName: string;
  difference: string;
}

export interface PlantRecognitionResult {
  chineseName: string;
  scientificName: string;
  englishName: string;
  family: string;
  genus: string;
  confidence: number;
  description: string;
  plantType: string;
  nativeHabitat: string;
  growthHabits: string;
  characteristics: PlantCharacteristic[];
  uses: PlantUsage[];
  growingTips: string[];
  similarPlants: SimilarPlant[];
  tags: string[];
  seasonalInfo: string;
  toxicity: string;
}

@Injectable()
export class PlantRecognitionService {
  private plantDatabase = [
    {
      chineseName: '牡丹',
      scientificName: 'Paeonia suffruticosa',
      englishName: 'Tree Peony',
      family: '芍药科 Paeoniaceae',
      genus: '芍药属 Paeonia',
      confidence: 0.93,
      description: '中国传统名花，被誉为"花中之王"。花朵硕大，色彩艳丽，雍容华贵，是富贵吉祥的象征。',
      plantType: '落叶灌木',
      nativeHabitat: '中国西北部，现广泛栽培于全国各地',
      growthHabits: '喜温暖凉爽气候，耐寒耐旱，怕积水，喜阳光也耐半阴',
      characteristics: [
        { name: '叶片', description: '二回三出复叶，小叶阔卵形至卵状长椭圆形，先端3-5裂，表面绿色无毛，背面粉白色' },
        { name: '花朵', description: '花单生枝顶，直径10-30厘米，花瓣5或为重瓣，颜色有白、粉、红、紫、黄、绿等多种' },
        { name: '果实', description: '蓇葖果，密生黄褐色硬毛，成熟时开裂' },
        { name: '茎干', description: '木质茎，高可达2米，分枝短而粗' }
      ],
      uses: [
        { category: '观赏价值', description: '著名观赏花卉，常用于园林造景、盆栽观赏' },
        { category: '药用价值', description: '根皮入药，称为"丹皮"，具有清热凉血、活血化瘀的功效' },
        { category: '文化价值', description: '中国国花候选，象征富贵吉祥，广泛出现在诗词、绘画、工艺品中' }
      ],
      growingTips: [
        '栽植宜在秋季进行，春季栽植往往不易开花',
        '选择地势高燥、排水良好的地方，忌低洼积水',
        '施肥以有机肥为主，花前花后各追施一次磷钾肥',
        '修剪一般在秋冬落叶后进行，去除弱枝、病枝、过密枝',
        '夏季注意遮阴防暴晒，冬季北方寒冷地区需适当防寒'
      ],
      similarPlants: [
        { name: 'Paeonia lactiflora', chineseName: '芍药', difference: '牡丹为木本，芍药为草本；牡丹叶片多裂，芍药叶片较尖' },
        { name: 'Paeonia rockii', chineseName: '紫斑牡丹', difference: '花瓣基部有明显紫斑，为珍贵野生品种' }
      ],
      tags: ['国花候选', '名贵花卉', '药用植物', '落叶灌木', '春季开花'],
      seasonalInfo: '花期4-5月，果期8-9月',
      toxicity: '无毒，但丹皮用量过大可能引起恶心、头晕等不适'
    },
    {
      chineseName: '荷花',
      scientificName: 'Nelumbo nucifera',
      englishName: 'Lotus',
      family: '莲科 Nelumbonaceae',
      genus: '莲属 Nelumbo',
      confidence: 0.95,
      description: '水生花卉代表，出淤泥而不染，是中国十大名花之一，也是印度、越南的国花。',
      plantType: '多年生水生草本',
      nativeHabitat: '亚洲热带和温带地区，中国南北各省均有分布',
      growthHabits: '喜温暖湿润、阳光充足的环境，水生植物，适宜静水池塘或湖泊生长',
      characteristics: [
        { name: '叶片', description: '叶盾状圆形，直径25-90厘米，表面深绿色，被蜡质白粉，背面灰绿色' },
        { name: '花朵', description: '花单生于花梗顶端，直径10-25厘米，花瓣多数，有红、粉红、白、紫等色，或有彩纹、镶边' },
        { name: '果实', description: '坚果椭圆形或卵形，俗称"莲子"，嵌生于海绵质花托内' },
        { name: '根茎', description: '地下茎肥厚横生，节间膨大，内有多数纵行通气孔道，即"莲藕"' }
      ],
      uses: [
        { category: '观赏价值', description: '园林水景重要造景材料，也可盆栽观赏' },
        { category: '食用价值', description: '莲藕、莲子、莲蓬均可食用，是常见的食材' },
        { category: '药用价值', description: '莲子、莲心、荷叶、莲房均可入药，具有清心安神、健脾止泻等功效' },
        { category: '文化价值', description: '佛教圣花，象征纯洁清净；也是君子品格的象征' }
      ],
      growingTips: [
        '种植水深一般为30-120厘米，不宜过深',
        '选择肥沃的塘泥或河泥作为种植基质',
        '生长期需充足阳光，每天至少6小时以上光照',
        '冬季北方地区需将种藕挖出室内贮藏或保持水面不结冰',
        '可在春季将种藕斜插泥中，顶芽向上，尾节露出泥面'
      ],
      similarPlants: [
        { name: 'Nymphaea tetragona', chineseName: '睡莲', difference: '荷花叶片高出水面，睡莲叶浮于水面；荷花有莲蓬，睡莲无' },
        { name: 'Nelumbo lutea', chineseName: '美洲黄莲', difference: '花黄色，原产美洲，耐寒性较差' }
      ],
      tags: ['水生植物', '十大名花', '食用花卉', '药用植物', '夏季开花'],
      seasonalInfo: '花期6-9月，果期8-10月',
      toxicity: '无毒，全株均可食用或药用'
    },
    {
      chineseName: '梅花',
      scientificName: 'Prunus mume',
      englishName: 'Mei Flower / Plum Blossom',
      family: '蔷薇科 Rosaceae',
      genus: '李属 Prunus',
      confidence: 0.92,
      description: '中国十大名花之首，寒冬先叶开放，傲雪凌霜，象征坚韧不拔的精神。',
      plantType: '落叶乔木',
      nativeHabitat: '中国西南地区，现全国各地广泛栽培',
      growthHabits: '喜温暖气候，耐寒性较强，耐旱，喜阳光充足、通风良好的环境',
      characteristics: [
        { name: '叶片', description: '叶片卵形或椭圆形，长4-8厘米，先端尾尖，叶缘有细锐锯齿' },
        { name: '花朵', description: '花单生或有时2朵同生于1芽内，直径2-2.5厘米，先于叶开放，花瓣倒卵形，白色至粉红色，香味浓郁' },
        { name: '果实', description: '核果近球形，直径2-3厘米，黄色或绿白色，被柔毛，味酸' },
        { name: '树干', description: '树皮浅灰色或带绿色，平滑；小枝绿色，光滑无毛' }
      ],
      uses: [
        { category: '观赏价值', description: '著名园林观赏树种，可孤植、丛植、群植，也是盆景良材' },
        { category: '食用价值', description: '果实可制作话梅、乌梅、梅酒等，是传统食品' },
        { category: '药用价值', description: '乌梅入药，具有敛肺止咳、涩肠止泻、生津止渴等功效' },
        { category: '文化价值', description: '与松、竹并称"岁寒三友"，与兰、竹、菊并称"四君子"，是中华民族精神的象征' }
      ],
      growingTips: [
        '栽植宜在早春或秋季落叶后进行',
        '选择阳光充足、排水良好的高燥地块种植',
        '生长期保持土壤湿润，雨季注意排水防涝',
        '花后进行修剪，去除病枝、弱枝，促进花芽分化',
        '常见病害有炭疽病、白粉病，需注意通风和药物防治'
      ],
      similarPlants: [
        { name: 'Prunus armeniaca', chineseName: '杏花', difference: '梅花花期早（1-3月），杏花花期稍晚；梅花小枝绿色，杏花小枝红褐色' },
        { name: 'Prunus persica', chineseName: '桃花', difference: '梅花先花后叶且香味浓，桃花花叶同放或先叶后花，香味较淡' }
      ],
      tags: ['十大名花', '岁寒三友', '四君子', '落叶乔木', '冬季开花'],
      seasonalInfo: '花期1-3月，果期5-6月',
      toxicity: '果实无毒可食用，但种仁（苦杏仁）含有苦杏仁苷，过量食用有毒'
    },
    {
      chineseName: '玫瑰',
      scientificName: 'Rosa rugosa',
      englishName: 'Rose',
      family: '蔷薇科 Rosaceae',
      genus: '蔷薇属 Rosa',
      confidence: 0.94,
      description: '著名观赏花卉和香料植物，象征爱情与浪漫，是世界四大切花之一。',
      plantType: '落叶灌木',
      nativeHabitat: '中国华北、日本、朝鲜，现世界各地广泛栽培',
      growthHabits: '喜阳光充足、通风良好的环境，耐寒耐旱，对土壤要求不严',
      characteristics: [
        { name: '叶片', description: '奇数羽状复叶，小叶5-9片，椭圆形至椭圆状倒卵形，叶缘有锯齿，表面多皱，背面有绒毛和腺毛' },
        { name: '花朵', description: '花单生或数朵簇生，直径6-8厘米，花瓣倒卵形，紫红色至白色，芳香浓郁' },
        { name: '果实', description: '蔷薇果扁球形，直径2-2.5厘米，砖红色，肉质' },
        { name: '茎干', description: '茎粗壮，丛生，密被绒毛、腺毛和针刺' }
      ],
      uses: [
        { category: '观赏价值', description: '重要的观赏花卉，可用于庭院、花坛、切花等' },
        { category: '香料价值', description: '花瓣可提取玫瑰精油，是名贵的天然香料' },
        { category: '食用价值', description: '花瓣可制作玫瑰酱、玫瑰糕、玫瑰茶等食品' },
        { category: '药用价值', description: '花蕾入药，具有理气解郁、和血调经的功效' },
        { category: '文化价值', description: '象征爱情、美丽、热情，是情人节的代表花卉' }
      ],
      growingTips: [
        '选择阳光充足、通风良好的位置，每天至少6小时阳光',
        '土壤要求疏松肥沃、排水良好，pH值6.5-7.5为宜',
        '浇水见干见湿，避免积水，雨季注意排水',
        '春季萌芽前施基肥，花前花后各追施一次磷钾肥',
        '冬季休眠期进行重剪，促进来年萌发壮枝',
        '注意防治白粉病、黑斑病和蚜虫等病虫害'
      ],
      similarPlants: [
        { name: 'Rosa chinensis', chineseName: '月季', difference: '玫瑰叶片皱缩，月季叶片光滑；玫瑰一年开一次花，月季多季开花' },
        { name: 'Rosa multiflora', chineseName: '蔷薇', difference: '蔷薇花多为圆锥状伞房花序，花朵较小，枝条细长蔓生' }
      ],
      tags: ['爱情之花', '香料植物', '食用花卉', '药用植物', '落叶灌木'],
      seasonalInfo: '花期5-6月，果期8-9月',
      toxicity: '无毒，花瓣可食用'
    },
    {
      chineseName: '兰花',
      scientificName: 'Cymbidium spp.',
      englishName: 'Orchid',
      family: '兰科 Orchidaceae',
      genus: '兰属 Cymbidium',
      confidence: 0.9,
      description: '中国传统名花，高洁典雅的象征，与梅、竹、菊并称"四君子"。',
      plantType: '多年生草本',
      nativeHabitat: '亚洲热带和亚热带地区，中国主要分布于长江流域及以南地区',
      growthHabits: '喜温暖湿润、半阴通风的环境，忌强光直射和积水',
      characteristics: [
        { name: '叶片', description: '叶从茎部簇生，线状披针形，革质，稍具弹性，通常2-6枚成束' },
        { name: '花朵', description: '花葶从假鳞茎基部抽出，花通常为总状花序，花被片6，2轮，内轮1片特化为唇瓣，形态奇特，颜色丰富，香气清雅' },
        { name: '假鳞茎', description: '地下具肥大的假鳞茎，卵形或卵状椭圆形，为储存养分和水分的器官' },
        { name: '根系', description: '肉质根，粗壮肥大，与兰菌共生' }
      ],
      uses: [
        { category: '观赏价值', description: '名贵观赏花卉，盆栽观赏，也是重要的切花材料' },
        { category: '药用价值', description: '部分品种如建兰、春兰等全草或假鳞茎可入药，具有滋阴清肺、化痰止咳等功效' },
        { category: '食用价值', description: '花朵可熏制兰花茶，也可用于菜肴点缀' },
        { category: '文化价值', description: '象征高洁典雅、淡泊名利，是文人雅士的最爱' }
      ],
      growingTips: [
        '栽培基质需疏松透气，常用兰石、树皮、水苔、椰壳等配制',
        '光照以散射光为宜，避免强光直射，春夏季需遮阴50%-70%',
        '浇水遵循"干则浇，湿则停，适当偏干"的原则',
        '空气湿度保持在60%-80%，干燥季节需经常喷雾增湿',
        '施肥宜薄肥勤施，生长期每10-15天施一次稀薄液肥',
        '注意通风，防止闷热潮湿引发病害'
      ],
      similarPlants: [
        { name: 'Phalaenopsis aphrodite', chineseName: '蝴蝶兰', difference: '蝴蝶兰为附生兰，花形似蝴蝶，叶片较宽厚' },
        { name: 'Dendrobium nobile', chineseName: '石斛兰', difference: '石斛兰茎直立肉质，节明显，多附生于树干或岩石上' }
      ],
      tags: ['四君子', '名贵花卉', '多年生草本', '传统名花', '春季开花'],
      seasonalInfo: '不同品种花期不同，春兰2-3月，建兰7-10月，墨兰12月至次年2月',
      toxicity: '无毒，多数品种可入药或食用'
    },
    {
      chineseName: '菊花',
      scientificName: 'Chrysanthemum morifolium',
      englishName: 'Chrysanthemum',
      family: '菊科 Asteraceae',
      genus: '菊属 Chrysanthemum',
      confidence: 0.93,
      description: '中国传统名花，秋季开花，与梅、兰、竹并称"四君子"，也是北京、太原等城市的市花。',
      plantType: '多年生草本',
      nativeHabitat: '中国原产，现世界各地广泛栽培',
      growthHabits: '喜凉爽气候，耐寒，喜阳光充足、通风良好的环境，短日照植物',
      characteristics: [
        { name: '叶片', description: '叶互生，卵形至披针形，长5-15厘米，羽状浅裂或半裂，叶缘有粗锯齿，背面被白色短柔毛' },
        { name: '花朵', description: '头状花序单生或数个集生于茎枝顶端，直径2.5-20厘米，花型花色极其丰富，有红、黄、白、紫、绿、粉、墨、泥金、雪青等多种颜色' },
        { name: '果实', description: '瘦果矩圆形，具纵棱，褐色，细小' },
        { name: '茎干', description: '茎直立，分枝或不分枝，高60-150厘米，被柔毛' }
      ],
      uses: [
        { category: '观赏价值', description: '重要的观赏花卉，可用于花坛、花境、盆栽、切花等，也是菊花展的主角' },
        { category: '药用价值', description: '花入药，具有疏风清热、明目解毒的功效，常用于治疗感冒、头痛、目赤等症' },
        { category: '食用价值', description: '可制作菊花茶、菊花酒、菊花糕、菊花火锅等' },
        { category: '文化价值', description: '象征高洁、隐逸、长寿，深受文人墨客喜爱，是重阳节的代表性花卉' }
      ],
      growingTips: [
        '喜疏松肥沃、排水良好的沙质壤土，pH值6.5-7.5为宜',
        '为短日照植物，控制光照可调节花期',
        '生长期需充足水分，但忌积水，雨季注意排水',
        '需多次摘心促进分枝，形成丰满株型和更多花蕾',
        '现蕾期加强磷钾肥供应，促进花大色艳',
        '注意防治蚜虫、红蜘蛛、白粉病等常见病虫害'
      ],
      similarPlants: [
        { name: 'Dendranthema indicum', chineseName: '野菊花', difference: '野菊花花朵较小，直径1-1.5厘米，黄色，多野生于山坡草地' },
        { name: 'Leucanthemum vulgare', chineseName: '滨菊（法国菊）', difference: '滨菊为单瓣白花黄心，叶片倒披针形，叶缘有齿' }
      ],
      tags: ['四君子', '十大名花', '药用植物', '食用花卉', '秋季开花'],
      seasonalInfo: '花期9-11月，果期10-11月',
      toxicity: '无毒，花可入药和食用，但少数人可能过敏'
    },
    {
      chineseName: '桂花',
      scientificName: 'Osmanthus fragrans',
      englishName: 'Sweet Osmanthus',
      family: '木犀科 Oleaceae',
      genus: '木犀属 Osmanthus',
      confidence: 0.95,
      description: '中国传统十大名花之一，花香浓郁清雅，是秋季的代表性花卉。',
      plantType: '常绿乔木或灌木',
      nativeHabitat: '中国西南部，现长江流域及以南地区广泛栽培',
      growthHabits: '喜温暖湿润气候，喜光也耐半阴，不耐寒，对土壤要求不严',
      characteristics: [
        { name: '叶片', description: '叶对生，革质，椭圆形或长椭圆形，长4-12厘米，全缘或上半部疏生细锯齿，叶面光滑' },
        { name: '花朵', description: '花小，簇生于叶腋，聚伞花序，每腋内有花多朵，花4裂，裂片质厚，花色有黄白、淡黄、金黄、橙红等，香气极浓' },
        { name: '果实', description: '核果椭圆形，长1-1.5厘米，呈紫黑色，歪斜' },
        { name: '树干', description: '树皮灰褐色，高可达12米，树冠圆球形' }
      ],
      uses: [
        { category: '观赏价值', description: '优良的园林观赏树种，常作行道树、庭荫树，也可盆栽' },
        { category: '食用价值', description: '花可制作桂花茶、桂花糕、桂花酒、桂花糖等，是传统食品香料' },
        { category: '药用价值', description: '花、果、根均可入药，花具有散寒破结、化痰止咳的功效' },
        { category: '香料价值', description: '花可提取芳香油，用于食品、化妆品等行业' },
        { category: '文化价值', description: '象征高洁、吉祥、友谊，是杭州、苏州、桂林等城市的市花' }
      ],
      growingTips: [
        '选择阳光充足、排水良好的地方栽植，忌低洼积水',
        '春季和秋季是最佳移栽时间',
        '生长期保持土壤湿润，干旱时及时浇水',
        '每年施肥3次：入冬前施基肥，春季萌芽后施追肥，花前施磷钾肥',
        '花后适当修剪，保持树形美观，通风透光',
        '北方地区冬季需采取防寒措施'
      ],
      similarPlants: [
        { name: 'Osmanthus heterophyllus', chineseName: '柊树（刺桂）', difference: '刺桂叶缘有刺状齿，花白色，香气较淡' },
        { name: 'Osmanthus fragrans var. thunbergii', chineseName: '金桂', difference: '金桂花金黄色，香气最浓，是桂花的变种之一' }
      ],
      tags: ['十大名花', '市花', '食用香料', '药用植物', '常绿乔木'],
      seasonalInfo: '花期9-10月，果期翌年4-5月',
      toxicity: '无毒，花可食用和药用'
    },
    {
      chineseName: '向日葵',
      scientificName: 'Helianthus annuus',
      englishName: 'Sunflower',
      family: '菊科 Asteraceae',
      genus: '向日葵属 Helianthus',
      confidence: 0.96,
      description: '一年生高大草本，花盘形似太阳，具有向光性，象征积极向上、光明希望。',
      plantType: '一年生草本',
      nativeHabitat: '北美洲，现世界各地广泛栽培',
      growthHabits: '喜温暖阳光充足的环境，耐旱，耐瘠薄，适应性强',
      characteristics: [
        { name: '叶片', description: '叶互生，心状卵形或卵圆形，先端锐突或渐尖，边缘具粗锯齿，两面被短糙毛，叶柄长' },
        { name: '花朵', description: '头状花序极大，直径10-30厘米，单生于茎顶或枝端，常下倾。总苞片多层，叶质。舌状花多数，黄色，不结实。管状花极多数，棕色或紫色，结实' },
        { name: '果实', description: '瘦果倒卵形或卵状长圆形，稍扁，灰色或黑色，俗称"葵花籽"' },
        { name: '茎干', description: '茎直立，高1-3.5米，粗壮，被白色粗硬毛，不分枝或有时上部分枝' }
      ],
      uses: [
        { category: '食用价值', description: '种子即葵花籽，可炒食、榨油，是重要的油料作物' },
        { category: '观赏价值', description: '花色鲜艳，花型独特，常用于庭院种植、切花、花海造景' },
        { category: '药用价值', description: '种子、花盘、茎叶均可入药，具有平肝祛风、清湿热、消滞气等功效' },
        { category: '工业价值', description: '向日葵油是重要的食用油和工业用油，茎秆可做造纸原料' },
        { category: '文化价值', description: '象征阳光、希望、忠诚、积极向上，是俄罗斯、乌克兰等国的国花' }
      ],
      growingTips: [
        '选择阳光充足的地方，每天至少8小时以上光照',
        '土壤以疏松肥沃、排水良好的沙壤土为佳',
        '播种深度2-3厘米，出苗后及时间苗定苗',
        '生长期需水量较大，但忌积水',
        '现蕾至开花期需增施磷钾肥，促进花大籽饱',
        '植株高大需设立支架防止倒伏',
        '注意防治向日葵螟、蚜虫、菌核病等病虫害'
      ],
      similarPlants: [
        { name: 'Helianthus tuberosus', chineseName: '菊芋（洋姜）', difference: '菊芋花较小，直径5-9厘米，地下有块茎可食用' },
        { name: 'Rudbeckia hirta', chineseName: '黑心金光菊', difference: '黑心菊花中心为黑色或深褐色，植株较矮' }
      ],
      tags: ['油料作物', '食用', '观赏花卉', '一年生草本', '夏季开花'],
      seasonalInfo: '花期7-9月，果期8-9月',
      toxicity: '无毒，全株均有利用价值'
    },
    {
      chineseName: '仙人掌',
      scientificName: 'Opuntia dillenii',
      englishName: 'Prickly Pear Cactus',
      family: '仙人掌科 Cactaceae',
      genus: '仙人掌属 Opuntia',
      confidence: 0.94,
      description: '典型的多肉植物，耐干旱，形态奇特，是墨西哥的国花。',
      plantType: '多年生肉质灌木或小乔木',
      nativeHabitat: '美洲热带、亚热带沙漠地区，中国南方沿海地区常见逸生',
      growthHabits: '喜温暖干燥、阳光充足的环境，耐旱性极强，不耐寒，怕积水',
      characteristics: [
        { name: '茎（叶状茎）', description: '茎节扁平，倒卵形至长圆形，长15-40厘米，蓝绿色，被白粉，上面散生小窠，小窠生有黄色或褐色的钩毛和长1-6厘米的锐刺' },
        { name: '叶片', description: '叶退化为钻形，生于小窠上，早落。光合作用由绿色茎代替' },
        { name: '花朵', description: '花单生于茎节上部的小窠上，直径4-7厘米，辐射对称，花瓣黄色或带红色条纹' },
        { name: '果实', description: '浆果倒卵球形，长5-9厘米，紫红色，有刺，果肉紫红色，味酸甜可食' }
      ],
      uses: [
        { category: '观赏价值', description: '常见盆栽观赏植物，也是沙漠景观园的重要植物材料' },
        { category: '食用价值', description: '果实（仙人掌果）可食用，嫩茎可作蔬菜，是墨西哥的传统食品' },
        { category: '药用价值', description: '全株入药，具有行气活血、清热解毒、消肿止痛等功效' },
        { category: '生态价值', description: '耐干旱瘠薄，可用于荒漠化治理和水土保持' },
        { category: '美容价值', description: '仙人掌提取物用于护肤品，具有保湿、抗氧化功效' }
      ],
      growingTips: [
        '盆土需疏松透气、排水良好，可用粗沙、园土、腐叶土混合配制',
        '喜充足阳光，夏季可放室外阳光下养护',
        '浇水遵循"不干不浇，浇则浇透"的原则，冬季减少浇水',
        '生长期每月施一次稀薄液肥即可，冬季停止施肥',
        '冬季温度保持在5℃以上可安全越冬',
        '换盆时注意防护，避免被刺伤'
      ],
      similarPlants: [
        { name: 'Carnegiea gigantea', chineseName: '巨人柱', difference: '巨人柱为高大柱状仙人掌，高可达15米，产于美洲沙漠' },
        { name: 'Aloe vera', chineseName: '芦荟', difference: '芦荟为百合科植物，叶肉质簇生，叶缘有刺，花橙红色' }
      ],
      tags: ['多肉植物', '沙漠植物', '食用', '药用', '耐旱植物'],
      seasonalInfo: '花期6-12月，果期秋季',
      toxicity: '无毒，可食用和药用，但某些品种汁液可能引起皮肤过敏'
    },
    {
      chineseName: '绿萝',
      scientificName: 'Epipremnum aureum',
      englishName: 'Golden Pothos',
      family: '天南星科 Araceae',
      genus: '麒麟叶属 Epipremnum',
      confidence: 0.97,
      description: '常见室内观叶植物，生命力顽强，能净化空气，被誉为"生命之花"。',
      plantType: '多年生常绿藤本',
      nativeHabitat: '所罗门群岛，现世界各地广泛栽培',
      growthHabits: '喜温暖湿润、半阴的环境，不耐寒，忌强光直射',
      characteristics: [
        { name: '叶片', description: '叶互生，长4-18厘米，宽3-10厘米，卵形或卵状长圆形，先端短渐尖，基部心形，全缘，幼叶较小，老叶较大，叶面有不规则的黄色或白色斑块' },
        { name: '茎干', description: '茎蔓生，肉质，长可达数米，节间具气生根，可攀援生长' },
        { name: '花朵', description: '肉穗花序，佛焰苞披针形，室内栽培极少开花' },
        { name: '根系', description: '气生根发达，可吸收空气中的水分和养分' }
      ],
      uses: [
        { category: '观赏价值', description: '最常见的室内观叶植物，可盆栽悬垂、立柱攀援或水培观赏' },
        { category: '净化空气', description: '能有效吸收甲醛、苯、一氧化碳等有害气体，净化室内空气' },
        { category: '药用价值', description: '全株可入药，具有活血散瘀的功效（外用）' },
        { category: '装饰价值', description: '可用于室内绿化装饰，增加生机与活力' }
      ],
      growingTips: [
        '喜散射光，避免强光直射，也耐较阴暗的环境',
        '适宜生长温度15-28℃，冬季温度不低于10℃',
        '浇水见干见湿，经常向叶面喷雾保持空气湿度',
        '生长期每月施1-2次稀薄液肥或复合肥',
        '可土培也可水培，水培需定期换水',
        '枝条过长时可修剪促发新枝，剪下的枝条可扦插繁殖',
        '注意防治红蜘蛛、介壳虫等害虫'
      ],
      similarPlants: [
        { name: 'Scindapsus pictus', chineseName: '银叶葛（银斑葛）', difference: '银叶葛叶面有银灰色斑点，叶色较深' },
        { name: 'Philodendron scandens', chineseName: '心叶蔓绿绒', difference: '叶片为纯绿色，无黄斑，叶质较厚' }
      ],
      tags: ['室内植物', '观叶植物', '净化空气', '水培植物', '常绿藤本'],
      seasonalInfo: '花期极少见，主要观叶',
      toxicity: '汁液含草酸钙结晶，有毒，误食会引起口腔和消化道刺激，皮肤接触可能引起瘙痒'
    },
    {
      chineseName: '芦荟',
      scientificName: 'Aloe vera',
      englishName: 'Aloe Vera',
      family: '阿福花科 Asphodelaceae',
      genus: '芦荟属 Aloe',
      confidence: 0.95,
      description: '常见的多功能植物，集食用、药用、美容、观赏于一身。',
      plantType: '多年生常绿草本',
      nativeHabitat: '非洲北部地区，现世界各地广泛栽培',
      growthHabits: '喜温暖干燥、阳光充足的环境，耐旱不耐寒，怕积水',
      characteristics: [
        { name: '叶片', description: '叶簇生，呈莲座状排列，叶片肥厚多汁，条状披针形，长15-35厘米，宽4-7厘米，粉绿色，边缘疏生刺状小齿' },
        { name: '花朵', description: '花葶高60-90厘米，总状花序，花多朵，花被圆筒形，长约2.5厘米，淡黄色而有红斑' },
        { name: '茎干', description: '茎短，不明显' },
        { name: '汁液', description: '叶内含有透明的凝胶状汁液，具有多种功效' }
      ],
      uses: [
        { category: '药用价值', description: '外用可治疗烧伤、烫伤、皮肤溃疡；内服可泻下通便、清肝泻火（需遵医嘱）' },
        { category: '美容价值', description: '芦荟胶具有保湿、防晒、抗衰老、祛痘等功效，广泛用于护肤品' },
        { category: '食用价值', description: '部分品种的芦荟可加工制作饮料、果冻、酸奶等食品' },
        { category: '观赏价值', description: '可盆栽观赏，也可用于庭院绿化' },
        { category: '净化空气', description: '能吸收室内有害气体，释放氧气，净化空气' }
      ],
      growingTips: [
        '选择疏松透气、排水良好的沙质土壤，可用腐叶土、园土、粗沙混合',
        '喜充足阳光，夏季避免暴晒，冬季需充足光照',
        '浇水遵循"不干不浇，浇则浇透"原则，宁干勿湿',
        '生长期每月施一次稀薄液肥，冬季停止施肥',
        '适宜生长温度15-30℃，冬季温度不低于5℃',
        '分株或扦插繁殖，极易成活'
      ],
      similarPlants: [
        { name: 'Aloe arborescens', chineseName: '木立芦荟', difference: '木立芦荟有明显直立的木质茎，高可达1-2米，叶较窄' },
        { name: 'Haworthia cymbiformis', chineseName: '水晶掌', difference: '水晶掌叶片较透明，排列成莲座状，体积较小' }
      ],
      tags: ['多肉植物', '药用植物', '美容植物', '净化空气', '常绿草本'],
      seasonalInfo: '花期冬末至春季',
      toxicity: '叶皮部分含芦荟素，有一定毒性，内服需去皮并遵医嘱；外用一般安全，但少数人可能过敏'
    },
    {
      chineseName: '发财树',
      scientificName: 'Pachira aquatica',
      englishName: 'Money Tree',
      family: '锦葵科 Malvaceae',
      genus: '瓜栗属 Pachira',
      confidence: 0.93,
      description: '常见的招财风水植物，寓意财运亨通，是办公室和家居的热门绿植。',
      plantType: '常绿小乔木',
      nativeHabitat: '中美洲热带地区，现世界各地广泛栽培',
      growthHabits: '喜高温多湿、阳光充足的环境，也耐半阴，不耐寒，怕积水',
      characteristics: [
        { name: '叶片', description: '掌状复叶，小叶5-9片，长椭圆形至倒卵状长椭圆形，全缘，叶色翠绿，有光泽' },
        { name: '花朵', description: '花单生于枝顶叶腋，花大，花瓣黄绿色，线形，长达15厘米，室内栽培极少开花' },
        { name: '果实', description: '蒴果木质，椭圆形，长约10厘米，褐色，内含多颗种子' },
        { name: '茎干', description: '茎干直立，基部膨大，光滑，绿色至棕灰色，常将几株茎干编织在一起造型' }
      ],
      uses: [
        { category: '观赏价值', description: '株型优美，茎干造型独特，是高档室内观叶植物' },
        { category: '风水寓意', description: '寓意招财进宝、兴旺发达，常作为开业、乔迁礼物' },
        { category: '净化空气', description: '能有效吸收室内有害气体，释放氧气，增加空气湿度' },
        { category: '食用价值', description: '种子可食用，味道类似花生，树皮和嫩叶也可食用' }
      ],
      growingTips: [
        '喜明亮散射光，避免强光直射，也耐较阴环境',
        '适宜生长温度20-30℃，冬季温度不低于10℃',
        '浇水遵循"见干见湿"原则，忌积水，宁干勿湿',
        '生长期每月施一次稀薄液肥或复合肥',
        '经常向叶面喷雾，保持空气湿度',
        '生长较快，每年春季可换盆一次',
        '注意防治介壳虫、红蜘蛛等害虫'
      ],
      similarPlants: [
        { name: 'Pachira glabra', chineseName: '水瓜栗', difference: '水瓜栗小叶较多，7-11片，茎干基部膨大更明显' },
        { name: 'Schefflera actinophylla', chineseName: '大叶伞（澳洲鸭脚木）', difference: '大叶伞小叶更多，10-15片，叶缘有波浪状起伏' }
      ],
      tags: ['室内植物', '观叶植物', '风水植物', '净化空气', '常绿乔木'],
      seasonalInfo: '室内栽培极少开花，主要观叶观茎',
      toxicity: '无毒，种子可食用'
    }
  ];

  recognizePlant(imageBase64: string): PlantRecognitionResult {
    const result = this.simulateRecognition(imageBase64);
    return result;
  }

  private simulateRecognition(_imageBase64: string): PlantRecognitionResult {
    const randomIndex = Math.floor(Math.random() * this.plantDatabase.length);
    const baseResult = this.plantDatabase[randomIndex];

    const confidenceVariation = Math.random() * 0.08 - 0.04;
    const adjustedConfidence = Math.max(0.75, Math.min(0.98, baseResult.confidence + confidenceVariation));

    const result: PlantRecognitionResult = {
      ...baseResult,
      confidence: Math.round(adjustedConfidence * 100) / 100,
      characteristics: baseResult.characteristics.map(char => ({ ...char })),
      uses: baseResult.uses.map(use => ({ ...use })),
      growingTips: [...baseResult.growingTips],
      similarPlants: baseResult.similarPlants.map(plant => ({ ...plant })),
      tags: [...baseResult.tags]
    };

    return result;
  }

  getAllPlants(): any[] {
    return this.plantDatabase.map(item => ({
      chineseName: item.chineseName,
      scientificName: item.scientificName,
      englishName: item.englishName,
      family: item.family,
      plantType: item.plantType,
      description: item.description
    }));
  }
}
