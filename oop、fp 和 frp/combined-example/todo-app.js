// 综合示例：待办事项应用
// 展示 OOP、FP 和 FRP 三种编程范式的协同使用

/**
 * 面向对象编程部分：定义核心数据模型和业务逻辑
 */

// 待办事项类（OOP）
class TodoItem {
  constructor(id, title, description = '', priority = 'medium') {
    this.id = id
    this.title = title
    this.description = description
    this.priority = priority // low, medium, high
    this.completed = false
    this.createdAt = new Date()
    this.updatedAt = new Date()
    this.tags = []
  }

  // 封装：提供安全的状态修改方法
  complete() {
    this.completed = true
    this.updatedAt = new Date()
    return this
  }

  uncomplete() {
    this.completed = false
    this.updatedAt = new Date()
    return this
  }

  updateTitle(newTitle) {
    if (newTitle && newTitle.trim()) {
      this.title = newTitle.trim()
      this.updatedAt = new Date()
    }
    return this
  }

  updateDescription(newDescription) {
    this.description = newDescription
    this.updatedAt = new Date()
    return this
  }

  setPriority(priority) {
    const validPriorities = ['low', 'medium', 'high']
    if (validPriorities.includes(priority)) {
      this.priority = priority
      this.updatedAt = new Date()
    }
    return this
  }

  addTag(tag) {
    if (tag && !this.tags.includes(tag)) {
      this.tags.push(tag)
      this.updatedAt = new Date()
    }
    return this
  }

  removeTag(tag) {
    this.tags = this.tags.filter((t) => t !== tag)
    this.updatedAt = new Date()
    return this
  }

  // 获取只读副本
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      priority: this.priority,
      completed: this.completed,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      tags: [...this.tags],
    }
  }
}

// 待办事项管理器类（OOP）
class TodoManager {
  constructor() {
    this.todos = new Map()
    this.nextId = 1
    this.observers = [] // 观察者模式
  }

  // 观察者模式：添加观察者
  addObserver(observer) {
    this.observers.push(observer)
  }

  // 通知观察者
  notifyObservers(event, data) {
    this.observers.forEach((observer) => {
      if (observer.onTodoEvent) {
        observer.onTodoEvent(event, data)
      }
    })
  }

  // 创建待办事项
  createTodo(title, description, priority) {
    const todo = new TodoItem(this.nextId++, title, description, priority)
    this.todos.set(todo.id, todo)
    this.notifyObservers('created', todo.toJSON())
    return todo
  }

  // 获取待办事项
  getTodo(id) {
    return this.todos.get(id)
  }

  // 获取所有待办事项
  getAllTodos() {
    return Array.from(this.todos.values())
  }

  // 更新待办事项
  updateTodo(id, updates) {
    const todo = this.todos.get(id)
    if (!todo) return null

    if (updates.title !== undefined) todo.updateTitle(updates.title)
    if (updates.description !== undefined) todo.updateDescription(updates.description)
    if (updates.priority !== undefined) todo.setPriority(updates.priority)
    if (updates.completed !== undefined) {
      updates.completed ? todo.complete() : todo.uncomplete()
    }

    this.notifyObservers('updated', todo.toJSON())
    return todo
  }

  // 删除待办事项
  deleteTodo(id) {
    const todo = this.todos.get(id)
    if (todo) {
      this.todos.delete(id)
      this.notifyObservers('deleted', todo.toJSON())
      return true
    }
    return false
  }

  // 批量操作
  batchComplete(ids) {
    const completed = []
    ids.forEach((id) => {
      const todo = this.getTodo(id)
      if (todo && !todo.completed) {
        todo.complete()
        completed.push(todo.toJSON())
      }
    })
    this.notifyObservers('batch_completed', completed)
    return completed
  }
}

/**
 * 函数式编程部分：数据处理和分析
 */

// 纯函数：过滤器工厂
const createFilter = (predicate) => (todos) => todos.filter(predicate)

// 纯函数：排序器工厂
const createSorter =
  (keyExtractor, ascending = true) =>
  (todos) => {
    return [...todos].sort((a, b) => {
      const valueA = keyExtractor(a)
      const valueB = keyExtractor(b)

      if (valueA < valueB) return ascending ? -1 : 1
      if (valueA > valueB) return ascending ? 1 : -1
      return 0
    })
  }

