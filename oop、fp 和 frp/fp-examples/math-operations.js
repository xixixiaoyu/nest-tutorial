// 函数式编程示例：数学运算系统
// 展示函数式编程在数学计算中的优雅应用

/**
 * 基础数学函数（纯函数）
 */
const MathOps = {
  // 基本运算
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => (b !== 0 ? a / b : NaN),
  power: (base, exponent) => Math.pow(base, exponent),

  // 高级运算
  factorial: (n) => (n <= 1 ? 1 : n * MathOps.factorial(n - 1)),
  fibonacci: (n) => (n <= 1 ? n : MathOps.fibonacci(n - 1) + MathOps.fibonacci(n - 2)),
  gcd: (a, b) => (b === 0 ? a : MathOps.gcd(b, a % b)),
  lcm: (a, b) => Math.abs(a * b) / MathOps.gcd(a, b),

  // 判断函数
  isEven: (n) => n % 2 === 0,
  isOdd: (n) => n % 2 !== 0,
  isPrime: (n) => {
    if (n < 2) return false
    for (let i = 2; i <= Math.sqrt(n); i++) {
      if (n % i === 0) return false
    }
    return true
  },
  isPerfect: (n) => {
    const divisors = Array.from({ length: n - 1 }, (_, i) => i + 1).filter((i) => n % i === 0)
    return divisors.reduce((sum, d) => sum + d, 0) === n
  },
}

/**
 * 函数组合工具
 */
const compose =
  (...fns) =>
  (value) =>
    fns.reduceRight((acc, fn) => fn(acc), value)
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value)

/**
 * 柯里化数学运算
 */
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return (...nextArgs) => curried(...args, ...nextArgs)
  }
}

// 柯里化的基本运算
const curriedAdd = curry(MathOps.add)
const curriedMultiply = curry(MathOps.multiply)
const curriedPower = curry(MathOps.power)

// 创建专用函数
const addTen = curriedAdd(10)
const double = curriedMultiply(2)
const square = curriedPower(2)
const cube = (x) => curriedPower(x)(3)

/**
 * 数组数学运算（高阶函数）
 */
const ArrayMath = {
  // 求和
  sum: (arr) => arr.reduce(MathOps.add, 0),

  // 求积
  product: (arr) => arr.reduce(MathOps.multiply, 1),

  // 平均值
  mean: (arr) => (arr.length > 0 ? ArrayMath.sum(arr) / arr.length : 0),

  // 中位数
  median: (arr) => {
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
  },

  // 众数
  mode: (arr) => {
    const frequency = arr.reduce((freq, num) => {
      freq[num] = (freq[num] || 0) + 1
      return freq
    }, {})

    const maxFreq = Math.max(...Object.values(frequency))
    return Object.keys(frequency)
      .filter((key) => frequency[key] === maxFreq)
      .map(Number)
  },

  // 方差
  variance: (arr) => {
    const mean = ArrayMath.mean(arr)
    const squaredDiffs = arr.map((x) => Math.pow(x - mean, 2))
    return ArrayMath.mean(squaredDiffs)
  },

  // 标准差
  standardDeviation: (arr) => Math.sqrt(ArrayMath.variance(arr)),

  // 范围
  range: (arr) => Math.max(...arr) - Math.min(...arr),

  // 四分位数
  quartiles: (arr) => {
    const sorted = [...arr].sort((a, b) => a - b)
    const q1Index = Math.floor(sorted.length * 0.25)
    const q3Index = Math.floor(sorted.length * 0.75)

    return {
      q1: sorted[q1Index],
      q2: ArrayMath.median(sorted), // 中位数
      q3: sorted[q3Index],
    }
  },
}

/**
 * 矩阵运算（函数式风格）
 */
const Matrix = {
  // 创建矩阵
  create: (rows, cols, fillValue = 0) =>
    Array.from({ length: rows }, () => Array(cols).fill(fillValue)),

  // 创建单位矩阵
  identity: (size) =>
    Matrix.create(size, size).map((row, i) => row.map((_, j) => (i === j ? 1 : 0))),

  // 矩阵加法
  add: (matrixA, matrixB) => matrixA.map((row, i) => row.map((val, j) => val + matrixB[i][j])),

  // 矩阵乘法
  multiply: (matrixA, matrixB) => {
    const rowsA = matrixA.length
    const colsA = matrixA[0].length
    const colsB = matrixB[0].length

    return Array.from({ length: rowsA }, (_, i) =>
      Array.from({ length: colsB }, (_, j) =>
        Array.from({ length: colsA }, (_, k) => matrixA[i][k] * matrixB[k][j]).reduce(
          MathOps.add,
          0
        )
      )
    )
  },

  // 矩阵转置
  transpose: (matrix) => matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex])),

  // 矩阵行列式（2x2）
  determinant2x2: (matrix) => matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0],

  // 打印矩阵
  print: (matrix) => {
    matrix.forEach((row) => {
      console.log(row.map((val) => val.toFixed(2).padStart(8)).join(' '))
    })
  },
}

