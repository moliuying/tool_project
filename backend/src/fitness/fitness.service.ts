import { Injectable } from '@nestjs/common';
import {
  CreateFitnessPlanDto,
  FitnessGoal,
  Gender,
  TrainingScene,
  HealthCondition,
} from './dto/create-fitness-plan.dto';

export interface Exercise {
  name: string;
  sets?: number;
  reps?: string;
  duration?: string;
  description: string;
  targetMuscle?: string;
}

export interface DayPlan {
  day: string;
  focus: string;
  exercises: Exercise[];
  warmUp: string;
  coolDown: string;
  estimatedDuration: number;
}

export interface WeeklyPlan {
  days: DayPlan[];
  restDays: string[];
}

export interface CyclePhase {
  name: string;
  duration: string;
  description: string;
  focus: string;
  intensity: string;
  tips: string[];
}

export interface HealthWarning {
  condition: string;
  severity: 'high' | 'medium' | 'low';
  warning: string;
  suggestions: string[];
}

export interface FitnessPlan {
  planBasis: string[];
  applicableScope: {
    suitableFor: string[];
    notSuitableFor: string[];
    boundaries: string[];
  };
  disclaimer: string;
  userProfile: {
    age: number;
    gender: Gender;
    weight: number;
    height: number;
    bmi: number;
    bmiCategory: string;
    bmr: number;
    goal: FitnessGoal;
    goalLabel: string;
    healthConditions: string[];
  };
  trainingOverview: {
    frequency: string;
    weeklyDays: number;
    minutesPerSession: number;
    totalWeeklyMinutes: number;
    intensityLevel: string;
    trainingScene: TrainingScene;
    sceneLabel: string;
  };
  weeklyPlan: WeeklyPlan;
  cyclePlan: {
    phases: CyclePhase[];
    totalDuration: string;
  };
  nutritionAdvice: string[];
  safetyTips: string[];
  healthWarnings: HealthWarning[];
  beginnerTips: string[];
}

@Injectable()
export class FitnessService {
  generatePlan(dto: CreateFitnessPlanDto): FitnessPlan {
    const healthConditions = dto.healthConditions || [];
    const hasHighRiskCondition = this.hasHighRiskCondition(healthConditions);

    const bmi = this.calculateBMI(dto.weight, dto.height);
    const bmiCategory = this.getBMICategory(bmi);
    const bmr = this.calculateBMR(dto.weight, dto.height, dto.age, dto.gender);
    const goalLabel = this.getGoalLabel(dto.goal);
    const sceneLabel = this.getSceneLabel(dto.trainingScene || TrainingScene.BOTH);
    const intensityLevel = this.determineIntensity(dto.age, bmi, dto.goal, healthConditions);

    const weeklyPlan = this.generateWeeklyPlan(dto, healthConditions);
    const cyclePlan = this.generateCyclePlan(dto.goal, dto.age, healthConditions);
    const nutritionAdvice = this.generateNutritionAdvice(dto.goal, bmr, bmi, healthConditions);
    const safetyTips = this.generateSafetyTips(dto.age, bmi, dto.goal, healthConditions);
    const healthWarnings = this.generateHealthWarnings(healthConditions);
    const beginnerTips = this.generateBeginnerTips();
    const planBasis = this.getPlanBasis();
    const applicableScope = this.getApplicableScope();
    const disclaimer = this.getDisclaimer(hasHighRiskCondition);

    return {
      planBasis,
      applicableScope,
      disclaimer,
      userProfile: {
        age: dto.age,
        gender: dto.gender,
        weight: dto.weight,
        height: dto.height,
        bmi,
        bmiCategory,
        bmr,
        goal: dto.goal,
        goalLabel,
        healthConditions: healthConditions.map(c => this.getHealthConditionLabel(c)),
      },
      trainingOverview: {
        frequency: this.getFrequencyLabel(dto.availableDaysPerWeek),
        weeklyDays: dto.availableDaysPerWeek,
        minutesPerSession: dto.availableMinutesPerSession,
        totalWeeklyMinutes: dto.availableDaysPerWeek * dto.availableMinutesPerSession,
        intensityLevel,
        trainingScene: dto.trainingScene || TrainingScene.BOTH,
        sceneLabel,
      },
      weeklyPlan,
      cyclePlan,
      nutritionAdvice,
      safetyTips,
      healthWarnings,
      beginnerTips,
    };
  }

  private getPlanBasis(): string[] {
    return [
      '基于国际运动医学学会 (ACSM) 运动测试与处方指南制定',
      '参考中国居民膳食指南（2022）营养建议',
      '结合 BMI 身体质量指数和 BMR 基础代谢率科学计算',
      '根据每周训练天数自动选择最佳训练分化模式（全身/上下肢/推拉腿）',
      '训练动作按目标肌群、器械可获得性（家庭/健身房）分类匹配',
      '强度安排遵循循序渐进原则，避免过度训练和运动损伤',
      '周期规划采用「适应-进阶-巩固」三阶段模型，符合人体运动适应规律',
    ];
  }

  private getApplicableScope(): { suitableFor: string[]; notSuitableFor: string[]; boundaries: string[] } {
    return {
      suitableFor: [
        '18-60 岁健康成年人，无严重慢性疾病或运动禁忌症',
        '健身新手，希望获得科学入门指导',
        '减脂人群（BMI 18.5-35），希望通过运动配合饮食控制体重',
        '增肌爱好者（BMI 17-28），希望系统提升肌肉量和力量',
        '塑形人群，希望改善体态、均衡发展各肌群',
        '忙碌职场人士，时间有限但希望保持规律运动',
        '家庭健身爱好者，使用徒手或简易器械训练',
        '健身房训练者，希望获得分化训练计划',
      ],
      notSuitableFor: [
        '孕妇（孕期运动需在产科医生和专业产前教练指导下进行）',
        '产后 6 周以内人群（需经医生评估后逐步恢复）',
        '严重心血管疾病患者（心梗、心衰、严重心律失常等）',
        '未控制的严重高血压患者（静息血压 > 180/110 mmHg）',
        '急性损伤期或术后恢复期患者',
        '严重骨关节疾病（如严重关节炎、股骨头坏死等）',
        '糖尿病视网膜病变、糖尿病足等严重并发症患者',
        '严重肥胖（BMI > 40）需医生评估后制定方案',
        '存在其他医生认为不适合运动的疾病状况者',
      ],
      boundaries: [
        '本计划为通用参考模板，不能替代医生或专业康复师的个性化指导',
        '如存在特殊健康状况，请在开始训练前咨询医生或专业人士',
        '如训练中出现胸痛、严重呼吸困难、头晕等症状，应立即停止并就医',
        '计划效果因人而异，受基因、饮食、睡眠、执行程度等多种因素影响',
        '建议每 4-8 周评估身体变化，调整训练方案以避免平台期',
      ],
    };
  }

  private getDisclaimer(hasHighRisk: boolean): string {
    if (hasHighRisk) {
      return '⚠️ 重要提示：您勾选了特殊健康状况，本计划已根据常规情况进行了适度调整，但仍强烈建议您在开始任何运动计划前，先咨询主治医生或专业康复医师的意见。如训练过程中出现不适，请立即停止并就医。';
    }
    return '免责声明：本健身计划由 AI 基于通用运动科学原理生成，仅供参考学习使用，不构成医疗建议或诊断。运动前请确保自身健康状况良好，如有任何疑问请咨询专业医生或持证健身教练。';
  }

  private getHealthConditionLabel(condition: HealthCondition): string {
    const labels: Record<HealthCondition, string> = {
      [HealthCondition.KNEE_INJURY]: '膝盖损伤',
      [HealthCondition.WAIST_INJURY]: '腰部损伤',
      [HealthCondition.SHOULDER_INJURY]: '肩部损伤',
      [HealthCondition.HYPERTENSION]: '高血压',
      [HealthCondition.HEART_DISEASE]: '心脏疾病',
      [HealthCondition.DIABETES]: '糖尿病',
      [HealthCondition.PREGNANCY]: '孕期',
      [HealthCondition.POSTPARTUM]: '产后恢复',
      [HealthCondition.OBESITY]: '重度肥胖',
      [HealthCondition.ARTHRITIS]: '关节炎',
      [HealthCondition.OSTEOPOROSIS]: '骨质疏松',
      [HealthCondition.ASTHMA]: '哮喘',
      [HealthCondition.NONE]: '无特殊状况',
    };
    return labels[condition];
  }

  private hasHighRiskCondition(conditions: HealthCondition[]): boolean {
    const highRisk = [
      HealthCondition.HEART_DISEASE,
      HealthCondition.PREGNANCY,
      HealthCondition.HYPERTENSION,
    ];
    return conditions.some(c => highRisk.includes(c));
  }

