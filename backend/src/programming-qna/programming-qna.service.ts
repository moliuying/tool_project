import { Injectable } from '@nestjs/common';
import {
  AskQuestionDto,
  ProgrammingCategory,
  DifficultyLevel,
} from './dto/ask-question.dto';

export interface CodeExample {
  title: string;
  language: string;
  code: string;
  explanation: string;
}

export interface RelatedTopic {
  topic: string;
  description: string;
}

export interface ProgrammingAnswer {
  category: ProgrammingCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  difficultyLabel: string;
  summary: string;
  detailedExplanation: string;
  keyPoints: string[];
  codeExamples: CodeExample[];
  commonPitfalls: string[];
  bestPractices: string[];
  relatedTopics: RelatedTopic[];
  references: string[];
  capabilityNote?: string;
}

@Injectable()
export class ProgrammingQnaService {
  private readonly categoryLabels: Record<ProgrammingCategory, string> = {
    [ProgrammingCategory.SYNTAX]: '编程语言语法',
    [ProgrammingCategory.FRAMEWORK]: '框架使用',
    [ProgrammingCategory.ALGORITHM]: '算法实现',
    [ProgrammingCategory.DEBUGGING]: '调试技巧',
    [ProgrammingCategory.API]: 'API调用',
    [ProgrammingCategory.DATABASE]: '数据库操作',
    [ProgrammingCategory.PERFORMANCE]: '性能优化',
    [ProgrammingCategory.DESIGN_PATTERN]: '设计模式',
    [ProgrammingCategory.DEPLOYMENT]: '部署运维',
    [ProgrammingCategory.GENERAL]: '通用编程',
  };

  private readonly difficultyLabels: Record<DifficultyLevel, string> = {
    [DifficultyLevel.BEGINNER]: '入门级',
    [DifficultyLevel.INTERMEDIATE]: '中等级',
    [DifficultyLevel.ADVANCED]: '高级',
  };

  async askQuestion(dto: AskQuestionDto): Promise<ProgrammingAnswer> {
    const question = dto.question.toLowerCase();
    const category = this.detectCategory(question, dto.category);
    const difficulty = this.detectDifficulty(question, dto.difficulty);
    const language = dto.language || this.detectLanguage(question);
    const framework = dto.framework || this.detectFramework(question);

    const answer = this.generateAnswer(question, category, difficulty, language, framework, dto);
    answer.capabilityNote = this.buildCapabilityNote(question);
    return answer;
  }

  private buildCapabilityNote(question: string): string | undefined {
    const strongAreas: string[] = [];
    const limitedAreas: string[] = [];

    const embeddedKeywords = ['arduino', 'stm32', 'esp32', 'esp8266', '树莓派', 'raspberry',
      '嵌入式', 'embedded', '单片机', 'mcu', 'gpio', 'i2c', 'spi', 'uart', 'pwm', 'adc',
      '传感器', 'sensor', 'freertos', 'rtos', '寄存器', '中断', '驱动', 'driver', '物联网', 'iot'];
    const hardwareKeywords = ['pcb', '电路板', '模拟电路', '数字电路', '运放', 'opamp',
      '电源设计', '功耗', '信号完整性', 'si', '电磁兼容', 'emc', '焊接', '原理图', '芯片选型',
      '芯片手册', 'datasheet', '晶体管', 'mos管', '电容', '电阻', 'verilog', 'vhdl', 'fpga'];
    const weakAreas: { keywords: string[]; note: string }[] = [
      { keywords: hardwareKeywords, note: '硬件电路设计（PCB、模拟电路、信号完整性等）——建议结合芯片手册和专业 EDA 工具验证' },
      { keywords: ['verilog', 'vhdl', 'fpga'], note: 'FPGA/ASIC 数字逻辑设计（Verilog/VHDL）——建议配合仿真工具（ModelSim、Vivado）验证' },
      { keywords: ['焊接', '维修', '拆焊'], note: '硬件维修、焊接等实操——请遵守安全规范，必要时寻求专业硬件工程师帮助' },
    ];

    for (const { keywords, note } of weakAreas) {
      if (keywords.some((k) => question.includes(k))) {
        limitedAreas.push(note);
      }
    }

    if (embeddedKeywords.some((k) => question.includes(k))) {
      strongAreas.push('嵌入式软件：Arduino/ESP32/STM32 固件开发、GPIO/UART/I2C/SPI 协议、传感器驱动、FreeRTOS 任务调度');
    }

    if (strongAreas.length === 0 && limitedAreas.length === 0) {
      return undefined;
    }

    let note = '';
    if (strongAreas.length) {
      note += '✅ 在以下方面可以提供可靠帮助：' + strongAreas.join('；') + '。\n';
    }
    if (limitedAreas.length) {
      note += '⚠️ 以下方向经验相对有限，建议结合专业工具/资料二次确认：' + limitedAreas.join('；') + '。';
    }
    return note.trim();
  }

  private detectCategory(
    question: string,
    explicit?: ProgrammingCategory,
  ): ProgrammingCategory {
    if (explicit) return explicit;

    const patterns: Array<{ category: ProgrammingCategory; keywords: string[] }> = [
      {
        category: ProgrammingCategory.ALGORITHM,
        keywords: [
          '排序', 'sort', '算法', 'algorithm', '二分', 'binary search',
          '动态规划', 'dp', '递归', 'recursion', '链表', 'linked list',
          '二叉树', 'tree', '图', 'graph', '深度优先', 'dfs', '广度优先', 'bfs',
        ],
      },
      {
        category: ProgrammingCategory.DEBUGGING,
        keywords: [
          '错误', 'error', '异常', 'exception', 'bug', 'debug', '调试',
          '报错', '堆栈', 'stack trace', 'crash', '崩溃', '无法运行',
          '不工作', 'not working', '报错信息',
        ],
      },
      {
        category: ProgrammingCategory.SYNTAX,
        keywords: [
          '语法', 'syntax', '怎么写', '如何写', '写法', '声明', 'declare',
          '定义', 'define', '关键字', 'keyword', '循环', 'loop', '条件',
          'condition', '函数', 'function', '类', 'class', '变量', 'variable',
        ],
      },
      {
        category: ProgrammingCategory.API,
        keywords: [
          'api', '接口', '调用', 'fetch', 'axios', 'http', '请求', 'request',
          '响应', 'response', 'rest', 'graphql', 'curl', 'post', 'get',
        ],
      },
      {
        category: ProgrammingCategory.DATABASE,
        keywords: [
          '数据库', 'database', 'sql', 'mysql', 'postgresql', 'mongodb',
          'redis', '查询', 'query', '表', 'table', '索引', 'index', '事务',
          'transaction', '连接', 'join',
        ],
      },
      {
        category: ProgrammingCategory.PERFORMANCE,
        keywords: [
          '性能', 'performance', '优化', 'optimize', '慢', 'slow', '卡顿',
          '内存泄漏', 'memory leak', '内存', 'memory', 'cpu', '缓存', 'cache',
        ],
      },
      {
        category: ProgrammingCategory.DESIGN_PATTERN,
        keywords: [
          '设计模式', 'design pattern', '单例', 'singleton', '工厂', 'factory',
          '观察者', 'observer', '策略', 'strategy', '依赖注入', 'di', 'ioc',
          'mvc', 'mvvm', '架构', 'architecture',
        ],
      },
      {
        category: ProgrammingCategory.DEPLOYMENT,
        keywords: [
          '部署', 'deploy', 'docker', 'k8s', 'kubernetes', '服务器', 'server',
          'nginx', 'ci', 'cd', '运维', 'linux', '命令行', 'cli',
        ],
      },
      {
        category: ProgrammingCategory.FRAMEWORK,
        keywords: [
          'vue', 'react', 'angular', 'nest', 'express', 'django', 'flask',
          'spring', 'laravel', '框架', 'framework', '组件', 'component',
          '路由', 'router', '状态管理', 'state', 'pinia', 'vuex', 'redux',
          'hook', '生命周期', 'lifecycle',
        ],
      },
      {
        category: ProgrammingCategory.GENERAL,
        keywords: [
          'arduino', 'stm32', 'esp32', 'esp8266', '树莓派', 'raspberry',
          '嵌入式', 'embedded', '单片机', 'mcu', 'iot', '物联网', '硬件',
          'hardware', 'gpio', 'i2c', 'spi', 'uart', '串口', 'pwm', 'adc',
          'dac', '传感器', 'sensor', '驱动', 'driver', 'freertos', 'rtos',
          '寄存器', 'register', '中断', 'interrupt', '时钟', 'clock',
        ],
      },
    ];

    for (const { category, keywords } of patterns) {
      if (keywords.some((k) => question.includes(k))) {
        return category;
      }
    }

    return ProgrammingCategory.GENERAL;
  }

  private detectDifficulty(
    question: string,
    explicit?: DifficultyLevel,
  ): DifficultyLevel {
    if (explicit) return explicit;

    const advancedKeywords = [
      '高并发', '分布式', '微服务', '底层原理', '源码', '编译原理',
      'garbage collection', '内存模型', '并发', '多线程', 'lock free',
    ];
    const intermediateKeywords = [
      '异步', 'async', 'promise', '闭包', 'closure', '原型链', 'prototype',
      '装饰器', 'decorator', '泛型', 'generic', '中间件', 'middleware',
    ];

    if (advancedKeywords.some((k) => question.includes(k))) {
      return DifficultyLevel.ADVANCED;
    }
    if (intermediateKeywords.some((k) => question.includes(k))) {
      return DifficultyLevel.INTERMEDIATE;
    }
    return DifficultyLevel.BEGINNER;
  }

  private detectLanguage(question: string): string {
    const patterns: Array<{ lang: string; keywords: string[] }> = [
      { lang: 'JavaScript/TypeScript', keywords: ['javascript', 'typescript', 'js', 'ts', 'node', 'es6', 'promise', 'async'] },
      { lang: 'Python', keywords: ['python', 'py', 'django', 'flask', 'pandas', 'numpy'] },
      { lang: 'Java', keywords: ['java', 'spring', 'jvm', 'maven', 'gradle'] },
      { lang: 'Go', keywords: ['golang', 'go ', 'goroutine', 'channel'] },
      { lang: 'Rust', keywords: ['rust', 'cargo', 'ownership', 'borrow'] },
      { lang: 'C/C++', keywords: ['c++', 'cpp', 'c语言', '指针', 'pointer', 'malloc'] },
      { lang: 'C#', keywords: ['c#', 'csharp', '.net', 'asp.net'] },
      { lang: 'PHP', keywords: ['php', 'laravel', 'composer'] },
      { lang: 'SQL', keywords: ['sql', 'mysql', 'postgresql', 'select', 'from'] },
      { lang: 'C/C++', keywords: ['arduino', 'stm32', 'esp32', 'esp8266', '单片机', 'embedded', '嵌入式', 'gpio', '寄存器'] },
    ];

    for (const { lang, keywords } of patterns) {
      if (keywords.some((k) => question.includes(k))) {
        return lang;
      }
    }
    return '通用编程';
  }