/**
 * 几何计算（纯函数）
 */
const Geometry = {
  // 点的距离
  distance: (point1, point2) =>
    Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)),

  // 圆的面积
  circleArea: (radius) => Math.PI * Math.pow(radius, 2),

  // 圆的周长
  circlePerimeter: (radius) => 2 * Math.PI * radius,

  // 矩形面积
  rectangleArea: (width, height) => width * height,

  // 三角形面积（海伦公式）
  triangleArea: (a, b, c) => {
    const s = (a + b + c) / 2 // 半周长
    return Math.sqrt(s * (s - a) * (s - b) * (s - c))
  },

  // 角度转弧度
  degToRad: (degrees) => (degrees * Math.PI) / 180,

  // 弧度转角度
  radToDeg: (radians) => (radians * 180) / Math.PI,
}

/**
 * 数学序列生成器（函数式风格）
 */
const Sequences = {
  // 等差数列
  arithmetic: (start, diff, length) => Array.from({ length }, (_, i) => start + i * diff),

  // 等比数列
  geometric: (start, ratio, length) => Array.from({ length }, (_, i) => start * Math.pow(ratio, i)),

  // 斐波那契数列
  fibonacci: (length) => {
    if (length <= 0) return []
    if (length === 1) return [0]
    if (length === 2) return [0, 1]

    const result = [0, 1]
    for (let i = 2; i < length; i++) {
      result[i] = result[i - 1] + result[i - 2]
    }
    return result
  },

  // 质数序列
  primes: (limit) => Array.from({ length: limit }, (_, i) => i + 1).filter(MathOps.isPrime),

  // 完全数序列
  perfectNumbers: (limit) =>
    Array.from({ length: limit }, (_, i) => i + 1).filter(MathOps.isPerfect),
}

/**
 * 统计分析工具
 */
const Statistics = {
  // 描述性统计
  describe: (data) => ({
    count: data.length,
    sum: ArrayMath.sum(data),
    mean: ArrayMath.mean(data),
    median: ArrayMath.median(data),
    mode: ArrayMath.mode(data),
    variance: ArrayMath.variance(data),
    standardDeviation: ArrayMath.standardDeviation(data),
    min: Math.min(...data),
    max: Math.max(...data),
    range: ArrayMath.range(data),
    quartiles: ArrayMath.quartiles(data),
  }),

  // 相关系数
  correlation: (x, y) => {
    const n = x.length
    const meanX = ArrayMath.mean(x)
    const meanY = ArrayMath.mean(y)

    const numerator = x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0)

    const denomX = Math.sqrt(x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0))

    const denomY = Math.sqrt(y.reduce((sum, yi) => sum + Math.pow(yi - meanY, 2), 0))

    return numerator / (denomX * denomY)
  },

  // 线性回归
  linearRegression: (x, y) => {
    const n = x.length
    const meanX = ArrayMath.mean(x)
    const meanY = ArrayMath.mean(y)

    const slope =
      x.reduce((sum, xi, i) => sum + (xi - meanX) * (y[i] - meanY), 0) /
      x.reduce((sum, xi) => sum + Math.pow(xi - meanX, 2), 0)

    const intercept = meanY - slope * meanX

    return {
      slope,
      intercept,
      predict: (xValue) => slope * xValue + intercept,
    }
  },
}

// 使用示例
console.log('=== 函数式编程：数学运算系统 ===')

// 基础数学运算
console.log('\n🔢 基础数学运算：')
console.log('5 + 3 =', MathOps.add(5, 3))
console.log('10! =', MathOps.factorial(10))
console.log('fibonacci(10) =', MathOps.fibonacci(10))
console.log('gcd(48, 18) =', MathOps.gcd(48, 18))
console.log('17 是质数吗？', MathOps.isPrime(17))
console.log('28 是完全数吗？', MathOps.isPerfect(28))

