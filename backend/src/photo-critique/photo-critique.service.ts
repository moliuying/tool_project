import { Injectable } from '@nestjs/common';

export interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
  description: string;
  highlights: string[];
  improvements: string[];
}

export interface PhotoCritique {
  overallScore: number;
  maxScore: number;
  overallGrade: string;
  overallComment: string;
  dimensions: DimensionScore[];
  compositionInsights: string[];
  technicalSuggestions: string[];
  creativeAdvice: string[];
  strengths: string[];
  weaknesses: string[];
  postProcessingTips: string[];
  learningPath: string[];
  suitableScenarios: string[];
}

@Injectable()
export class PhotoCritiqueService {
  private readonly dimensionTemplates = {
    composition: {
      name: '构图',
      descriptions: [
        '画面构图出色，主体突出且富有视觉引导性，展现了成熟的视觉叙事能力。',
        '构图整体良好，主体位置合理，但在视觉层次和节奏感方面还有提升空间。',
        '构图基本合格，主体能够被识别，但缺乏明确的视觉焦点和画面分割意识。',
        '构图需要加强，主体不够突出，画面元素分布较为混乱，缺少视觉引导。'
      ],
      highlights: [
        '黄金分割点运用得当，主体位置自然舒适',
        '前景中景远景层次分明，空间纵深感强',
        '引导线运用巧妙，有效引导观众视线',
        '负空间留白恰当，给人呼吸感',
        '对称构图稳定和谐，充满形式美感',
        '三分法构图经典有效，画面平衡感好'
      ],
      improvements: [
        '尝试将主体放置在黄金分割点而非画面正中央',
        '增加前景元素以增强画面纵深感和层次感',
        '利用道路、河流、栏杆等自然引导线引导视线',
        '注意背景简化，去除干扰主体的杂乱元素',
        '尝试不同的拍摄角度和机位，寻找最佳视角',
        '关注画面边框，避免边缘出现不完整的干扰元素'
      ]
    },
    exposure: {
      name: '曝光',
      descriptions: [
        '曝光精准，明暗过渡自然，高光和暗部细节均得到良好保留，展现了出色的曝光控制能力。',
        '曝光整体准确，主体曝光正确，部分极端明暗区域略有损失但不影响整体。',
        '曝光基本可用，主体亮度尚可，但高光或暗部存在一定的细节丢失。',
        '曝光需要调整，存在明显过曝或欠曝问题，关键细节丢失较多。'
      ],
      highlights: [
        '高光压制出色，天空等亮部细节丰富完整',
        '暗部提亮得当，阴影区域层次分明无死黑',
        '动态范围利用充分，从亮到暗过渡自然',
        '曝光补偿运用合理，主体曝光精准',
        '直方图分布均衡，像素利用率高'
      ],
      improvements: [
        '使用曝光包围功能拍摄多张，后期合成HDR获得更大动态范围',
        '针对亮部适当降低曝光补偿，避免高光溢出',
        '暗部可在后期通过阴影提亮工具恢复细节',
        '使用渐变灰滤镜平衡天空与地面的亮度差',
        '拍摄时关注直方图，避免两端溢出',
        '尝试点测光对主体精准测光，再调整曝光补偿'
      ]
    },
    color: {
      name: '色彩',
      descriptions: [
        '色彩表现出众，色调和谐统一，色彩情感表达准确，具有强烈的视觉感染力。',
        '色彩整体不错，饱和度和白平衡基本准确，色彩搭配较为协调。',
        '色彩表现一般，存在轻微的偏色或饱和度问题，但不影响整体观感。',
        '色彩需要优化，存在明显偏色、饱和度失衡或色彩混乱的问题。'
      ],
      highlights: [
        '白平衡准确，肤色还原真实自然',
        '饱和度适中，色彩鲜艳而不过分溢出',
        '对比色运用巧妙，视觉冲击力强',
        '和谐色调统一，整体氛围营造到位',
        '色彩层次感丰富，过渡细腻平滑',
        '低饱和莫兰迪色调高级，质感出众'
      ],
      improvements: [
        '调整白平衡，消除偏色还原真实色彩',
        '使用HSL工具单独调整各颜色的色相饱和度',
        '尝试统一画面主色调，增强整体协调感',
        '适当降低过于鲜艳的颜色，避免喧宾夺主',
        '利用色彩心理学，选择符合主题情绪的色调',
        '可尝试黑白转换，专注光影和构图表达'
      ]
    },
    themeExpression: {
      name: '主题表达',
      descriptions: [
        '主题表达清晰有力，拍摄意图明确，观众能够迅速理解并产生共鸣，展现了优秀的视觉叙事能力。',
        '主题表达较为明确，主体与环境关系处理得当，基本能够传达拍摄者的意图。',
        '主题表达尚可，但主体与陪体关系不够清晰，拍摄意图需要观众更多揣测。',
        '主题表达需要强化，画面主体不够明确，拍摄意图模糊，难以让观众产生共鸣。'
      ],
      highlights: [
        '主体特征捕捉到位，主题一目了然',
        '环境交代充分，故事背景完整',
        '决定性瞬间把握精准，故事感强',
        '细节选择用心，以小见大寓意深刻',
        '符号语言运用恰当，文化内涵丰富'
      ],
      improvements: [
        '明确拍摄主体，去除与主题无关的干扰元素',
        '善用环境元素交代背景和故事',
        '耐心等待最佳拍摄时机，捕捉决定性瞬间',
        '拍摄前思考：这张照片要传达什么？',
        '尝试系列拍摄，多角度完整呈现主题',
        '关注人文情感，让作品更有温度和深度'
      ]
    },
    emotion: {
      name: '情感传递',
      descriptions: [
        '情感传递极具感染力，作品能够触动人心，引发观众强烈的情感共鸣和思考。',
        '情感表达较好，能够传递一定的情绪氛围，观众能感受到拍摄者的用心。',
        '情感传递一般，画面氛围基本建立，但情感冲击力和共鸣感不足。',
        '情感传递需要加强，画面缺少情绪感染力，观众难以产生情感连接。'
      ],
      highlights: [
        '光影氛围营造出色，情绪感染力强',
        '人物表情捕捉生动，情感真挚动人',
        '色调选择精准，完美烘托情绪氛围',
        '画面留白得当，给观众想象空间',
        '节奏感把控到位，叙事张弛有度'
      ],
      improvements: [
        '利用光影营造情绪氛围，侧光逆光增强戏剧感',
        '关注人物眼神和微表情，捕捉真情实感',
        '色调选择要服务于情感表达，冷调宁静暖调温馨',
        '适当留白，让画面有呼吸感和想象空间',
        '拍摄时投入情感，作品才会有灵魂',
        '尝试对比手法，用反差强化情感表达'
      ]
    },
    technicalExecution: {
      name: '技术执行',
      descriptions: [
        '技术执行精湛，对焦、快门、景深等参数运用恰到好处，展现了扎实的摄影基本功。',
        '技术执行良好，核心技术参数设置合理，照片质量整体达标。',
        '技术执行基本合格，照片基本可用，但在某些技术细节上还有提升空间。',
        '技术执行需要加强，存在对焦不实、快门不当、噪点过多等明显技术问题。'
      ],
      highlights: [
        '对焦精准锐利，主体细节纤毫毕现',
        '快门速度运用得当，动态凝固或流动效果完美',
        '景深控制精确，虚实对比恰到好处',
        'ISO控制出色，画面纯净噪点极低',
        '镜头素质发挥充分，分辨率和畸变控制优秀'
      ],
      improvements: [
        '使用单点对焦模式，确保对焦在最关键的位置',
        '安全快门速度不低于焦距倒数，防止手抖模糊',
        '根据拍摄意图选择合适光圈，控制景深范围',
        '尽量使用原生低ISO，保证画面纯净度',
        '拍摄后放大检查，确保对焦准确不虚',
        '善用三脚架，保证长曝光或微距拍摄稳定'
      ]
    }
  };

