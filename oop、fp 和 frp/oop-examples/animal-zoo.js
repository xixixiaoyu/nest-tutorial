// 面向对象编程示例：动物园管理系统
// 展示封装、继承、多态三大核心特性

/**
 * 动物基类 - 展示封装特性
 * 封装：把数据和操作数据的方法包装在一起，隐藏内部实现细节
 */
class Animal {
  // 私有属性（使用 # 表示私有）
  #energy = 100
  #hunger = 0

  constructor(name, species) {
    this.name = name
    this.species = species
    this.age = 0
  }

  // 公共方法：外界可以访问
  speak() {
    console.log(`${this.name} 发出了声音`)
  }

  eat(food) {
    this.#hunger = Math.max(0, this.#hunger - 30)
    this.#energy = Math.min(100, this.#energy + 20)
    console.log(`${this.name} 吃了 ${food}，感觉好多了！`)
  }

  sleep() {
    this.#energy = 100
    console.log(`${this.name} 睡了一觉，精力充沛！`)
  }

  // 获取器方法：安全地访问私有属性
  getStatus() {
    return {
      name: this.name,
      species: this.species,
      energy: this.#energy,
      hunger: this.#hunger,
      age: this.age,
    }
  }

  // 受保护的方法：子类可以重写
  makeSound() {
    return '一些声音'
  }
}

/**
 * 狗类 - 展示继承特性
 * 继承：子类获得父类的属性和方法，同时可以添加自己的特性
 */
class Dog extends Animal {
  constructor(name, breed) {
    super(name, '犬科') // 调用父类构造函数
    this.breed = breed
    this.loyalty = 100
  }

  // 重写父类方法 - 展示多态特性
  speak() {
    console.log(`${this.name} 汪汪叫！`)
  }

  makeSound() {
    return '汪汪汪！'
  }

  // 狗特有的方法
  fetch() {
    console.log(`${this.name} 兴奋地跑去捡球`)
    return this
  }

  wagTail() {
    console.log(`${this.name} 开心地摇尾巴`)
    return this
  }

  // 方法链式调用
  playWith(owner) {
    console.log(`${this.name} 和 ${owner} 一起玩耍`)
    return this.fetch().wagTail()
  }
}

/**
 * 猫类 - 展示继承和多态
 */
class Cat extends Animal {
  constructor(name, breed) {
    super(name, '猫科')
    this.breed = breed
    this.independence = 80
  }

  // 重写父类方法 - 多态的体现
  speak() {
    console.log(`${this.name} 喵喵叫~`)
  }

  makeSound() {
    return '喵喵喵~'
  }

  // 猫特有的方法
  purr() {
    console.log(`${this.name} 满足地呼噜呼噜`)
  }

  climb() {
    console.log(`${this.name} 敏捷地爬上了树`)
  }
}

/**
 * 鸟类 - 展示抽象和接口的概念
 */
class Bird extends Animal {
  constructor(name, species, canFly = true) {
    super(name, species)
    this.canFly = canFly
  }

  speak() {
    console.log(`${this.name} 啁啾鸣叫`)
  }

  makeSound() {
    return '啁啾啁啾'
  }

  fly() {
    if (this.canFly) {
      console.log(`${this.name} 展翅高飞`)
    } else {
      console.log(`${this.name} 不会飞，但可以快速奔跑`)
    }
  }
}

/**
 * 动物园管理类 - 展示组合和聚合
 */
class Zoo {
  constructor(name) {
    this.name = name
    this.animals = []
    this.visitors = 0
  }

  addAnimal(animal) {
    this.animals.push(animal)
    console.log(`欢迎 ${animal.name} 加入 ${this.name}！`)
  }

  // 多态的实际应用：同样的方法调用，不同的动物有不同的行为
  feedingTime() {
    console.log('\n🍽️ 喂食时间到了！')
    this.animals.forEach((animal) => {
      animal.eat('美味的食物')
    })
  }

  // 展示多态：所有动物都会"说话"，但方式不同
  animalConcert() {
    console.log('\n🎵 动物音乐会开始了！')
    this.animals.forEach((animal) => {
      animal.speak() // 多态：同样的方法，不同的实现
    })
  }

  getAnimalSounds() {
    return this.animals.map((animal) => ({
      name: animal.name,
      sound: animal.makeSound(),
    }))
  }

  showStatus() {
    console.log(`\n📊 ${this.name} 状态报告：`)
    console.log(`动物数量: ${this.animals.length}`)
    console.log(`今日访客: ${this.visitors}`)

    this.animals.forEach((animal) => {
      const status = animal.getStatus()
      console.log(
        `${status.name} (${status.species}): 精力 ${status.energy}%, 饥饿度 ${status.hunger}%`
      )
    })
  }
}

// 使用示例
console.log('=== 面向对象编程：动物园管理系统 ===')

// 创建动物园
const happyZoo = new Zoo('快乐动物园')

// 创建不同的动物（展示继承）
const dog = new Dog('旺财', '金毛')
const cat = new Cat('咪咪', '波斯猫')
const parrot = new Bird('彩彩', '鹦鹉')
const penguin = new Bird('胖胖', '企鹅', false)

// 添加动物到动物园
happyZoo.addAnimal(dog)
happyZoo.addAnimal(cat)
happyZoo.addAnimal(parrot)
happyZoo.addAnimal(penguin)

// 展示多态：同样的方法调用，不同的行为
happyZoo.animalConcert()

// 展示封装：通过公共方法安全地操作对象
happyZoo.feedingTime()

// 展示狗的特有行为和方法链
console.log('\n🐕 狗狗特别表演：')
dog.playWith('小明')

// 展示猫的特有行为
console.log('\n🐱 猫咪特别表演：')
cat.purr()
cat.climb()

// 展示鸟类的特有行为
console.log('\n🐦 鸟类特别表演：')
parrot.fly()
penguin.fly()

// 展示动物园状态
happyZoo.visitors = 150
happyZoo.showStatus()

// 获取所有动物的声音（展示多态的数据处理）
console.log('\n🔊 动物声音收集：')
const sounds = happyZoo.getAnimalSounds()
sounds.forEach(({ name, sound }) => {
  console.log(`${name}: ${sound}`)
})

console.log('\n💡 OOP 核心特性展示完毕！')
console.log('- 封装：Animal 类隐藏了内部状态（#energy, #hunger）')
console.log('- 继承：Dog, Cat, Bird 都继承自 Animal')
console.log('- 多态：同样的 speak() 方法，不同动物有不同实现')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Animal, Dog, Cat, Bird, Zoo }
}