  private calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100;
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
  }

  private getBMICategory(bmi: number): string {
    if (bmi < 18.5) return '偏瘦';
    if (bmi < 24) return '正常';
    if (bmi < 28) return '超重';
    return '肥胖';
  }

  private calculateBMR(weight: number, height: number, age: number, gender: Gender): number {
    if (gender === Gender.MALE) {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    }
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }

  private getGoalLabel(goal: FitnessGoal): string {
    const labels: Record<FitnessGoal, string> = {
      [FitnessGoal.MUSCLE_GAIN]: '增肌',
      [FitnessGoal.FAT_LOSS]: '减脂',
      [FitnessGoal.BODY_SHAPING]: '塑形',
      [FitnessGoal.FITNESS_IMPROVEMENT]: '提升体能',
    };
    return labels[goal];
  }

  private getSceneLabel(scene: TrainingScene): string {
    const labels: Record<TrainingScene, string> = {
      [TrainingScene.HOME]: '家庭健身',
      [TrainingScene.GYM]: '健身房训练',
      [TrainingScene.BOTH]: '家庭+健身房',
    };
    return labels[scene];
  }

  private getFrequencyLabel(days: number): string {
    if (days <= 2) return '低频次（每周 1-2 次）';
    if (days <= 4) return '中频次（每周 3-4 次）';
    return '高频次（每周 5-7 次）';
  }

  private determineIntensity(age: number, bmi: number, goal: FitnessGoal, healthConditions: HealthCondition[]): string {
    if (healthConditions.includes(HealthCondition.HEART_DISEASE) ||
        healthConditions.includes(HealthCondition.PREGNANCY)) {
      return '极低强度，务必先咨询医生';
    }
    if (healthConditions.includes(HealthCondition.HYPERTENSION) ||
        healthConditions.includes(HealthCondition.DIABETES)) {
      return '低强度起步，严格监测身体指标';
    }
    if (age > 50 || bmi >= 30 || healthConditions.includes(HealthCondition.OBESITY)) {
      return '低强度起步，循序渐进';
    }
    if (age > 40 || bmi >= 28 || healthConditions.includes(HealthCondition.KNEE_INJURY) ||
        healthConditions.includes(HealthCondition.WAIST_INJURY) ||
        healthConditions.includes(HealthCondition.ARTHRITIS)) {
      return '中低强度，注意保护关节';
    }
    if (goal === FitnessGoal.FAT_LOSS) return '中高强度，注重心率控制';
    if (goal === FitnessGoal.MUSCLE_GAIN) return '中高强度，注重渐进超负荷';
    return '中等强度，持续提升';
  }

  private generateHealthWarnings(conditions: HealthCondition[]): HealthWarning[] {
    const warnings: HealthWarning[] = [];

    if (conditions.includes(HealthCondition.KNEE_INJURY)) {
      warnings.push({
        condition: '膝盖损伤',
        severity: 'medium',
        warning: '膝关节为负重关节，损伤后需特别注意运动方式的选择',
        suggestions: [
          '避免深蹲、弓步蹲、跳跃类、登山机、楼梯机等对膝盖压力大的动作',
          '用坐姿腿屈伸、坐姿腿弯举替代站立训练',
          '优先选择游泳、椭圆机、骑自行车（调高坐垫）等低冲击有氧运动',
          '运动时佩戴护膝，加强股四头肌和腘绳肌的力量训练以稳定膝关节',
          '如出现膝盖疼痛、肿胀、弹响等症状，立即停止训练并就医',
        ],
      });
    }

    if (conditions.includes(HealthCondition.WAIST_INJURY)) {
      warnings.push({
        condition: '腰部损伤',
        severity: 'medium',
        warning: '腰部是连接上下肢的枢纽，损伤后需严格避免加重腰椎负担的动作',
        suggestions: [
          '禁止硬拉、负重体前屈、仰卧起坐（卷腹）、悬垂举腿等对腰部压力大的动作',
          '核心训练以平板支撑、死虫式、鸟狗式等静态或低负荷动作为主',
          '深蹲时注意背部挺直，不要弯腰负重',
          '训练前充分热身腰部，训练后及时拉伸放松',
          '日常注意坐姿，避免久坐，每隔 45-60 分钟起身活动',
        ],
      });
    }

    if (conditions.includes(HealthCondition.HYPERTENSION)) {
      warnings.push({
        condition: '高血压',
        severity: 'high',
        warning: '剧烈运动可能导致血压骤升，存在心脑血管风险',
        suggestions: [
          '‼️ 训练前请确保静息血压低于 160/100 mmHg，如高于此值请勿训练',
          '避免憋气发力（如大重量深蹲、硬拉），这会显著升高血压',
          '避免需要头部低于心脏的体位（如下斜卧推、倒立）',
          '避免竞技性、爆发性运动，选择持续温和的有氧运动（快走、慢跑、游泳、骑车）',
          '运动强度控制在最大心率的 50-65%（最大心率 ≈ 220 - 年龄）',
          '训练前后监测血压，运动中如感到头痛、头晕、心慌立即停止',
        ],
      });
    }

    if (conditions.includes(HealthCondition.HEART_DISEASE)) {
      warnings.push({
        condition: '心脏疾病',
        severity: 'high',
        warning: '不恰当的运动可能诱发心肌缺血、心律失常等严重后果',
        suggestions: [
          '‼️ 极高风险：在开始任何运动前，必须经主治医生（心内科）评估并获得运动许可',
          '建议在医院心脏康复中心进行 3-6 个月的规范康复训练后再居家训练',
          '仅允许低强度活动（慢走、极慢骑车），严禁力量训练和 HIIT',
          '运动时必须有人陪伴，随身携带急救药物（如硝酸甘油）',
          '严格控制运动心率不超过医生指定靶心率',
          '如出现胸痛、胸闷、气短、冷汗、恶心等症状，立即停止并拨打急救电话',
        ],
      });
    }

    if (conditions.includes(HealthCondition.DIABETES)) {
      warnings.push({
        condition: '糖尿病',
        severity: 'high',
        warning: '运动会影响血糖水平，不当运动可能导致低血糖或酮症酸中毒',
        suggestions: [
          '训练前确保血糖在 5.6-16.7 mmol/L 之间，低于 5.6 需先补充碳水，高于 16.7 不宜训练',
          '避免空腹运动，最好在餐后 1-2 小时训练',
          '随身携带糖果、果汁等易吸收碳水，以备低血糖时急救',
          '注射胰岛素的患者，运动前应适当减少胰岛素剂量（需咨询医生）',
          '避免剧烈运动和长时间运动，每次以 20-45 分钟中等强度为宜',
          '运动前后监测血糖，记录血糖变化以调整用药和饮食',
          '注意足部保护，避免赤脚运动，穿合脚的运动鞋袜',
        ],
      });
    }

    if (conditions.includes(HealthCondition.PREGNANCY)) {
      warnings.push({
        condition: '孕期运动安全指引（已自动调整为孕期专属方案）',
        severity: 'high',
        warning: '孕期运动涉及胎儿安全，个体差异极大。本方案为通用参考，开始前务必获得产科医生许可，运动中随时以身体感受为准，如有不适立即停止。',
        suggestions: [
          '【孕早期（1-12周）】以休息为主，仅推荐10-15分钟慢走+呼吸练习，避免劳累，避免高温环境，此阶段胎儿不稳定',
          '【孕中期（13-27周）】相对安全的运动窗口，可进行20-30分钟低强度运动，每周3次以内，注意补充水分和能量',
          '【孕晚期（28周以后）】运动时间缩短至15-20分钟，以散步、盆底肌练习、拉伸为主，避免仰卧位，避免平衡挑战',
          '✅ 推荐运动：慢走、孕妇瑜伽、游泳（水温适宜）、固定自行车、凯格尔运动、骨盆倾斜、桥式（靠墙）、轻柔拉伸',
          '❌ 绝对禁忌：仰卧位（孕中晚期）、跳跃、冲击性动作、腹部受压、憋气发力（Valsalva动作）、球类对抗、滑雪/骑马/潜水、高温瑜伽、平躺超过5分钟',
          '⚠️ 监测指标：运动中心率不超过（220-年龄）× 70%，始终能正常说话（说话测试），体温不超过38℃',
          '🚨 出现以下情况立即停止并就医：阴道出血/流液、规律宫缩、腹痛、头晕胸痛、严重气短、头痛视物模糊、胎动异常减少',
          '每次运动前补充水分和少量碳水，穿宽松衣物和合脚的鞋，避免空腹或餐后立即运动，运动后缓慢降温',
        ],
      });
    }

    if (conditions.includes(HealthCondition.POSTPARTUM)) {
      warnings.push({
        condition: '产后恢复',
        severity: 'medium',
        warning: '产后身体各系统需要时间恢复，过早高强度运动可能导致子宫脱垂、腹直肌分离加重',
        suggestions: [
          '顺产 42 天内、剖宫产 3 个月内以休息和盆底肌激活（凯格尔运动）为主',
          '开始训练前需经 42 天产后检查确认身体恢复良好',
          '禁止卷腹、仰卧起坐、跳跃、大重量负重等动作',
          '从盆底肌修复、腹式呼吸、核心激活等基础训练开始',
          '如存在腹直肌分离 > 2 指，需先进行专业康复，禁止传统腹部训练',
          '注意哺乳时间安排，避免运动后立即哺乳',
        ],
      });
    }

    if (conditions.includes(HealthCondition.OBESITY)) {
      warnings.push({
        condition: '重度肥胖',
        severity: 'medium',
        warning: '过重体重会给关节和心肺带来额外负担，需选择低冲击运动并循序渐进',
        suggestions: [
          '避免跑步、跳绳、开合跳、深蹲跳等对关节冲击大的运动',
          '优先选择游泳、水中有氧、椭圆机、卧式自行车、快走等低冲击运动',
          '初期以消耗热量的有氧运动为主，力量训练从徒手或极轻重量开始',
          '每次运动时间从 15-20 分钟开始，逐步增加到 40-60 分钟',
          '穿有良好支撑的运动鞋，必要时佩戴护膝',
          '减重速度以每周 0.5-1 公斤为宜，不要追求快速减重',
        ],
      });
    }

    if (conditions.includes(HealthCondition.ARTHRITIS)) {
      warnings.push({
        condition: '关节炎',
        severity: 'medium',
        warning: '关节软骨已受损，不当运动可能加速关节磨损和炎症',
        suggestions: [
          '避免剧烈屈伸关节、长时间负重、爬山爬楼梯的动作',
          '选择游泳、水中运动、太极、散步等对关节友好的运动',
          '力量训练以等长收缩（静态发力）为主，减少关节摩擦',
          '运动前充分热身，运动时避免疼痛，如疼痛持续需停止',
          '注意关节保暖，避免在潮湿寒冷环境中训练',
          '急性期关节红肿热痛时应休息，不要训练',
        ],
      });
    }

    if (conditions.includes(HealthCondition.OSTEOPOROSIS)) {
      warnings.push({
        condition: '骨质疏松',
        severity: 'high',
        warning: '骨密度降低，骨折风险显著增加，需特别注意防跌倒和动作选择',
        suggestions: [
          '‼️ 避免向前弯腰、仰卧起坐、扭转脊柱、高处跳下等动作',
          '避免需要平衡和协调的高风险运动（滑雪、滑冰、网球等）',
          '推荐快走、低冲击舞蹈、阶梯器、轻重量抗阻训练',
          '力量训练注重脊柱深层稳定肌和下肢肌肉，增加骨密度刺激',
          '训练时确保地面平整无障碍物，避免滑倒',
          '同时注意补充钙和维生素 D，遵医嘱进行药物治疗',
        ],
      });
    }

    if (conditions.includes(HealthCondition.ASTHMA)) {
      warnings.push({
        condition: '哮喘',
        severity: 'medium',
        warning: '运动可能诱发支气管痉挛（运动性哮喘），需提前预防并做好急救准备',
        suggestions: [
          '运动前 15-30 分钟预防性吸入短效支气管扩张剂（如沙丁胺醇），随身携带急救药物',
          '避免在寒冷、干燥、空气污染严重的环境中运动，优先选择温暖潮湿环境',
          '充分热身 10-15 分钟，循序渐进增加强度，避免突然的剧烈运动',
          '优先选择游泳（湿润空气）、散步、间歇式强度较低的运动',
          '避免长时间持续高强度的耐力运动',
          '如出现胸闷、喘息、咳嗽等哮喘发作征兆，立即停止并使用急救药物，必要时就医',
        ],
      });
    }

    if (conditions.includes(HealthCondition.SHOULDER_INJURY)) {
      warnings.push({
        condition: '肩部损伤',
        severity: 'medium',
        warning: '肩关节是人体活动度最大但最不稳定的关节，损伤后极易复发',
        suggestions: [
          '避免卧推、过头推举、侧平举、引体向上等肩部高负荷动作',
          '先以 YTWL 字母操、弹力带外旋等肩袖肌群激活训练为主',
          '动作幅度不要超过肩关节无痛活动范围',
          '注重胸背肌肉平衡，避免含胸圆肩加重肩部负担',
          '肩部训练前务必用弹力带做 5-10 分钟的激活热身',
        ],
      });
    }

    return warnings;
  }

  private generateWeeklyPlan(dto: CreateFitnessPlanDto, healthConditions: HealthCondition[]): WeeklyPlan {
    const scene = dto.trainingScene || TrainingScene.BOTH;
    const allDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const trainingDays: string[] = [];
    const restDays: string[] = [];

    let effectiveDays = dto.availableDaysPerWeek;
    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      effectiveDays = Math.min(effectiveDays, 2);
    } else if (this.hasHighRiskCondition(healthConditions) || healthConditions.includes(HealthCondition.POSTPARTUM)) {
      effectiveDays = Math.min(effectiveDays, 3);
    }

    for (let i = 0; i < 7; i++) {
      if (i < effectiveDays) {
        trainingDays.push(allDays[i]);
      } else {
        restDays.push(allDays[i]);
      }
    }

    const dayPlans: DayPlan[] = trainingDays.map((day, index) =>
      this.generateDayPlan(day, index, dto, healthConditions)
    );

    return {
      days: dayPlans,
      restDays: restDays.length > 0 ? restDays : ['灵活安排休息日'],
    };
  }

  private generateDayPlan(day: string, index: number, dto: CreateFitnessPlanDto, healthConditions: HealthCondition[]): DayPlan {
    const scene = dto.trainingScene || TrainingScene.BOTH;
    const perSession = dto.availableMinutesPerSession;
    const focus = this.getDayFocus(index, dto.availableDaysPerWeek, dto.goal, healthConditions);

    const exercises = this.selectExercises(focus, dto.goal, scene, perSession, healthConditions);

    let warmUp = '5-10 分钟动态热身：开合跳、高抬腿、关节环绕、动态拉伸';
    let coolDown = '5-10 分钟放松：静态拉伸、泡沫轴放松、深呼吸';

    if (healthConditions.includes(HealthCondition.KNEE_INJURY)) {
      warmUp = '5-10 分钟热身：原地踏步、膝关节环绕（小幅度）、股四头肌拉伸、腘绳肌拉伸';
    }
    if (healthConditions.includes(HealthCondition.HYPERTENSION) || healthConditions.includes(HealthCondition.HEART_DISEASE)) {
      warmUp = '10-15 分钟缓慢热身：慢走 + 关节活动，让心率平稳上升';
      coolDown = '10-15 分钟逐渐放松：慢走 + 深呼吸，让心率平稳下降，不要突然停止';
    }
    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      warmUp = '5-8 分钟孕期专属热身：原地慢走摆臂 → 手腕脚踝关节环绕 → 肩部画圈 → 骨盆轻柔晃动（手扶稳固支撑），全程呼吸平稳，不做任何跳跃或快速动作';
      coolDown = '8-10 分钟孕期放松：逐渐减速慢走 → 端坐或侧卧腹式深呼吸 → 小腿和肩部轻柔静态拉伸（每个动作15-20秒，不过度伸展）→ 左侧卧休息2-3分钟，避免突然站起防止体位性低血压';
    }

    if (!healthConditions.includes(HealthCondition.PREGNANCY)) {
      if (perSession < 30) {
        warmUp = '3-5 分钟简单热身：关节环绕、原地踏步';
        coolDown = '3-5 分钟简单拉伸';
      } else if (perSession > 90 && !this.hasHighRiskCondition(healthConditions)) {
        warmUp = '10-15 分钟充分热身：慢跑/跳绳 + 动态拉伸 + 激活训练';
        coolDown = '10-15 分钟系统放松：静态拉伸 + 泡沫轴 + 冥想';
      }
    }

    let sessionDuration = perSession;
    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      sessionDuration = Math.min(perSession, 30);
    }
    const estimatedDuration = Math.min(
      sessionDuration,
      (sessionDuration >= 60 ? 10 : 5) +
        exercises.reduce((acc, ex) => acc + (this.estimateExerciseTime(ex)), 0) +
        (sessionDuration >= 60 ? 10 : 5)
    );

    return {
      day,
      focus,
      exercises,
      warmUp,
      coolDown,
      estimatedDuration,
    };
  }

  private estimateExerciseTime(exercise: Exercise): number {
    if (exercise.duration) {
      const match = exercise.duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 10;
    }
    const sets = exercise.sets || 3;
    const repsMatch = exercise.reps?.match(/(\d+)/);
    const reps = repsMatch ? parseInt(repsMatch[1]) : 12;
    return Math.round(sets * (reps * 0.05 + 1.5));
  }

  private getSplitType(days: number, goal: FitnessGoal): string {
    if (days <= 2) return '全身训练';
    if (days === 3) return '上下肢分化';
    if (days <= 5) return '推拉腿分化';
    return '肌群细分训练';
  }

  private getDayFocus(index: number, totalDays: number, goal: FitnessGoal, healthConditions: HealthCondition[]): string {
    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      const pregnancyFocuses = [
        '孕期专属 · 慢走 + 呼吸 + 凯格尔',
        '孕期专属 · 骨盆稳定 + 拉伸放松',
      ];
      return pregnancyFocuses[index % pregnancyFocuses.length];
    }
    if (healthConditions.includes(HealthCondition.HEART_DISEASE)) {
      return '轻度活动 · 以散步和呼吸为主';
    }
    if (healthConditions.includes(HealthCondition.HYPERTENSION) ||
        healthConditions.includes(HealthCondition.DIABETES) ||
        healthConditions.includes(HealthCondition.OBESITY)) {
      const focuses = ['低冲击有氧 + 核心激活', '轻量力量训练（上半身）', '低冲击有氧 + 拉伸放松'];
      return focuses[index % 3];
    }
    if (totalDays <= 2) {
      return index === 0 ? '全身力量 + 有氧' : '全身循环 + 核心';
    }
    if (totalDays === 3) {
      const focuses = ['上肢力量训练', '下肢力量训练', '全身 HIIT + 核心'];
      return focuses[index % 3];
    }
    if (totalDays === 4) {
      const focuses = ['推力训练（胸肩三头）', '拉力训练（背二头）', '下肢力量训练', '有氧 + 核心'];
      return focuses[index % 4];
    }
    if (totalDays === 5) {
      const focuses = ['胸部 + 三头', '背部 + 二头', '腿部训练', '肩部 + 核心', '有氧 HIIT'];
      return focuses[index % 5];
    }
    const focuses = [
      '胸部 + 三头', '背部 + 二头', '腿部训练', '肩部训练', '手臂 + 核心', '有氧 HIIT', '主动恢复'
    ];
    return focuses[index % 7];
  }

  private selectExercises(
    focus: string,
    goal: FitnessGoal,
    scene: TrainingScene,
    duration: number,
    healthConditions: HealthCondition[]
  ): Exercise[] {
    const isHome = scene === TrainingScene.HOME;
    const isShort = duration < 45;

    let exercises: Exercise[] = [];

    if (healthConditions.includes(HealthCondition.HEART_DISEASE)) {
      exercises = [
        { name: '慢走', duration: '20 分钟', description: '以能正常说话的速度匀速慢走，如感到不适立即停止', targetMuscle: '全身、心肺' },
        { name: '腹式呼吸', duration: '5 分钟', description: '仰卧或端坐，深呼吸，吸气鼓腹，呼气收腹', targetMuscle: '核心、呼吸肌' },
      ];
      return exercises;
    }

    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      return this.getPregnancyExercises();
    }

    if (focus.includes('轻度活动') || focus.includes('低冲击')) {
      exercises = [
        { name: '原地踏步', duration: '10 分钟', description: '抬起膝盖，手臂自然摆动，保持呼吸平稳', targetMuscle: '全身、心肺' },
        { name: '坐姿举臂', sets: 3, reps: '15 次', description: '端坐椅子上，双手缓慢向上举过头顶再放下', targetMuscle: '肩部、核心' },
        { name: '坐姿伸腿', sets: 3, reps: '每侧 12 次', description: '端坐椅子上，双腿交替伸直抬起与地面平行', targetMuscle: '股四头肌' },
        { name: '墙推', sets: 3, reps: '15 次', description: '面对墙站立，双手推墙，类似俯卧撑但强度低', targetMuscle: '胸部、三头' },
        { name: '骨盆倾斜', sets: 3, reps: '15 次', description: '仰卧，腰部贴地再放松，锻炼核心稳定', targetMuscle: '核心、下背' },
        { name: '静态拉伸', duration: '10 分钟', description: '各主要肌群轻柔拉伸，每个动作保持 15-30 秒', targetMuscle: '全身' },
      ];
      return exercises;
    }

    if (focus.includes('全身')) {
      exercises = this.getFullBodyExercises(isHome, goal, isShort, healthConditions);
    } else if (focus.includes('上肢') || focus.includes('推力') || focus.includes('胸部')) {
      exercises = this.getPushExercises(isHome, goal, isShort, healthConditions);
    } else if (focus.includes('拉力') || focus.includes('背部')) {
      exercises = this.getPullExercises(isHome, goal, isShort, healthConditions);
    } else if (focus.includes('下肢') || focus.includes('腿部')) {
      exercises = this.getLegExercises(isHome, goal, isShort, healthConditions);
    } else if (focus.includes('肩部')) {
      exercises = this.getShoulderExercises(isHome, goal, isShort, healthConditions);
    } else if (focus.includes('有氧') || focus.includes('HIIT')) {
      exercises = this.getCardioExercises(isHome, goal, duration, healthConditions);
    } else if (focus.includes('核心') || focus.includes('手臂')) {
      exercises = this.getCoreArmExercises(isHome, goal, isShort, healthConditions);
    } else {
      exercises = this.getFullBodyExercises(isHome, goal, isShort, healthConditions);
    }

    return this.adjustExerciseIntensity(exercises, goal, duration, healthConditions);
  }

  private adjustExerciseIntensity(
    exercises: Exercise[],
    goal: FitnessGoal,
    duration: number,
    healthConditions: HealthCondition[]
  ): Exercise[] {
    if (healthConditions.includes(HealthCondition.HYPERTENSION) ||
        healthConditions.includes(HealthCondition.DIABETES) ||
        healthConditions.includes(HealthCondition.POSTPARTUM) ||
        healthConditions.includes(HealthCondition.ARTHRITIS)) {
      exercises = exercises.map(ex => {
        if (ex.sets) {
          return { ...ex, sets: Math.max(2, Math.round(ex.sets * 0.7)) };
        }
        return ex;
      });
    }
    let setsMultiplier = 1;
    let repsAdjustment = '';

    if (goal === FitnessGoal.MUSCLE_GAIN) {
      setsMultiplier = 1;
    } else if (goal === FitnessGoal.FAT_LOSS) {
      setsMultiplier = 1;
    } else if (goal === FitnessGoal.BODY_SHAPING) {
      setsMultiplier = 1;
    }

    if (duration < 45) {
      return exercises.slice(0, Math.max(3, Math.floor(exercises.length * 0.6)));
    }
    if (duration < 60) {
      return exercises.slice(0, Math.max(4, Math.floor(exercises.length * 0.8)));
    }
    return exercises;
  }

  private getFullBodyExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean, healthConditions: HealthCondition[]): Exercise[] {
    const hasKnee = healthConditions.includes(HealthCondition.KNEE_INJURY);
    const hasWaist = healthConditions.includes(HealthCondition.WAIST_INJURY);
    const hasShoulder = healthConditions.includes(HealthCondition.SHOULDER_INJURY);
    const hasObesity = healthConditions.includes(HealthCondition.OBESITY) || healthConditions.includes(HealthCondition.ARTHRITIS);
    const gymExercises: Exercise[] = [
      { name: '深蹲', sets: 4, reps: '10-12 次', description: '杠铃/哑铃深蹲，注意膝盖方向与脚尖一致', targetMuscle: '腿部、臀部' },
      { name: '卧推', sets: 4, reps: '10-12 次', description: '平板卧推，控制下放速度', targetMuscle: '胸部、三头' },
      { name: '硬拉', sets: 4, reps: '8-10 次', description: '传统硬拉，保持背部挺直', targetMuscle: '背部、腿部、核心' },
      { name: '引体向上/高位下拉', sets: 4, reps: '8-12 次', description: '做不动引体可用高位下拉替代', targetMuscle: '背部、二头' },
      { name: '推举', sets: 3, reps: '10-12 次', description: '站姿杠铃推举', targetMuscle: '肩部、三头' },
      { name: '平板支撑', duration: '3 组 × 60 秒', description: '保持身体一条直线', targetMuscle: '核心' },
    ];

    const homeExercises: Exercise[] = [
      { name: '徒手深蹲', sets: 4, reps: '15-20 次', description: '可扶椅子保持平衡，下蹲至大腿平行地面', targetMuscle: '腿部、臀部' },
      { name: '俯卧撑', sets: 4, reps: '12-15 次', description: '标准俯卧撑，做不了可膝盖着地', targetMuscle: '胸部、三头、肩部' },
      { name: '弓步蹲', sets: 3, reps: '每侧 12 次', description: '向前跨步下蹲，后膝接近地面', targetMuscle: '腿部、臀部' },
      { name: '超人式', sets: 3, reps: '15 次', description: '俯卧，四肢同时抬起', targetMuscle: '下背、臀部' },
      { name: '平板支撑', duration: '3 组 × 45 秒', description: '保持身体一条直线', targetMuscle: '核心' },
      { name: '开合跳', duration: '3 组 × 60 秒', description: '全身有氧运动', targetMuscle: '全身、心肺' },
    ];

    let result = isHome ? homeExercises : gymExercises;
    if (hasKnee) {
      result = result.filter(e => !['深蹲', '箭步蹲', '弓步蹲', '开合跳', '跳绳'].includes(e.name));
    }
    if (hasWaist) {
      result = result.filter(e => !['硬拉', '仰卧起坐', '卷腹'].includes(e.name));
    }
    if (hasShoulder) {
      result = result.filter(e => !['站姿推举', '推肩'].includes(e.name));
    }
    if (hasObesity) {
      result = result.filter(e => !['开合跳', '跳绳', '深蹲跳'].includes(e.name));
    }
    return result;
  }

  private getPushExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean, healthConditions: HealthCondition[]): Exercise[] {
    const hasShoulder = healthConditions.includes(HealthCondition.SHOULDER_INJURY);
    const gymExercises: Exercise[] = [
      { name: '平板卧推', sets: 4, reps: '10-12 次', description: '控制节奏，离心 2-3 秒', targetMuscle: '胸大肌' },
      { name: '上斜哑铃卧推', sets: 3, reps: '10-12 次', description: '锻炼上胸部', targetMuscle: '上胸' },
      { name: '哑铃飞鸟', sets: 3, reps: '12-15 次', description: '感受胸部拉伸', targetMuscle: '胸部中缝' },
      { name: '坐姿推举', sets: 4, reps: '10-12 次', description: '杠铃或哑铃坐姿推举', targetMuscle: '三角肌前中束' },
      { name: '哑铃侧平举', sets: 4, reps: '15 次', description: '轻重量高次数，控制速度', targetMuscle: '三角肌中束' },
      { name: '绳索下压', sets: 4, reps: '12-15 次', description: '锻炼肱三头肌', targetMuscle: '肱三头肌' },
    ];

    const homeExercises: Exercise[] = [
      { name: '标准俯卧撑', sets: 4, reps: '15 次', description: '身体保持一条直线', targetMuscle: '胸部、三头' },
      { name: '上斜俯卧撑', sets: 3, reps: '15 次', description: '手撑椅子，侧重下胸部', targetMuscle: '下胸' },
      { name: '下斜俯卧撑', sets: 3, reps: '12 次', description: '脚垫高，侧重上胸部', targetMuscle: '上胸' },
      { name: '椅子臂屈伸', sets: 3, reps: '12 次', description: '双手撑椅子，身体下沉', targetMuscle: '肱三头肌' },
      { name: '水瓶侧平举', sets: 4, reps: '15 次', description: '双手握装满水的水瓶', targetMuscle: '肩部中束' },
      { name: '墙壁俯卧撑', sets: 3, reps: '20 次', description: '热身或力竭后的补充', targetMuscle: '肩部前束' },
    ];

    let result = isHome ? homeExercises : gymExercises;
    if (hasShoulder) {
      result = result.filter(e => !['站姿推举', '哑铃侧平举', '水瓶侧平举', '坐姿推举'].includes(e.name));
      result.push({ name: '墙壁俯卧撑', sets: 3, reps: '15 次', description: '低强度推胸动作，肩部友好', targetMuscle: '胸部' });
    }
    return result;
  }

  private getPullExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean, healthConditions: HealthCondition[]): Exercise[] {
    const hasWaist = healthConditions.includes(HealthCondition.WAIST_INJURY);
    const gymExercises: Exercise[] = [
      { name: '引体向上', sets: 4, reps: '力竭', description: '做不动可用弹力带辅助', targetMuscle: '背阔肌、二头' },
      { name: '高位下拉', sets: 4, reps: '10-12 次', description: '宽握距，感受背部发力', targetMuscle: '背阔肌' },
      { name: '杠铃划船', sets: 4, reps: '10-12 次', description: '俯身 45 度，拉向下腹部', targetMuscle: '中背部' },
      { name: '单臂哑铃划船', sets: 3, reps: '每侧 12 次', description: '感受背部收缩', targetMuscle: '背阔肌' },
      { name: '坐姿划船', sets: 3, reps: '12-15 次', description: '注意肩胛骨后缩', targetMuscle: '中背部' },
      { name: '杠铃弯举', sets: 4, reps: '10-12 次', description: '控制节奏，避免借力', targetMuscle: '肱二头肌' },
    ];

    const homeExercises: Exercise[] = [
      { name: '反向划船', sets: 4, reps: '12 次', description: '使用稳固的桌子或低单杠，身体后仰拉', targetMuscle: '背部、二头' },
      { name: '毛巾引体向上', sets: 3, reps: '力竭', description: '如果门上有横杆可用毛巾辅助', targetMuscle: '背阔肌' },
      { name: '超人式', sets: 4, reps: '20 次', description: '俯卧，四肢同时抬起', targetMuscle: '下背部' },
      { name: '俯卧 T 字伸展', sets: 3, reps: '15 次', description: '手臂呈 T 字，抬起挤压肩胛骨', targetMuscle: '中背部、后肩' },
      { name: '水瓶弯举', sets: 4, reps: '12-15 次', description: '双手握装满水的水瓶', targetMuscle: '肱二头肌' },
      { name: '反手俯卧撑', sets: 3, reps: '12 次', description: '双手靠近，手指朝向脚部', targetMuscle: '二头、胸部' },
    ];

    let result = isHome ? homeExercises : gymExercises;
    if (hasWaist) {
      result = result.filter(e => !['杠铃划船', '硬拉'].includes(e.name));
    }
    return result;
  }

  private getLegExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean, healthConditions: HealthCondition[]): Exercise[] {
    const hasKnee = healthConditions.includes(HealthCondition.KNEE_INJURY);
    const hasWaist = healthConditions.includes(HealthCondition.WAIST_INJURY);
    const hasObesity = healthConditions.includes(HealthCondition.OBESITY) || healthConditions.includes(HealthCondition.ARTHRITIS);
    const gymExercises: Exercise[] = [
      { name: '杠铃深蹲', sets: 5, reps: '8-10 次', description: '深蹲之王，全幅度下蹲', targetMuscle: '股四头、臀大肌' },
      { name: '罗马尼亚硬拉', sets: 4, reps: '10-12 次', description: '感受腘绳肌拉伸', targetMuscle: '腘绳肌、臀大肌' },
      { name: '腿举', sets: 4, reps: '12-15 次', description: '根据训练目标调整脚位', targetMuscle: '腿部整体' },
      { name: '腿部屈伸', sets: 3, reps: '15 次', description: '孤立训练股四头肌', targetMuscle: '股四头肌' },
      { name: '腿部弯举', sets: 3, reps: '15 次', description: '孤立训练腘绳肌', targetMuscle: '腘绳肌' },
      { name: '提踵', sets: 4, reps: '20 次', description: '站姿或坐姿提踵', targetMuscle: '小腿' },
    ];

    const homeExercises: Exercise[] = [
      { name: '徒手深蹲', sets: 5, reps: '20 次', description: '下蹲至大腿平行地面', targetMuscle: '股四头、臀大肌' },
      { name: '箭步蹲', sets: 4, reps: '每侧 15 次', description: '向前跨步下蹲，后膝接近地面', targetMuscle: '腿部、臀部' },
      { name: '保加利亚分腿蹲', sets: 3, reps: '每侧 12 次', description: '后脚放椅子上', targetMuscle: '单腿力量' },
      { name: '臀桥', sets: 4, reps: '20 次', description: '仰卧，臀部用力抬起', targetMuscle: '臀大肌、腘绳肌' },
      { name: '单腿臀桥', sets: 3, reps: '每侧 12 次', description: '单腿抬起，增加难度', targetMuscle: '臀大肌' },
      { name: '台阶跳', sets: 3, reps: '15 次', description: '利用台阶或稳固椅子', targetMuscle: '小腿、爆发力' },
    ];

    let result = isHome ? homeExercises : gymExercises;
    if (hasKnee) {
      result = result.filter(e => !['杠铃深蹲', '箭步蹲', '弓步蹲', '深蹲跳', '台阶跳', '提踵跳'].includes(e.name));
      result.push({ name: '坐姿腿屈伸', sets: 3, reps: '15 次', description: '椅子上交替伸直腿，膝盖友好', targetMuscle: '股四头肌' });
      result.push({ name: '臀桥', sets: 3, reps: '15 次', description: '仰卧屈膝抬臀，无膝关节压力', targetMuscle: '臀大肌、腘绳肌' });
    }
    if (hasWaist) {
      result = result.filter(e => !['罗马尼亚硬拉', '硬拉'].includes(e.name));
    }
    if (hasObesity) {
      result = result.filter(e => !['深蹲跳', '台阶跳', '开合跳'].includes(e.name));
    }
    return result;
  }

  private getShoulderExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean, healthConditions: HealthCondition[]): Exercise[] {
    const hasShoulder = healthConditions.includes(HealthCondition.SHOULDER_INJURY);
    const gymExercises: Exercise[] = [
      { name: '站姿杠铃推举', sets: 4, reps: '10-12 次', description: '核心收紧，不借力', targetMuscle: '三角肌整体' },
      { name: '哑铃侧平举', sets: 5, reps: '15 次', description: '轻重量，感受中束收缩', targetMuscle: '三角肌中束' },
      { name: '哑铃前平举', sets: 4, reps: '12 次', description: '手臂伸直抬起至水平', targetMuscle: '三角肌前束' },
      { name: '反向飞鸟', sets: 4, reps: '15 次', description: '俯身，感受后肩收缩', targetMuscle: '三角肌后束' },
      { name: '绳索面拉', sets: 4, reps: '15 次', description: '拉向面部，后肩和斜方肌下部', targetMuscle: '后肩、上背' },
      { name: '阿诺德推举', sets: 3, reps: '12 次', description: '哑铃推举的变式，旋转手腕', targetMuscle: '三角肌整体' },
    ];

    const homeExercises: Exercise[] = [
      { name: '水瓶推举', sets: 4, reps: '15 次', description: '双手握装满水的水瓶', targetMuscle: '三角肌整体' },
      { name: '水瓶侧平举', sets: 5, reps: '15 次', description: '轻重量多次数', targetMuscle: '三角肌中束' },
      { name: '水瓶前平举', sets: 4, reps: '12 次', description: '交替或双手同时', targetMuscle: '三角肌前束' },
      { name: '俯卧飞鸟', sets: 4, reps: '15 次', description: '俯卧椅子上，手臂侧抬', targetMuscle: '三角肌后束' },
      { name: '倒立撑（靠墙）', sets: 3, reps: '力竭', description: '靠墙，身体几乎倒立', targetMuscle: '肩部、三头' },
      { name: ' pike 俯卧撑', sets: 3, reps: '12 次', description: '臀部高抬，侧重肩部', targetMuscle: '三角肌前束' },
    ];

    let result = isHome ? homeExercises : gymExercises;
    if (hasShoulder) {
      result = result.filter(e => !['站姿杠铃推举', '哑铃侧平举', '哑铃前平举', '倒立撑', '水瓶侧平举'].includes(e.name));
      result.push({ name: '耸肩', sets: 3, reps: '20 次', description: '轻重量，仅斜方肌上提，肩关节活动小', targetMuscle: '斜方肌' });
      result.push({ name: '靠墙天使', sets: 3, reps: '15 次', description: '背贴墙，手臂滑动上下，恢复肩关节活动度', targetMuscle: '肩部稳定肌' });
    }
    return result;
  }

  private getCardioExercises(isHome: boolean, goal: FitnessGoal, duration: number, healthConditions: HealthCondition[]): Exercise[] {
    const hasKnee = healthConditions.includes(HealthCondition.KNEE_INJURY);
    const hasObesity = healthConditions.includes(HealthCondition.OBESITY) || healthConditions.includes(HealthCondition.ARTHRITIS);
    const hasAsthma = healthConditions.includes(HealthCondition.ASTHMA);
    const hasHeart = healthConditions.includes(HealthCondition.HEART_DISEASE) || healthConditions.includes(HealthCondition.HYPERTENSION);
    const cardioTime = Math.max(15, Math.floor(duration * 0.6));
    const hiitTime = Math.max(10, Math.floor(duration * 0.4));

    const gymCardio: Exercise[] = [
      { name: '跑步机热身', duration: '5 分钟', description: '速度 6-8km/h，心率升至最大心率的 60%', targetMuscle: '心肺' },
      { name: 'HIIT 间歇跑', duration: `${hiitTime} 分钟`, description: '30 秒冲刺（最大心率 90%） + 60 秒快走，交替循环', targetMuscle: '心肺、燃脂' },
      { name: '划船机', duration: '10 分钟', description: '保持稳定节奏，注意发力顺序：腿-核心-手', targetMuscle: '全身、心肺' },
      { name: '椭圆机', duration: `${cardioTime - 15} 分钟`, description: '中高强度，心率维持在最大心率的 70-80%', targetMuscle: '下肢、心肺' },
      { name: '战绳训练', duration: '3 组 × 60 秒', description: '波浪、摔绳等动作，组间休息 30 秒', targetMuscle: '全身、核心' },
    ];

    const homeCardio: Exercise[] = [
      { name: '原地踏步热身', duration: '5 分钟', description: '高抬腿或原地踏步，逐渐提升心率', targetMuscle: '心肺' },
      { name: '开合跳', duration: '3 组 × 60 秒', description: '组间休息 30 秒', targetMuscle: '全身、心肺' },
      { name: '高抬腿', duration: '3 组 × 45 秒', description: '膝盖尽量抬高，保持节奏', targetMuscle: '腿部、心肺' },
      { name: '波比跳', duration: '3 组 × 12 次', description: '完整动作：蹲下-俯卧撑-跳起', targetMuscle: '全身、爆发力' },
      { name: '登山跑', duration: '3 组 × 45 秒', description: '俯卧撑姿势，交替提膝', targetMuscle: '核心、心肺' },
      { name: '跳绳（模拟）', duration: `${cardioTime - 15} 分钟`, description: '没有绳子可以模拟跳绳动作', targetMuscle: '小腿、心肺' },
    ];

    let result = isHome ? homeCardio : gymCardio;
    if (hasKnee || hasObesity) {
      result = result.filter(e => !['高抬腿', '开合跳', '跳绳', '跳绳（模拟）', '波比跳', '台阶跳'].includes(e.name));
      result.push({ name: '原地踏步', duration: `${cardioTime} 分钟`, description: '低冲击有氧，膝盖友好', targetMuscle: '全身、心肺' });
    }
    if (hasAsthma || hasHeart) {
      result = result.filter(e => e.name.includes('HIIT') || e.name.includes('波比') || e.name.includes('冲刺'));
      result = [{ name: '快走/慢走', duration: `${cardioTime} 分钟`, description: '匀速进行，保持可正常说话的强度，如感不适立即停止', targetMuscle: '全身、心肺' }];
    }
    return result;
  }

  private getCoreArmExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean, healthConditions: HealthCondition[]): Exercise[] {
    const hasWaist = healthConditions.includes(HealthCondition.WAIST_INJURY);
    const hasShoulder = healthConditions.includes(HealthCondition.SHOULDER_INJURY);
    const gymExercises: Exercise[] = [
      { name: '悬垂举腿', sets: 4, reps: '15 次', description: '核心发力，不借力摆动', targetMuscle: '下腹' },
      { name: '绳索卷腹', sets: 4, reps: '15 次', description: '感受腹部收缩', targetMuscle: '腹肌整体' },
      { name: '俄罗斯转体', sets: 3, reps: '每侧 20 次', description: '可持哑铃增加难度', targetMuscle: '腹斜肌' },
      { name: '杠铃弯举', sets: 4, reps: '12 次', description: '控制节奏，不甩臂', targetMuscle: '肱二头肌' },
      { name: '锤式弯举', sets: 3, reps: '12 次', description: '锻炼肱肌和前臂', targetMuscle: '肱肌、前臂' },
      { name: '绳索下压', sets: 4, reps: '15 次', description: '充分伸展和收缩', targetMuscle: '肱三头肌' },
    ];

    const homeExercises: Exercise[] = [
      { name: '仰卧卷腹', sets: 4, reps: '20 次', description: '下背部贴地，肩胛骨离地即可', targetMuscle: '上腹肌' },
      { name: '仰卧举腿', sets: 4, reps: '15 次', description: '腿抬至垂直地面，缓慢下放', targetMuscle: '下腹肌' },
      { name: '俄罗斯转体', sets: 3, reps: '每侧 20 次', description: '可抱重物增加难度', targetMuscle: '腹斜肌' },
      { name: '平板支撑', duration: '3 组 × 60 秒', description: '保持身体一条直线', targetMuscle: '核心整体' },
      { name: '水瓶弯举', sets: 4, reps: '15 次', description: '双手握装满水的水瓶', targetMuscle: '肱二头肌' },
      { name: '椅子臂屈伸', sets: 4, reps: '15 次', description: '双手撑椅子，身体下沉', targetMuscle: '肱三头肌' },
    ];

    let result = isHome ? homeExercises : gymExercises;
    if (hasWaist) {
      result = result.filter(e => !['俄罗斯转体', '仰卧卷腹', '绳索卷腹'].includes(e.name));
      result.push({ name: '死虫式', sets: 3, reps: '每侧 12 次', description: '仰卧，对侧手脚同时伸展，腰部始终贴地', targetMuscle: '核心稳定' });
      result.push({ name: '鸟狗式', sets: 3, reps: '每侧 12 次', description: '四点跪姿，对侧手脚同时伸展，保持躯干稳定', targetMuscle: '核心、下背' });
    }
    if (hasShoulder) {
      result = result.filter(e => !['椅子臂屈伸', '绳索下压'].includes(e.name));
    }
    return result;
  }

  private getPregnancyExercises(): Exercise[] {
    return [
      {
        name: '户外慢走',
        duration: '15-20 分钟',
        description: '以能正常说话的速度匀速行走，穿合脚的运动鞋，选择平坦安全的路线，避免高温和寒冷天气',
        targetMuscle: '全身、心肺'
      },
      {
        name: '凯格尔运动（盆底肌训练）',
        sets: 3,
        reps: '每轮 10-15 次 × 保持 5 秒',
        description: '收缩盆底肌肉（如同憋尿），保持 5 秒后放松 10 秒，站姿或坐姿均可，有助于预防孕期尿失禁和加速产后恢复',
        targetMuscle: '盆底肌'
      },
      {
        name: '骨盆倾斜运动',
        sets: 3,
        reps: '10-12 次',
        description: '双手膝四点跪姿（猫式准备），吸气时塌腰抬头，呼气时拱背收腹（类似猫牛式），动作缓慢轻柔，锻炼核心稳定缓解腰酸',
        targetMuscle: '核心、下背、盆底'
      },
      {
        name: '腹式呼吸练习',
        duration: '5 分钟',
        description: '端坐或侧卧，一手放胸前一手放腹部，吸气时腹部隆起（3秒），呼气时腹部收缩（5秒），全程胸部不动，有助于血氧交换和放松',
        targetMuscle: '呼吸肌、核心'
      },
      {
        name: '坐姿举臂拉伸',
        sets: 3,
        reps: '每侧 8-10 次',
        description: '端坐稳固椅子上，双手合十上举过头顶，然后身体缓慢向左右侧弯曲各 5 秒，轻柔拉伸肋间肌和腰侧，缓解孕期腰背紧张',
        targetMuscle: '肩背、腰侧'
      },
      {
        name: '坐姿踝泵练习',
        sets: 4,
        reps: '每侧 15 次',
        description: '端坐椅子上，双腿伸直抬起与地面平行（或放矮凳上），脚踝用力向回勾再向前踩，促进下肢血液循环，预防孕期水肿和静脉血栓',
        targetMuscle: '小腿、踝关节'
      },
      {
        name: '靠墙桥式（臀部抬起）',
        sets: 3,
        reps: '8-10 次',
        description: '上背部和头部靠墙，双脚踩地屈膝与肩同宽，吸气时臀部缓慢抬起至身体呈一条斜线（不做完全桥式），呼气回落，增强臀肌和下背，注意不要憋气',
        targetMuscle: '臀大肌、下背'
      },
      {
        name: '盘腿坐姿拉伸',
        duration: '3-5 分钟',
        description: '端坐垫上，双脚掌相对（蝴蝶式），双手轻按膝盖向下施压（不用强求贴地），保持呼吸平稳，有助于打开骨盆，为分娩做准备',
        targetMuscle: '髋内收肌、骨盆底'
      },
    ];
  }

  private generateCyclePlan(goal: FitnessGoal, age: number, healthConditions: HealthCondition[]): { phases: CyclePhase[]; totalDuration: string } {
    const hasCondition = healthConditions.length > 0;
    const phases: CyclePhase[] = [];

    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      phases.push({
        name: '孕早期（1-12周）· 静养与适应',
        duration: '12 周',
        description: '此阶段胎儿不稳定，以休息和极轻度活动为主，避免劳累和风险',
        focus: '呼吸练习、盆底肌激活、日常慢走（如身体允许）',
        intensity: '极低强度，以无不适为原则，有孕吐或不适时完全休息',
        tips: [
          '每日仅 10-15 分钟慢走或呼吸练习，避免任何劳累',
          '避免高温、避免长时间站立、避免提重物',
          '坚持补充叶酸，注意饮食清淡少量多餐',
          '有腹痛、阴道出血等异常情况立即停止活动并就医',
        ],
      });
      phases.push({
        name: '孕中期（13-27周）· 黄金运动窗口',
        duration: '15 周',
        description: '此阶段相对稳定，是孕期最适合规律运动的时期，有助于控制体重和改善血液循环',
        focus: '规律慢走、凯格尔运动、孕妇瑜伽、骨盆稳定练习',
        intensity: '低强度，能正常说话的程度，每次 20-30 分钟，每周 2-3 次',
        tips: [
          '运动前后补充水分和少量碳水，避免空腹',
          '避免仰卧位超过 5 分钟，避免憋气发力',
          '穿着孕妇专用运动内衣和有支撑的运动鞋',
          '每周体重增长约 0.3-0.5kg，关注体重变化',
        ],
      });
      phases.push({
        name: '孕晚期（28周以后）· 分娩准备',
        duration: '约 12 周（至分娩）',
        description: '此阶段身体负担大，缩短运动时间，重点在呼吸技巧、盆底肌和骨盆准备，为分娩做准备',
        focus: '短时间慢走、拉玛泽呼吸法、凯格尔运动、轻柔骨盆拉伸',
        intensity: '极低强度，每次 15-20 分钟，随时可停止，避免平衡挑战',
        tips: [
          '学习拉玛泽呼吸法，为分娩镇痛做准备',
          '避免平躺、避免久站、避免腹部受压',
          '关注胎动和宫缩，如有规律宫缩、破水等情况立即就医',
          '饮食控制精制糖和盐分，预防水肿和妊娠糖尿病',
        ],
      });
      return { phases, totalDuration: '全程约 40 周，配合孕期进程动态调整，遵医嘱为第一原则' };
    }

    if (age > 50) {
      phases.push({
        name: '基础适应期',
        duration: '4 周',
        description: '让身体逐步适应运动节奏，建立正确动作模式',
        focus: '动作学习、关节灵活性、核心稳定性',
        intensity: '低强度，动作质量优先',
        tips: [
          '每个动作先空杆或徒手练习',
          '重量宁轻勿假，确保动作标准',
          '训练中如有关节不适立即停止',
          '保证充足的睡眠和水分补充',
        ],
      });
    } else {
      phases.push({
        name: '基础适应期',
        duration: '2 周',
        description: '让身体逐步适应训练节奏，纠正动作模式',
        focus: '动作标准度、肌肉感受度、心肺基础',
        intensity: '低-中强度，约最大能力的 60%',
        tips: [
          '不要追求重量，动作质量第一',
          '每次训练后记录肌肉感受',
          '保持规律的作息时间',
          '注意热身和拉伸的完整性',
        ],
      });
    }

    let progressiveDuration = '8 周';
    let progressiveIntensity = '中-高强度，渐进超负荷';
    if (hasCondition) {
      phases[0] = {
        ...phases[0],
        name: '基础适应期（延长）',
        duration: '6-8 周',
        description: '因存在特殊健康状况，需要更长时间让身体逐步适应，请在专业人士指导下进行',
        intensity: '低强度，以不产生不适为原则',
      };
      progressiveDuration = '保守进阶，不急于增加强度';
      progressiveIntensity = '低-中强度，以安全为第一原则';
    }
    if (goal === FitnessGoal.FAT_LOSS) {
      progressiveDuration = '6 周';
      progressiveIntensity = '中高强度，关注心率区间';
    } else if (goal === FitnessGoal.MUSCLE_GAIN) {
      progressiveDuration = '10 周';
      progressiveIntensity = '中高强度，持续增加训练容量';
    }

    phases.push({
      name: '持续进阶期',
      duration: progressiveDuration,
      description: '核心训练阶段，根据目标逐步增加训练难度',
      focus: this.getProgressiveFocus(goal),
      intensity: progressiveIntensity,
      tips: this.getProgressiveTips(goal),
    });

    phases.push({
      name: '巩固调整期',
      duration: '2 周',
      description: '降低训练强度，让身体充分恢复，避免过度训练',
      focus: '主动恢复、动作回顾、体态调整',
      intensity: '低强度，训练量减至平时的 50%',
      tips: [
        '保持运动习惯，但降低强度',
        '多做拉伸和泡沫轴放松',
        '可以尝试新的运动方式（瑜伽、游泳等）',
        '回顾前阶段成果，制定下一阶段目标',
      ],
    });

    const totalWeeks = phases.reduce((acc, p) => {
      const match = p.duration.match(/(\d+)/);
      return acc + (match ? parseInt(match[1]) : 0);
    }, 0);

    return {
      phases,
      totalDuration: `约 ${totalWeeks} 周（${Math.round(totalWeeks / 4 * 10) / 10} 个月）`,
    };
  }

  private getProgressiveFocus(goal: FitnessGoal): string {
    const focusMap: Record<FitnessGoal, string> = {
      [FitnessGoal.MUSCLE_GAIN]: '增加训练容量、渐进超负荷、肌肉孤立训练',
      [FitnessGoal.FAT_LOSS]: '提升训练密度、增加有氧比例、控制心率区间',
      [FitnessGoal.BODY_SHAPING]: '均衡发展各肌群、改善体态、增加功能性训练',
      [FitnessGoal.FITNESS_IMPROVEMENT]: '提升心肺耐力、增加力量基础、改善运动表现',
    };
    return focusMap[goal];
  }

  private getProgressiveTips(goal: FitnessGoal): string[] {
    const tipsMap: Record<FitnessGoal, string[]> = {
      [FitnessGoal.MUSCLE_GAIN]: [
        '每周尝试增加重量或次数（渐进超负荷）',
        '训练组间休息 60-90 秒',
        '注重肌肉离心收缩过程（下放阶段）',
        '保证充足蛋白质摄入（每公斤体重 1.6-2.2g）',
      ],
      [FitnessGoal.FAT_LOSS]: [
        '保持心率在最大心率的 60-80% 区间',
        '力量训练后进行 20-30 分钟中低强度有氧',
        '适当缩短组间休息（30-60 秒）',
        '配合饮食控制，制造适度热量缺口',
      ],
      [FitnessGoal.BODY_SHAPING]: [
        '注意薄弱部位的针对性训练',
        '加入功能性训练和体态矫正动作',
        '每个动作控制在 12-15 次区间',
        '保持运动多样性，避免平台期',
      ],
      [FitnessGoal.FITNESS_IMPROVEMENT]: [
        '每周安排 2-3 次有氧训练',
        '尝试不同的运动方式，全面发展',
        '记录每次训练的数据，量化进步',
        '注意呼吸模式和运动效率',
      ],
    };
    return tipsMap[goal];
  }

  private generateNutritionAdvice(goal: FitnessGoal, bmr: number, bmi: number, healthConditions: HealthCondition[]): string[] {
    const advice: string[] = [];
    if (healthConditions.includes(HealthCondition.DIABETES)) {
      advice.push('⚠️ 糖尿病饮食请严格遵照医生或营养师的指导，本建议仅作参考');
      advice.push('定时定量进餐，避免血糖大幅波动，选择低 GI（升糖指数）食物');
    }
    if (healthConditions.includes(HealthCondition.HYPERTENSION)) {
      advice.push('⚠️ 高血压饮食请严格限盐（每日 < 5g），避免腌制食品和加工肉类');
      advice.push('增加钾摄入（香蕉、土豆、菠菜等），限制饮酒和咖啡因');
    }
    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      advice.push('⚠️【孕期专属营养】请严格遵照产科医生和营养师指导，以下为通用建议，个体情况需遵医嘱');
      advice.push('【孕早期（1-12周）】每日补充叶酸400-800μg预防神经管畸形，饮食清淡易消化，少量多餐缓解孕吐，保证碳水摄入避免酮症');
      advice.push('【孕中期（13-27周）】每日增加约300大卡热量，蛋白质增加15g（约等于1个鸡蛋+1杯牛奶+50g瘦肉），注意补铁预防贫血');
      advice.push('【孕晚期（28周以后）】每日增加约450大卡热量，蛋白质增加30g，钙摄入需达1000mg/天（牛奶500ml+豆制品+深绿色蔬菜），控制精制糖和盐分避免水肿');
      advice.push('关键营养素：叶酸、铁（红肉/动物血/肝脏，搭配维C促进吸收）、钙、DHA（深海鱼每周2-3次或补充剂）、碘、维生素D');
      advice.push('饮食禁忌：禁止饮酒和含酒精饮品、避免生食（生鱼片/半熟蛋/未杀菌奶制品）、避免高汞鱼类（鲨鱼/旗鱼/金枪鱼）、减少咖啡因（每日<200mg，约1杯美式）、避免未清洗的蔬果');
      advice.push('体重增长参考：孕前BMI正常（18.5-24.9）总增重11.5-16kg，孕中晚期每周约0.4kg；超重/肥胖需适当控制，具体遵医嘱');
    }
    if (healthConditions.includes(HealthCondition.OSTEOPOROSIS)) {
      advice.push('⚠️ 骨质疏松注意补充钙（每日 1000-1200mg）和维生素 D，多吃奶制品、豆制品、深绿色蔬菜');
    }
    if (advice.length > 0) {
      advice.push('--- 以下为通用营养建议 ---');
    }
    let caloricIntake: string;
    let proteinRatio: string;
    let specificTips: string[];

    switch (goal) {
      case FitnessGoal.MUSCLE_GAIN:
        caloricIntake = `每日建议摄入热量：${bmr + 300}-${bmr + 500} 大卡（BMR + 300~500 大卡盈余）`;
        proteinRatio = '蛋白质：每公斤体重 1.6-2.2g/天，均匀分配到 4-5 餐';
        specificTips = [
          '训练后 1 小时内补充蛋白质和碳水（如乳清蛋白 + 香蕉）',
          '碳水选择复合碳水（糙米、燕麦、红薯），提供持续能量',
          '适量摄入健康脂肪（牛油果、坚果、橄榄油）',
          '每天保证充足水分（每公斤体重 35-40ml）',
        ];
        break;
      case FitnessGoal.FAT_LOSS:
        const deficitMin = Math.max(300, Math.round(bmr * 0.15));
        const deficitMax = Math.max(500, Math.round(bmr * 0.25));
        caloricIntake = `每日建议摄入热量：${bmr - deficitMax}-${bmr - deficitMin} 大卡（适度热量缺口，不低于基础代谢）`;
        proteinRatio = '蛋白质：每公斤体重 1.8-2.4g/天，防止肌肉流失';
        specificTips = [
          '多吃高纤维食物（蔬菜、粗粮），增加饱腹感',
          '避免含糖饮料和精加工食品',
          '饮食顺序：先吃蔬菜 → 蛋白质 → 碳水',
          '不要过度节食，保证基础代谢和营养均衡',
        ];
        break;
      case FitnessGoal.BODY_SHAPING:
        caloricIntake = `每日建议摄入热量：${bmr - 100}-${bmr + 200} 大卡（微调即可，重点是营养分配）`;
        proteinRatio = '蛋白质：每公斤体重 1.6-2.0g/天，保持肌肉量';
        specificTips = [
          '均衡摄入三大营养素，碳水 40%、蛋白质 30%、脂肪 30%',
          '多吃色彩丰富的蔬菜水果，补充维生素和矿物质',
          '训练日适当增加碳水摄入，休息日减少',
          '控制加工食品和精制糖的摄入',
        ];
        break;
      default:
        caloricIntake = `每日建议摄入热量：${bmr + 200}-${bmr + 400} 大卡（满足运动消耗）`;
        proteinRatio = '蛋白质：每公斤体重 1.4-1.8g/天';
        specificTips = [
          '运动前 1-2 小时适量补充碳水，避免空腹运动',
          '保证电解质摄入，尤其是大量出汗后',
          '饮食多样化，不要挑食偏食',
          '少食多餐，避免暴饮暴食',
        ];
    }

    const generalTips = [
      caloricIntake,
      proteinRatio,
      ...specificTips,
    ];

    if (bmi >= 28) {
      generalTips.push('⚠️ 您的 BMI 偏高，建议先咨询医生后再开始减脂计划，避免运动损伤');
    }
    if (bmi < 18.5 && goal === FitnessGoal.FAT_LOSS) {
      generalTips.push('⚠️ 您的 BMI 偏低，减脂目标可能不适合，建议改为塑形或体能提升');
    }

    return [...advice, ...generalTips];
  }

  private generateSafetyTips(age: number, bmi: number, goal: FitnessGoal, healthConditions: HealthCondition[]): string[] {
    const tips: string[] = [
      '训练前必须充分热身，训练后必须拉伸放松',
      '动作质量优先于重量和次数，不标准的动作容易受伤',
      '训练中如感到头晕、胸闷、关节疼痛，应立即停止',
      '循序渐进，不要急于求成，身体需要时间适应',
    ];

    if (age >= 40) {
      tips.push('40 岁以上人群建议训练前进行体检，特别关注心血管功能');
      tips.push('避免突然的剧烈运动，心率控制在（220-年龄）× 70% 以内');
    }

    if (age >= 50) {
      tips.push('50 岁以上人群建议在专业人士指导下开始训练');
      tips.push('重点关注关节保护，避免高强度冲击性运动');
    }

    if (bmi >= 28) {
      tips.push('BMI 偏高人群注意保护膝关节，避免跳绳、快跑等高冲击运动');
      tips.push('建议先从游泳、椭圆机、快走等低冲击运动开始');
    }

    if (bmi >= 30) {
      tips.push('肥胖人群建议先咨询医生或专业健身教练，制定安全的运动方案');
    }

    if (healthConditions.includes(HealthCondition.PREGNANCY)) {
      tips.unshift('🚨【孕期安全第一】运动前必须获得产科医生书面许可，有前置胎盘、先兆流产、妊娠高血压等并发症者禁止运动');
      tips.push('孕期避免仰卧位超过5分钟（孕中晚期），避免憋气发力、避免腹部受压、避免体温过高（<38℃）');
      tips.push('每次运动前先喝200ml水，运动中每15分钟补充水分，避免在高温高湿环境和正午时段运动');
      tips.push('建议在家人或专业人员陪同下运动，随身携带手机和糖块，选择地面平坦安全的场所');
      tips.push('孕晚期建议以左侧卧位休息为主，避免长时间站立，运动后监测胎动是否正常');
      tips.push('体重每周称重1次（晨起空腹），体重异常快速增加或减少需及时就医');
    } else {
      tips.push('保证每周至少 1-2 天的完全休息日，让身体充分恢复');
    }

    tips.push('运动时穿着合适的运动鞋和运动服，提供足够的支撑和保护');

    return tips;
  }

  private generateBeginnerTips(): string[] {
    return [
      '第一个月不要追求重量和次数，重点是学会正确的动作模式',
      '建议在镜子前训练，或请朋友帮忙观察动作是否标准',
      '可以先用手机录像，回放分析自己的动作',
      '养成记录训练日志的习惯，帮助追踪进步',
      '新手最容易犯的错误：动作不标准、重量过重、急于求成',
      '如果对某个动作不确定，宁可少做或不做，也不要勉强',
      '训练中保持专注，不要玩手机分心',
      '找到一起训练的伙伴，互相鼓励和监督',
      '不要和别人比较，每个人的起点和体质都不同',
      '坚持是最重要的，前 3 个月最难熬，坚持下来就会看到变化',
    ];
  }
}