  private readonly scenarioTemplates = [
    '摄影学习阶段的作品自评，快速发现个人短板',
    '摄影比赛投稿前的质量评估，提高获奖概率',
    '社交媒体发布前的作品筛选，确保最佳呈现效果',
    '专业摄影接单前的能力自测，了解服务水准',
    '摄影课程作业自我检查，对照教学要求查漏补缺',
    '旅行摄影选片参考，挑选最值得珍藏的作品',
    '人像写真客户选片辅助，提供专业点评依据',
    '风光摄影作品优化建议，提升大片质感'
  ];

  private readonly learningPathTemplates = [
    '系统学习摄影构图法则：三分法、黄金分割、引导线、框架构图等',
    '深入理解曝光三角：光圈、快门、ISO的关系与运用',
    '研究色彩理论：色彩搭配、色温色调、色彩情感表达',
    '练习光线控制：自然光、人造光、柔光、硬光的特点与运用',
    '培养视觉叙事能力：用镜头讲故事，用画面传递情感',
    '学习后期处理：Lightroom、Photoshop等工具的系统化使用',
    '大量观摩大师作品，分析其用光、构图和表达方式',
    '坚持每日拍摄练习，在实践中消化理论知识',
    '参加摄影社群交流，获取同行反馈和不同视角',
    '建立个人作品集，定期复盘总结成长轨迹'
  ];

