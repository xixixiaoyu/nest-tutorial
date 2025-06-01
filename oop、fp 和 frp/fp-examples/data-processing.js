// 函数式编程示例：数据处理系统
// 展示纯函数、不可变性、高阶函数、函数组合等核心概念

/**
 * 纯函数示例
 * 特点：相同输入总是产生相同输出，无副作用
 */

// ✅ 纯函数：计算两个数的和
const add = (a, b) => a + b

// ✅ 纯函数：计算数组的平均值
const average = (numbers) => {
  if (numbers.length === 0) return 0
  return numbers.reduce((sum, num) => sum + num, 0) / numbers.length
}

// ✅ 纯函数：格式化货币
const formatCurrency = (amount, currency = 'CNY') => {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// ❌ 非纯函数示例（仅作对比，实际不使用）
let globalCounter = 0
const impureIncrement = () => ++globalCounter // 依赖外部状态
const impureRandom = () => Math.random() // 输出不可预测

/**
 * 不可变性示例
 * 原则：不修改原始数据，总是返回新的数据副本
 */

// ✅ 不可变的数组操作
const immutableArrayOps = {
  // 添加元素（不修改原数组）
  append: (arr, item) => [...arr, item],

  // 删除元素（不修改原数组）
  remove: (arr, index) => [...arr.slice(0, index), ...arr.slice(index + 1)],

  // 更新元素（不修改原数组）
  update: (arr, index, newValue) => [...arr.slice(0, index), newValue, ...arr.slice(index + 1)],

  // 排序（不修改原数组）
  sort: (arr, compareFn) => [...arr].sort(compareFn),
}

// ✅ 不可变的对象操作
const immutableObjectOps = {
  // 更新对象属性（不修改原对象）
  updateProperty: (obj, key, value) => ({
    ...obj,
    [key]: value,
  }),

  // 深度更新嵌套对象
  updateNested: (obj, path, value) => {
    const [head, ...tail] = path
    if (tail.length === 0) {
      return { ...obj, [head]: value }
    }
    return {
      ...obj,
      [head]: immutableObjectOps.updateNested(obj[head] || {}, tail, value),
    }
  },

  // 合并对象
  merge: (obj1, obj2) => ({ ...obj1, ...obj2 }),
}

/**
 * 高阶函数示例
 * 定义：接收函数作为参数或返回函数的函数
 */

// 创建过滤器函数
const createFilter = (predicate) => (array) => array.filter(predicate)

// 创建映射器函数
const createMapper = (transform) => (array) => array.map(transform)

// 创建归约器函数
const createReducer = (reducer, initialValue) => (array) => array.reduce(reducer, initialValue)

// 函数组合工具
const compose =
  (...functions) =>
  (value) =>
    functions.reduceRight((acc, fn) => fn(acc), value)

const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((acc, fn) => fn(acc), value)

// 柯里化工具
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

/**
 * 实际应用：学生成绩管理系统
 */

// 学生数据
const students = [
  { id: 1, name: '张三', age: 20, scores: { math: 85, english: 78, chinese: 92 }, grade: 'A' },
  { id: 2, name: '李四', age: 19, scores: { math: 92, english: 88, chinese: 85 }, grade: 'A' },
  { id: 3, name: '王五', age: 21, scores: { math: 78, english: 82, chinese: 79 }, grade: 'B' },
  { id: 4, name: '赵六', age: 20, scores: { math: 95, english: 91, chinese: 88 }, grade: 'A' },
  { id: 5, name: '钱七', age: 18, scores: { math: 72, english: 75, chinese: 80 }, grade: 'B' },
  { id: 6, name: '孙八', age: 22, scores: { math: 88, english: 85, chinese: 90 }, grade: 'A' },
]

// 纯函数：计算学生总分
const calculateTotalScore = (student) => {
  const { math, english, chinese } = student.scores
  return math + english + chinese
}

// 纯函数：计算学生平均分
const calculateAverageScore = (student) => {
  const total = calculateTotalScore(student)
  return Math.round((total / 3) * 100) / 100 // 保留两位小数
}

// 纯函数：判断是否优秀学生（平均分 >= 85）
const isExcellentStudent = (student) => calculateAverageScore(student) >= 85

// 纯函数：按年龄分组
const groupByAge = (students) => {
  return students.reduce((groups, student) => {
    const age = student.age
    return {
      ...groups,
      [age]: [...(groups[age] || []), student],
    }
  }, {})
}

// 高阶函数：创建排序函数
const createSorter =
  (keyExtractor, ascending = true) =>
  (array) => {
    return [...array].sort((a, b) => {
      const valueA = keyExtractor(a)
      const valueB = keyExtractor(b)

      if (valueA < valueB) return ascending ? -1 : 1
      if (valueA > valueB) return ascending ? 1 : -1
      return 0
    })
  }

// 柯里化函数：过滤学生
const filterStudents = curry((predicate, students) => students.filter(predicate))

// 柯里化函数：映射学生数据
const mapStudents = curry((transform, students) => students.map(transform))

// 函数组合示例：数据处理管道
const processStudentData = pipe(
  // 1. 添加总分和平均分
  mapStudents((student) => ({
    ...student,
    totalScore: calculateTotalScore(student),
    averageScore: calculateAverageScore(student),
  })),

  // 2. 过滤出优秀学生
  filterStudents((student) => student.averageScore >= 85),

  // 3. 按平均分降序排序
  createSorter((student) => student.averageScore, false)
)

// 统计函数
const getStatistics = (students) => {
  const totalScores = students.map(calculateTotalScore)
  const averageScores = students.map(calculateAverageScore)

  return {
    totalStudents: students.length,
    averageTotalScore: average(totalScores),
    averageScore: average(averageScores),
    excellentStudents: students.filter(isExcellentStudent).length,
    gradeDistribution: students.reduce(
      (dist, student) => ({
        ...dist,
        [student.grade]: (dist[student.grade] || 0) + 1,
      }),
      {}
    ),
  }
}

// 报告生成函数
const generateReport = (students) => {
  const stats = getStatistics(students)
  const excellentStudents = processStudentData(students)
  const ageGroups = groupByAge(students)

  return {
    summary: stats,
    excellentStudents: excellentStudents,
    ageDistribution: Object.keys(ageGroups).reduce(
      (dist, age) => ({
        ...dist,
        [age]: ageGroups[age].length,
      }),
      {}
    ),
    topPerformers: excellentStudents.slice(0, 3),
  }
}

/**
 * 函数式工具库示例
 */
const FunctionalUtils = {
  // 防抖函数
  debounce: (fn, delay) => {
    let timeoutId
    return (...args) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn.apply(null, args), delay)
    }
  },

  // 节流函数
  throttle: (fn, interval) => {
    let lastTime = 0
    return (...args) => {
      const now = Date.now()
      if (now - lastTime >= interval) {
        lastTime = now
        return fn.apply(null, args)
      }
    }
  },

  // 记忆化函数
  memoize: (fn) => {
    const cache = new Map()
    return (...args) => {
      const key = JSON.stringify(args)
      if (cache.has(key)) {
        return cache.get(key)
      }
      const result = fn.apply(null, args)
      cache.set(key, result)
      return result
    }
  },

  // 偏函数应用
  partial: (fn, ...partialArgs) => {
    return (...remainingArgs) => {
      return fn(...partialArgs, ...remainingArgs)
    }
  },
}