// 纯函数：映射器工厂
const createMapper = (transform) => (todos) => todos.map(transform)

// 函数组合工具
const pipe =
  (...functions) =>
  (value) =>
    functions.reduce((acc, fn) => fn(acc), value)

const compose =
  (...functions) =>
  (value) =>
    functions.reduceRight((acc, fn) => fn(acc), value)

// 柯里化工具
const curry = (fn) => {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return (...nextArgs) => curried(...args, ...nextArgs)
  }
}

// 待办事项分析函数（纯函数）
const TodoAnalytics = {
  // 统计信息
  getStats: (todos) => {
    const total = todos.length
    const completed = todos.filter((todo) => todo.completed).length
    const pending = total - completed

    const priorityCount = todos.reduce((acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1
      return acc
    }, {})

    const tagCount = todos.reduce((acc, todo) => {
      todo.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1
      })
      return acc
    }, {})

    return {
      total,
      completed,
      pending,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : 0,
      priorityDistribution: priorityCount,
      popularTags: Object.entries(tagCount)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count })),
    }
  },

  // 生产力分析
  getProductivityMetrics: (todos) => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

    const todayCompleted = todos.filter((todo) => todo.completed && todo.updatedAt >= today).length

    const weekCompleted = todos.filter(
      (todo) => todo.completed && todo.updatedAt >= thisWeek
    ).length

    const avgCompletionTime = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.updatedAt - todo.createdAt)
      .reduce((sum, time, _, arr) => sum + time / arr.length, 0)

    return {
      todayCompleted,
      weekCompleted,
      avgCompletionTimeHours: avgCompletionTime / (1000 * 60 * 60),
    }
  },

  // 获取过期任务
  getOverdueTasks: (todos) => {
    const now = new Date()
    return todos.filter((todo) => !todo.completed && todo.dueDate && new Date(todo.dueDate) < now)
  },
}

// 预定义的过滤器（柯里化）
const filterByStatus = curry((completed, todos) =>
  todos.filter((todo) => todo.completed === completed)
)

const filterByPriority = curry((priority, todos) =>
  todos.filter((todo) => todo.priority === priority)
)

const filterByTag = curry((tag, todos) => todos.filter((todo) => todo.tags.includes(tag)))

// 预定义的排序器
const sortByCreatedDate = createSorter((todo) => todo.createdAt, false)
const sortByPriority = createSorter((todo) => {
  const priorities = { high: 3, medium: 2, low: 1 }
  return priorities[todo.priority]
}, false)
const sortByTitle = createSorter((todo) => todo.title.toLowerCase())

// 数据处理管道
const TodoProcessors = {
  // 获取高优先级未完成任务
  getHighPriorityPending: pipe(filterByStatus(false), filterByPriority('high'), sortByCreatedDate),

  // 获取最近完成的任务
  getRecentlyCompleted: pipe(
    filterByStatus(true),
    createSorter((todo) => todo.updatedAt, false),
    createMapper((todo) => ({
      ...todo,
      completedAgo: Date.now() - todo.updatedAt.getTime(),
    }))
  ),

  // 获取任务摘要
  getTaskSummary: createMapper((todo) => ({
    id: todo.id,
    title: todo.title,
    priority: todo.priority,
    completed: todo.completed,
    tagCount: todo.tags.length,
  })),
}

/**
 * 函数响应式编程部分：事件流和实时更新
 */

