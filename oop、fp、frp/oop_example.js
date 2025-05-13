// OOP (Object-Oriented Programming) - 面向对象编程
// oop 的主要思想是把数据和操作这些数据的方法（函数）捆绑在一起，形成一个“对象”。程序就是由一堆这样的对象互相协作来完成任务的。
// 主要特点：
// 封装 (Encapsulation)： 把对象的内部细节藏起来，只对外暴露一些必要的接口（方法）来跟它打交道。
// 继承 (Inheritance)： 子类可以自动拥有父类的属性和方法，并且还能有自己独特的东西。
// 多态 (Polymorphism)：  “同样的行为，不同对象做出来效果不一样”。比如，你对“动物”下达“叫”的指令，狗会“汪汪”，猫会“喵喵”。同一个 makeSound()  方法，不同的动物对象调用，表现不同。
// 封装让代码更安全，也更容易维护，继承则可以代码复用，多态让代码更灵活，扩展性更好。

// 定义一个“动物”类 (父类)
class Animal {
  constructor(name) {
    this.name = name
  }

  speak() {
    console.log(`${this.name} 发出了一些声音`)
  }
}

// 定义一个“狗”类，继承自“动物”
class Dog extends Animal {
  constructor(name, breed) {
    super(name) // 调用父类的 constructor
    this.breed = breed
  }

  speak() {
    // 重写父类的方法 (多态的一种体现)
    console.log(`${this.name} 汪汪叫!`)
  }

  fetch() {
    console.log(`${this.name} 跑去捡球了`)
  }
}

let myDog = new Dog('旺财', '哈士奇')
myDog.speak() // 输出: 旺财 汪汪叫!
myDog.fetch() // 输出: 旺财 跑去捡球了

let genericAnimal = new Animal('某动物')
genericAnimal.speak() // 输出: 某动物 发出了一些声音

console.log(
  '\n// 当你处理的系统比较复杂，有很多实体和它们之间的交互时，OOP 非常有用。比如游戏开发、企业级应用等。它能帮你把复杂问题拆解成一个个小模块（对象），让代码结构更清晰。'
)
