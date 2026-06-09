import { Injectable } from '@nestjs/common';
import {
  CreateFitnessPlanDto,
  FitnessGoal,
  Gender,
  TrainingScene,
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

export interface FitnessPlan {
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
  beginnerTips: string[];
}

@Injectable()
export class FitnessService {
  generatePlan(dto: CreateFitnessPlanDto): FitnessPlan {
    const bmi = this.calculateBMI(dto.weight, dto.height);
    const bmiCategory = this.getBMICategory(bmi);
    const bmr = this.calculateBMR(dto.weight, dto.height, dto.age, dto.gender);
    const goalLabel = this.getGoalLabel(dto.goal);
    const sceneLabel = this.getSceneLabel(dto.trainingScene || TrainingScene.BOTH);
    const intensityLevel = this.determineIntensity(dto.age, bmi, dto.goal);

    const weeklyPlan = this.generateWeeklyPlan(dto);
    const cyclePlan = this.generateCyclePlan(dto.goal, dto.age);
    const nutritionAdvice = this.generateNutritionAdvice(dto.goal, bmr, bmi);
    const safetyTips = this.generateSafetyTips(dto.age, bmi, dto.goal);
    const beginnerTips = this.generateBeginnerTips();

    return {
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
      beginnerTips,
    };
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

  private determineIntensity(age: number, bmi: number, goal: FitnessGoal): string {
    if (age > 50 || bmi >= 30) return '低强度起步，循序渐进';
    if (age > 40 || bmi >= 28) return '中低强度，注意保护关节';
    if (goal === FitnessGoal.FAT_LOSS) return '中高强度，注重心率控制';
    if (goal === FitnessGoal.MUSCLE_GAIN) return '中高强度，注重渐进超负荷';
    return '中等强度，持续提升';
  }

  private generateWeeklyPlan(dto: CreateFitnessPlanDto): WeeklyPlan {
    const scene = dto.trainingScene || TrainingScene.BOTH;
    const allDays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const trainingDays: string[] = [];
    const restDays: string[] = [];

    for (let i = 0; i < 7; i++) {
      if (i < dto.availableDaysPerWeek) {
        trainingDays.push(allDays[i]);
      } else {
        restDays.push(allDays[i]);
      }
    }

    const dayPlans: DayPlan[] = trainingDays.map((day, index) =>
      this.generateDayPlan(day, index, dto)
    );

    return {
      days: dayPlans,
      restDays: restDays.length > 0 ? restDays : ['灵活安排休息日'],
    };
  }

  private generateDayPlan(day: string, index: number, dto: CreateFitnessPlanDto): DayPlan {
    const scene = dto.trainingScene || TrainingScene.BOTH;
    const perSession = dto.availableMinutesPerSession;
    const splitType = this.getSplitType(dto.availableDaysPerWeek, dto.goal);
    const focus = this.getDayFocus(index, dto.availableDaysPerWeek, dto.goal);

    const exercises = this.selectExercises(focus, dto.goal, scene, perSession);

    let warmUp = '5-10 分钟动态热身：开合跳、高抬腿、关节环绕、动态拉伸';
    let coolDown = '5-10 分钟放松：静态拉伸、泡沫轴放松、深呼吸';

    if (perSession < 30) {
      warmUp = '3-5 分钟简单热身：关节环绕、原地踏步';
      coolDown = '3-5 分钟简单拉伸';
    } else if (perSession > 90) {
      warmUp = '10-15 分钟充分热身：慢跑/跳绳 + 动态拉伸 + 激活训练';
      coolDown = '10-15 分钟系统放松：静态拉伸 + 泡沫轴 + 冥想';
    }

    const estimatedDuration = Math.min(
      perSession,
      (perSession >= 60 ? 10 : 5) +
        exercises.reduce((acc, ex) => acc + (this.estimateExerciseTime(ex)), 0) +
        (perSession >= 60 ? 10 : 5)
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

  private getDayFocus(index: number, totalDays: number, goal: FitnessGoal): string {
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

  private selectExercises(focus: string, goal: FitnessGoal, scene: TrainingScene, duration: number): Exercise[] {
    const isHome = scene === TrainingScene.HOME;
    const isShort = duration < 45;

    let exercises: Exercise[] = [];

    if (focus.includes('全身')) {
      exercises = this.getFullBodyExercises(isHome, goal, isShort);
    } else if (focus.includes('上肢') || focus.includes('推力') || focus.includes('胸部')) {
      exercises = this.getPushExercises(isHome, goal, isShort);
    } else if (focus.includes('拉力') || focus.includes('背部')) {
      exercises = this.getPullExercises(isHome, goal, isShort);
    } else if (focus.includes('下肢') || focus.includes('腿部')) {
      exercises = this.getLegExercises(isHome, goal, isShort);
    } else if (focus.includes('肩部')) {
      exercises = this.getShoulderExercises(isHome, goal, isShort);
    } else if (focus.includes('有氧') || focus.includes('HIIT')) {
      exercises = this.getCardioExercises(isHome, goal, duration);
    } else if (focus.includes('核心') || focus.includes('手臂')) {
      exercises = this.getCoreArmExercises(isHome, goal, isShort);
    } else {
      exercises = this.getFullBodyExercises(isHome, goal, isShort);
    }

    return this.adjustExerciseIntensity(exercises, goal, duration);
  }

  private adjustExerciseIntensity(exercises: Exercise[], goal: FitnessGoal, duration: number): Exercise[] {
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

  private getFullBodyExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean): Exercise[] {
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

    return isHome ? homeExercises : gymExercises;
  }

  private getPushExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean): Exercise[] {
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

    return isHome ? homeExercises : gymExercises;
  }

  private getPullExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean): Exercise[] {
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

    return isHome ? homeExercises : gymExercises;
  }

  private getLegExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean): Exercise[] {
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

    return isHome ? homeExercises : gymExercises;
  }

  private getShoulderExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean): Exercise[] {
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

    return isHome ? homeExercises : gymExercises;
  }

  private getCardioExercises(isHome: boolean, goal: FitnessGoal, duration: number): Exercise[] {
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

    return isHome ? homeCardio : gymCardio;
  }

  private getCoreArmExercises(isHome: boolean, goal: FitnessGoal, isShort: boolean): Exercise[] {
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

    return isHome ? homeExercises : gymExercises;
  }

  private generateCyclePlan(goal: FitnessGoal, age: number): { phases: CyclePhase[]; totalDuration: string } {
    const phases: CyclePhase[] = [];

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

  private generateNutritionAdvice(goal: FitnessGoal, bmr: number, bmi: number): string[] {
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

    return generalTips;
  }

  private generateSafetyTips(age: number, bmi: number, goal: FitnessGoal): string[] {
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

    tips.push('保证每周至少 1-2 天的完全休息日，让身体充分恢复');
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
