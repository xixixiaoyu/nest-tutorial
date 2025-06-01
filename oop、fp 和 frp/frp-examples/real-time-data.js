// 函数响应式编程示例：实时数据处理系统
// 展示股票价格、传感器数据、聊天消息等实时数据流的处理

/**
 * 扩展 Observable 类，添加更多操作符
 */
class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe
  }

  subscribe(observer) {
    if (typeof observer === 'function') {
      observer = { next: observer }
    }
    return this._subscribe(observer)
  }

  // 静态方法：创建定时器
  static interval(ms) {
    return new Observable((observer) => {
      let count = 0
      const intervalId = setInterval(() => {
        observer.next(count++)
      }, ms)
      return () => clearInterval(intervalId)
    })
  }

  // 静态方法：从值创建
  static of(...values) {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value))
      if (observer.complete) observer.complete()
    })
  }

  // 静态方法：合并多个流
  static merge(...observables) {
    return new Observable((observer) => {
      const subscriptions = observables.map((obs) =>
        obs.subscribe({
          next: (value) => observer.next(value),
          error: (err) => observer.error && observer.error(err),
        })
      )

      return () => subscriptions.forEach((unsub) => unsub && unsub())
    })
  }

  // 映射操作符
  map(transform) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (value) => observer.next(transform(value)),
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 过滤操作符
  filter(predicate) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (value) => predicate(value) && observer.next(value),
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 扫描操作符（累积）
  scan(accumulator, seed) {
    return new Observable((observer) => {
      let acc = seed
      let hasSeed = seed !== undefined

      return this.subscribe({
        next: (value) => {
          if (!hasSeed) {
            acc = value
            hasSeed = true
          } else {
            acc = accumulator(acc, value)
          }
          observer.next(acc)
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 缓冲操作符
  buffer(size) {
    return new Observable((observer) => {
      let buffer = []

      return this.subscribe({
        next: (value) => {
          buffer.push(value)
          if (buffer.length >= size) {
            observer.next([...buffer])
            buffer = []
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => {
          if (buffer.length > 0) {
            observer.next(buffer)
          }
          observer.complete && observer.complete()
        },
      })
    })
  }

  // 时间窗口操作符
  windowTime(ms) {
    return new Observable((observer) => {
      let window = []

      const emitWindow = () => {
        if (window.length > 0) {
          observer.next([...window])
          window = []
        }
      }

      const intervalId = setInterval(emitWindow, ms)

      const subscription = this.subscribe({
        next: (value) => window.push(value),
        error: (err) => observer.error && observer.error(err),
        complete: () => {
          clearInterval(intervalId)
          emitWindow()
          observer.complete && observer.complete()
        },
      })

      return () => {
        clearInterval(intervalId)
        subscription && subscription()
      }
    })
  }

  // 节流操作符
  throttleTime(ms) {
    return new Observable((observer) => {
      let lastEmitTime = 0

      return this.subscribe({
        next: (value) => {
          const now = Date.now()
          if (now - lastEmitTime >= ms) {
            lastEmitTime = now
            observer.next(value)
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 去重操作符
  distinctUntilChanged(keySelector) {
    return new Observable((observer) => {
      let lastValue
      let hasValue = false

      return this.subscribe({
        next: (value) => {
          const key = keySelector ? keySelector(value) : value
          const lastKey = keySelector ? keySelector(lastValue) : lastValue

          if (!hasValue || key !== lastKey) {
            hasValue = true
            lastValue = value
            observer.next(value)
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 取前 n 个值
  take(count) {
    return new Observable((observer) => {
      let taken = 0

      const subscription = this.subscribe({
        next: (value) => {
          if (taken < count) {
            observer.next(value)
            taken++
            if (taken === count && observer.complete) {
              observer.complete()
            }
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })

      return subscription
    })
  }
}

/**
 * 股票价格数据流模拟器
 */
class StockPriceSimulator {
  constructor() {
    this.stocks = {
      AAPL: { price: 150.0, volatility: 0.02 },
      GOOGL: { price: 2800.0, volatility: 0.025 },
      TSLA: { price: 800.0, volatility: 0.04 },
      MSFT: { price: 300.0, volatility: 0.015 },
      AMZN: { price: 3200.0, volatility: 0.03 },
    }
  }

  // 创建股票价格流
  createPriceStream(symbol, intervalMs = 1000) {
    return Observable.interval(intervalMs)
      .map(() => {
        const stock = this.stocks[symbol]
        if (!stock) return null

        // 模拟价格波动
        const change = (Math.random() - 0.5) * 2 * stock.volatility
        stock.price = Math.max(0.01, stock.price * (1 + change))

        return {
          symbol,
          price: Math.round(stock.price * 100) / 100,
          timestamp: new Date(),
          change: Math.round(change * 10000) / 100, // 百分比变化
        }
      })
      .filter((data) => data !== null)
  }

  // 创建所有股票的合并流
  createAllStocksStream(intervalMs = 1000) {
    const streams = Object.keys(this.stocks).map((symbol) =>
      this.createPriceStream(symbol, intervalMs)
    )
    return Observable.merge(...streams)
  }
}

/**
 * 传感器数据模拟器
 */
class SensorSimulator {
  constructor() {
    this.sensors = {
      temperature: { value: 25, min: 15, max: 35, noise: 0.5 },
      humidity: { value: 60, min: 30, max: 90, noise: 2 },
      pressure: { value: 1013, min: 980, max: 1050, noise: 1 },
      light: { value: 500, min: 0, max: 1000, noise: 10 },
    }
  }

  // 创建传感器数据流
  createSensorStream(sensorType, intervalMs = 500) {
    return Observable.interval(intervalMs)
      .map(() => {
        const sensor = this.sensors[sensorType]
        if (!sensor) return null

        // 模拟传感器读数
        const noise = (Math.random() - 0.5) * sensor.noise
        let newValue = sensor.value + noise

        // 保持在合理范围内
        newValue = Math.max(sensor.min, Math.min(sensor.max, newValue))
        sensor.value = newValue

        return {
          sensorType,
          value: Math.round(newValue * 100) / 100,
          timestamp: new Date(),
          unit: this.getUnit(sensorType),
        }
      })
      .filter((data) => data !== null)
  }

  getUnit(sensorType) {
    const units = {
      temperature: '°C',
      humidity: '%',
      pressure: 'hPa',
      light: 'lux',
    }
    return units[sensorType] || ''
  }

  // 创建所有传感器的合并流
  createAllSensorsStream(intervalMs = 500) {
    const streams = Object.keys(this.sensors).map((type) =>
      this.createSensorStream(type, intervalMs)
    )
    return Observable.merge(...streams)
  }
}

/**
 * 聊天消息模拟器
 */
class ChatSimulator {
  constructor() {
    this.users = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']
    this.messages = [
      '大家好！',
      '今天天气不错',
      '有人在吗？',
      '我刚看了一部电影',
      '周末有什么计划？',
      '这个项目进展如何？',
      '谢谢大家的帮助',
      '晚安！',
      '早上好',
      '午餐时间到了',
    ]
  }

  // 创建聊天消息流
  createMessageStream(intervalMs = 2000) {
    return Observable.interval(intervalMs).map(() => {
      const user = this.users[Math.floor(Math.random() * this.users.length)]
      const message = this.messages[Math.floor(Math.random() * this.messages.length)]

      return {
        id: Date.now() + Math.random(),
        user,
        message,
        timestamp: new Date(),
        type: Math.random() > 0.9 ? 'system' : 'user',
      }
    })
  }
}

/**
 * 实时数据分析器
 */
class RealTimeAnalyzer {
  constructor() {
    this.stats = {
      count: 0,
      sum: 0,
      min: Infinity,
      max: -Infinity,
      average: 0,
    }
  }

  // 创建移动平均线
  createMovingAverage(stream, windowSize) {
    return stream.buffer(windowSize).map((values) => {
      const sum = values.reduce((acc, val) => acc + val, 0)
      return sum / values.length
    })
  }

  // 创建实时统计
  createRealTimeStats(stream, valueExtractor) {
    return stream.map(valueExtractor).scan(
      (stats, value) => ({
        count: stats.count + 1,
        sum: stats.sum + value,
        min: Math.min(stats.min, value),
        max: Math.max(stats.max, value),
        average: (stats.sum + value) / (stats.count + 1),
      }),
      { count: 0, sum: 0, min: Infinity, max: -Infinity, average: 0 }
    )
  }

  // 检测异常值
  createAnomalyDetector(stream, valueExtractor, threshold = 2) {
    let values = []

    return stream
      .map((item) => {
        const value = valueExtractor(item)
        values.push(value)

        // 保持最近100个值
        if (values.length > 100) {
          values.shift()
        }

        if (values.length < 10) return null // 需要足够的数据

        const mean = values.reduce((sum, v) => sum + v, 0) / values.length
        const variance = values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length
        const stdDev = Math.sqrt(variance)

        const zScore = Math.abs(value - mean) / stdDev

        return {
          ...item,
          value,
          mean,
          stdDev,
          zScore,
          isAnomaly: zScore > threshold,
        }
      })
      .filter((result) => result !== null)
  }

  // 创建趋势分析
  createTrendAnalyzer(stream, valueExtractor, windowSize = 10) {
    return stream
      .map(valueExtractor)
      .buffer(windowSize)
      .map((values) => {
        if (values.length < 2) return null

        // 简单线性回归计算趋势
        const n = values.length
        const x = Array.from({ length: n }, (_, i) => i)
        const y = values

        const sumX = x.reduce((sum, val) => sum + val, 0)
        const sumY = y.reduce((sum, val) => sum + val, 0)
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0)
        const sumXX = x.reduce((sum, val) => sum + val * val, 0)

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)

        return {
          values,
          slope,
          trend: slope > 0.1 ? 'up' : slope < -0.1 ? 'down' : 'stable',
          strength: Math.abs(slope),
        }
      })
      .filter((result) => result !== null)
  }
}

/**
 * 实时仪表板
 */
class RealTimeDashboard {
  constructor() {
    this.widgets = new Map()
  }

  // 添加小部件
  addWidget(name, stream, renderer) {
    const subscription = stream.subscribe({
      next: (data) => renderer(data),
      error: (err) => console.error(`Widget ${name} error:`, err),
    })

    this.widgets.set(name, subscription)
  }

  // 移除小部件
  removeWidget(name) {
    const subscription = this.widgets.get(name)
    if (subscription) {
      subscription()
      this.widgets.delete(name)
    }
  }

  // 清理所有小部件
  cleanup() {
    this.widgets.forEach((subscription) => subscription())
    this.widgets.clear()
  }
}

// 使用示例
console.log('=== 函数响应式编程：实时数据处理系统 ===')

// 创建模拟器
const stockSim = new StockPriceSimulator()
const sensorSim = new SensorSimulator()
const chatSim = new ChatSimulator()
const analyzer = new RealTimeAnalyzer()
const dashboard = new RealTimeDashboard()

// 1. 股票价格监控
console.log('\n📈 股票价格实时监控：')
const appleStock = stockSim.createPriceStream('AAPL', 1000)

// 添加股票价格小部件
dashboard.addWidget('apple-price', appleStock.take(5), (data) =>
  console.log(`🍎 AAPL: $${data.price} (${data.change > 0 ? '+' : ''}${data.change}%)`)
)

// 股票价格移动平均线
const applePriceValues = appleStock.map((data) => data.price)
const appleMA = analyzer.createMovingAverage(applePriceValues, 3)

dashboard.addWidget('apple-ma', appleMA.take(3), (ma) =>
  console.log(`📊 AAPL 3期移动平均: $${ma.toFixed(2)}`)
)

// 2. 传感器数据监控
console.log('\n🌡️ 传感器数据实时监控：')
const temperatureStream = sensorSim.createSensorStream('temperature', 800)

// 温度统计
const tempStats = analyzer.createRealTimeStats(temperatureStream, (data) => data.value)

dashboard.addWidget('temp-stats', tempStats.take(5), (stats) =>
  console.log(
    `🌡️ 温度统计: 平均 ${stats.average.toFixed(1)}°C, 范围 ${stats.min.toFixed(
      1
    )}-${stats.max.toFixed(1)}°C`
  )
)

// 温度异常检测
const tempAnomalies = analyzer.createAnomalyDetector(temperatureStream, (data) => data.value, 1.5)

dashboard.addWidget(
  'temp-anomalies',
  tempAnomalies.filter((result) => result.isAnomaly).take(2),
  (anomaly) =>
    console.log(
      `🚨 温度异常: ${anomaly.value.toFixed(1)}°C (Z-score: ${anomaly.zScore.toFixed(2)})`
    )
)

// 3. 多传感器数据聚合
console.log('\n📡 多传感器数据聚合：')
const allSensors = sensorSim.createAllSensorsStream(1200)

// 按时间窗口聚合传感器数据
const sensorWindow = allSensors.windowTime(3000)

dashboard.addWidget('sensor-summary', sensorWindow.take(2), (window) => {
  const summary = window.reduce((acc, data) => {
    acc[data.sensorType] = data.value
    return acc
  }, {})
  console.log('📊 传感器摘要:', summary)
})

// 4. 聊天消息流处理
console.log('\n💬 聊天消息流处理：')
const messageStream = chatSim.createMessageStream(1500)

// 消息统计
const messageStats = messageStream.scan(
  (stats, msg) => ({
    totalMessages: stats.totalMessages + 1,
    userMessages: stats.userMessages + (msg.type === 'user' ? 1 : 0),
    systemMessages: stats.systemMessages + (msg.type === 'system' ? 1 : 0),
    activeUsers: new Set([...stats.activeUsers, msg.user]),
  }),
  {
    totalMessages: 0,
    userMessages: 0,
    systemMessages: 0,
    activeUsers: new Set(),
  }
)

dashboard.addWidget('message-stats', messageStats.take(5), (stats) =>
  console.log(`💬 消息统计: 总计 ${stats.totalMessages}, 活跃用户 ${stats.activeUsers.size}`)
)

// 用户活动监控
const userActivity = messageStream
  .filter((msg) => msg.type === 'user')
  .map((msg) => msg.user)
  .buffer(3)
  .map((users) => {
    const frequency = users.reduce((freq, user) => {
      freq[user] = (freq[user] || 0) + 1
      return freq
    }, {})
    return frequency
  })

dashboard.addWidget('user-activity', userActivity.take(2), (activity) =>
  console.log('👥 用户活动:', activity)
)

// 5. 多数据流合并分析
console.log('\n🔄 多数据流合并分析：')
const combinedStream = Observable.merge(
  stockSim.createPriceStream('TSLA', 2000).map((data) => ({ type: 'stock', data })),
  sensorSim.createSensorStream('humidity', 1800).map((data) => ({ type: 'sensor', data })),
  messageStream.map((data) => ({ type: 'message', data }))
)

// 数据流统计
const streamStats = combinedStream.scan(
  (stats, item) => ({
    ...stats,
    [item.type]: (stats[item.type] || 0) + 1,
    total: stats.total + 1,
  }),
  { total: 0 }
)

dashboard.addWidget('stream-stats', streamStats.throttleTime(2000).take(3), (stats) =>
  console.log('📊 数据流统计:', stats)
)

// 6. 趋势分析
console.log('\n📈 趋势分析：')
const humidityTrend = analyzer.createTrendAnalyzer(
  sensorSim.createSensorStream('humidity', 600),
  (data) => data.value,
  5
)

dashboard.addWidget('humidity-trend', humidityTrend.take(2), (trend) =>
  console.log(`📈 湿度趋势: ${trend.trend} (强度: ${trend.strength.toFixed(3)})`)
)

// 7. 实时警报系统
console.log('\n🚨 实时警报系统：')
const alertStream = Observable.merge(
  // 股票价格警报
  stockSim
    .createPriceStream('TSLA', 1000)
    .filter((data) => Math.abs(data.change) > 3)
    .map((data) => ({
      type: 'price_alert',
      message: `TSLA价格剧烈波动: ${data.change.toFixed(2)}%`,
      severity: 'high',
      timestamp: data.timestamp,
    })),

  // 传感器警报
  sensorSim
    .createSensorStream('temperature', 500)
    .filter((data) => data.value > 30 || data.value < 18)
    .map((data) => ({
      type: 'sensor_alert',
      message: `温度异常: ${data.value.toFixed(1)}°C`,
      severity: data.value > 32 || data.value < 16 ? 'high' : 'medium',
      timestamp: data.timestamp,
    }))
)

dashboard.addWidget('alerts', alertStream.take(3), (alert) =>
  console.log(`🚨 ${alert.severity.toUpperCase()} 警报: ${alert.message}`)
)

// 清理资源
setTimeout(() => {
  console.log('\n🧹 清理实时数据流...')
  dashboard.cleanup()
  console.log('✅ 清理完成')
}, 15000)

console.log('\n💡 实时数据处理 FRP 特性：')
console.log('- 数据流组合：轻松合并多个数据源')
console.log('- 实时分析：即时计算统计信息和趋势')
console.log('- 异常检测：自动识别数据异常')
console.log('- 时间窗口：按时间聚合数据')
console.log('- 响应式警报：基于条件自动触发警报')
console.log('- 资源管理：自动清理订阅，防止内存泄漏')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Observable,
    StockPriceSimulator,
    SensorSimulator,
    ChatSimulator,
    RealTimeAnalyzer,
    RealTimeDashboard,
  }
}