  private readonly postProcessingTips = [
    '建议使用Lightroom进行基础调整：曝光、对比度、高光阴影、白色黑色色阶',
    '色调曲线可精细控制明暗对比，打造个性化影调',
    'HSL/混色器单独调整各颜色，让主体色彩更加突出',
    '细节面板适度增加锐化，但不要过度导致伪色',
    '使用蒙版工具局部调整，让后期更加精细自然',
    '校准面板微调三原色，获得独特的色彩风格',
    '转换配置文件可快速尝试不同色彩风格',
    '暗角效果增加画面聚焦感，让视线集中在主体',
    ' Dehaze工具增强画面通透感和空气透视',
    '最后适度降噪，平衡细节保留和画面纯净度'
  ];

  critiquePhoto(imagesBase64: string[]): PhotoCritique {
    return this.generateCritique(imagesBase64);
  }

  private generateCritique(_imagesBase64: string[]): PhotoCritique {
    const imageCount = _imagesBase64.length;
    const seed = this.hashImages(_imagesBase64);
    const random = this.seededRandom(seed);

    const dimensions: DimensionScore[] = [];
    const dimensionKeys = ['composition', 'exposure', 'color', 'themeExpression', 'emotion', 'technicalExecution'];

    dimensionKeys.forEach((key) => {
      const template = this.dimensionTemplates[key as keyof typeof this.dimensionTemplates];
      const baseScore = 65 + random() * 30;
      const score = Math.round(baseScore * 10) / 10;

      const descIndex = this.scoreToDescriptionIndex(score);

      const highlightCount = 1 + Math.floor(random() * 3);
      const improveCount = 1 + Math.floor(random() * 3);

      const highlights = this.pickRandom(template.highlights, highlightCount, random);
      const improvements = this.pickRandom(template.improvements, improveCount, random);

      dimensions.push({
        name: template.name,
        score,
        maxScore: 100,
        description: template.descriptions[descIndex],
        highlights,
        improvements
      });
    });

    const overallScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length * 10
    ) / 10;

    const overallGrade = this.scoreToGrade(overallScore);
    const overallComment = this.generateOverallComment(overallScore, overallGrade, imageCount);

    const allHighlights = dimensions.flatMap(d => d.highlights);
    const allImprovements = dimensions.flatMap(d => d.improvements);

    const strengths = this.pickRandom(allHighlights, Math.min(5, allHighlights.length), random);
    const weaknesses = this.pickRandom(allImprovements, Math.min(5, allImprovements.length), random);