// 简化版 Observable（复用之前的实现）
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

  static fromEvent(element, eventType) {
    return new Observable((observer) => {
      const handler = (event) => observer.next(event)
      element.addEventListener(eventType, handler)
      return () => element.removeEventListener(eventType, handler)
    })
  }

  static of(...values) {
    return new Observable((observer) => {
      values.forEach((value) => observer.next(value))
      if (observer.complete) observer.complete()
    })
  }

  map(transform) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (value) => observer.next(transform(value)),
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  filter(predicate) {
    return new Observable((observer) => {
      return this.subscribe({
        next: (value) => predicate(value) && observer.next(value),
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

  debounceTime(ms) {
    return new Observable((observer) => {
      let timeoutId
      return this.subscribe({
        next: (value) => {
          clearTimeout(timeoutId)
          timeoutId = setTimeout(() => observer.next(value), ms)
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }

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
}

// 待办事项应用类（结合三种范式）
class TodoApp {
  constructor() {
    // OOP: 使用类实例管理状态
    this.todoManager = new TodoManager()
    this.currentFilter = 'all'
    this.currentSort = 'created'

    // FRP: 创建事件流
    this.actionStream = new Observable((observer) => {
      this.actionObserver = observer
    })

    // 设置响应式数据流
    this.setupStreams()

    // 添加观察者
    this.todoManager.addObserver(this)
  }

  // 设置响应式数据流
  setupStreams() {
    // 过滤和排序流
    this.filteredTodosStream = this.actionStream
      .filter((action) => ['filter_change', 'sort_change', 'todo_updated'].includes(action.type))
      .map(() => this.getFilteredAndSortedTodos())
      .distinctUntilChanged()

    // 统计信息流
    this.statsStream = this.actionStream
      .filter((action) => ['created', 'updated', 'deleted'].includes(action.type))
      .debounceTime(100) // 防抖，避免频繁计算
      .map(() => TodoAnalytics.getStats(this.todoManager.getAllTodos()))

    // 搜索流
    this.searchStream = this.actionStream
      .filter((action) => action.type === 'search')
      .map((action) => action.query)
      .debounceTime(300)
      .distinctUntilChanged()
      .map((query) => this.searchTodos(query))

    // 订阅流
    this.filteredTodosStream.subscribe((todos) => this.renderTodos(todos))

    this.statsStream.subscribe((stats) => this.renderStats(stats))

    this.searchStream.subscribe((results) => this.renderSearchResults(results))
  }

  // 发送动作到流
  dispatch(action) {
    if (this.actionObserver) {
      this.actionObserver.next(action)
    }
  }

  // TodoManager 观察者接口
  onTodoEvent(event, data) {
    this.dispatch({ type: event, data })
  }

  // FP: 使用函数式编程处理数据
  getFilteredAndSortedTodos() {
    let todos = this.todoManager.getAllTodos()

    // 应用过滤器
    switch (this.currentFilter) {
      case 'completed':
        todos = filterByStatus(true)(todos)
        break
      case 'pending':
        todos = filterByStatus(false)(todos)
        break
      case 'high':
        todos = filterByPriority('high')(todos)
        break
    }

    // 应用排序
    switch (this.currentSort) {
      case 'priority':
        todos = sortByPriority(todos)
        break
      case 'title':
        todos = sortByTitle(todos)
        break
      default:
        todos = sortByCreatedDate(todos)
    }

    return todos
  }

  // FP: 搜索功能
  searchTodos(query) {
    if (!query || query.trim() === '') {
      return []
    }

    const searchTerm = query.toLowerCase()
    return this.todoManager
      .getAllTodos()
      .filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchTerm) ||
          todo.description.toLowerCase().includes(searchTerm) ||
          todo.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      )
  }

  // 应用接口方法
  addTodo(title, description, priority = 'medium') {
    return this.todoManager.createTodo(title, description, priority)
  }

  updateTodo(id, updates) {
    return this.todoManager.updateTodo(id, updates)
  }

  deleteTodo(id) {
    return this.todoManager.deleteTodo(id)
  }

  setFilter(filter) {
    this.currentFilter = filter
    this.dispatch({ type: 'filter_change', filter })
  }

  setSort(sort) {
    this.currentSort = sort
    this.dispatch({ type: 'sort_change', sort })
  }

  search(query) {
    this.dispatch({ type: 'search', query })
  }

  // 渲染方法（在实际应用中会更新 DOM）
  renderTodos(todos) {
    console.log('🎨 渲染待办事项列表:', todos.length, '项')
    todos.forEach((todo) => {
      const status = todo.completed ? '✅' : '⏳'
      const priority = { high: '🔴', medium: '🟡', low: '🟢' }[todo.priority]
      console.log(`  ${status} ${priority} ${todo.title}`)
    })
  }

  renderStats(stats) {
    console.log('📊 统计信息更新:')
    console.log(`  总计: ${stats.total}, 完成: ${stats.completed}, 待办: ${stats.pending}`)
    console.log(`  完成率: ${stats.completionRate}%`)
  }

  renderSearchResults(results) {
    console.log('🔍 搜索结果:', results.length, '项')
    results.forEach((todo) => {
      console.log(`  📝 ${todo.title}`)
    })
  }

  // 获取应用状态快照
  getSnapshot() {
    const todos = this.todoManager.getAllTodos()
    return {
      todos: todos.map((todo) => todo.toJSON()),
      stats: TodoAnalytics.getStats(todos),
      productivity: TodoAnalytics.getProductivityMetrics(todos),
      currentFilter: this.currentFilter,
      currentSort: this.currentSort,
    }
  }
}

// 使用示例
console.log('=== 综合示例：待办事项应用（OOP + FP + FRP）===')

// 创建应用实例
const app = new TodoApp()

// 添加一些测试数据
console.log('\n📝 添加待办事项：')
app.addTodo('学习 JavaScript', '深入理解 JS 核心概念', 'high')
app.addTodo('完成项目文档', '编写 API 文档和用户手册', 'medium')
app.addTodo('代码重构', '优化现有代码结构', 'low')
app.addTodo('准备演示', '为客户演示准备材料', 'high')
app.addTodo('团队会议', '讨论下周工作计划', 'medium')

// 添加标签
const todos = app.todoManager.getAllTodos()
todos[0].addTag('学习').addTag('前端')
todos[1].addTag('文档').addTag('项目')
todos[2].addTag('重构').addTag('代码质量')
todos[3].addTag('演示').addTag('客户')
todos[4].addTag('会议').addTag('团队')

// 完成一些任务
console.log('\n✅ 完成一些任务：')
app.updateTodo(1, { completed: true })
app.updateTodo(3, { completed: true })

// 测试过滤功能
console.log('\n🔍 测试过滤功能：')
app.setFilter('pending')

setTimeout(() => {
  console.log('\n🔍 切换到高优先级过滤：')
  app.setFilter('high')
}, 1000)

setTimeout(() => {
  console.log('\n📊 按优先级排序：')
  app.setSort('priority')
}, 2000)

// 测试搜索功能
setTimeout(() => {
  console.log('\n🔍 搜索功能测试：')
  app.search('项目')
}, 3000)

setTimeout(() => {
  app.search('学习')
}, 3500)

// 展示函数式编程的威力
setTimeout(() => {
  console.log('\n🔧 函数式编程数据处理：')
  const allTodos = app.todoManager.getAllTodos()

  // 使用预定义的处理器
  const highPriorityPending = TodoProcessors.getHighPriorityPending(allTodos)
  console.log(
    '高优先级待办事项:',
    highPriorityPending.map((t) => t.title)
  )

  const recentlyCompleted = TodoProcessors.getRecentlyCompleted(allTodos)
  console.log(
    '最近完成的任务:',
    recentlyCompleted.map((t) => t.title)
  )

  // 使用分析函数
  const stats = TodoAnalytics.getStats(allTodos)
  console.log('详细统计:', stats)
}, 4000)

// 展示应用状态快照
setTimeout(() => {
  console.log('\n📸 应用状态快照：')
  const snapshot = app.getSnapshot()
  console.log('快照数据:', {
    todoCount: snapshot.todos.length,
    completionRate: snapshot.stats.completionRate,
    currentFilter: snapshot.currentFilter,
    currentSort: snapshot.currentSort,
  })
}, 5000)

console.log('\n💡 三种编程范式协同工作的优势：')
console.log('- OOP: 清晰的数据模型和封装，易于维护和扩展')
console.log('- FP: 纯函数处理数据，可预测且易于测试')
console.log('- FRP: 响应式事件流，自动处理状态变化')
console.log('- 结合使用: 各取所长，构建健壮且灵活的应用')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    TodoItem,
    TodoManager,
    TodoAnalytics,
    TodoProcessors,
    TodoApp,
    Observable,
    pipe,
    compose,
    curry,
  }
}