  private detectFramework(question: string): string {
    const patterns: Array<{ fw: string; keywords: string[] }> = [
      { fw: 'Vue.js', keywords: ['vue', 'pinia', 'vuex', 'vue-router', 'composition api', 'vite'] },
      { fw: 'React', keywords: ['react', 'redux', 'hook', 'jsx', 'next.js', 'nextjs'] },
      { fw: 'Angular', keywords: ['angular', 'rxjs', 'ng'] },
      { fw: 'NestJS', keywords: ['nest', 'nestjs'] },
      { fw: 'Express.js', keywords: ['express', 'expressjs'] },
      { fw: 'Django', keywords: ['django'] },
      { fw: 'Flask', keywords: ['flask'] },
      { fw: 'Spring Boot', keywords: ['spring boot', 'springboot'] },
      { fw: 'Arduino', keywords: ['arduino', 'uno', 'nano', 'mega'] },
      { fw: 'FreeRTOS', keywords: ['freertos', 'rtos', '实时操作系统'] },
      { fw: 'ESP-IDF', keywords: ['esp-idf', 'esp32', 'esp8266'] },
      { fw: 'STM32 HAL', keywords: ['stm32', 'hal库', 'cubeide', 'cubemx'] },
    ];

    for (const { fw, keywords } of patterns) {
      if (keywords.some((k) => question.includes(k))) {
        return fw;
      }
    }
    return '无特定框架';
  }

  private generateAnswer(
    question: string,
    category: ProgrammingCategory,
    difficulty: DifficultyLevel,
    language: string,
    framework: string,
    dto: AskQuestionDto,
  ): ProgrammingAnswer {
    const answerBuilders: Record<ProgrammingCategory, () => ProgrammingAnswer> = {
      [ProgrammingCategory.SYNTAX]: () => this.buildSyntaxAnswer(question, difficulty, language),
      [ProgrammingCategory.FRAMEWORK]: () => this.buildFrameworkAnswer(question, difficulty, language, framework),
      [ProgrammingCategory.ALGORITHM]: () => this.buildAlgorithmAnswer(question, difficulty, language),
      [ProgrammingCategory.DEBUGGING]: () => this.buildDebuggingAnswer(question, difficulty, language, dto),
      [ProgrammingCategory.API]: () => this.buildApiAnswer(question, difficulty, language),
      [ProgrammingCategory.DATABASE]: () => this.buildDatabaseAnswer(question, difficulty),
      [ProgrammingCategory.PERFORMANCE]: () => this.buildPerformanceAnswer(question, difficulty, language),
      [ProgrammingCategory.DESIGN_PATTERN]: () => this.buildDesignPatternAnswer(question, difficulty, language),
      [ProgrammingCategory.DEPLOYMENT]: () => this.buildDeploymentAnswer(question, difficulty),
      [ProgrammingCategory.GENERAL]: () => this.buildGeneralAnswer(question, difficulty, language),
    };

    const answer = answerBuilders[category]();
    return {
      ...answer,
      category,
      categoryLabel: this.categoryLabels[category],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
    };
  }

