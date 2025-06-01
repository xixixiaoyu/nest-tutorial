// 函数响应式编程示例：搜索系统
// 展示数据流、响应式操作符、异步处理等核心概念

/**
 * 简化版 Observable 实现
 * 用于演示 FRP 核心概念
 */
class Observable {
  constructor(subscribe) {
    this._subscribe = subscribe
  }

  // 订阅观察者
  subscribe(observer) {
    if (typeof observer === 'function') {
      observer = { next: observer }
    }
    return this._subscribe(observer)
  }

  // 静态方法：从事件创建 Observable
  static fromEvent(element, eventType) {
    return new Observable((observer) => {
      const handler = (event) => observer.next(event)
      element.addEventListener(eventType, handler)

      // 返回取消订阅函数
      return () => element.removeEventListener(eventType, handler)
    })
  }

  // 静态方法：从数组创建 Observable
  static from(array) {
    return new Observable((observer) => {
      array.forEach((item) => observer.next(item))
      if (observer.complete) observer.complete()
    })
  }

  // 静态方法：创建定时器 Observable
  static interval(ms) {
    return new Observable((observer) => {
      let count = 0
      const intervalId = setInterval(() => {
        observer.next(count++)
      }, ms)

      return () => clearInterval(intervalId)
    })
  }

