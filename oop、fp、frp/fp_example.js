// FP (Functional Programming) - 函数式编程
// 想象一下数学里的函数，比如 y = f(x) 。
// FP 把程序看作是一系列数学函数的组合。你给函数一个输入，它就给你一个输出。强调的是“纯函数 (Pure Functions)”，避免副作用 (Side Effects) 和共享状态 (Shared State)。
// 主要特点：
// 纯函数 (Pure Functions)： 给它同样的输入，永远得到同样的输出，并且不会改变函数外部的任何东西（没有副作用）。
// 不可变性 (Immutability)： 数据一旦创建，就不能被修改。如果你想改，那就创建一个新的数据副本，在副本上改。
// 函数是一等公民 (First-class Functions)：  函数跟普通变量一样，可以赋值给其他变量，可以作为参数传递给别的函数，也可以作为函数的返回值。
// 高阶函数 (Higher-Order Functions)： 能接收函数作为参数，或者能返回一个函数的函数。常见的 map , filter , reduce  就是高阶函数。
// 纯函数使结果可预测，不可变性减少了意外修改的麻烦，一等公民可以写出更简洁强大的代码，高阶函数则可以抽离通用操作，让代码更精炼。

// 纯函数示例：加法
function add(a, b) {
  return a + b // 同样输入，同样输出，无副作用
}
console.log('纯函数 add(2, 3):', add(2, 3))

// 不可变性示例 (通常配合库或特定写法)
const numbers = [1, 2, 3]
console.log('原始数组 numbers:', numbers)
// 想添加一个元素，不是修改原数组，而是创建一个新数组
const newNumbers = [...numbers, 4] // numbers 还是 [1, 2, 3]
console.log('新数组 newNumbers:', newNumbers)
console.log('原数组 numbers (未改变):', numbers)

// 高阶函数示例：map
const names = ['Alice', 'Bob', 'Charlie']
console.log('原始名称数组 names:', names)
const greetings = names.map((name) => `Hello, ${name}!`)
// greetings 会是: ['Hello, Alice!', 'Hello, Bob!', 'Hello, Charlie!']
// map 接收了一个箭头函数作为参数
console.log('使用 map 后的问候数组 greetings:', greetings)

console.log(
  '\n// 当你需要处理数据转换、并发程序，或者希望代码更简洁、可预测、易于测试时，FP 是个好选择。'
)
console.log('// 很多现代前端框架（如 React）和数据处理库都大量借鉴了 FP 的思想。')