  private buildSyntaxAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
  ): ProgrammingAnswer {
    const isJsTs = language.includes('JavaScript') || language.includes('TypeScript');
    const isPython = language.includes('Python');

    let summary = '以下是该语法问题的详细解答和代码示例。';
    let detailedExplanation = '编程语法是编写代码的基础规则，理解语法有助于写出正确且规范的代码。下面从多个维度进行详细说明。';
    let keyPoints: string[] = [];
    let codeExamples: CodeExample[] = [];
    let commonPitfalls: string[] = [];
    let bestPractices: string[] = [];

    if (question.includes('异步') || question.includes('async') || question.includes('promise')) {
      summary = '异步编程是现代开发的核心概念，通过 async/await 或 Promise 处理耗时操作。';
      detailedExplanation = `
异步编程用于处理需要等待的操作（如网络请求、文件I/O），避免阻塞主线程。
JavaScript/TypeScript 中异步编程经历了回调函数 → Promise → async/await 三个阶段的演进，
其中 async/await 是目前最推荐的方式，它基于 Promise 但语法更简洁直观。
      `.trim();
      keyPoints = [
        'async 函数总是返回 Promise，await 只能在 async 函数内使用',
        'await 会暂停函数执行，等待 Promise 解决后再继续',
        '使用 try/catch 捕获异步操作中的错误',
        'Promise.all 用于并行执行多个异步任务',
        'Promise.allSettled 用于等待所有 Promise 完成（无论成功或失败）',
      ];
      codeExamples = [
        {
          title: '基础 async/await 用法',
          language: 'typescript',
          code: `// 模拟一个异步API请求
async function fetchUserData(userId: number): Promise<{ name: string; email: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ name: '张三', email: 'zhangsan@example.com' });
    }, 1000);
  });
}

async function main() {
  console.log('开始获取数据...');
  try {
    const user = await fetchUserData(1);
    console.log('用户信息:', user);
  } catch (error) {
    console.error('获取失败:', error);
  }
  console.log('程序继续执行');
}

main();`,
          explanation: '使用 async/await 可以像写同步代码一样写异步逻辑，通过 try/catch 处理异常。',
        },
        {
          title: '并行执行多个异步任务',
          language: 'typescript',
          code: `async function loadDashboard() {
  // 并行发起多个请求，提高效率
  const [userData, stats, notifications] = await Promise.all([
    fetchUserData(1),
    fetchStats(),
    fetchNotifications(),
  ]);

  return { userData, stats, notifications };
}

// 如果需要处理部分失败的情况
async function loadWithPartialFailure() {
  const results = await Promise.allSettled([
    fetchUserData(1),
    fetchStats(),
    fetchNotifications(),
  ]);

  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      console.log(\`任务 \${index} 成功:\`, result.value);
    } else {
      console.error(\`任务 \${index} 失败:\`, result.reason);
    }
  });
}`,
          explanation: 'Promise.all 等待全部成功或任一失败，allSettled 等待全部完成并收集每个结果。',
        },
      ];
      commonPitfalls = [
        '忘记在 async 函数外使用 await，得到的是 Promise 对象而非实际值',
        '过度使用串行 await 导致性能低下，应考虑并行执行',
        '遗漏 try/catch 或 .catch() 导致未处理的 Promise rejection',
        '在 forEach 中使用 await 无法达到预期效果，应使用 for...of 或 Promise.all',
      ];
      bestPractices = [
        '优先使用 async/await 而非原始 Promise 链式调用',
        '对多个独立请求使用 Promise.all 并行执行',
        '合理设置超时避免长时间等待',
        '统一的错误处理策略（全局拦截 + 局部特殊处理）',
      ];
    } else if (question.includes('闭包') || question.includes('closure')) {
      summary = '闭包是指函数能够访问其词法作用域中的变量，即使该函数在其词法作用域之外执行。';
      detailedExplanation = `
闭包（Closure）是 JavaScript 中最重要的概念之一。简单来说，当一个函数可以记住并访问它所在的词法作用域时，
就产生了闭包，即使函数是在当前词法作用域之外执行。闭包的本质是函数执行时创建的执行上下文不会被销毁，
因为有外部引用指向其中的变量环境。
      `.trim();
      keyPoints = [
        '闭包是函数和其词法环境的组合',
        '内部函数可以访问外部函数的变量和参数',
        '闭包中的变量会长期保存在内存中',
        '模块化、数据私有化、柯里化等都依赖闭包实现',
      ];
      codeExamples = [
        {
          title: '基础闭包示例 - 计数器',
          language: 'javascript',
          code: `function createCounter() {
  let count = 0; // 私有变量，外部无法直接访问

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.decrement()); // 1
console.log(counter.getCount());  // 1
console.log(counter.count);       // undefined - 无法直接访问私有变量`,
          explanation: '通过闭包实现了数据私有化，count 变量只能通过暴露的方法访问和修改。',
        },
        {
          title: '闭包应用 - 函数柯里化',
          language: 'javascript',
          code: `// 柯里化：将多参数函数转化为单参数函数序列
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...nextArgs) {
      return curried.apply(this, [...args, ...nextArgs]);
    };
  };
}

// 使用示例
function add(a, b, c) {
  return a + b + c;
}

const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3));      // 6
console.log(curriedAdd(1, 2)(3));      // 6
console.log(curriedAdd(1)(2, 3));      // 6`,
          explanation: '柯里化利用闭包保存已传入的参数，直到参数足够时才执行原函数。',
        },
      ];
      commonPitfalls = [
        '滥用闭包导致内存泄漏，变量无法被垃圾回收',
        '在循环中创建闭包时误用 var 导致共享同一变量',
        '不理解闭包导致调试困难，变量值不符合预期',
      ];
      bestPractices = [
        '使用闭包实现数据私有化和模块化封装',
        '合理使用 let/const 替代 var 避免循环闭包问题',
        '使用完毕后主动解除引用（设为 null）释放内存',
      ];
    } else if (isPython && (question.includes('列表推导') || question.includes('comprehension'))) {
      summary = '列表推导式是 Python 中创建列表的简洁语法，可读性强且效率更高。';
      detailedExplanation = `
列表推导式（List Comprehension）提供了一种简洁的方式来创建列表。
它的基本格式是 [表达式 for 变量 in 可迭代对象 if 条件]，
相比传统的 for 循环 + append 方式，列表推导式语法更简洁，执行效率也更高。
      `.trim();
      keyPoints = [
        '列表推导式比等价的 for 循环更简洁高效',
        '支持条件过滤（if 子句）',
        '支持多层嵌套循环',
        '还有字典推导式、集合推导式、生成器表达式',
      ];
      codeExamples = [
        {
          title: '基础列表推导式',
          language: 'python',
          code: `# 生成平方数列表
squares = [x ** 2 for x in range(10)]
print(squares)  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 带条件过滤
even_squares = [x ** 2 for x in range(10) if x % 2 == 0]
print(even_squares)  # [0, 4, 16, 36, 64]

# 等价的传统写法
even_squares = []
for x in range(10):
    if x % 2 == 0:
        even_squares.append(x ** 2)`,
          explanation: '列表推导式一行代码完成了传统写法多行才能完成的工作。',
        },
        {
          title: '字典推导式与集合推导式',
          language: 'python',
          code: `# 字典推导式 - 键值互换
original = {'a': 1, 'b': 2, 'c': 3}
reversed_dict = {v: k for k, v in original.items()}
print(reversed_dict)  # {1: 'a', 2: 'b', 3: 'c'}

# 集合推导式 - 去重并计算长度
words = ['hello', 'world', 'hello', 'python']
unique_lengths = {len(word) for word in words}
print(unique_lengths)  # {5, 6}

# 生成器表达式 - 惰性求值，节省内存
sum_of_squares = sum(x ** 2 for x in range(1000000))
print(sum_of_squares)  # 不会一次性创建百万元素列表`,
          explanation: '字典和集合也有类似的推导式，生成器表达式使用圆括号，惰性求值更省内存。',
        },
      ];
      commonPitfalls = [
        '过度嵌套导致可读性下降，超过两层嵌套建议使用普通循环',
        '在列表推导式中进行复杂计算或副作用操作',
        '忘记生成器表达式是一次性的，遍历后即耗尽',
      ];
      bestPractices = [
        '简单转换和过滤优先使用推导式',
        '复杂逻辑使用普通 for 循环以保持可读性',
        '处理大数据集使用生成器表达式节省内存',
      ];
    } else {
      summary = `这是关于 ${language} 的语法问题，下面给出通用解答和示例。`;
      detailedExplanation = `
掌握编程语言的基础语法是高效开发的前提。建议从变量声明、控制流、函数定义、数据结构等方面系统学习，
多写代码并注意编码规范。遇到不确定的语法时，查阅官方文档是最可靠的方式。
      `.trim();
      keyPoints = [
        '理解变量声明和作用域规则',
        '掌握条件判断和循环控制语句',
        '熟悉函数定义和调用方式',
        '了解常用内置数据结构的使用方法',
      ];
      codeExamples = [
        {
          title: '基础语法示例',
          language: isPython ? 'python' : 'javascript',
          code: isPython
            ? `# 变量和基本类型
name: str = "Hello"
count: int = 42
pi: float = 3.14

# 条件判断
if count > 50:
    print("大于50")
elif count > 20:
    print("大于20小于等于50")
else:
    print("小于等于20")

# 循环
for i in range(5):
    print(i, end=" ")  # 0 1 2 3 4

# 函数定义
def greet(name: str, greeting: str = "你好") -> str:
    return f"{greeting}, {name}!"

print(greet("小明"))  # 你好, 小明!`
            : `// 变量和基本类型
const name = 'Hello';
let count = 42;
const pi = 3.14;

// 条件判断
if (count > 50) {
  console.log('大于50');
} else if (count > 20) {
  console.log('大于20小于等于50');
} else {
  console.log('小于等于20');
}

// 循环
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

// 函数定义
function greet(name, greeting = '你好') {
  return \`\${greeting}, \${name}!\`;
}

console.log(greet('小明')); // 你好, 小明!`,
          explanation: '展示了变量声明、条件判断、循环和函数定义的基础语法。',
        },
      ];
      commonPitfalls = [
        '混淆不同语言的语法细节（如分号、缩进）',
        '变量作用域理解不清导致意外结果',
        '隐式类型转换引发的 bug',
      ];
      bestPractices = [
        '使用强类型或类型注解（TypeScript/Python type hints）',
        '遵循官方编码规范和风格指南',
        '使用 linter 和 formatter 自动检查代码风格',
      ];
    }

    return {
      category: ProgrammingCategory.SYNTAX,
      categoryLabel: this.categoryLabels[ProgrammingCategory.SYNTAX],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary,
      detailedExplanation,
      keyPoints,
      codeExamples,
      commonPitfalls,
      bestPractices,
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.SYNTAX),
      references: this.getReferences(language, ''),
    };
  }

  private buildFrameworkAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
    framework: string,
  ): ProgrammingAnswer {
    let summary = '以下是该框架使用问题的详细解答。';
    let detailedExplanation = '框架封装了通用的开发模式，让开发者可以专注于业务逻辑而非重复造轮子。';
    let keyPoints: string[] = [];
    let codeExamples: CodeExample[] = [];
    let commonPitfalls: string[] = [];
    let bestPractices: string[] = [];

    if (framework === 'Vue.js' || question.includes('vue')) {
      if (question.includes('组合式') || question.includes('composition') || question.includes('setup')) {
        summary = 'Vue 3 的组合式 API（Composition API）提供了更灵活的逻辑组织和复用方式。';
        detailedExplanation = `
Vue 3 引入了组合式 API，与 Options API 不同，它允许我们按逻辑关注点组织代码，
而不是按选项类型（data、methods、computed 等）。通过 setup 函数和
<script setup> 语法糖，我们可以更灵活地组织和复用逻辑。
        `.trim();
        keyPoints = [
          'reactive() 用于对象，ref() 用于基本类型（也可用于对象）',
          'computed() 创建计算属性，返回只读 ref',
          'watch() 和 watchEffect() 监听响应式变化',
          'onMounted、onUnmounted 等生命周期钩子',
          '使用组合式函数（Composables）提取可复用逻辑',
        ];
        codeExamples = [
          {
            title: '基础响应式与计算属性',
            language: 'vue',
            code: `<script setup lang="ts">
import { ref, reactive, computed } from 'vue';

// ref - 基本类型响应式
const count = ref(0);

// reactive - 对象类型响应式
const user = reactive({
  name: '张三',
  age: 25,
});

// computed - 计算属性
const doubledCount = computed(() => count.value * 2);
const isAdult = computed(() => user.age >= 18);

// 方法直接定义
function increment() {
  count.value++;
}

function celebrateBirthday() {
  user.age++;
}
</script>

<template>
  <div>
    <p>计数: {{ count }} (加倍: {{ doubledCount }})</p>
    <button @click="increment">+1</button>

    <p>{{ user.name }} - {{ user.age }}岁 {{ isAdult ? '✓成年' : '未成年' }}</p>
    <button @click="celebrateBirthday">过生日</button>
  </div>
</template>`,
            explanation: 'ref 需要通过 .value 访问值（模板中自动解包），reactive 直接访问属性。',
          },
          {
            title: '可复用组合式函数 (Composable)',
            language: 'typescript',
            code: `// composables/useCounter.ts
import { ref, computed } from 'vue';

export function useCounter(initialValue = 0) {
  const count = ref(initialValue);
  const doubled = computed(() => count.value * 2);

  function increment() {
    count.value++;
  }

  function decrement() {
    count.value--;
  }

  function reset() {
    count.value = initialValue;
  }

  return {
    count,
    doubled,
    increment,
    decrement,
    reset,
  };
}

// 在组件中使用
// <script setup lang="ts">
// import { useCounter } from '@/composables/useCounter';
//
// const { count, doubled, increment, decrement, reset } = useCounter(10);
// </script>`,
            explanation: '组合式函数是 Vue 3 中复用逻辑的推荐方式，类似 React Hooks。',
          },
        ];
        commonPitfalls = [
          '解构 reactive 对象会丢失响应性，需要使用 toRefs() 保持',
          'ref 在模板中自动解包，但在 <script> 中必须使用 .value',
          '在 watch 中监听 reactive 对象的属性时需要用函数包装',
          '遗漏 defineProps / defineEmits 的类型声明',
        ];
        bestPractices = [
          '优先使用 <script setup> 语法糖，代码更简洁',
          '将相关逻辑提取到组合式函数中，命名以 use 开头',
          '使用 TypeScript 获得更好的类型推导',
          '合理拆分组件，保持单一职责',
        ];
      } else if (question.includes('pinia') || question.includes('状态管理')) {
        summary = 'Pinia 是 Vue 3 的官方状态管理库，替代了 Vuex，提供更简洁的 API 和更好的 TypeScript 支持。';
        detailedExplanation = `
Pinia 是 Vue 生态系统中最新的状态管理方案。相比 Vuex，它去掉了 mutations，
概念更简单，对 TypeScript 的支持更好，同时也支持 Options API 和 Composition API。
核心概念包括：State（状态）、Getters（计算属性）、Actions（操作方法）。
        `.trim();
        keyPoints = [
          '使用 defineStore 定义 Store，第一个参数为唯一 id',
          'State 是 store 的核心数据，使用 ref/reactive 定义',
          'Getters 等同于 store 的计算属性，使用 computed',
          'Actions 是操作方法，可以是同步也可以是异步',
          '使用 storeToRefs 解构 store 保持响应性',
        ];
        codeExamples = [
          {
            title: '定义和使用 Pinia Store',
            language: 'typescript',
            code: `// stores/user.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref<{ name: string; role: string } | null>(null);
  const token = ref<string>('');

  // Getters
  const isLoggedIn = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === 'admin');

  // Actions
  async function login(username: string, password: string) {
    // 模拟API调用
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    token.value = data.token;
    user.value = data.user;
    return data;
  }

  function logout() {
    user.value = null;
    token.value = '';
  }

  return { user, token, isLoggedIn, isAdmin, login, logout };
});

// 在组件中使用
// <script setup lang="ts">
// import { storeToRefs } from 'pinia';
// import { useUserStore } from '@/stores/user';
//
// const userStore = useUserStore();
// const { user, isLoggedIn, isAdmin } = storeToRefs(userStore);
// const { login, logout } = userStore;
// </script>`,
            explanation: '使用 setup 语法定义 Store，解构时需用 storeToRefs 保持响应性。',
          },
        ];
        commonPitfalls = [
          '直接解构 store 丢失响应性，需要使用 storeToRefs',
          '在 action 中调用其他 action 时忘记 this',
          '过度使用全局状态，应将局部状态保留在组件中',
        ];
        bestPractices = [
          '按业务模块拆分 Store，避免单一 Store 过于臃肿',
          '使用组合式 Store 语法（setup store）获得更好的 TS 支持',
          '将 API 调用放在 action 中，保持组件纯净',
        ];
      } else {
        summary = 'Vue.js 是一个渐进式 JavaScript 框架，易于上手且功能强大。';
        detailedExplanation = 'Vue 3 带来了组合式 API、更好的性能、Teleport、Fragments、Suspense 等新特性，推荐使用 <script setup> 语法进行开发。';
        keyPoints = [
          'Vue 3 推荐使用组合式 API 和 <script setup>',
          '响应式系统基于 Proxy，性能更好且支持完整对象监听',
          '使用 Vite 作为构建工具，开发体验极佳',
          '生态：Vue Router（路由）+ Pinia（状态管理）',
        ];
        codeExamples = [
          {
            title: 'Vue 3 单文件组件基础结构',
            language: 'vue',
            code: `<script setup lang="ts">
import { ref, onMounted } from 'vue';

const message = ref('Hello Vue 3!');

onMounted(() => {
  console.log('组件已挂载');
});
</script>

<template>
  <div>
    <h1>{{ message }}</h1>
    <input v-model="message" type="text" />
  </div>
</template>

<style scoped>
h1 {
  color: #42b883;
}
</style>`,
            explanation: '标准的 Vue 3 单文件组件（SFC）结构，<script setup> 是推荐语法。',
          },
        ];
        commonPitfalls = ['混淆 Options API 和 Composition API 的用法', '响应式原理理解不深导致 bug'];
        bestPractices = ['新项目使用 Vue 3 + Vite + TypeScript', '遵循 Vue 官方风格指南'];
      }
    } else if (framework === 'React' || question.includes('react')) {
      summary = 'React 是用于构建用户界面的 JavaScript 库，核心思想是组件化和声明式编程。';
      detailedExplanation = `
React 通过组件化将 UI 拆分为独立、可复用的部分。Hooks 是 React 16.8 引入的功能，
让我们可以在函数组件中使用状态和其他 React 特性，替代了之前的类组件。
      `.trim();
      keyPoints = [
        'useState 用于添加组件状态',
        'useEffect 处理副作用（数据获取、订阅、DOM操作）',
        'useMemo 和 useCallback 用于性能优化',
        'useRef 获取 DOM 引用或保存跨渲染数据',
        '自定义 Hook 提取可复用逻辑',
      ];
      codeExamples = [
        {
          title: 'useState 和 useEffect 基础用法',
          language: 'tsx',
          code: `import { useState, useEffect } from 'react';

interface UserData {
  id: number;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: number }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        if (!response.ok) throw new Error('获取失败');
        const data = await response.json();
        if (!cancelled) setUser(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : '未知错误');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      cancelled = true; // 清理函数，避免组件卸载后更新状态
    };
  }, [userId]); // 依赖数组：userId 变化时重新执行

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;
  if (!user) return <div>用户不存在</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>邮箱: {user.email}</p>
    </div>
  );
}

export default UserProfile;`,
          explanation: 'useEffect 的依赖数组控制副作用执行时机，清理函数防止内存泄漏。',
        },
        {
          title: '自定义 Hook - useFetch',
          language: 'tsx',
          code: `import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function useFetch<T>(url: string, options?: RequestInit) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const [refetchKey, setRefetchKey] = useState(0);

  const refetch = useCallback(() => {
    setRefetchKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function doFetch() {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const response = await fetch(url, {
          ...options,
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
        const data = await response.json();
        if (!cancelled) setState({ data, loading: false, error: null });
      } catch (e) {
        if (!cancelled && e.name !== 'AbortError') {
          setState({
            data: null,
            loading: false,
            error: e instanceof Error ? e.message : '请求失败',
          });
        }
      }
    }

    doFetch();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url, refetchKey]);

  return { ...state, refetch };
}

// 使用示例
// function App() {
//   const { data, loading, error, refetch } = useFetch<User[]>('/api/users');
//   return <div>...</div>;
// }`,
          explanation: '自定义 Hook 将数据获取逻辑封装起来，方便在多个组件中复用。',
        },
      ];
      commonPitfalls = [
        'useEffect 依赖数组遗漏导致无限循环或获取旧值',
        '在 useEffect 中更新状态但忘记正确处理依赖',
        '组件卸载后仍尝试更新状态导致警告',
        '过度使用 useMemo/useCallback 反而降低性能',
      ];
      bestPractices = [
        '使用 React 18 的并发特性（useTransition、useDeferredValue）',
        '将可复用逻辑提取为自定义 Hook',
        '使用 React Query/SWR 处理服务端状态，减少手动 useEffect',
      ];
    }

    return {
      category: ProgrammingCategory.FRAMEWORK,
      categoryLabel: this.categoryLabels[ProgrammingCategory.FRAMEWORK],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary,
      detailedExplanation,
      keyPoints,
      codeExamples,
      commonPitfalls,
      bestPractices,
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.FRAMEWORK),
      references: this.getReferences(language, framework),
    };
  }

  private buildAlgorithmAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
  ): ProgrammingAnswer {
    let summary = '以下是该算法问题的详细解答和实现。';
    let detailedExplanation = '算法是计算机科学的核心，掌握常见算法和数据结构能帮助你写出更高效的代码。';
    let keyPoints: string[] = [];
    let codeExamples: CodeExample[] = [];
    let commonPitfalls: string[] = [];
    let bestPractices: string[] = [];

    if (question.includes('排序') || question.includes('sort')) {
      summary = '排序算法是最基础的算法之一，不同场景应选择合适的排序方法。';
      detailedExplanation = `
排序算法可分为：比较类排序（时间复杂度下界 O(n log n)）和非比较类排序（利用数据特征，可达到 O(n)）。
实际开发中应优先使用语言内置的排序函数，它们通常是优化过的混合排序算法
（如 TimSort - Python/Java，QuickSort 变体 - C++）。理解排序原理有助于分析问题。
      `.trim();
      keyPoints = [
        '快速排序：平均 O(n log n)，最坏 O(n²)，不稳定，原地排序',
        '归并排序：稳定 O(n log n)，需要 O(n) 额外空间',
        '堆排序：不稳定 O(n log n)，原地排序',
        '冒泡/插入/选择：简单但 O(n²)，仅适用于小规模或教学',
        '计数/桶/基数排序：非比较排序，利用数据特征可达 O(n)',
      ];
      codeExamples = [
        {
          title: '快速排序（Quick Sort）',
          language: 'typescript',
          code: `function quickSort<T>(arr: T[]): T[] {
  // 基准情况：空数组或单元素无需排序
  if (arr.length <= 1) return arr;

  // 选择中间元素作为基准（避免最坏情况）
  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr[pivotIndex];

  const left: T[] = [];
  const right: T[] = [];
  const equal: T[] = [];

  for (const item of arr) {
    if (item < pivot) left.push(item);
    else if (item > pivot) right.push(item);
    else equal.push(item);
  }

  // 递归排序左右两侧，中间合并
  return [...quickSort(left), ...equal, ...quickSort(right)];
}

// 原地排序版本（空间效率更高）
function quickSortInPlace<T>(arr: T[], left = 0, right = arr.length - 1): void {
  if (left >= right) return;

  function partition(l: number, r: number): number {
    const pivot = arr[Math.floor((l + r) / 2)];
    while (l <= r) {
      while (arr[l] < pivot) l++;
      while (arr[r] > pivot) r--;
      if (l <= r) {
        [arr[l], arr[r]] = [arr[r], arr[l]];
        l++;
        r--;
      }
    }
    return l;
  }

  const index = partition(left, right);
  quickSortInPlace(arr, left, index - 1);
  quickSortInPlace(arr, index, right);
}

// 测试
const nums = [64, 34, 25, 12, 22, 11, 90];
console.log(quickSort(nums)); // [11, 12, 22, 25, 34, 64, 90]

const nums2 = [64, 34, 25, 12, 22, 11, 90];
quickSortInPlace(nums2);
console.log(nums2); // [11, 12, 22, 25, 34, 64, 90]`,
          explanation: '快速排序采用分治策略，选择基准元素将数组分区后递归排序。',
        },
        {
          title: '归并排序（Merge Sort）',
          language: 'python',
          code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    # 分：将数组对半拆分
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    # 治：合并两个有序数组
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0

    # 双指针合并
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # 处理剩余元素
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# 测试
data = [38, 27, 43, 3, 9, 82, 10]
sorted_data = merge_sort(data)
print(sorted_data)  # [3, 9, 10, 27, 38, 43, 82]`,
          explanation: '归并排序是稳定排序，时间复杂度稳定 O(n log n)，适合链表和外部排序。',
        },
      ];
      commonPitfalls = [
        '快排基准选得不好导致最坏情况（已排序数组选首尾为基准）',
        '混淆稳定排序和不稳定排序的适用场景',
        '在数据量很小时使用复杂排序反而更慢（插入排序对小数组更快）',
      ];
      bestPractices = [
        '实际开发优先使用语言/库内置排序，不要重复造轮子',
        '面试/刷题时从时间复杂度、空间复杂度、稳定性、是否原地多维度分析',
        '了解 TimSort（实际最常用的混合排序）',
      ];
    } else if (question.includes('二分') || question.includes('binary search')) {
      summary = '二分查找是在有序数组中查找元素的高效算法，时间复杂度 O(log n)。';
      detailedExplanation = `
二分查找（Binary Search）又称折半查找，核心思想是每次将搜索范围缩小一半。
前提条件是数组必须有序。除了基础的「查找目标值」，二分查找还可以用来：
查找第一个/最后一个满足条件的元素、寻找峰值、最小值最大化等问题。
      `.trim();
      keyPoints = [
        '时间复杂度 O(log n)，空间复杂度 O(1)（迭代）',
        '前提：数组必须有序',
        '循环条件和边界处理是最容易出错的地方',
        '可扩展：查找左边界、右边界、最大化最小值等',
      ];
      codeExamples = [
        {
          title: '基础二分查找模板',
          language: 'typescript',
          code: `// 基础：查找目标值，存在返回索引，不存在返回 -1
function binarySearch(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length - 1; // 闭区间 [left, right]

  while (left <= right) {
    // 防溢出的写法：left + (right - left) / 2
    const mid = left + Math.floor((right - left) / 2);

    if (nums[mid] === target) {
      return mid;
    } else if (nums[mid] < target) {
      left = mid + 1; // 目标在右半区
    } else {
      right = mid - 1; // 目标在左半区
    }
  }
  return -1;
}

// 查找左边界：第一个 >= target 的位置
function binarySearchLeft(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length; // 左闭右开 [left, right)

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] >= target) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left; // 需要额外判断是否等于 target
}

// 查找右边界：第一个 > target 的位置（右边界 = 此位置 - 1）
function binarySearchRight(nums: number[], target: number): number {
  let left = 0;
  let right = nums.length;

  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (nums[mid] <= target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return left - 1;
}

// 测试
const nums = [1, 3, 5, 5, 5, 7, 9];
console.log(binarySearch(nums, 5));      // 2（某个 5 的位置）
console.log(binarySearchLeft(nums, 5));  // 2（第一个 5）
console.log(binarySearchRight(nums, 5)); // 4（最后一个 5）`,
          explanation: '掌握「闭区间」和「左闭右开」两种模板，明确循环条件和边界更新。',
        },
      ];
      commonPitfalls = [
        'mid 计算使用 (left + right) / 2 导致整数溢出',
        '循环条件 left <= right 和 left < right 混用导致死循环或漏查',
        '边界更新时遗漏 +1 或 -1',
      ];
      bestPractices = [
        '选定一种区间模板（推荐左闭右开）反复练习直到熟练',
        '遇到「搜索满足条件的最值」类问题先想到二分答案',
        '写好后用边界条件（空数组、单元素、目标不存在等）测试',
      ];
    } else {
      summary = '算法与数据结构是编程能力的基石，建议系统性学习和练习。';
      detailedExplanation = `
常见数据结构：数组、链表、栈、队列、哈希表、树、图、堆。
常见算法思想：分治、贪心、动态规划、回溯、广度/深度优先搜索、二分查找、双指针、滑动窗口。
建议在 LeetCode 等平台按专题练习，掌握每种题型的套路。
      `.trim();
      keyPoints = [
        '时间复杂度和空间复杂度分析是基础',
        '数组操作快但插入删除慢，链表相反',
        '哈希表提供 O(1) 的查找插入删除（平均）',
        '树和图是最高频的面试考点',
        '动态规划是难点，但套路可循（状态定义、状态转移、初始化、边界）',
      ];
      codeExamples = [
        {
          title: '经典双指针技巧',
          language: 'typescript',
          code: `// 问题：两数之和 II - 输入有序数组
// 给定升序排列的有序数组，找到两个数使它们相加之和等于目标数
function twoSum(numbers: number[], target: number): number[] {
  let left = 0;
  let right = numbers.length - 1;

  while (left < right) {
    const sum = numbers[left] + numbers[right];
    if (sum === target) {
      return [left + 1, right + 1];
    } else if (sum < target) {
      left++; // 和太小，左指针右移增大和
    } else {
      right--; // 和太大，右指针左移减小和
    }
  }
  return [-1, -1]; // 题目保证一定有解
}

// 问题：反转字符串
function reverseString(s: string[]): void {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
}`,
          explanation: '双指针技巧常用于数组/链表相关问题，可将暴力 O(n²) 优化到 O(n)。',
        },
      ];
      commonPitfalls = [
        '上来就写代码，没有先分析时间空间复杂度',
        '忽略边界情况（空输入、单个元素、重复元素）',
        '刷完不复盘总结，换道题又不会',
      ];
      bestPractices = [
        '按专题刷题（数组→链表→哈希→树→动态规划→...）',
        '每道题做完后分析最优解，记录解题思路',
        '同一道题尝试多种解法，对比分析优劣',
      ];
    }

    return {
      category: ProgrammingCategory.ALGORITHM,
      categoryLabel: this.categoryLabels[ProgrammingCategory.ALGORITHM],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary,
      detailedExplanation,
      keyPoints,
      codeExamples,
      commonPitfalls,
      bestPractices,
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.ALGORITHM),
      references: this.getReferences(language, ''),
    };
  }

  private buildDebuggingAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
    dto: AskQuestionDto,
  ): ProgrammingAnswer {
    let summary = '调试是程序员的核心技能，掌握系统化的调试方法能快速定位和解决问题。';
    let detailedExplanation = `
调试不只是「print 一下」，而是一套系统化的问题定位方法：
1. 复现问题：确保问题稳定复现，记录复现步骤
2. 缩小范围：通过二分法快速定位到出问题的模块/函数/代码行
3. 假设验证：提出可能的原因假设，逐一验证排除
4. 修复验证：修复后用测试用例验证，避免引入新问题
5. 复盘记录：记录问题原因和解决方案，建立知识库
    `.trim();
    const keyPoints = [
      '阅读错误信息，理解堆栈跟踪（Stack Trace）',
      '使用断点调试代替 console.log，效率更高',
      '学会看浏览器 DevTools / IDE Debugger',
      '二分法定位问题：注释代码、回退提交、切换分支',
      '最小化复现场景，排除无关变量',
    ];
    const codeExamples: CodeExample[] = [
      {
        title: 'TypeScript 常见类型错误调试',
        language: 'typescript',
        code: `// ❌ 错误：类型 'string | undefined' 不能赋值给类型 'string'
interface User {
  name: string;
  address?: {
    city: string;
  };
}

function getCity(user: User): string {
  // user.address 可能是 undefined
  return user.address.city;
}

// ✅ 解决方案 1：可选链 + 默认值
function getCity1(user: User): string {
  return user.address?.city ?? '未知';
}

// ✅ 解决方案 2：类型守卫
function getCity2(user: User): string {
  if (user.address) {
    return user.address.city; // TypeScript 已知 address 存在
  }
  return '未知';
}

// ✅ 解决方案 3：类型断言（确定存在时使用）
function getCity3(user: User): string {
  return user.address!.city; // ! 表示开发者保证不为空
}`,
        explanation: '当遇到类型错误时，先看报错位置和推断出的类型，再用类型收窄解决。',
      },
      {
        title: 'Promise 异步错误捕获',
        language: 'javascript',
        code: `// ❌ 问题：未捕获的 Promise rejection
async function fetchData() {
  const response = await fetch('/api/data'); // 404 或网络错误会抛出
  return response.json();
}
fetchData(); // 没有 .catch()，出错时控制台会有 UnhandledPromiseRejection

// ✅ 正确做法 1：try/catch
async function safeFetch1() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    console.error('请求失败:', error);
    // 给用户友好提示，或返回降级数据
    return null;
  }
}

// ✅ 正确做法 2：.catch()
async function safeFetch2() {
  return fetchData().catch((error) => {
    console.error('请求失败:', error);
    return null;
  });
}

// ✅ 全局未处理 Promise rejection 监听
process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的 Promise 拒绝:', promise, '原因:', reason);
});`,
        explanation: '异步错误最容易被遗漏，务必确保每个 Promise 都有错误处理。',
      },
    ];
    const commonPitfalls = [
      '只看错误信息最后一行，不看完整堆栈跟踪',
      '盲目修改代码试错，没有系统分析原因',
      '修复 bug 但不补充测试，后续容易再次回归',
      '不查看官方文档和 GitHub Issues，可能是已知问题',
    ];
    const bestPractices = [
      '养成阅读完整错误信息和堆栈跟踪的习惯',
      '掌握调试器（VS Code Debugger、Chrome DevTools）',
      '写单元测试，让 bug 可复现、可预防',
      '使用 Git 二分查找（git bisect）快速定位引入 bug 的提交',
    ];

    if (dto.errorMessage) {
      detailedExplanation += `\\n\\n根据你提供的错误信息："${dto.errorMessage}"，建议首先检查代码中是否有空指针/undefined 访问，以及类型转换是否正确。`;
    }

    return {
      category: ProgrammingCategory.DEBUGGING,
      categoryLabel: this.categoryLabels[ProgrammingCategory.DEBUGGING],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary,
      detailedExplanation,
      keyPoints,
      codeExamples,
      commonPitfalls,
      bestPractices,
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.DEBUGGING),
      references: this.getReferences(language, ''),
    };
  }

  private buildApiAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
  ): ProgrammingAnswer {
    const summary = 'API 调用是前后端通信的基础，通常使用 RESTful API 或 GraphQL。';
    const detailedExplanation = `
RESTful API 是目前最主流的接口设计风格，使用 HTTP 方法（GET/POST/PUT/DELETE）表示操作类型，
URL 表示资源。前端通常使用 fetch（浏览器原生）或 axios 等第三方库发起请求。
GraphQL 是另一种方案，由 Facebook 开发，允许客户端精确指定需要的数据。
    `.trim();
    const keyPoints = [
      'GET 获取数据，POST 创建，PUT/PATCH 更新，DELETE 删除',
      '正确使用 HTTP 状态码：2xx 成功，4xx 客户端错误，5xx 服务端错误',
      '使用拦截器统一处理请求头、错误、Loading 状态',
      '请求取消：使用 AbortController 防止重复请求和内存泄漏',
      '请求重试和超时处理提升用户体验',
    ];
    const codeExamples: CodeExample[] = [
      {
        title: 'Axios 封装与使用',
        language: 'typescript',
        code: `// utils/request.ts - Axios 封装
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ElMessage } from 'element-plus';

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加 Token
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = \`Bearer \${token}\`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response: AxiosResponse) => {
    const data = response.data;
    // 假设后端返回格式 { code, message, data }
    if (data.code !== 0 && data.code !== 200) {
      ElMessage.error(data.message || '请求失败');
      if (data.code === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(new Error(data.message || '请求失败'));
    }
    return data.data; // 直接返回业务数据
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('请求已取消');
    } else if (error.code === 'ECONNABORTED') {
      ElMessage.error('请求超时，请稍后重试');
    } else {
      ElMessage.error(error.response?.data?.message || error.message || '网络错误');
    }
    return Promise.reject(error);
  },
);

// 类型化的 API 方法
// api/user.ts
interface User {
  id: number;
  name: string;
  email: string;
}

export const userApi = {
  getUserList: (params?: { page?: number; size?: number }) =>
    request.get<User[], User[]>('/users', { params }),

  createUser: (data: Partial<User>) =>
    request.post<Partial<User>, User>('/users', data),

  updateUser: (id: number, data: Partial<User>) =>
    request.put<Partial<User>, User>(\`/users/\${id}\`, data),

  deleteUser: (id: number) =>
    request.delete<void>(\`/users/\${id}\`),
};`,
        explanation: '统一封装 axios，处理鉴权、错误提示、超时、取消请求等通用逻辑。',
      },
      {
        title: '使用 Fetch 上传文件',
        language: 'typescript',
        code: `// 单个文件上传
async function uploadFile(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', 'avatar');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    headers: {
      // 注意：不要手动设置 Content-Type，浏览器会自动添加 boundary
      Authorization: \`Bearer \${localStorage.getItem('token') || ''}\`,
    },
  });

  if (!response.ok) {
    throw new Error(\`上传失败: HTTP \${response.status}\`);
  }

  const data = await response.json();
  return data.url;
}

// 带进度的上传（使用 XMLHttpRequest）
function uploadWithProgress(file: File, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        resolve(data.url);
      } else {
        reject(new Error(\`上传失败: \${xhr.status}\`));
      }
    });

    xhr.addEventListener('error', () => reject(new Error('网络错误')));
    xhr.addEventListener('abort', () => reject(new Error('上传已取消')));

    xhr.open('POST', '/api/upload');
    xhr.setRequestHeader('Authorization', \`Bearer \${localStorage.getItem('token') || ''}\`);
    xhr.send(formData);
  });
}`,
        explanation: 'FormData 用于文件上传，fetch 原生不支持进度，需要用 XHR 实现。',
      },
    ];
    const commonPitfalls = [
      '手动设置 FormData 的 Content-Type，导致 boundary 丢失上传失败',
      'GET 请求参数未做 URL 编码，特殊字符报错',
      '未处理请求取消，组件卸载后更新状态引发警告',
      '忽略跨域（CORS）配置问题',
    ];
    const bestPractices = [
      '统一封装 HTTP 请求库，不要在组件中直接写 fetch/axios',
      '使用 TypeScript 定义 API 请求和响应类型',
      '实现请求防抖/取消机制，避免用户快速点击触发重复请求',
      '前后端统一接口返回格式和错误码规范',
    ];

    return {
      category: ProgrammingCategory.API,
      categoryLabel: this.categoryLabels[ProgrammingCategory.API],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary,
      detailedExplanation,
      keyPoints,
      codeExamples,
      commonPitfalls,
      bestPractices,
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.API),
      references: this.getReferences(language, ''),
    };
  }

  private buildDatabaseAnswer(
    question: string,
    difficulty: DifficultyLevel,
  ): ProgrammingAnswer {
    return {
      category: ProgrammingCategory.DATABASE,
      categoryLabel: this.categoryLabels[ProgrammingCategory.DATABASE],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary: '数据库是应用的核心，合理的表结构设计和查询优化直接影响系统性能。',
      detailedExplanation:
        '关系型数据库（MySQL、PostgreSQL）是目前应用最广泛的数据库类型。数据库优化主要包括：索引设计、查询优化、表结构设计、事务管理、分库分表策略等。索引是最常用的优化手段，但需权衡读写性能。',
      keyPoints: [
        '主键索引（聚簇）和二级索引（非聚簇）的区别',
        'B+ 树索引的原理和最左前缀匹配原则',
        '避免 SELECT *，只查询需要的字段',
        '合理使用 LIMIT 分页，深分页使用游标方式',
        '事务隔离级别：读未提交、读已提交、可重复读、串行化',
      ],
      codeExamples: [
        {
          title: 'SQL 查询优化示例',
          language: 'sql',
          code: `-- ❌ 避免：全表扫描，未走索引
SELECT * FROM orders WHERE YEAR(created_at) = 2024;

-- ✅ 推荐：允许使用 created_at 列上的索引
SELECT * FROM orders
WHERE created_at >= '2024-01-01'
  AND created_at < '2025-01-01';

-- ❌ 避免：SELECT * 返回不需要的字段
SELECT * FROM users WHERE status = 1;

-- ✅ 推荐：明确指定所需字段，减少数据传输和内存
SELECT id, name, email FROM users WHERE status = 1;

-- 索引创建示例
CREATE INDEX idx_users_status_created ON users(status, created_at DESC);

-- 查看查询计划，分析是否走索引
EXPLAIN SELECT id, name FROM users WHERE status = 1;`,
          explanation: '避免在 WHERE 条件中的列上使用函数，这会导致索引失效。始终用 EXPLAIN 分析慢查询。',
        },
      ],
      commonPitfalls: [
        '索引建得太多导致写入性能下降',
        '联合索引顺序错误导致无法命中',
        '深分页 LIMIT 100000, 10 性能极差',
        '长事务导致锁等待和主从延迟',
      ],
      bestPractices: [
        '用 EXPLAIN 分析所有慢查询',
        '联合索引遵循最左前缀原则',
        '读写分离应对读多写少场景',
        '定期分析慢查询日志并优化',
      ],
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.DATABASE),
      references: ['《高性能 MySQL》', 'PostgreSQL 官方文档'],
    };
  }

  private buildPerformanceAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
  ): ProgrammingAnswer {
    return {
      category: ProgrammingCategory.PERFORMANCE,
      categoryLabel: this.categoryLabels[ProgrammingCategory.PERFORMANCE],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary: '性能优化需要先测量瓶颈所在，再针对性优化，避免过早优化。',
      detailedExplanation:
        '性能优化的黄金法则：先测量（Profile），再优化。使用 Chrome DevTools Performance、Lighthouse、Node.js --inspect 等工具定位瓶颈后，再从算法、内存、I/O、渲染等维度优化。',
      keyPoints: [
        '时间换空间 / 空间换时间的权衡',
        '前端：减少重排重绘、虚拟列表、图片懒加载、代码分割',
        '后端：缓存（Redis/CDN）、数据库索引、异步处理、连接池',
        '网络：HTTP/2、Gzip/Brotli 压缩、CDN 加速、资源预加载',
        '使用性能分析工具定位真实瓶颈，不要凭感觉优化',
      ],
      codeExamples: [
        {
          title: '防抖与节流优化高频事件',
          language: 'typescript',
          code: `// 防抖（debounce）：事件触发后 n 秒才执行，期间重复触发则重新计时
// 适用于：搜索框输入联想、窗口 resize
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// 节流（throttle）：n 秒内只执行一次
// 适用于：滚动事件、鼠标移动、按钮防重复点击
function throttle<T extends (...args: any[]) => any>(
  fn: T,
  interval = 300,
): (...args: Parameters<T>) => void {
  let lastTime = 0;
  return function (this: any, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

// 使用示例
const handleSearch = debounce((keyword: string) => {
  console.log('搜索:', keyword);
}, 300);

const handleScroll = throttle(() => {
  console.log('滚动位置:', window.scrollY);
}, 200);`,
          explanation: '防抖和节流是前端最常用的性能优化手段，分别适用于不同场景。',
        },
      ],
      commonPitfalls: [
        '没有测量就盲目优化，可能优化了非瓶颈位置',
        '过度缓存导致数据不一致和内存浪费',
        '前端只关注 JS 性能，忽略渲染和网络层面',
      ],
      bestPractices: [
        '建立性能基线和监控，持续关注指标变化',
        '遵循「二八定律」，优先优化 20% 的关键路径',
        '前端关注 Core Web Vitals 指标',
        '后端关注 P95/P99 响应时间而非平均值',
      ],
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.PERFORMANCE),
      references: this.getReferences(language, ''),
    };
  }

  private buildDesignPatternAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
  ): ProgrammingAnswer {
    return {
      category: ProgrammingCategory.DESIGN_PATTERN,
      categoryLabel: this.categoryLabels[ProgrammingCategory.DESIGN_PATTERN],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary: '设计模式是解决常见软件设计问题的经验总结，选择合适的模式让代码更易维护和扩展。',
      detailedExplanation:
        'GoF 23 种设计模式分为创建型、结构型、行为型三大类。实际开发中最常用的有：单例、工厂、观察者、策略、装饰器、代理模式等。设计模式不是银弹，过度使用反而增加复杂度。',
      keyPoints: [
        '创建型：单例、工厂方法、抽象工厂、建造者、原型',
        '结构型：适配器、装饰器、代理、外观、桥接、组合、享元',
        '行为型：观察者、策略、命令、责任链、状态、模板方法、迭代器、访问者、中介者、备忘录、解释器',
        'SOLID 原则是设计模式的基础：单一职责、开闭、里氏替换、接口隔离、依赖倒置',
      ],
      codeExamples: [
        {
          title: '单例模式 + 观察者模式',
          language: 'typescript',
          code: `// 单例模式：全局唯一的事件总线
class EventBus {
  private static instance: EventBus;
  private handlers: Map<string, Set<Function>> = new Map();

  private constructor() {}

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  // 观察者模式：订阅事件
  on(event: string, handler: Function): () => void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);

    // 返回取消订阅函数
    return () => this.off(event, handler);
  }

  off(event: string, handler: Function): void {
    this.handlers.get(event)?.delete(handler);
  }

  emit(event: string, ...args: any[]): void {
    this.handlers.get(event)?.forEach((handler) => handler(...args));
  }
}

// 使用示例
const bus = EventBus.getInstance();

const unsubscribe = bus.on('user:login', (user) => {
  console.log('用户登录:', user);
});

bus.emit('user:login', { id: 1, name: '张三' });
// unsubscribe(); // 取消订阅`,
          explanation: '单例保证全局唯一实例，观察者模式实现事件订阅/发布的解耦。',
        },
      ],
      commonPitfalls: [
        '为了用模式而用模式，过度设计',
        '不理解模式适用场景就生搬硬套',
        '单例模式导致全局状态难以测试',
      ],
      bestPractices: [
        '先写简单可工作的代码，发现重复和变化时再重构引入模式',
        '理解每个模式的意图、适用场景和优缺点',
        '优先使用组合而非继承',
      ],
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.DESIGN_PATTERN),
      references: ['《设计模式：可复用面向对象软件的基础》（GoF）', '《重构：改善既有代码的设计》'],
    };
  }

  private buildDeploymentAnswer(
    question: string,
    difficulty: DifficultyLevel,
  ): ProgrammingAnswer {
    return {
      category: ProgrammingCategory.DEPLOYMENT,
      categoryLabel: this.categoryLabels[ProgrammingCategory.DEPLOYMENT],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary: '现代部署基于容器化和自动化 CI/CD，保证应用快速、可靠、可回滚地发布。',
      detailedExplanation:
        'Docker 容器化 + Kubernetes 编排是目前主流部署方案。CI/CD 流水线（Jenkins/GitLab CI/GitHub Actions）实现自动化测试、构建和部署。Nginx 常用作反向代理和静态资源服务。',
      keyPoints: [
        'Docker 镜像构建：多阶段构建减小镜像体积',
        'K8s 核心概念：Pod、Deployment、Service、Ingress、ConfigMap、Secret',
        'CI/CD 流水线：代码提交 → 自动测试 → 构建镜像 → 部署',
        'Nginx 反向代理、负载均衡、Gzip 压缩、HTTPS 配置',
      ],
      codeExamples: [
        {
          title: '多阶段构建 Dockerfile（Node.js 前端）',
          language: 'dockerfile',
          code: `# 第一阶段：构建
FROM node:18-alpine AS builder
WORKDIR /app

# 先复制依赖文件，利用 Docker 缓存
COPY package*.json ./
RUN npm ci --registry=https://registry.npmmirror.com

# 复制源码并构建
COPY . .
RUN npm run build

# 第二阶段：运行 - 仅包含构建产物和 nginx
FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# 自定义 nginx 配置（SPA 路由支持）
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
          explanation: '多阶段构建只将最终产物放入镜像，显著减小镜像体积（从几百 MB 降到几十 MB）。',
        },
      ],
      commonPitfalls: [
        '镜像过大，包含编译工具和源码',
        '在容器中以 root 权限运行（安全风险）',
        '缺少健康检查和优雅关闭配置',
        '没有实现灰度发布/回滚机制',
      ],
      bestPractices: [
        '使用多阶段构建和 Alpine 基础镜像',
        '固定依赖版本，保证构建可复现',
        '配置 Liveness/Readiness Probes',
        '使用 Helm/Kustomize 管理 K8s 配置',
      ],
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.DEPLOYMENT),
      references: ['Docker 官方文档', 'Kubernetes 官方文档'],
    };
  }

  private buildGeneralAnswer(
    question: string,
    difficulty: DifficultyLevel,
    language: string,
  ): ProgrammingAnswer {
    const isEmbedded = /arduino|stm32|esp32|esp8266|树莓派|raspberry|嵌入式|embedded|单片机|mcu|gpio|i2c|spi|uart|串口|pwm|adc|dac|传感器|sensor|freertos|rtos|寄存器|中断|iot|物联网/.test(question);

    if (isEmbedded) {
      let summary = '嵌入式开发需要同时关注软件逻辑和硬件特性，资源受限环境下代码效率和稳定性是关键。';
      let detailedExplanation = `
嵌入式系统是"为特定应用设计的专用计算机系统"，核心特征是资源受限（RAM/Flash/CPU频率有限）、实时性要求高、与物理世界直接交互。
开发流程通常是：理解硬件规格 → 配置时钟/外设 → 编写驱动/协议 → 应用逻辑 → 调试优化。
常用通信协议：UART（串口）、I2C（两线，多从设备）、SPI（四线，高速）、1-Wire、CAN、ModBus。
      `.trim();
      let keyPoints: string[] = [
        'GPIO 操作：配置输入/输出模式，上拉/下拉设置，注意电平兼容性（3.3V vs 5V）',
        '通信协议：UART 异步串口、I2C 两线双向、SPI 四线高速，根据场景选型',
        '中断 vs 轮询：高频事件用中断，低频率简单场景用轮询，注意中断处理函数要"短"',
        '资源意识：单片机 RAM/Flash 有限，避免大数组、动态分配和递归调用',
        '看门狗 WDT：防止程序跑飞卡死，定期喂狗保障系统可靠性',
      ];
      let codeExamples: CodeExample[] = [];
      let commonPitfalls: string[] = [];
      let bestPractices: string[] = [];

      if (question.includes('gpio') || question.includes('点灯') || question.includes('led') || question.includes('blink')) {
        summary = 'GPIO（通用输入输出）是嵌入式最基础的外设，用于读取按键、驱动LED、控制继电器等。';
        detailedExplanation = `
GPIO 操作三步走：1）开启外设时钟；2）配置引脚模式（输入/输出/复用/模拟）；3）读写数据寄存器。
注意：STM32 等 ARM 芯片必须先开启对应 GPIO 端口时钟，否则配置不会生效。
        `.trim();
        codeExamples = [
          {
            title: 'Arduino LED 闪烁（Blink）',
            language: 'cpp',
            code: `// Arduino Uno - LED_BUILTIN 引脚 13
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);  // 配置为输出模式
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);  // 点亮
  delay(1000);                       // 延时 1 秒
  digitalWrite(LED_BUILTIN, LOW);   // 熄灭
  delay(1000);
}`,
            explanation: '最基础的 GPIO 输出示例，setup 执行一次，loop 循环执行。',
          },
          {
            title: 'STM32 HAL 库 GPIO 输出',
            language: 'c',
            code: `/* STM32F103C8T6 - PC13 引脚控制板载 LED */
#include "stm32f1xx_hal.h"

GPIO_InitTypeDef GPIO_InitStruct = {0};

void GPIO_Init(void) {
  __HAL_RCC_GPIOC_CLK_ENABLE();  // 必须先开启 GPIOC 时钟！

  HAL_GPIO_WritePin(GPIOC, GPIO_PIN_13, GPIO_PIN_SET);  // 初始熄灭（低电平点亮）

  GPIO_InitStruct.Pin   = GPIO_PIN_13;
  GPIO_InitStruct.Mode  = GPIO_MODE_OUTPUT_PP;         // 推挽输出
  GPIO_InitStruct.Pull  = GPIO_NOPULL;                 // 无上拉下拉
  GPIO_InitStruct.Speed = GPIO_SPEED_FREQ_LOW;         // 低速足够
  HAL_GPIO_Init(GPIOC, &GPIO_InitStruct);
}

// 在 main 循环中调用
HAL_GPIO_TogglePin(GPIOC, GPIO_PIN_13);  // 翻转电平
HAL_Delay(500);`,
            explanation: 'HAL 库是 STM32 官方库，注意要点：1）先开时钟；2）推挽输出(Push-Pull) vs 开漏(Open-Drain)；3）LED 是高电平还是低电平点亮要看原理图。',
          },
          {
            title: 'ESP32 GPIO 输入（按键检测 + 消抖）',
            language: 'cpp',
            code: `// ESP32 - 按键接 GPIO0，下拉输入
#define BUTTON_PIN 0
#define DEBOUNCE_MS 50

unsigned long lastPressTime = 0;
bool lastState = HIGH;

void setup() {
  Serial.begin(115200);
  pinMode(BUTTON_PIN, INPUT_PULLUP);  // 内部上拉，按键按下接地
}

void loop() {
  bool state = digitalRead(BUTTON_PIN);
  unsigned long now = millis();

  // 状态变化 + 消抖判断
  if (state != lastState && (now - lastPressTime) > DEBOUNCE_MS) {
    lastPressTime = now;
    lastState = state;
    if (state == LOW) {
      Serial.println("按键按下！");
    }
  }
}`,
            explanation: '机械按键按下/释放时会有几十ms抖动，必须软件消抖，否则会误触发多次。',
          },
        ];
        commonPitfalls = [
          '忘记开启 GPIO 外设时钟（STM32 常见坑）',
          '忽略电平兼容性：3.3V 芯片直连 5V 外设可能烧毁',
          '按键未做消抖处理，触发多次',
          '上拉/下拉模式配置错误，导致引脚电平不确定',
        ];
        bestPractices = [
          '引脚配置集中在初始化函数，方便维护',
          '按键输入都加上消抖（软件延时或硬件 RC 消抖）',
          '不用的引脚建议配置为模拟输入，降低功耗',
          '使用 HAL/官方库，不要直接操作寄存器（除非性能极致要求）',
        ];
      }
      else if (question.includes('i2c') || question.includes('iic')) {
        summary = 'I2C（Inter-Integrated Circuit）是两线制串行总线，常用于连接传感器、EEPROM、OLED 等低速外设。';
        detailedExplanation = `
I2C 只需两根线：SCL（时钟）和 SDA（数据），支持一主多从。
每个从设备有唯一 7/10 位地址。通信由主设备发起 START 信号，发送 7 位地址 + R/W 位，从设备 ACK 应答后传输数据，STOP 结束。
常用速率：标准模式 100kbps、快速模式 400kbps、高速模式 3.4Mbps。
        `.trim();
        codeExamples = [
          {
            title: 'Arduino I2C 读取 BH1750 光照传感器',
            language: 'cpp',
            code: `// Arduino + BH1750（地址 0x23）
#include <Wire.h>

#define BH1750_ADDR 0x23
#define CONTINUOUS_H_RES 0x10  // 连续高分辨率模式

void setup() {
  Wire.begin();          // 初始化 I2C 主机
  Serial.begin(115200);
  Wire.beginTransmission(BH1750_ADDR);
  Wire.write(CONTINUOUS_H_RES);  // 发送测量命令
  Wire.endTransmission();
  delay(180);
}

void loop() {
  // 请求 2 字节数据
  Wire.requestFrom(BH1750_ADDR, (uint8_t)2);
  if (Wire.available() >= 2) {
    uint16_t raw = (Wire.read() << 8) | Wire.read();
    float lux = raw / 1.2;  // 转换为勒克斯
    Serial.printf("光照: %.1f lux\\n", lux);
  }
  delay(1000);
}`,
            explanation: 'I2C 典型读取流程：发起请求 → 读取数据 → 转换物理量。注意：SDA/SCL 需要外接 4.7K 上拉电阻（大部分模块已自带）。',
          },
          {
            title: 'STM32 HAL I2C 发送数据',
            language: 'c',
            code: `/* STM32 HAL 库 I2C 写寄存器（以 OLED SSD1306 为例） */
#define OLED_ADDR 0x3C  // 7 位地址

uint8_t cmd[2] = {0x00, 0xAE};  // 控制字节 + 关闭显示命令

// 阻塞模式发送
HAL_StatusTypeDef status = HAL_I2C_Master_Transmit(
    &hi2c1,             // I2C 句柄
    OLED_ADDR << 1,     // HAL 库需要 8 位地址（左移一位，最低位 R/W=0）
    cmd,                // 数据缓冲区
    sizeof(cmd),        // 数据长度
    100                 // 超时 ms
);

if (status != HAL_OK) {
  // 错误处理：NACK、总线仲裁失败等
  Error_Handler();
}`,
            explanation: 'STM32 HAL I2C 注意：地址要左移一位；建议开启 I2C 中断或 DMA 模式避免阻塞主循环。',
          },
        ];
        commonPitfalls = [
          'SDA/SCL 缺少上拉电阻，导致信号异常或通信失败',
          '地址位宽不匹配：7 位还是 8 位？HAL 库需手动左移',
          'I2C 总线死锁：从设备拉低 SDA，主设备发 9 个时钟脉冲释放',
          '速率过高导致长距离通信不稳定',
        ];
        bestPractices = [
          'I2C 扫描程序先确认从设备地址是否正确',
          '关键通信加超时和重试机制',
          '多从设备时注意地址冲突，部分模块可用跳线切换地址',
          '调试时用逻辑分析仪抓波形，比打印 Log 高效得多',
        ];
      }
      else if (question.includes('uart') || question.includes('串口')) {
        summary = 'UART（通用异步收发器）是最常用的串行通信协议，用于调试输出、GPS/WiFi/Bluetooth 模块通信等。';
        detailedExplanation = `
UART 是异步协议，无需时钟线，通过约定波特率（9600/115200/921600）同步。
帧格式：起始位(1bit) + 数据位(5-8bit) + 校验位(可选) + 停止位(1/1.5/2bit)。
常见问题：波特率不匹配、帧格式错误、电平不兼容（TTL vs RS232 vs RS485）。
        `.trim();
        codeExamples = [
          {
            title: 'STM32 HAL UART 中断接收 + 空闲中断',
            language: 'c',
            code: `/* STM32 HAL：使用空闲中断实现不定长数据接收 */
#define RX_BUF_SIZE 128
uint8_t rx_buf[RX_BUF_SIZE];
volatile uint16_t rx_len = 0;
volatile uint8_t rx_done = 0;

// 初始化时开启接收中断和空闲中断
void UART_Init_Ex(void) {
  __HAL_UART_ENABLE_IT(&huart1, UART_IT_IDLE);   // 空闲中断
  HAL_UART_Receive_IT(&huart1, rx_buf, RX_BUF_SIZE);
}

// USART1 全局中断服务函数
void USART1_IRQHandler(void) {
  HAL_UART_IRQHandler(&huart1);

  if (__HAL_UART_GET_FLAG(&huart1, UART_FLAG_IDLE) != RESET) {
    __HAL_UART_CLEAR_IDLEFLAG(&huart1);  // 必须软件清标志
    HAL_UART_AbortReceive(&huart1);
    rx_len = RX_BUF_SIZE - huart1.RxXferCount;
    rx_done = 1;
    HAL_UART_Receive_IT(&huart1, rx_buf, RX_BUF_SIZE);  // 重新开启
  }
}

// main 循环中处理
if (rx_done) {
  HAL_UART_Transmit(&huart1, rx_buf, rx_len, 100);  // 回显
  rx_done = 0;
}`,
            explanation: '空闲中断（IDLE）检测一帧数据结束，配合接收中断实现不定长数据接收，比固定长度接收更灵活。',
          },
        ];
        commonPitfalls = [
          '波特率不匹配：双方必须严格一致（115200 最常用）',
          'TX/RX 接反：A 的 TX 接 B 的 RX，交叉连接',
          '电平不兼容：TTL(3.3V/5V) 和 RS232(-12V~+12V) 需要 MAX232 转换',
          '数据丢失：处理不及时导致接收缓冲区溢出',
        ];
        bestPractices = [
          '打印调试信息时加时间戳和模块前缀',
          '大数据量使用 DMA + 空闲中断，降低 CPU 占用',
          '关键通信协议加入 CRC 校验，发现错误数据',
          '串口线尽量短、远离干扰源（电机、电源）',
        ];
      }
      else if (question.includes('freertos') || question.includes('rtos') || question.includes('任务')) {
        summary = 'FreeRTOS 是最流行的开源实时操作系统内核，提供任务调度、信号量、队列、软件定时器等功能。';
        detailedExplanation = `
RTOS 核心概念：任务（Task）是独立执行单元，每个任务有自己的栈；调度器基于优先级抢占式调度；
同步通信原语：队列(Queue)、信号量(Semaphore)、互斥锁(Mutex)、事件组(Event Group)、任务通知(Task Notification)。
中断优先级必须高于系统调用优先级，且中断中只能使用 FromISR 后缀的 API。
        `.trim();
        codeExamples = [
          {
            title: 'FreeRTOS 创建任务 + 队列通信',
            language: 'c',
            code: `/* FreeRTOS：两个任务通过队列传递数据 */
#include "FreeRTOS.h"
#include "task.h"
#include "queue.h"

QueueHandle_t xQueue;

// 生产者任务：每 500ms 发送一个递增数字
void vProducerTask(void *pvParam) {
  uint32_t counter = 0;
  for (;;) {
    xQueueSend(xQueue, &counter, portMAX_DELAY);
    counter++;
    vTaskDelay(pdMS_TO_TICKS(500));
  }
}

// 消费者任务：从队列接收并打印
void vConsumerTask(void *pvParam) {
  uint32_t value;
  for (;;) {
    if (xQueueReceive(xQueue, &value, pdMS_TO_TICKS(1000)) == pdPASS) {
      printf("收到: %lu\\n", value);
    } else {
      printf("超时，无数据\\n");
    }
  }
}

// main 中初始化并启动调度器
int main(void) {
  xQueue = xQueueCreate(10, sizeof(uint32_t));  // 10 个元素的队列

  xTaskCreate(vProducerTask, "Producer", 512, NULL, 2, NULL);
  xTaskCreate(vConsumerTask, "Consumer", 512, NULL, 1, NULL);

  vTaskStartScheduler();  // 启动调度器，不会返回
  for (;;);
}`,
            explanation: '队列是 FreeRTOS 最常用的任务间通信方式，线程安全、支持多写多读。注意栈大小要足够，避免栈溢出。',
          },
        ];
        commonPitfalls = [
          '任务栈溢出：任务栈分配过小，导致内存踩踏和莫名崩溃',
          '在中断中调用非 FromISR 版本的 API，系统直接崩溃',
          '高优先级任务死循环，低优先级任务永远得不到执行（饥饿）',
          '使用 Mutex 但不释放，造成死锁',
          'vTaskDelay 误用为精确延时（实际是至少延时）',
        ];
        bestPractices = [
          '合理分配任务优先级：紧急任务优先级高，常规任务低',
          '队列/信号量在初始化时一次性创建，运行时不要动态创建删除',
          '开启 FreeRTOS 栈溢出检测（configCHECK_FOR_STACK_OVERFLOW）',
          '中断处理函数尽量短，只负责唤醒任务，实际逻辑在任务中做',
          '使用软件定时器处理周期性事件，避免创建大量专用任务',
        ];
      }
      else {
        // 通用嵌入式解答
        codeExamples = [
          {
            title: 'Arduino 多传感器综合示例（DHT11温湿度 + OLED显示）',
            language: 'cpp',
            code: `// Arduino Uno + DHT11 温湿度 + SSD1306 0.96" OLED
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <DHT.h>

#define DHT_PIN 2
#define DHT_TYPE DHT11
DHT dht(DHT_PIN, DHT_TYPE);

#define SCREEN_W 128
#define SCREEN_H 64
Adafruit_SSD1306 display(SCREEN_W, SCREEN_H, &Wire, -1);

void setup() {
  Serial.begin(115200);
  dht.begin();
  display.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();

  display.clearDisplay();
  display.setCursor(0, 0);
  display.printf("Temp: %.1f C", t);
  display.setCursor(0, 20);
  display.printf("Humi: %.1f %%", h);
  display.setCursor(0, 40);
  display.println("ESP32 Ready!");
  display.display();
  delay(2000);
}`,
            explanation: '典型 Arduino 项目结构：库头文件 → 引脚/对象定义 → setup 初始化 → loop 业务循环。每个外设一个库，降低开发难度。',
          },
        ];
        commonPitfalls = [
          '混淆不同硬件的引脚定义，直接复制代码不看原理图',
          '忽略电流和功耗：单片机 IO 驱动能力有限（一般 <20mA）',
          '外设电源不稳：传感器/模块需要独立供电或增加滤波电容',
          '看门狗未喂狗或喂狗时机不对，导致系统反复重启',
          '调试只靠串口打印：逻辑分析仪和示波器才是硬件调试利器',
        ];
        bestPractices = [
          '阅读芯片数据手册(Datasheet)，理解寄存器和电气特性',
          '硬件外设先跑官方 Demo，确认硬件没问题再集成',
          '模块化分层：硬件抽象层(HAL) → 驱动层 → 应用层',
          '使用示波器/逻辑分析仪看波形，比串口打印高效 10 倍',
          '做好版本管理：硬件版本和固件版本对应，避免混乱',
        ];
      }

      return {
        category: ProgrammingCategory.GENERAL,
        categoryLabel: this.categoryLabels[ProgrammingCategory.GENERAL] + ' / 嵌入式与物联网',
        difficulty,
        difficultyLabel: this.difficultyLabels[difficulty],
        summary,
        detailedExplanation,
        keyPoints,
        codeExamples,
        commonPitfalls,
        bestPractices,
        relatedTopics: [
          { topic: '通信协议', description: 'UART / I2C / SPI / CAN / ModBus 选型与对比' },
          { topic: '实时操作系统', description: 'FreeRTOS / RT-Thread / Zephyr 任务调度与同步' },
          { topic: '低功耗设计', description: '休眠模式、时钟门控、外设按需开启' },
        ],
        references: [
          'Arduino 官方文档（https://docs.arduino.cc）',
          'STM32 HAL 库用户手册（ST 官网 UM1725）',
          'FreeRTOS 官方文档（https://www.freertos.org/Documentation）',
          'ESP-IDF 编程指南（https://docs.espressif.com）',
          '相关芯片数据手册(Datasheet)与参考手册(Reference Manual)',
        ],
      };
    }

    return {
      category: ProgrammingCategory.GENERAL,
      categoryLabel: this.categoryLabels[ProgrammingCategory.GENERAL],
      difficulty,
      difficultyLabel: this.difficultyLabels[difficulty],
      summary: '编程是一门实践学科，建议从基础知识开始，配合大量练习和项目实战。',
      detailedExplanation:
        '学习编程的建议路径：1）掌握一门语言的基础语法；2）学习数据结构与算法；3）选择一个方向（前端/后端/全栈/移动端/嵌入式）深入学习；4）参与开源项目或做实战项目积累经验。持续学习是程序员的终身必修课。',
      keyPoints: [
        '打好基础：语言基础、数据结构、算法、计算机网络、操作系统',
        '多写代码，阅读优秀源码，参与开源项目',
        '建立自己的知识体系，做技术笔记和博客',
        '关注行业动态，学习新技术但保持理性判断',
      ],
      codeExamples: [
        {
          title: 'Git 常用命令',
          language: 'bash',
          code: `# 克隆仓库
git clone <repository-url>

# 查看状态
git status
git log --oneline -10

# 分支操作
git checkout -b feature/new-feature   # 创建并切换分支
git branch -a                         # 查看所有分支
git merge feature/new-feature         # 合并分支到当前分支

# 提交操作
git add .
git commit -m "feat: 添加用户登录功能"
git push origin feature/new-feature

# 撤销与回退
git reset --soft HEAD~1        # 撤销最近一次提交，保留修改
git checkout -- <file>         # 丢弃某个文件的修改
git stash                      # 暂存当前修改`,
          explanation: 'Git 是程序员的必备技能，建议熟练掌握分支管理和回退操作。',
        },
      ],
      commonPitfalls: [
        '只看教程不写代码，眼高手低',
        '追逐技术热点，基础不扎实',
        '遇到问题直接复制粘贴，不求甚解',
      ],
      bestPractices: [
        '每天写代码，保持手感',
        '写单元测试，培养质量意识',
        'Code Review 是最好的学习方式之一',
        '定期复盘总结，构建知识体系',
      ],
      relatedTopics: this.getRelatedTopics(ProgrammingCategory.GENERAL),
      references: this.getReferences(language, ''),
    };
  }

  private getRelatedTopics(category: ProgrammingCategory): RelatedTopic[] {
    const topicsMap: Record<ProgrammingCategory, RelatedTopic[]> = {
      [ProgrammingCategory.SYNTAX]: [
        { topic: '作用域与闭包', description: '理解变量生命周期和访问规则' },
        { topic: '类型系统', description: '静态类型 vs 动态类型，类型推断' },
      ],
      [ProgrammingCategory.FRAMEWORK]: [
        { topic: '组件设计原则', description: '单一职责、可复用、可测试' },
        { topic: '状态管理', description: '前端状态分层和数据流设计' },
      ],
      [ProgrammingCategory.ALGORITHM]: [
        { topic: '数据结构', description: '数组、链表、树、图、堆、哈希表' },
        { topic: '复杂度分析', description: '时间复杂度 Big O 分析' },
      ],
      [ProgrammingCategory.DEBUGGING]: [
        { topic: '单元测试', description: 'Jest/Vitest 编写可测试代码' },
        { topic: '日志规范', description: '结构化日志便于问题排查' },
      ],
      [ProgrammingCategory.API]: [
        { topic: 'RESTful 设计规范', description: '资源命名、HTTP 方法语义' },
        { topic: '接口鉴权', description: 'JWT、OAuth2、Session 方案对比' },
      ],
      [ProgrammingCategory.DATABASE]: [
        { topic: '事务与锁', description: 'ACID、MVCC、乐观锁悲观锁' },
        { topic: 'Redis 缓存', description: '缓存策略、穿透击穿雪崩' },
      ],
      [ProgrammingCategory.PERFORMANCE]: [
        { topic: '浏览器渲染原理', description: '从 URL 到页面展示的全过程' },
        { topic: '网络优化', description: 'HTTP/2、多路复用、缓存策略' },
      ],
      [ProgrammingCategory.DESIGN_PATTERN]: [
        { topic: 'SOLID 原则', description: '面向对象设计的五大原则' },
        { topic: '领域驱动设计', description: 'DDD 复杂业务建模' },
      ],
      [ProgrammingCategory.DEPLOYMENT]: [
        { topic: 'Docker & K8s', description: '容器化与编排入门' },
        { topic: 'CI/CD 实践', description: '自动化构建、测试、部署流水线' },
      ],
      [ProgrammingCategory.GENERAL]: [
        { topic: '代码规范', description: 'ESLint/Prettier 统一团队风格' },
        { topic: 'Git 工作流', description: 'Git Flow / GitHub Flow 分支策略' },
      ],
    };
    return topicsMap[category] || [];
  }

  private getReferences(language: string, framework: string): string[] {
    const refs: string[] = [];
    if (language.includes('JavaScript') || language.includes('TypeScript')) {
      refs.push('MDN Web Docs（https://developer.mozilla.org）');
      refs.push('TypeScript 官方文档（https://www.typescriptlang.org/docs）');
    }
    if (language.includes('Python')) {
      refs.push('Python 官方文档（https://docs.python.org）');
    }
    if (framework === 'Vue.js') {
      refs.push('Vue 3 官方文档（https://vuejs.org）');
    }
    if (framework === 'React') {
      refs.push('React 官方文档（https://react.dev）');
    }
    refs.push('GitHub 搜索 Issues 与 Stack Overflow');
    return refs;
  }
}
