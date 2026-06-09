import { Injectable } from '@nestjs/common';

export interface Ingredient {
  name: string;
  probability: number;
}

export interface CookingMethod {
  name: string;
  description: string;
}

export interface FoodRecognitionResult {
  dishName: string;
  englishName: string;
  cuisine: string;
  mainIngredients: Ingredient[];
  cookingMethods: CookingMethod[];
  flavor: string;
  description: string;
  confidence: number;
  difficulty: string;
  cookingTime: string;
  calories: string;
  nutritionalInfo: string;
  similarDishes: string[];
  cookingTips: string[];
  dietaryTags: string[];
}

@Injectable()
export class FoodRecognitionService {
  private foodDatabase = [
    {
      dishName: '宫保鸡丁',
      englishName: 'Kung Pao Chicken',
      cuisine: '川菜',
      mainIngredients: [
        { name: '鸡胸肉', probability: 0.95 },
        { name: '花生米', probability: 0.9 },
        { name: '干辣椒', probability: 0.85 },
        { name: '花椒', probability: 0.8 },
        { name: '葱白', probability: 0.75 },
        { name: '黄瓜', probability: 0.7 }
      ],
      cookingMethods: [
        { name: '爆炒', description: '高温快炒，保持鸡肉嫩滑' }
      ],
      flavor: '麻辣鲜香，酸甜微辣',
      description: '经典川菜代表，鸡肉嫩滑，花生酥脆，是一道色香味俱全的家常名菜。',
      confidence: 0.92,
      difficulty: '中等',
      cookingTime: '20-25分钟',
      calories: '约350千卡/份',
      nutritionalInfo: '高蛋白、适中脂肪、富含维生素',
      similarDishes: ['辣子鸡', '鱼香肉丝', '小炒黄牛肉'],
      cookingTips: [
        '鸡丁提前用料酒、淀粉腌制15分钟更嫩滑',
        '花生米最后放入保持酥脆口感',
        '火候要大，动作要快',
        '调味汁比例：醋2:糖1:生抽1:老抽少许'
      ],
      dietaryTags: ['高蛋白', '微辣', '下饭菜']
    },
    {
      dishName: '红烧肉',
      englishName: 'Braised Pork Belly',
      cuisine: '江浙菜/家常菜',
      mainIngredients: [
        { name: '五花肉', probability: 0.98 },
        { name: '冰糖', probability: 0.9 },
        { name: '生抽', probability: 0.85 },
        { name: '老抽', probability: 0.85 },
        { name: '八角', probability: 0.8 },
        { name: '生姜', probability: 0.75 },
        { name: '料酒', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '红烧', description: '先炒糖色，再慢炖收汁' }
      ],
      flavor: '咸甜适口，肥而不腻',
      description: '肥瘦相间的五花肉经慢火炖煮，入口即化，色泽红亮诱人。',
      confidence: 0.95,
      difficulty: '中等',
      cookingTime: '60-90分钟',
      calories: '约550千卡/份',
      nutritionalInfo: '高脂肪、优质蛋白质',
      similarDishes: ['东坡肉', '梅菜扣肉', '回锅肉'],
      cookingTips: [
        '选择三层五花肉最佳',
        '炒糖色要用小火，避免发苦',
        '加开水没过肉块，慢炖1小时以上',
        '最后大火收汁，色泽更红亮'
      ],
      dietaryTags: ['经典名菜', '肥而不腻', '宴席菜']
    },
    {
      dishName: '麻婆豆腐',
      englishName: 'Mapo Tofu',
      cuisine: '川菜',
      mainIngredients: [
        { name: '嫩豆腐', probability: 0.98 },
        { name: '猪肉末', probability: 0.9 },
        { name: '豆瓣酱', probability: 0.95 },
        { name: '花椒粉', probability: 0.9 },
        { name: '辣椒粉', probability: 0.85 },
        { name: '蒜苗', probability: 0.7 }
      ],
      cookingMethods: [
        { name: '烧煮', description: '豆腐切块后与肉末调味料同烧' }
      ],
      flavor: '麻辣鲜香烫',
      description: '川菜灵魂之作，嫩滑豆腐配麻辣肉末，麻辣鲜香烫一应俱全。',
      confidence: 0.93,
      difficulty: '简单',
      cookingTime: '15-20分钟',
      calories: '约280千卡/份',
      nutritionalInfo: '植物蛋白丰富、适量脂肪',
      similarDishes: ['鱼香茄子', '水煮豆腐', '肉末豆腐'],
      cookingTips: [
        '豆腐用淡盐水浸泡不易碎',
        '花椒粉最后撒入香气更浓',
        '勾芡要薄，分两次加入',
        '出锅前撒花椒油增香'
      ],
      dietaryTags: ['素食可选', '麻辣', '下饭神器']
    },
    {
      dishName: '鱼香肉丝',
      englishName: 'Yu Xiang Shredded Pork',
      cuisine: '川菜',
      mainIngredients: [
        { name: '猪里脊肉', probability: 0.92 },
        { name: '胡萝卜', probability: 0.85 },
        { name: '木耳', probability: 0.85 },
        { name: '青椒', probability: 0.8 },
        { name: '泡椒', probability: 0.85 },
        { name: '豆瓣酱', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '爆炒', description: '肉丝与蔬菜快速翻炒' }
      ],
      flavor: '鱼香味，酸甜微辣',
      description: '虽无鱼却有鱼香，经典调味，肉丝嫩滑，配菜爽脆。',
      confidence: 0.88,
      difficulty: '中等',
      cookingTime: '20分钟',
      calories: '约320千卡/份',
      nutritionalInfo: '高蛋白、多种维生素',
      similarDishes: ['宫保鸡丁', '京酱肉丝', '鱼香茄子'],
      cookingTips: [
        '肉丝要切细，腌制入味',
        '鱼香汁比例：醋2:糖1:生抽1:淀粉适量',
        '蔬菜丝要均匀',
        '大火快炒保持爽脆'
      ],
      dietaryTags: ['经典川菜', '酸甜', '下饭菜']
    },
    {
      dishName: '水煮鱼',
      englishName: 'Sichuan Boiled Fish',
      cuisine: '川菜',
      mainIngredients: [
        { name: '草鱼/黑鱼', probability: 0.95 },
        { name: '豆芽', probability: 0.9 },
        { name: '干辣椒', probability: 0.95 },
        { name: '花椒', probability: 0.9 },
        { name: '豆瓣酱', probability: 0.85 },
        { name: '蛋清', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '水煮', description: '鱼片腌制后在麻辣汤中汆熟' }
      ],
      flavor: '麻辣鲜香，肉质鲜嫩',
      description: '麻辣鲜香的经典代表作，鱼肉滑嫩，麻辣过瘾。',
      confidence: 0.9,
      difficulty: '较难',
      cookingTime: '30-40分钟',
      calories: '约450千卡/份',
      nutritionalInfo: '优质蛋白、高脂肪',
      similarDishes: ['水煮肉片', '酸菜鱼', '毛血旺'],
      cookingTips: [
        '鱼片要片薄，用蛋清淀粉腌制上浆',
        '豆芽焯水铺底增加口感层次',
        '最后泼热油激发出辣椒花椒香气',
        '选择刺少的鱼更方便食用'
      ],
      dietaryTags: ['麻辣', '招牌硬菜', '聚餐首选']
    },
    {
      dishName: '西红柿炒鸡蛋',
      englishName: 'Tomato and Egg Stir-fry',
      cuisine: '家常菜',
      mainIngredients: [
        { name: '鸡蛋', probability: 0.99 },
        { name: '西红柿', probability: 0.99 },
        { name: '葱花', probability: 0.85 },
        { name: '白糖', probability: 0.7 }
      ],
      cookingMethods: [
        { name: '翻炒', description: '鸡蛋先炒盛出，再炒西红柿后混合' }
      ],
      flavor: '酸甜可口，家常味道',
      description: '国民家常菜，酸甜开胃，简单快手，是每个人的童年味道。',
      confidence: 0.98,
      difficulty: '简单',
      cookingTime: '10分钟',
      calories: '约220千卡/份',
      nutritionalInfo: '优质蛋白、维生素C、番茄红素',
      similarDishes: ['番茄蛋汤', '黄瓜炒鸡蛋', '青椒炒鸡蛋'],
      cookingTips: [
        '鸡蛋加少许温水和盐打散更蓬松',
        '西红柿去皮口感更好',
        '加少许糖中和酸味',
        '鸡蛋先炒至8分熟盛出，最后再混合'
      ],
      dietaryTags: ['快手菜', '家常菜', '老少皆宜']
    },
    {
      dishName: '糖醋里脊',
      englishName: 'Sweet and Sour Pork',
      cuisine: '鲁菜',
      mainIngredients: [
        { name: '猪里脊肉', probability: 0.95 },
        { name: '番茄酱', probability: 0.9 },
        { name: '白醋', probability: 0.85 },
        { name: '白糖', probability: 0.9 },
        { name: '淀粉', probability: 0.9 },
        { name: '鸡蛋', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '炸+炒', description: '里脊先炸至金黄，再裹糖醋汁' }
      ],
      flavor: '酸甜可口，外酥里嫩',
      description: '经典鲁菜，外酥里嫩，酸甜开胃，老少皆宜。',
      confidence: 0.91,
      difficulty: '中等',
      cookingTime: '25-30分钟',
      calories: '约480千卡/份',
      nutritionalInfo: '高蛋白、高碳水',
      similarDishes: ['锅包肉', '菠萝咕噜肉', '糖醋排骨'],
      cookingTips: [
        '里脊肉切条后腌制15分钟',
        '挂糊要均匀，炸两遍更酥脆',
        '糖醋汁比例：番茄酱3:糖2:醋1:水适量',
        '汁要快速翻炒均匀出锅'
      ],
      dietaryTags: ['酸甜', '老少皆宜', '宴客菜']
    },
    {
      dishName: '青椒土豆丝',
      englishName: 'Shredded Potato with Green Pepper',
      cuisine: '家常菜',
      mainIngredients: [
        { name: '土豆', probability: 0.99 },
        { name: '青椒', probability: 0.95 },
        { name: '干辣椒', probability: 0.7 },
        { name: '醋', probability: 0.85 },
        { name: '蒜', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '爆炒', description: '土豆丝与青椒丝快炒' }
      ],
      flavor: '清爽脆嫩，微辣开胃',
      description: '清爽下饭的家常素菜，土豆脆嫩爽口。',
      confidence: 0.94,
      difficulty: '简单',
      cookingTime: '15分钟',
      calories: '约180千卡/份',
      nutritionalInfo: '低脂肪、碳水化合物、维生素C',
      similarDishes: ['酸辣土豆丝', '醋溜土豆丝', '清炒土豆丝'],
      cookingTips: [
        '土豆丝泡水去淀粉更脆',
        '大火快炒保持脆嫩',
        '沿锅边淋醋香气更浓',
        '加少许白醋保持色泽'
      ],
      dietaryTags: ['素菜', '快手菜', '下饭']
    },
    {
      dishName: '可乐鸡翅',
      englishName: 'Coke Chicken Wings',
      cuisine: '家常菜',
      mainIngredients: [
        { name: '鸡翅中', probability: 0.99 },
        { name: '可乐', probability: 0.98 },
        { name: '生抽', probability: 0.85 },
        { name: '生姜', probability: 0.8 },
        { name: '料酒', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '红烧', description: '鸡翅煎制后加可乐焖煮收汁' }
      ],
      flavor: '甜香浓郁，肉质鲜嫩',
      description: '新手零失败的家常好菜，鸡翅甜香入味，小朋友最爱。',
      confidence: 0.93,
      difficulty: '简单',
      cookingTime: '25分钟',
      calories: '约420千卡/份',
      nutritionalInfo: '高蛋白、高糖分',
      similarDishes: ['红烧鸡翅', '奥尔良烤翅', '啤酒鸭'],
      cookingTips: [
        '鸡翅划两刀便于入味',
        '先煎至两面金黄',
        '可乐没过鸡翅即可',
        '大火收汁色泽更红亮'
      ],
      dietaryTags: ['家常菜', '甜香', '小朋友最爱']
    },
    {
      dishName: '蒜蓉西兰花',
      englishName: 'Garlic Broccoli',
      cuisine: '家常菜',
      mainIngredients: [
        { name: '西兰花', probability: 0.99 },
        { name: '大蒜', probability: 0.95 },
        { name: '蚝油', probability: 0.7 }
      ],
      cookingMethods: [
        { name: '清炒', description: '西兰花焯水后与蒜蓉快炒' }
      ],
      flavor: '清淡蒜香，清爽健康',
      description: '健康营养的素菜，蒜香浓郁，口感脆嫩。',
      confidence: 0.92,
      difficulty: '简单',
      cookingTime: '10分钟',
      calories: '约120千卡/份',
      nutritionalInfo: '低热量、高纤维、维生素丰富',
      similarDishes: ['白灼西兰花', '清炒时蔬', '蒜蓉菜心'],
      cookingTips: [
        '西兰花掰小朵，焯水时加少许盐和油',
        '蒜蓉要多，香气才足',
        '焯水时间不要过长保持翠绿',
        '出锅前淋少许明油提亮'
      ],
      dietaryTags: ['素菜', '健康低卡', '蒜香']
    },
    {
      dishName: '清蒸鲈鱼',
      englishName: 'Steamed Sea Bass',
      cuisine: '粤菜',
      mainIngredients: [
        { name: '鲈鱼', probability: 0.99 },
        { name: '葱姜丝', probability: 0.95 },
        { name: '蒸鱼豉油', probability: 0.9 },
        { name: '料酒', probability: 0.8 }
      ],
      cookingMethods: [
        { name: '清蒸', description: '鱼身划刀，上锅蒸制后淋热油' }
      ],
      flavor: '鲜嫩清淡，原汁原味',
      description: '粤菜经典，鱼肉鲜嫩，原汁原味，营养健康。',
      confidence: 0.9,
      difficulty: '中等',
      cookingTime: '20分钟',
      calories: '约200千卡/份',
      nutritionalInfo: '优质蛋白、低脂肪、DHA丰富',
      similarDishes: ['清蒸多宝鱼', '清蒸桂鱼', '葱油鲈鱼'],
      cookingTips: [
        '鱼身抹少许盐和料酒腌制',
        '鱼身下垫筷子便于蒸汽流通',
        '蒸8-10分钟刚刚好',
        '最后淋热油激发出葱姜香'
      ],
      dietaryTags: ['清淡', '健康', '宴客菜']
    },
    {
      dishName: '蛋炒饭',
      englishName: 'Egg Fried Rice',
      cuisine: '家常菜',
      mainIngredients: [
        { name: '米饭', probability: 0.99 },
        { name: '鸡蛋', probability: 0.99 },
        { name: '葱花', probability: 0.9 },
        { name: '胡萝卜丁', probability: 0.65 },
        { name: '青豆', probability: 0.6 }
      ],
      cookingMethods: [
        { name: '翻炒', description: '鸡蛋与米饭大火翻炒均匀' }
      ],
      flavor: '香气四溢，粒粒分明',
      description: '最经典的主食，简单却考验功底，粒粒分明蛋香浓郁。',
      confidence: 0.95,
      difficulty: '简单',
      cookingTime: '10分钟',
      calories: '约380千卡/份',
      nutritionalInfo: '碳水化合物、优质蛋白',
      similarDishes: ['扬州炒饭', '酱油炒饭', '咖喱炒饭'],
      cookingTips: [
        '用隔夜饭效果最佳',
        '米饭提前打散',
        '鸡蛋先炒散再下米饭',
        '大火快炒，让每粒米都裹上蛋花'
      ],
      dietaryTags: ['主食', '快手', '经典']
    },
    {
      dishName: '酸菜鱼',
      englishName: 'Sour Spicy Fish',
      cuisine: '川菜',
      mainIngredients: [
        { name: '草鱼/黑鱼', probability: 0.95 },
        { name: '酸菜', probability: 0.99 },
        { name: '泡椒', probability: 0.85 },
        { name: '干辣椒', probability: 0.8 },
        { name: '花椒', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '煮', description: '酸菜炒香后加水煮鱼' }
      ],
      flavor: '酸辣鲜香，开胃下饭',
      description: '酸辣开胃的经典名菜，鱼肉嫩滑，酸菜爽口。',
      confidence: 0.91,
      difficulty: '中等',
      cookingTime: '30-40分钟',
      calories: '约380千卡/份',
      nutritionalInfo: '优质蛋白、开胃助消化',
      similarDishes: ['水煮鱼', '酸辣汤', '泡椒鱼'],
      cookingTips: [
        '鱼片要薄，用蛋清淀粉腌制',
        '酸菜要提前炒香出味',
        '先煮鱼骨酸菜，最后下鱼片',
        '鱼片下锅不要煮太久'
      ],
      dietaryTags: ['酸辣', '开胃', '经典川菜']
    },
    {
      dishName: '回锅肉',
      englishName: 'Twice-cooked Pork',
      cuisine: '川菜',
      mainIngredients: [
        { name: '五花肉', probability: 0.98 },
        { name: '豆瓣酱', probability: 0.95 },
        { name: '青蒜苗', probability: 0.9 },
        { name: '豆豉', probability: 0.8 }
      ],
      cookingMethods: [
        { name: '爆炒', description: '煮熟肉片后与调料蔬菜爆炒' }
      ],
      flavor: '咸香微辣，肥而不腻',
      description: '川菜之首，五花肉煮熟再炒，酱香浓郁，蒜苗清香。',
      confidence: 0.9,
      difficulty: '中等',
      cookingTime: '30分钟',
      calories: '约520千卡/份',
      nutritionalInfo: '高脂肪、优质蛋白',
      similarDishes: ['盐煎肉', '蒜苗炒肉', '农家小炒肉'],
      cookingTips: [
        '五花肉先煮至八分熟切薄片',
        '肉片要煸出油才不腻',
        '豆瓣酱要炒出红油',
        '青蒜苗最后下锅保持清香'
      ],
      dietaryTags: ['川菜之首', '下饭', '咸香']
    },
    {
      dishName: '酸辣土豆丝',
      englishName: 'Hot and Sour Shredded Potato',
      cuisine: '川菜/家常菜',
      mainIngredients: [
        { name: '土豆', probability: 0.99 },
        { name: '干辣椒', probability: 0.9 },
        { name: '醋', probability: 0.95 },
        { name: '花椒', probability: 0.8 },
        { name: '蒜', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '爆炒', description: '土豆丝与干辣椒花椒快炒' }
      ],
      flavor: '酸辣爽脆，开胃下饭',
      description: '最受欢迎的素菜之一，酸辣爽脆，超级下饭。',
      confidence: 0.94,
      difficulty: '简单',
      cookingTime: '15分钟',
      calories: '约190千卡/份',
      nutritionalInfo: '低脂肪、富含碳水、维生素',
      similarDishes: ['青椒土豆丝', '醋溜白菜', '炝炒莲白'],
      cookingTips: [
        '土豆丝切匀，泡水去淀粉',
        '花椒干辣椒先炝锅',
        '大火快炒保持脆嫩',
        '醋沿锅边淋入'
      ],
      dietaryTags: ['素菜', '酸辣', '下饭神器']
    },
    {
      dishName: '地三鲜',
      englishName: 'Di San Xian (Sauteed Potato, Green Pepper and Eggplant)',
      cuisine: '东北菜',
      mainIngredients: [
        { name: '茄子', probability: 0.99 },
        { name: '土豆', probability: 0.99 },
        { name: '青椒', probability: 0.95 },
        { name: '大蒜', probability: 0.8 },
        { name: '生抽', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '炸+炒', description: '茄子土豆先炸后炒' }
      ],
      flavor: '咸香入味，软糯可口',
      description: '东北经典素菜，茄子软糯，土豆绵密，青椒爽脆。',
      confidence: 0.89,
      difficulty: '中等',
      cookingTime: '25分钟',
      calories: '约350千卡/份',
      nutritionalInfo: '多种蔬菜、维生素丰富',
      similarDishes: ['烧茄子', '土豆烧茄子', '家常豆腐'],
      cookingTips: [
        '茄子切滚刀块，撒盐腌出水',
        '土豆茄子分别炸至金黄',
        '调碗汁翻炒更均匀',
        '青椒最后放保持脆嫩'
      ],
      dietaryTags: ['素菜', '东北菜', '下饭']
    },
    {
      dishName: '白切鸡',
      englishName: 'Poached Chicken',
      cuisine: '粤菜',
      mainIngredients: [
        { name: '三黄鸡', probability: 0.95 },
        { name: '姜葱', probability: 0.9 },
        { name: '姜葱酱', probability: 0.85 },
        { name: '料酒', probability: 0.75 }
      ],
      cookingMethods: [
        { name: '浸煮', description: '鸡肉浸煮至刚熟，冰水浸泡' }
      ],
      flavor: '皮爽肉滑，原汁原味',
      description: '粤菜经典代表，皮脆肉嫩，配上姜葱酱是灵魂。',
      confidence: 0.92,
      difficulty: '中等',
      cookingTime: '40-50分钟',
      calories: '约280千卡/份',
      nutritionalInfo: '高蛋白、低脂肪',
      similarDishes: ['盐焗鸡', '文昌鸡', '葱油鸡'],
      cookingTips: [
        '选择走地鸡口感最佳',
        '浸煮时保持微沸状态',
        '煮好立刻冰水浸泡皮更爽脆',
        '姜葱酱要现做更香'
      ],
      dietaryTags: ['清淡', '粤菜经典', '原汁原味']
    },
    {
      dishName: '扬州炒饭',
      englishName: 'Yangzhou Fried Rice',
      cuisine: '淮扬菜',
      mainIngredients: [
        { name: '米饭', probability: 0.99 },
        { name: '鸡蛋', probability: 0.98 },
        { name: '虾仁', probability: 0.9 },
        { name: '火腿丁', probability: 0.85 },
        { name: '青豆', probability: 0.85 },
        { name: '胡萝卜丁', probability: 0.8 }
      ],
      cookingMethods: [
        { name: '翻炒', description: '多种配料与米饭大火翻炒' }
      ],
      flavor: '鲜香丰富，粒粒分明',
      description: '淮扬名点，配料丰富，色泽金黄，口感层次丰富。',
      confidence: 0.9,
      difficulty: '中等',
      cookingTime: '15分钟',
      calories: '约450千卡/份',
      nutritionalInfo: '碳水化合物、优质蛋白',
      similarDishes: ['虾仁炒饭', '酱油炒饭', '咖喱鸡饭'],
      cookingTips: [
        '米饭要粒粒分明',
        '配料分别炒熟再混合',
        '虾仁要先焯水',
        '火候要大，翻炒要快'
      ],
      dietaryTags: ['主食', '名点', '经典']
    },
    {
      dishName: '东坡肉',
      englishName: 'Dongpo Pork',
      cuisine: '江浙菜',
      mainIngredients: [
        { name: '五花肉', probability: 0.99 },
        { name: '绍兴酒', probability: 0.9 },
        { name: '酱油', probability: 0.9 },
        { name: '冰糖', probability: 0.85 },
        { name: '葱姜', probability: 0.8 }
      ],
      cookingMethods: [
        { name: '慢炖', description: '五花肉加调料慢火长时间炖煮' }
      ],
      flavor: '咸甜酥烂，入口即化',
      description: '杭州名菜，苏东坡创制，肥而不腻，入口即化。',
      confidence: 0.88,
      difficulty: '较难',
      cookingTime: '2-3小时',
      calories: '约600千卡/份',
      nutritionalInfo: '高脂肪、优质蛋白',
      similarDishes: ['红烧肉', '梅菜扣肉', '坛子肉'],
      cookingTips: [
        '肉块要方正大小均匀',
        '加绍兴酒代替水更香',
        '小火慢炖2小时以上',
        '收汁要耐心'
      ],
      dietaryTags: ['名菜', '肥而不腻', '杭州特色']
    },
    {
      dishName: '干煸四季豆',
      englishName: 'Dry-fried Green Beans',
      cuisine: '川菜',
      mainIngredients: [
        { name: '四季豆', probability: 0.99 },
        { name: '猪肉末', probability: 0.85 },
        { name: '干辣椒', probability: 0.9 },
        { name: '花椒', probability: 0.85 },
        { name: '豆瓣酱', probability: 0.8 },
        { name: '芽菜', probability: 0.7 }
      ],
      cookingMethods: [
        { name: '干煸', description: '四季豆煸至虎皮后与肉末同炒' }
      ],
      flavor: '干香辣爽，下饭一绝',
      description: '川菜素菜经典，四季豆干香入味，微辣开胃。',
      confidence: 0.87,
      difficulty: '中等',
      cookingTime: '20分钟',
      calories: '约260千卡/份',
      nutritionalInfo: '膳食纤维丰富、维生素',
      similarDishes: ['干煸豆角', '肉末豆角', '榄菜四季豆'],
      cookingTips: [
        '四季豆要煸至表皮起皱',
        '一定要煸时不要加水',
        '芽菜或榨菜增加风味',
        '出锅前撒蒜末增香'
      ],
      dietaryTags: ['素菜', '干香', '下饭菜']
    }
  ];

  recognizeFood(imageBase64: string): FoodRecognitionResult {
    const result = this.simulateRecognition(imageBase64);
    return result;
  }

  private simulateRecognition(_imageBase64: string): FoodRecognitionResult {
    const randomIndex = Math.floor(Math.random() * this.foodDatabase.length);
    const baseResult = this.foodDatabase[randomIndex];
    
    const confidenceVariation = (Math.random() * 0.08 - 0.04);
    const adjustedConfidence = Math.max(0.75, Math.min(0.98, baseResult.confidence + confidenceVariation));
    
    const result: FoodRecognitionResult = {
      ...baseResult,
      confidence: Math.round(adjustedConfidence * 100) / 100,
      mainIngredients: baseResult.mainIngredients.map(ing => ({
        ...ing,
      probability: Math.max(0.5, Math.min(0.99, ing.probability + (Math.random() * 0.1 - 0.05))
      }))
    };
    
    return result;
  }

  getAllDishes(): any[] {
    return this.foodDatabase.map(item => ({
      dishName: item.dishName,
      englishName: item.englishName,
      cuisine: item.cuisine,
      description: item.description
    }));
  }
}