  // 静态方法：延迟创建 Observable
  static of(...values) {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value))
      if (observer.complete) observer.complete()
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
        next: (value) => {
          if (predicate(value)) {
            observer.next(value)
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 防抖操作符
  debounceTime(ms) {
    return new Observable((observer) => {
      let timeoutId

      return this.subscribe({
        next: (value) => {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(() => {
            observer.next(value)
          }, ms)
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  // 去重操作符
  distinctUntilChanged() {
    return new Observable((observer) => {
      let lastValue
      let hasValue = false

      return this.subscribe({
        next: (value) => {
          if (!hasValue || value !== lastValue) {
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

  // 切换映射操作符（取消之前的请求）
  switchMap(project) {
    return new Observable((observer) => {
      let innerSubscription

      const outerSubscription = this.subscribe({
        next: (value) => {
          // 取消之前的内部订阅
          if (innerSubscription) {
            innerSubscription()
          }

          // 创建新的内部订阅
          const innerObservable = project(value)
          innerSubscription = innerObservable.subscribe({
            next: (innerValue) => observer.next(innerValue),
            error: (err) => observer.error && observer.error(err),
          })
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })

      // 返回取消订阅函数
      return () => {
        outerSubscription()
        if (innerSubscription) {
          innerSubscription()
        }
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

  // 跳过前 n 个值
  skip(count) {
    return new Observable((observer) => {
      let skipped = 0

      return this.subscribe({
        next: (value) => {
          if (skipped >= count) {
            observer.next(value)
          } else {
            skipped++
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }
}

/**
 * 模拟搜索 API
 */
const SearchAPI = {
  // 模拟数据库
  database: [
    { id: 1, title: 'JavaScript 基础教程', category: '编程', tags: ['js', 'frontend'] },
    { id: 2, title: 'React 开发指南', category: '编程', tags: ['react', 'frontend'] },
    { id: 3, title: 'Node.js 后端开发', category: '编程', tags: ['nodejs', 'backend'] },
    { id: 4, title: 'Python 数据分析', category: '数据科学', tags: ['python', 'data'] },
    { id: 5, title: 'Vue.js 实战项目', category: '编程', tags: ['vue', 'frontend'] },
    { id: 6, title: 'TypeScript 进阶', category: '编程', tags: ['typescript', 'frontend'] },
    { id: 7, title: 'Docker 容器化部署', category: '运维', tags: ['docker', 'devops'] },
    { id: 8, title: 'MySQL 数据库设计', category: '数据库', tags: ['mysql', 'database'] },
    { id: 9, title: 'Redis 缓存优化', category: '数据库', tags: ['redis', 'cache'] },
    { id: 10, title: 'AWS 云服务实践', category: '云计算', tags: ['aws', 'cloud'] },
  ],

  // 模拟搜索请求（异步）
  search(query) {
    return new Observable((observer) => {
      // 模拟网络延迟
      const delay = Math.random() * 500 + 200

      setTimeout(() => {
        try {
          if (!query || query.trim() === '') {
            observer.next([])
            return
          }

          const results = this.database.filter(
            (item) =>
              item.title.toLowerCase().includes(query.toLowerCase()) ||
              item.category.toLowerCase().includes(query.toLowerCase()) ||
              item.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
          )

          console.log(`🔍 搜索 "${query}" 找到 ${results.length} 个结果`)
          observer.next(results)

          if (observer.complete) {
            observer.complete()
          }
        } catch (error) {
          if (observer.error) {
            observer.error(error)
          }
        }
      }, delay)
    })
  },

  // 获取搜索建议
  getSuggestions(query) {
    return new Observable((observer) => {
      setTimeout(() => {
        const suggestions = this.database
          .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
          .map((item) => item.title)
          .slice(0, 5)

        observer.next(suggestions)
        if (observer.complete) observer.complete()
      }, 100)
    })
  },
}

/**
 * 搜索系统类
 */
class SearchSystem {
  constructor() {
    this.searchHistory = []
    this.currentQuery = ''
    this.isLoading = false
    this.results = []
    this.suggestions = []
  }

  // 创建搜索输入流
  createSearchStream(inputElement) {
    return Observable.fromEvent(inputElement, 'input')
      .map((event) => event.target.value)
      .debounceTime(300) // 防抖：300ms 后才执行搜索
      .distinctUntilChanged() // 去重：只有值真正改变才通过
      .filter((query) => query.length >= 2) // 过滤：至少2个字符才搜索
      .switchMap((query) => {
        console.log(`📝 准备搜索: "${query}"`)
        this.currentQuery = query
        this.isLoading = true

        // 添加到搜索历史
        this.addToHistory(query)

        return SearchAPI.search(query)
      })
  }

  // 创建搜索建议流
  createSuggestionStream(inputElement) {
    return Observable.fromEvent(inputElement, 'input')
      .map((event) => event.target.value)
      .debounceTime(150) // 建议的防抖时间更短
      .distinctUntilChanged()
      .filter((query) => query.length >= 1)
      .switchMap((query) => SearchAPI.getSuggestions(query))
  }

  // 创建点击流
  createClickStream(element) {
    return Observable.fromEvent(element, 'click').throttleTime(1000) // 防止重复点击
  }

  // 添加到搜索历史
  addToHistory(query) {
    if (!this.searchHistory.includes(query)) {
      this.searchHistory.unshift(query)
      if (this.searchHistory.length > 10) {
        this.searchHistory.pop()
      }
    }
  }

  // 获取搜索历史流
  getHistoryStream() {
    return Observable.from(this.searchHistory)
  }

  // 实时搜索统计
  createSearchAnalytics() {
    const searchCount$ = Observable.interval(1000)
      .map(() => this.searchHistory.length)
      .distinctUntilChanged()

    const popularQueries$ = Observable.interval(5000).map(() => {
      const frequency = this.searchHistory.reduce((freq, query) => {
        freq[query] = (freq[query] || 0) + 1
        return freq
      }, {})

      return Object.entries(frequency)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([query]) => query)
    })

    return {
      searchCount: searchCount$,
      popularQueries: popularQueries$,
    }
  }
}

/**
 * 搜索结果渲染器
 */
class SearchRenderer {
  constructor(containerId) {
    this.container = document.getElementById(containerId) || {
      innerHTML: '',
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
    }
  }

  renderResults(results) {
    console.log('🎨 渲染搜索结果:', results.length, '个结果')

    if (results.length === 0) {
      this.container.innerHTML = '<div class="no-results">没有找到相关结果</div>'
      return
    }

    const html = results
      .map(
        (item) => `
      <div class="search-result-item">
        <h3>${this.highlightQuery(item.title)}</h3>
        <span class="category">${item.category}</span>
        <div class="tags">
          ${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
      </div>
    `
      )
      .join('')

    this.container.innerHTML = html
  }

  renderSuggestions(suggestions) {
    console.log('💡 渲染搜索建议:', suggestions)
    // 在实际应用中，这里会更新建议列表的 DOM
  }

  renderLoading() {
    this.container.innerHTML = '<div class="loading">搜索中...</div>'
  }

  highlightQuery(text) {
    // 简单的高亮实现
    return text // 在实际应用中会高亮匹配的文本
  }
}

/**
 * 高级搜索功能
 */
class AdvancedSearch {
  constructor() {
    this.filters = {
      category: '',
      tags: [],
      dateRange: null,
    }
  }

  // 创建过滤器流
  createFilterStream(filterElement) {
    return Observable.fromEvent(filterElement, 'change')
      .map((event) => ({
        type: event.target.name,
        value: event.target.value,
      }))
      .filter((filter) => filter.value !== '')
      .map((filter) => {
        this.filters[filter.type] = filter.value
        return this.filters
      })
  }

  // 组合搜索和过滤
  combineSearchAndFilter(searchStream, filterStream) {
    return searchStream.map((results) => this.applyFilters(results)).distinctUntilChanged()
  }

  applyFilters(results) {
    return results.filter((item) => {
      if (this.filters.category && item.category !== this.filters.category) {
        return false
      }

      if (this.filters.tags.length > 0) {
        const hasMatchingTag = this.filters.tags.some((tag) => item.tags.includes(tag))
        if (!hasMatchingTag) return false
      }

      return true
    })
  }
}

// 使用示例
console.log('=== 函数响应式编程：搜索系统 ===')

// 模拟 DOM 元素
const mockInput = {
  value: '',
  addEventListener: (event, handler) => {
    console.log(`📝 监听 ${event} 事件`)
    // 模拟用户输入
    setTimeout(() => {
      mockInput.value = 'javascript'
      handler({ target: mockInput })
    }, 100)

    setTimeout(() => {
      mockInput.value = 'react'
      handler({ target: mockInput })
    }, 1500)

    setTimeout(() => {
      mockInput.value = 'vue'
      handler({ target: mockInput })
    }, 3000)
  },
  removeEventListener: () => {},
}

// 创建搜索系统
const searchSystem = new SearchSystem()
const renderer = new SearchRenderer('search-results')

// 创建搜索流
console.log('\n🔄 创建响应式搜索流...')
const searchStream = searchSystem.createSearchStream(mockInput)

// 订阅搜索结果
const searchSubscription = searchStream.subscribe({
  next: (results) => {
    searchSystem.isLoading = false
    searchSystem.results = results
    renderer.renderResults(results)
  },
  error: (error) => {
    console.error('❌ 搜索出错:', error)
    searchSystem.isLoading = false
  },
})

// 创建搜索建议流
const suggestionStream = searchSystem.createSuggestionStream(mockInput)
const suggestionSubscription = suggestionStream.subscribe({
  next: (suggestions) => {
    searchSystem.suggestions = suggestions
    renderer.renderSuggestions(suggestions)
  },
})

// 演示其他 FRP 操作符
console.log('\n🎯 演示 FRP 操作符：')

// 1. 数字流处理
const numberStream = Observable.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

console.log('\n📊 数字流处理：')
numberStream
  .filter((n) => n % 2 === 0) // 过滤偶数
  .map((n) => n * n) // 平方
  .take(3) // 取前3个
  .subscribe((value) => console.log(`处理结果: ${value}`))

// 2. 定时器流
console.log('\n⏰ 定时器流（前5个值）：')
const timerSubscription = Observable.interval(1000)
  .take(5)
  .map((count) => `定时器: ${count}`)
  .subscribe({
    next: (value) => console.log(value),
    complete: () => console.log('定时器完成'),
  })

// 3. 搜索分析
console.log('\n📈 搜索分析：')
const analytics = searchSystem.createSearchAnalytics()

analytics.searchCount.take(3).subscribe((count) => console.log(`搜索次数: ${count}`))

analytics.popularQueries.take(2).subscribe((queries) => console.log(`热门搜索:`, queries))

// 4. 错误处理示例
console.log('\n❌ 错误处理示例：')
const errorStream = new Observable((observer) => {
  setTimeout(() => observer.next('正常数据'), 100)
  setTimeout(() => observer.error(new Error('模拟错误')), 200)
  setTimeout(() => observer.next('这不会被发送'), 300)
})

errorStream.subscribe({
  next: (value) => console.log(`接收到: ${value}`),
  error: (error) => console.log(`捕获错误: ${error.message}`),
  complete: () => console.log('流完成'),
})

// 5. 流的组合
console.log('\n🔗 流的组合示例：')
const stream1 = Observable.of(1, 2, 3)
const stream2 = Observable.of('a', 'b', 'c')

// 简单的组合示例
stream1
  .switchMap((num) => stream2.map((letter) => `${num}${letter}`))
  .subscribe((value) => console.log(`组合结果: ${value}`))

// 清理资源
setTimeout(() => {
  console.log('\n🧹 清理订阅...')
  if (searchSubscription) searchSubscription()
  if (suggestionSubscription) suggestionSubscription()
  if (timerSubscription) timerSubscription()
}, 8000)

console.log('\n💡 FRP 核心特性展示完毕！')
console.log('- 数据流：将事件和数据看作随时间变化的流')
console.log('- 响应式：数据变化时自动触发相关处理')
console.log('- 函数式操作符：map, filter, debounce 等')
console.log('- 异步处理：优雅处理异步操作和事件')
console.log('- 组合性：可以轻松组合多个数据流')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Observable,
    SearchAPI,
    SearchSystem,
    SearchRenderer,
    AdvancedSearch,
  }
}
