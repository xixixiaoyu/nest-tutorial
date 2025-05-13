// FRP (Functional Reactive Programming) - 函数响应式编程
// 这个稍微复杂一点，可以看作是 FP 在处理“随时间变化的数据流”上的应用。
// FRP 把所有东西都看成是“流 (Streams)”。比如用户点击鼠标、键盘输入、网络请求响应等等，这些都是一连串的事件或数据，就像水流一样。你用函数式的方法来处理和响应这些流。
// 主要特点：
// 数据流 (Streams / Observables)：  一系列随时间发生的事件或数据。
// 响应式 (Reactive)： 当流中的数据发生变化时，相关的处理会自动执行。
// 函数式操作符 (Functional Operators)：  提供一堆像 map , filter , merge , debounce  (防抖) 这样的函数式工具，用来组合、转换、过滤这些数据流。

console.log('FRP (Functional Reactive Programming) - 概念示例')
console.log('注意: 这是一个简化的 FRP 概念演示，实际应用通常使用 RxJS 等库。')

// 模拟一个简单的 Observable 实现
class SimpleObservable {
  constructor(subscriberFunc) {
    this._subscriberFunc = subscriberFunc
  }

  subscribe(observer) {
    // observer 可以是一个函数，或者一个包含 next, error, complete 方法的对象
    const observerFn = typeof observer === 'function' ? { next: observer } : observer
    return this._subscriberFunc(observerFn)
  }

  pipe(...operators) {
    return operators.reduce((obs, op) => op(obs), this)
  }
}

// --- 操作符工厂函数 ---
function map(transformFn) {
  return (sourceObservable) => {
    return new SimpleObservable((observer) => {
      return sourceObservable.subscribe({
        next: (value) => observer.next(transformFn(value)),
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }
}

function debounceTime(milliseconds) {
  return (sourceObservable) => {
    return new SimpleObservable((observer) => {
      let timeoutId = null
      let lastValue = undefined
      return sourceObservable.subscribe({
        next: (value) => {
          lastValue = value
          if (timeoutId) {
            clearTimeout(timeoutId)
          }
          timeoutId = setTimeout(() => {
            observer.next(lastValue)
            timeoutId = null
          }, milliseconds)
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => {
          if (timeoutId) clearTimeout(timeoutId)
          if (lastValue !== undefined) observer.next(lastValue) // Emit last value if pending
          observer.complete && observer.complete()
        },
      })
    })
  }
}

function distinctUntilChanged() {
  return (sourceObservable) => {
    return new SimpleObservable((observer) => {
      let previousValue = undefined
      let isFirstValue = true
      return sourceObservable.subscribe({
        next: (value) => {
          if (isFirstValue || value !== previousValue) {
            previousValue = value
            isFirstValue = false
            observer.next(value)
          }
        },
        error: (err) => observer.error && observer.error(err),
        complete: () => observer.complete && observer.complete(),
      })
    })
  }
}

// 模拟 DOM 事件源 (例如输入框)
// 在 Node.js 环境中，我们不能直接操作 DOM，所以我们模拟事件的发生
function createMockInputEventStream() {
  let listeners = []
  const observable = new SimpleObservable((observer) => {
    listeners.push(observer.next.bind(observer))
    // 在真实场景中，这里会有取消订阅的逻辑，比如移除事件监听器
    return () => {
      listeners = listeners.filter((l) => l !== observer.next.bind(observer))
      console.log('Input stream unsubscribed')
    }
  })

  // 模拟用户输入
  function simulateInput(value) {
    console.log(`\nSimulating input: "${value}"`)
    listeners.forEach((listener) => listener({ target: { value } }))
  }

  return { stream: observable, simulateInput }
}

// --- 模拟 API 调用 ---
function searchApi(query) {
  console.log(`API: Searching for "${query}"...`)
  return new SimpleObservable((observer) => {
    // 模拟异步 API 请求
    const timeoutId = setTimeout(() => {
      const results = [`Result for ${query} 1`, `Result for ${query} 2`]
      console.log(`API: Received results for "${query}"`)
      observer.next(results)
      observer.complete && observer.complete()
    }, 500)
    return () => clearTimeout(timeoutId) // Cleanup on unsubscribe
  })
}

// --- 使用示例 ---
console.log('\n--- FRP Example Start ---')
const { stream: inputStream, simulateInput } = createMockInputEventStream()

const subscription = inputStream
  .pipe(
    map((event) => event.target.value), // 1. 从事件对象中提取输入的值
    debounceTime(300), // 2. 防抖：300ms 内没有新输入才让数据通过
    distinctUntilChanged(), // 3. 只有当值真正改变时才通过
    // switchMap 比较复杂，这里简化为直接调用 searchApi
    // 真实的 switchMap 会取消之前的内部 observable
    // 这里我们用 map + subscribe 来模拟，但要注意它不是真正的 switchMap
    map((query) => searchApi(query)) // 4. 用最新的查询值去调用搜索 API (返回 Observable)
  )
  .subscribe((resultObservable) => {
    // 5. 订阅结果流 (这里是 searchApi 返回的 Observable)
    resultObservable.subscribe((results) => {
      console.log('UI: Displaying results:', results)
    })
  })

// 模拟用户输入序列
simulateInput('a')
simulateInput('ap')
simulateInput('app')
setTimeout(() => simulateInput('appl'), 100) // 快速连续输入
setTimeout(() => simulateInput('apple'), 200)

setTimeout(() => {
  simulateInput('banana')
}, 1000) // 稍后输入，触发新的搜索

setTimeout(() => {
  console.log('\n--- FRP Example End ---')
  // 在真实应用中，如果组件销毁，需要取消订阅
  // subscription.unsubscribe(); // 如果 SimpleObservable 的 subscribe 返回了取消函数
}, 2500)

console.log('\n// FRP 非常适合处理复杂的异步场景和用户界面交互。')
console.log('// 它能让你的异步代码更清晰、更易于管理，避免所谓的“回调地狱 (Callback Hell)”。')