// 柯里化示例
console.log('\n🍛 柯里化数学运算：')
const numbers = [1, 2, 3, 4, 5]
console.log('原数组:', numbers)
console.log('每个数加10:', numbers.map(addTen))
console.log('每个数乘2:', numbers.map(double))
console.log('每个数平方:', numbers.map(square))
console.log('每个数立方:', numbers.map(cube))

// 函数组合示例
console.log('\n🔗 函数组合示例：')
const processNumber = pipe(
  addTen, // 加10
  double, // 乘2
  square // 平方
)

console.log('处理数字5 (加10->乘2->平方):', processNumber(5))

// 数组数学运算
console.log('\n📊 数组数学运算：')
const testData = [2, 4, 4, 4, 5, 5, 7, 9]
console.log('测试数据:', testData)
console.log('求和:', ArrayMath.sum(testData))
console.log('平均值:', ArrayMath.mean(testData).toFixed(2))
console.log('中位数:', ArrayMath.median(testData))
console.log('众数:', ArrayMath.mode(testData))
console.log('标准差:', ArrayMath.standardDeviation(testData).toFixed(2))
console.log('四分位数:', ArrayMath.quartiles(testData))

// 矩阵运算
console.log('\n🔢 矩阵运算：')
const matrixA = [
  [1, 2],
  [3, 4],
]
const matrixB = [
  [5, 6],
  [7, 8],
]

console.log('矩阵 A:')
Matrix.print(matrixA)
console.log('矩阵 B:')
Matrix.print(matrixB)

console.log('A + B:')
Matrix.print(Matrix.add(matrixA, matrixB))

console.log('A × B:')
Matrix.print(Matrix.multiply(matrixA, matrixB))

console.log('A 的转置:')
Matrix.print(Matrix.transpose(matrixA))

console.log('A 的行列式:', Matrix.determinant2x2(matrixA))

// 几何计算
console.log('\n📐 几何计算：')
const point1 = { x: 0, y: 0 }
const point2 = { x: 3, y: 4 }
console.log('两点距离:', Geometry.distance(point1, point2))
console.log('半径为5的圆面积:', Geometry.circleArea(5).toFixed(2))
console.log('边长为3,4,5的三角形面积:', Geometry.triangleArea(3, 4, 5))

// 数学序列
console.log('\n🔢 数学序列：')
console.log('等差数列(首项2,公差3,长度5):', Sequences.arithmetic(2, 3, 5))
console.log('等比数列(首项1,公比2,长度6):', Sequences.geometric(1, 2, 6))
console.log('斐波那契数列(前10项):', Sequences.fibonacci(10))
console.log('前20个质数:', Sequences.primes(20))
console.log('前1000个完全数:', Sequences.perfectNumbers(1000))

// 统计分析
console.log('\n📈 统计分析：')
const sampleData = [12, 15, 18, 20, 22, 25, 28, 30, 32, 35]
console.log('样本数据:', sampleData)
const stats = Statistics.describe(sampleData)
console.log('描述性统计:')
Object.entries(stats).forEach(([key, value]) => {
  if (typeof value === 'number') {
    console.log(`  ${key}: ${value.toFixed(2)}`)
  } else {
    console.log(`  ${key}:`, value)
  }
})

// 相关性分析
const x = [1, 2, 3, 4, 5]
const y = [2, 4, 6, 8, 10]
console.log('\n📊 相关性分析：')
console.log('X:', x)
console.log('Y:', y)
console.log('相关系数:', Statistics.correlation(x, y).toFixed(4))

const regression = Statistics.linearRegression(x, y)
console.log('线性回归:')
console.log(`  斜率: ${regression.slope.toFixed(4)}`)
console.log(`  截距: ${regression.intercept.toFixed(4)}`)
console.log(`  预测 x=6 时 y =`, regression.predict(6))

console.log('\n💡 函数式数学编程特点：')
console.log('- 纯函数：数学运算天然无副作用')
console.log('- 组合性：复杂运算由简单函数组合而成')
console.log('- 可预测：相同输入总是产生相同输出')
console.log('- 易测试：每个函数都可以独立测试')
console.log('- 可复用：基础函数可以在多个场景中使用')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MathOps,
    ArrayMath,
    Matrix,
    Geometry,
    Sequences,
    Statistics,
    compose,
    pipe,
    curry,
  }
}