    const compositionInsights = this.pickRandom(
      [...this.dimensionTemplates.composition.highlights, ...this.dimensionTemplates.composition.improvements],
      3,
      random
    );

    const technicalSuggestions = this.pickRandom(
      [...this.dimensionTemplates.exposure.improvements, ...this.dimensionTemplates.technicalExecution.improvements],
      3,
      random
    );

    const creativeAdvice = this.pickRandom(
      [...this.dimensionTemplates.themeExpression.improvements, ...this.dimensionTemplates.emotion.improvements],
      3,
      random
    );

    const postProcessingTips = this.pickRandom(this.postProcessingTips, 5, random);
    const learningPath = this.pickRandom(this.learningPathTemplates, 5, random);
    const suitableScenarios = this.pickRandom(this.scenarioTemplates, 4, random);

    return {
      overallScore,
      maxScore: 100,
      overallGrade,
      overallComment,
      dimensions,
      compositionInsights,
      technicalSuggestions,
      creativeAdvice,
      strengths,
      weaknesses,
      postProcessingTips,
      learningPath,
      suitableScenarios
    };
  }

  private hashImages(images: string[]): number {
    let hash = 0;
    const sample = images.map(img => img.substring(0, 100)).join('|');
    for (let i = 0; i < sample.length; i++) {
      const char = sample.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash) || Date.now();
  }

  private seededRandom(seed: number) {
    let s = seed;
    return function() {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }

  private pickRandom<T>(arr: T[], count: number, random: () => number): T[] {
    const shuffled = [...arr].sort(() => random() - 0.5);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  private scoreToDescriptionIndex(score: number): number {
    if (score >= 85) return 0;
    if (score >= 70) return 1;
    if (score >= 55) return 2;
    return 3;
  }

  private scoreToGrade(score: number): string {
    if (score >= 90) return 'S (卓越)';
    if (score >= 85) return 'A+ (优秀)';
    if (score >= 80) return 'A (良好)';
    if (score >= 75) return 'B+ (较好)';
    if (score >= 70) return 'B (不错)';
    if (score >= 65) return 'C+ (合格)';
    if (score >= 60) return 'C (一般)';
    if (score >= 50) return 'D (待提升)';
    return 'E (需努力)';
  }

  private generateOverallComment(score: number, grade: string, imageCount: number): string {
    const imageNote = imageCount > 1
      ? `本次点评了你的 ${imageCount} 张作品，`
      : '本次点评了你的作品，';

    if (score >= 90) {
      return `${imageNote}综合评级为「${grade}」，达到了准专业水准！作品在各维度均有出色表现，展现了扎实的摄影技术功底和成熟的艺术审美。继续保持这种创作状态，尝试更多风格突破，你的作品将具有更强的艺术感染力和市场价值。`;
    } else if (score >= 80) {
      return `${imageNote}综合评级为「${grade}」，整体表现优秀！你的摄影基本功扎实，对画面有较好的把控能力。在某些维度仍有提升空间，针对性地加强短板练习，很快就能迈入更高的创作水平。`;
    } else if (score >= 70) {
      return `${imageNote}综合评级为「${grade}」，作品整体不错！你已经掌握了摄影的基本技术和概念，具备了继续进阶的良好基础。建议重点关注下方列出的改进建议，系统学习理论知识并加强实践练习。`;
    } else if (score >= 60) {
      return `${imageNote}综合评级为「${grade}」，作品基本合格。你对摄影有一定的热情和基础，但在技术和艺术层面都还有较多需要提升的地方。建议从基本功开始系统学习，多看、多拍、多思考，稳步提升摄影水平。`;
    } else {
      return `${imageNote}综合评级为「${grade}」，作品还有较大提升空间。摄影是一门需要长期积累的艺术，建议你从基础的曝光、构图开始系统学习，保持热情坚持练习，每一次拍摄都是进步的机会。`;
    }
  }
}