// 使用示例
console.log('=== 函数式编程：数据处理系统 ===')

// 展示纯函数
console.log('\n📊 纯函数示例：')
console.log('add(5, 3) =', add(5, 3))
console.log('average([1, 2, 3, 4, 5]) =', average([1, 2, 3, 4, 5]))
console.log('formatCurrency(1234.56) =', formatCurrency(1234.56))

// 展示不可变性
console.log('\n🔒 不可变性示例：')
const originalArray = [1, 2, 3]
const newArray = immutableArrayOps.append(originalArray, 4)
console.log('原数组:', originalArray)
console.log('新数组:', newArray)

const originalObject = { name: '张三', age: 20 }
const updatedObject = immutableObjectOps.updateProperty(originalObject, 'age', 21)
console.log('原对象:', originalObject)
console.log('更新后:', updatedObject)

// 展示高阶函数
console.log('\n🔧 高阶函数示例：')
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const isEven = (x) => x % 2 === 0
const double = (x) => x * 2
const sum = (a, b) => a + b

const filterEven = createFilter(isEven)
const mapDouble = createMapper(double)
const sumAll = createReducer(sum, 0)

console.log('原数组:', numbers)
console.log('偶数:', filterEven(numbers))
console.log('双倍:', mapDouble(numbers))
console.log('总和:', sumAll(numbers))

// 函数组合示例
const processNumbers = pipe(filterEven, mapDouble, sumAll)

console.log('函数组合结果（偶数->双倍->求和）:', processNumbers(numbers))

// 学生数据处理示例
console.log('\n👨‍🎓 学生数据处理示例：')
console.log('原始学生数据:', students.length, '名学生')

// 处理学生数据
const excellentStudents = processStudentData(students)
console.log('\n🏆 优秀学生（平均分>=85）:')
excellentStudents.forEach((student) => {
  console.log(`${student.name}: 平均分 ${student.averageScore}`)
})

// 生成报告
const report = generateReport(students)
console.log('\n📈 统计报告:')
console.log('总学生数:', report.summary.totalStudents)
console.log('平均总分:', report.summary.averageTotalScore.toFixed(2))
console.log('平均分:', report.summary.averageScore.toFixed(2))
console.log('优秀学生数:', report.summary.excellentStudents)
console.log('成绩分布:', report.summary.gradeDistribution)
console.log('年龄分布:', report.ageDistribution)

console.log('\n🥇 前三名优秀学生:')
report.topPerformers.forEach((student, index) => {
  console.log(`${index + 1}. ${student.name} - 平均分: ${student.averageScore}`)
})

// 柯里化示例
console.log('\n🍛 柯里化示例：')
const filterByGrade = filterStudents((student) => student.grade === 'A')
const gradeAStudents = filterByGrade(students)
console.log(
  'A级学生:',
  gradeAStudents.map((s) => s.name)
)

// 记忆化示例
console.log('\n🧠 记忆化示例：')
const expensiveCalculation = (n) => {
  console.log(`计算斐波那契数列第 ${n} 项...`)
  if (n <= 1) return n
  return expensiveCalculation(n - 1) + expensiveCalculation(n - 2)
}

const memoizedFib = FunctionalUtils.memoize(expensiveCalculation)
console.log('第一次计算 fib(10):')
console.log('结果:', memoizedFib(10))
console.log('第二次计算 fib(10) (使用缓存):')
console.log('结果:', memoizedFib(10))

console.log('\n💡 函数式编程核心特性展示完毕！')
console.log('- 纯函数：可预测、易测试、无副作用')
console.log('- 不可变性：避免意外修改，提高代码安全性')
console.log('- 高阶函数：函数作为一等公民，提高代码复用性')
console.log('- 函数组合：将简单函数组合成复杂功能')
console.log('- 柯里化：函数参数部分应用，提高灵活性')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    add,
    average,
    formatCurrency,
    immutableArrayOps,
    immutableObjectOps,
    compose,
    pipe,
    curry,
    calculateTotalScore,
    calculateAverageScore,
    processStudentData,
    generateReport,
    FunctionalUtils,
  }
}
