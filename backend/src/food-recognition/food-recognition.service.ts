import { Injectable } from '@nestjs/common';

export interface Ingredient {
  name: string;
  probability: number;
}

export interface CookingMethod {
  name: string;
  description: string;
}

export interface RegionalVersion {
  region: string;
  regionIcon: string;
  cuisine: string;
  mainIngredients: Ingredient[];
  cookingMethods: CookingMethod[];
  flavor: string;
  description: string;
  difficulty: string;
  cookingTime: string;
  calories: string;
  nutritionalInfo: string;
  cookingTips: string[];
  isDefault?: boolean;
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
  regionalVersions?: RegionalVersion[];
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
      dietaryTags: ['高蛋白', '微辣', '下饭菜'],
      regionalVersions: [
        {
          region: '四川原版',
          regionIcon: '🌶️',
          cuisine: '川菜',
          mainIngredients: [
            { name: '鸡腿肉', probability: 0.95 },
            { name: '花生米', probability: 0.95 },
            { name: '干辣椒', probability: 0.9 },
            { name: '汉源花椒', probability: 0.9 },
            { name: '葱白', probability: 0.8 },
            { name: '泡椒', probability: 0.75 }
          ],
          cookingMethods: [
            { name: '爆炒', description: '川菜正宗做法，讲究小煎小炒，火候要猛，出勺要快' }
          ],
          flavor: '麻辣鲜香，酸甜微辣，糊辣味明显',
          description: '正宗川菜宫保鸡丁使用鸡腿肉，讲究小煎小炒，麻辣鲜香酸甜平衡，糊辣味是其灵魂，花生酥脆是关键。',
          difficulty: '较难',
          cookingTime: '15分钟',
          calories: '约380千卡/份',
          nutritionalInfo: '高蛋白、适中脂肪、富含维生素',
          cookingTips: [
            '用鸡腿肉比鸡胸肉更嫩更有口感',
            '干辣椒要炒至棕红色，发出糊辣味',
            '一定要用汉源花椒，麻味才正',
            '调味汁比例：醋3:糖2:生抽2:老抽少许:淀粉1'
          ],
          isDefault: true
        },
        {
          region: '山东鲁菜版',
          regionIcon: '🏔️',
          cuisine: '鲁菜',
          mainIngredients: [
            { name: '鸡胸肉', probability: 0.95 },
            { name: '花生米', probability: 0.9 },
            { name: '荸荠', probability: 0.8 },
            { name: '胡萝卜', probability: 0.75 },
            { name: '青椒', probability: 0.7 },
            { name: '葱姜蒜', probability: 0.8 }
          ],
          cookingMethods: [
            { name: '滑炒', description: '鲁菜做法，鸡丁先滑油，配料更丰富，口味偏酱香' }
          ],
          flavor: '咸鲜酱香，微甜微辣',
          description: '鲁菜版宫保鸡丁传说是丁宝桢在山东时所创，配料更丰富，使用荸荠增加爽脆口感，口味偏酱香。',
          difficulty: '中等',
          cookingTime: '20分钟',
          calories: '约340千卡/份',
          nutritionalInfo: '高蛋白、多种维生素',
          cookingTips: [
            '鸡丁滑油时油温不要太高，保持嫩滑',
            '荸荠切片增加爽脆口感',
            '鲁菜版突出酱香，可加少许甜面酱',
            '花生可以用油炸的更酥脆'
          ]
        },
        {
          region: '贵州版',
          regionIcon: '🍶',
          cuisine: '贵州菜',
          mainIngredients: [
            { name: '鸡腿肉', probability: 0.95 },
            { name: '花生米', probability: 0.9 },
            { name: '糍粑辣椒', probability: 0.95 },
            { name: '蒜瓣', probability: 0.8 },
            { name: '姜片', probability: 0.75 },
            { name: '青蒜', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '爆炒', description: '贵州版用糍粑辣椒代替干辣椒，辣度更高，香气更浓' }
          ],
          flavor: '香辣浓郁，咸鲜带酸',
          description: '贵州版宫保鸡丁使用糍粑辣椒，辣度更高更香浓，加醋提鲜，是丁宝桢家乡贵州的传统做法。',
          difficulty: '中等',
          cookingTime: '18分钟',
          calories: '约360千卡/份',
          nutritionalInfo: '高蛋白、维生素丰富',
          cookingTips: [
            '糍粑辣椒要自己做才正宗，用干辣椒、姜、蒜一起捣碎',
            '贵州版喜欢放少许醋提鲜',
            '青蒜段最后放，增加清香',
            '可以用本地土鸡，肉质更鲜美'
          ]
        }
      ]
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
      dietaryTags: ['经典名菜', '肥而不腻', '宴席菜'],
      regionalVersions: [
        {
          region: '江浙沪版',
          regionIcon: '🏮',
          cuisine: '江浙菜',
          mainIngredients: [
            { name: '五花肉', probability: 0.98 },
            { name: '冰糖', probability: 0.95 },
            { name: '生抽', probability: 0.85 },
            { name: '老抽', probability: 0.85 },
            { name: '绍兴料酒', probability: 0.9 },
            { name: '八角', probability: 0.75 },
            { name: '生姜', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '红烧', description: '炒糖色后加绍兴酒慢炖，色泽红亮，甜咸并重' }
          ],
          flavor: '甜咸适中，入口即化，酒香浓郁',
          description: '本帮红烧肉浓油赤酱，加入绍兴酒炖煮，肥而不腻，甜中带咸，是江浙地区最经典的做法。',
          difficulty: '中等',
          cookingTime: '90分钟',
          calories: '约580千卡/份',
          nutritionalInfo: '高脂肪、优质蛋白质、胶原蛋白丰富',
          cookingTips: [
            '一定要用绍兴料酒，去腥增香效果最佳',
            '冰糖炒糖色是上色的关键',
            '小火慢炖至少1.5小时，肉才会酥烂',
            '收汁时要不停翻动防止粘锅'
          ],
          isDefault: true
        },
        {
          region: '川湘版',
          regionIcon: '🌶️',
          cuisine: '川湘菜',
          mainIngredients: [
            { name: '五花肉', probability: 0.98 },
            { name: '干辣椒', probability: 0.9 },
            { name: '豆瓣酱', probability: 0.85 },
            { name: '花椒', probability: 0.75 },
            { name: '生抽', probability: 0.8 },
            { name: '八角', probability: 0.7 },
            { name: '大蒜', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '红烧', description: '先煸出油，加豆瓣酱干辣椒炒香，再加水炖煮' }
          ],
          flavor: '咸鲜微辣，酱香浓郁',
          description: '川湘口味的红烧肉加入豆瓣酱和干辣椒，口感更丰富，辣中带香，适合重口味食客。',
          difficulty: '中等',
          cookingTime: '75分钟',
          calories: '约560千卡/份',
          nutritionalInfo: '高脂肪、优质蛋白质',
          cookingTips: [
            '五花肉先煸炒出多余油脂，吃起来不腻',
            '豆瓣酱要小火炒出红油',
            '干辣椒和花椒根据个人口味调整',
            '最后大火收汁时注意不要糊锅'
          ]
        },
        {
          region: '东北版',
          regionIcon: '❄️',
          cuisine: '东北菜',
          mainIngredients: [
            { name: '五花肉', probability: 0.98 },
            { name: '土豆', probability: 0.9 },
            { name: '鹌鹑蛋', probability: 0.8 },
            { name: '生抽', probability: 0.85 },
            { name: '老抽', probability: 0.8 },
            { name: '冰糖', probability: 0.7 },
            { name: '葱姜', probability: 0.75 }
          ],
          cookingMethods: [
            { name: '红烧', description: '肉块与土豆、鹌鹑蛋一起炖煮，菜肉一锅出' }
          ],
          flavor: '咸鲜入味，分量十足',
          description: '东北红烧肉喜欢搭配土豆、鹌鹑蛋一起炖，菜肉混合，汤汁浓郁，是地道的东北家常硬菜。',
          difficulty: '简单',
          cookingTime: '60分钟',
          calories: '约520千卡/份',
          nutritionalInfo: '高脂肪、优质蛋白质、碳水化合物',
          cookingTips: [
            '土豆切大块，耐炖不易碎',
            '鹌鹑蛋提前煮熟去壳',
            '汤汁要宽一些，可以拌饭',
            '东北做法不用放太多糖，以咸鲜为主'
          ]
        }
      ]
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
      dietaryTags: ['经典川菜', '酸甜', '下饭菜'],
      regionalVersions: [
        {
          region: '四川原版',
          regionIcon: '🌶️',
          cuisine: '川菜',
          mainIngredients: [
            { name: '猪里脊肉', probability: 0.95 },
            { name: '鱼泡椒', probability: 0.9 },
            { name: '水发木耳', probability: 0.85 },
            { name: '胡萝卜', probability: 0.7 },
            { name: '四川豆瓣酱', probability: 0.88 },
            { name: '葱姜蒜', probability: 0.8 }
          ],
          cookingMethods: [
            { name: '爆炒', description: '四川传统做法，鱼泡椒和豆瓣酱是灵魂，大火快炒' }
          ],
          flavor: '鱼香味浓郁，咸甜酸辣兼备',
          description: '正宗四川鱼香肉丝的灵魂是鱼泡椒，咸甜酸辣四味俱全，肉丝嫩滑，是川菜调味的巅峰之作。',
          difficulty: '较难',
          cookingTime: '25分钟',
          calories: '约340千卡/份',
          nutritionalInfo: '高蛋白、多种维生素',
          cookingTips: [
            '一定要用四川鱼泡椒，这是鱼香味的来源',
            '鱼香汁比例：醋3:糖2:生抽2:淀粉1',
            '肉丝用料酒、盐、淀粉腌制15分钟',
            '全程大火快炒，出勺要快'
          ],
          isDefault: true
        },
        {
          region: '北方家常版',
          regionIcon: '🏠',
          cuisine: '北方家常菜',
          mainIngredients: [
            { name: '猪里脊肉', probability: 0.92 },
            { name: '胡萝卜', probability: 0.95 },
            { name: '木耳', probability: 0.85 },
            { name: '青椒', probability: 0.9 },
            { name: '鸡蛋', probability: 0.75 },
            { name: '番茄酱', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '爆炒', description: '北方改良版，蔬菜更多，口味偏酸甜，番茄酱提色' }
          ],
          flavor: '酸甜可口，微辣开胃',
          description: '北方家常版鱼香肉丝减少了辣味，增加了蔬菜比例，用番茄酱提色，酸甜开胃，更适合北方口味。',
          difficulty: '简单',
          cookingTime: '15分钟',
          calories: '约280千卡/份',
          nutritionalInfo: '高蛋白、多种维生素、膳食纤维丰富',
          cookingTips: [
            '蔬菜丝可以多放一些，营养更均衡',
            '番茄酱少许提色，不要放太多',
            '北方人吃可以少放或不放辣椒',
            '可以加鸡蛋增加口感层次'
          ]
        },
        {
          region: '广东改良版',
          regionIcon: '🌴',
          cuisine: '粤菜',
          mainIngredients: [
            { name: '猪里脊肉', probability: 0.9 },
            { name: '茭白', probability: 0.85 },
            { name: '冬笋', probability: 0.8 },
            { name: '木耳', probability: 0.75 },
            { name: '红椒', probability: 0.65 },
            { name: '鲍鱼汁', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '滑炒', description: '粤菜做法，肉丝先滑油，配料更精致，口感清淡' }
          ],
          flavor: '清淡鲜甜，微酸微辣',
          description: '粤式鱼香肉丝更讲究食材的鲜嫩，使用冬笋、茭白等时令蔬菜，口味清淡鲜甜，保留了鱼香的基本味道但更温和。',
          difficulty: '中等',
          cookingTime: '20分钟',
          calories: '约300千卡/份',
          nutritionalInfo: '高蛋白、低脂肪、时令蔬菜',
          cookingTips: [
            '肉丝先滑油至8分熟，保持嫩滑',
            '冬笋和茭白要焯水去除涩味',
            '调味以清淡为主，不要太咸太辣',
            '可用鲍鱼汁或蚝油增加鲜味'
          ]
        }
      ]
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
      dietaryTags: ['酸甜', '老少皆宜', '宴客菜'],
      regionalVersions: [
        {
          region: '山东原版',
          regionIcon: '🏔️',
          cuisine: '鲁菜',
          mainIngredients: [
            { name: '猪里脊肉', probability: 0.95 },
            { name: '白糖', probability: 0.95 },
            { name: '米醋', probability: 0.9 },
            { name: '番茄酱', probability: 0.7 },
            { name: '淀粉', probability: 0.9 },
            { name: '鸡蛋', probability: 0.75 },
            { name: '葱姜水', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '炸+溜', description: '正宗鲁菜做法，讲究外酥里嫩，糖醋汁不用番茄酱，用糖和醋调汁' }
          ],
          flavor: '酸甜浓郁，外酥里嫩，色泽金黄',
          description: '正宗鲁菜糖醋里脊不用番茄酱，只用白糖和米醋调出天然的酸甜味，讲究外酥里嫩，是鲁菜经典代表之一。',
          difficulty: '较难',
          cookingTime: '30分钟',
          calories: '约500千卡/份',
          nutritionalInfo: '高蛋白、高碳水',
          cookingTips: [
            '鲁菜版糖醋汁讲究糖和醋的比例，糖:醋=3:2',
            '里脊肉要顶刀切，切断纤维',
            '炸两遍：第一遍低温炸熟，第二遍高温复炸酥脆',
            '不用番茄酱，保持传统味道'
          ],
          isDefault: true
        },
        {
          region: '东北锅包肉版',
          regionIcon: '❄️',
          cuisine: '东北菜',
          mainIngredients: [
            { name: '猪里脊肉', probability: 0.95 },
            { name: '土豆淀粉', probability: 0.95 },
            { name: '白糖', probability: 0.9 },
            { name: '9度米醋', probability: 0.9 },
            { name: '胡萝卜丝', probability: 0.8 },
            { name: '葱姜丝', probability: 0.8 },
            { name: '香菜', probability: 0.75 }
          ],
          cookingMethods: [
            { name: '炸+烹', description: '东北锅包肉是糖醋里脊的亲戚，用土豆淀粉挂糊，烹汁法制作' }
          ],
          flavor: '酸甜酥脆，外焦里嫩，果香浓郁',
          description: '锅包肉是糖醋里脊的东北改良版，用土豆淀粉挂糊炸至金黄酥脆，酸甜汁烹入，搭配葱姜丝、胡萝卜丝，是东北最经典的名菜。',
          difficulty: '较难',
          cookingTime: '35分钟',
          calories: '约520千卡/份',
          nutritionalInfo: '高蛋白、高碳水',
          cookingTips: [
            '一定要用土豆淀粉，玉米淀粉不酥脆',
            '挂糊要厚，像酸奶一样的稠度',
            '肉片要大片，约0.5厘米厚',
            '烹汁时大火，快速翻勺出锅'
          ]
        },
        {
          region: '广东菠萝咕噜肉版',
          regionIcon: '🍍',
          cuisine: '粤菜',
          mainIngredients: [
            { name: '猪里脊肉', probability: 0.9 },
            { name: '菠萝', probability: 0.95 },
            { name: '番茄酱', probability: 0.95 },
            { name: '白糖', probability: 0.85 },
            { name: '白醋', probability: 0.8 },
            { name: '青红椒', probability: 0.8 },
            { name: '淀粉', probability: 0.9 }
          ],
          cookingMethods: [
            { name: '炸+炒', description: '粤式做法，加入菠萝、青红椒，果香浓郁，酸甜适中' }
          ],
          flavor: '酸甜果香，外酥里嫩，色彩丰富',
          description: '菠萝咕噜肉是粤式改良版，加入新鲜菠萝和青红椒，果香浓郁，酸甜更柔和，色彩丰富，老少皆宜。',
          difficulty: '中等',
          cookingTime: '25分钟',
          calories: '约450千卡/份',
          nutritionalInfo: '高蛋白、高碳水、维生素丰富',
          cookingTips: [
            '菠萝要用盐水浸泡30分钟去涩',
            '番茄酱要多放一些，色泽更红亮',
            '青红椒最后放，保持脆嫩',
            '可以加少许喼汁增加风味'
          ]
        }
      ]
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
      dietaryTags: ['素菜', '东北菜', '下饭'],
      regionalVersions: [
        {
          region: '东北原版',
          regionIcon: '❄️',
          cuisine: '东北菜',
          mainIngredients: [
            { name: '紫皮茄子', probability: 0.99 },
            { name: '黄心土豆', probability: 0.99 },
            { name: '薄皮青椒', probability: 0.95 },
            { name: '大蒜', probability: 0.85 },
            { name: '东北大酱', probability: 0.75 },
            { name: '生抽', probability: 0.7 }
          ],
          cookingMethods: [
            { name: '炸+炒', description: '正宗东北做法，茄子土豆过油炸至金黄，再用大酱爆锅翻炒' }
          ],
          flavor: '咸香浓郁，酱香味足，软糯入味',
          description: '正宗东北地三鲜讲究茄子、土豆、青椒三种时蔬，过油炸至金黄，用东北大酱爆锅，咸香浓郁，是东北最经典的素菜。',
          difficulty: '中等',
          cookingTime: '30分钟',
          calories: '约380千卡/份',
          nutritionalInfo: '多种蔬菜、碳水化合物、维生素丰富',
          cookingTips: [
            '一定要用东北紫皮茄子，口感最软糯',
            '黄心土豆比白心土豆更面更好吃',
            '茄子切滚刀块后撒盐腌10分钟去水',
            '东北大酱是灵魂，不可缺少'
          ],
          isDefault: true
        },
        {
          region: '南方家常版',
          regionIcon: '🌿',
          cuisine: '南方家常菜',
          mainIngredients: [
            { name: '长茄子', probability: 0.95 },
            { name: '土豆', probability: 0.95 },
            { name: '青椒', probability: 0.85 },
            { name: '彩椒', probability: 0.6 },
            { name: '蚝油', probability: 0.75 },
            { name: '蒜末', probability: 0.8 }
          ],
          cookingMethods: [
            { name: '少油煸炒', description: '南方改良版，少油煸炒更健康，加蚝油提鲜' }
          ],
          flavor: '清淡鲜香，清爽不油腻',
          description: '南方地三鲜减少用油量，用煸炒代替油炸，加入蚝油提鲜，口味更清淡，适合追求健康的吃法。',
          difficulty: '简单',
          cookingTime: '20分钟',
          calories: '约260千卡/份',
          nutritionalInfo: '低油、多种蔬菜、维生素丰富',
          cookingTips: [
            '茄子可以用微波炉加热3分钟代替油炸',
            '加彩椒增加色泽和营养',
            '蚝油提鲜，不用放太多盐',
            '南方人吃可以加少许糖提鲜'
          ]
        },
        {
          region: '川渝麻辣版',
          regionIcon: '🌶️',
          cuisine: '川菜',
          mainIngredients: [
            { name: '茄子', probability: 0.98 },
            { name: '土豆', probability: 0.95 },
            { name: '尖椒', probability: 0.9 },
            { name: '干辣椒', probability: 0.85 },
            { name: '花椒', probability: 0.8 },
            { name: '豆瓣酱', probability: 0.8 }
          ],
          cookingMethods: [
            { name: '干煸+炒', description: '川渝改良版，加入豆瓣酱、干辣椒、花椒，麻辣鲜香' }
          ],
          flavor: '麻辣鲜香，开胃下饭',
          description: '川渝版地三鲜加入豆瓣酱、干辣椒、花椒，麻辣鲜香，更重口味，是下饭神器。',
          difficulty: '中等',
          cookingTime: '22分钟',
          calories: '约320千卡/份',
          nutritionalInfo: '多种蔬菜、维生素',
          cookingTips: [
            '豆瓣酱要小火炒出红油',
            '干辣椒和花椒最后放增香',
            '喜欢更辣的可以加小米椒',
            '川渝版不需要放糖，突出麻辣'
          ]
        }
      ]
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
