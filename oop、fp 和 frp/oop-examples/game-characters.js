// 面向对象编程示例：游戏角色系统
// 展示抽象类、接口、设计模式等高级OOP概念

/**
 * 游戏角色基类 - 抽象类的概念
 */
class GameCharacter {
  constructor(name, health = 100) {
    if (this.constructor === GameCharacter) {
      throw new Error('GameCharacter 是抽象类，不能直接实例化')
    }
    this.name = name
    this.health = health
    this.maxHealth = health
    this.level = 1
    this.experience = 0
  }

  // 抽象方法：子类必须实现
  attack() {
    throw new Error('attack() 方法必须在子类中实现')
  }

  // 抽象方法：子类必须实现
  useSpecialAbility() {
    throw new Error('useSpecialAbility() 方法必须在子类中实现')
  }

  // 通用方法：所有角色都有的行为
  takeDamage(damage) {
    this.health = Math.max(0, this.health - damage)
    console.log(`${this.name} 受到 ${damage} 点伤害，剩余生命值: ${this.health}`)

    if (this.health === 0) {
      console.log(`💀 ${this.name} 被击败了！`)
    }
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount)
    console.log(`${this.name} 恢复了 ${amount} 点生命值，当前生命值: ${this.health}`)
  }

  gainExperience(exp) {
    this.experience += exp
    console.log(`${this.name} 获得 ${exp} 点经验值`)

    // 升级逻辑
    const expNeeded = this.level * 100
    if (this.experience >= expNeeded) {
      this.levelUp()
    }
  }

  levelUp() {
    this.level++
    this.experience = 0
    this.maxHealth += 20
    this.health = this.maxHealth
    console.log(`🎉 ${this.name} 升级到 ${this.level} 级！生命值上限提升到 ${this.maxHealth}`)
  }

  getStatus() {
    return {
      name: this.name,
      level: this.level,
      health: this.health,
      maxHealth: this.maxHealth,
      experience: this.experience,
      isAlive: this.health > 0,
    }
  }
}

/**
 * 战士类 - 近战角色
 */
class Warrior extends GameCharacter {
  constructor(name) {
    super(name, 120) // 战士有更多生命值
    this.strength = 15
    this.armor = 10
    this.rage = 0
  }

  attack() {
    const damage = this.strength + Math.floor(Math.random() * 10)
    console.log(`⚔️ ${this.name} 挥舞大剑攻击，造成 ${damage} 点伤害！`)
    this.rage = Math.min(100, this.rage + 10)
    return damage
  }

  useSpecialAbility() {
    if (this.rage >= 50) {
      const damage = this.strength * 2
      this.rage = 0
      console.log(`🔥 ${this.name} 使用狂暴攻击，造成 ${damage} 点伤害！`)
      return damage
    } else {
      console.log(`${this.name} 怒气不足，无法使用狂暴攻击`)
      return 0
    }
  }

  defend() {
    console.log(`🛡️ ${this.name} 举起盾牌防御`)
    return this.armor
  }
}

/**
 * 法师类 - 远程魔法角色
 */
class Mage extends GameCharacter {
  constructor(name) {
    super(name, 80) // 法师生命值较低
    this.intelligence = 20
    this.mana = 100
    this.maxMana = 100
  }

  attack() {
    if (this.mana >= 10) {
      const damage = this.intelligence + Math.floor(Math.random() * 15)
      this.mana -= 10
      console.log(`✨ ${this.name} 释放魔法弹，造成 ${damage} 点伤害！剩余法力值: ${this.mana}`)
      return damage
    } else {
      console.log(`${this.name} 法力值不足，只能进行普通攻击`)
      return 5
    }
  }

  useSpecialAbility() {
    if (this.mana >= 30) {
      const damage = this.intelligence * 2.5
      this.mana -= 30
      console.log(`🔥 ${this.name} 释放火球术，造成 ${damage} 点伤害！`)
      return damage
    } else {
      console.log(`${this.name} 法力值不足，无法释放火球术`)
      return 0
    }
  }

  restoreMana(amount = 20) {
    this.mana = Math.min(this.maxMana, this.mana + amount)
    console.log(`💙 ${this.name} 恢复了 ${amount} 点法力值，当前法力值: ${this.mana}`)
  }
}

/**
 * 盗贼类 - 敏捷角色
 */
class Rogue extends GameCharacter {
  constructor(name) {
    super(name, 90)
    this.agility = 18
    this.stealth = false
  }

  attack() {
    let damage = this.agility + Math.floor(Math.random() * 12)

    // 潜行状态下暴击
    if (this.stealth) {
      damage *= 2
      this.stealth = false
      console.log(`🗡️ ${this.name} 从阴影中发起偷袭，造成 ${damage} 点暴击伤害！`)
    } else {
      console.log(`🗡️ ${this.name} 快速攻击，造成 ${damage} 点伤害！`)
    }

    return damage
  }

  useSpecialAbility() {
    this.stealth = true
    console.log(`👤 ${this.name} 进入潜行状态，下次攻击将造成双倍伤害！`)
    return 0
  }

  dodge() {
    const success = Math.random() < 0.3 // 30% 闪避几率
    if (success) {
      console.log(`💨 ${this.name} 敏捷地闪避了攻击！`)
    }
    return success
  }
}

/**
 * 战斗系统类 - 展示策略模式和观察者模式
 */
class BattleSystem {
  constructor() {
    this.observers = [] // 观察者列表
  }

  // 观察者模式：添加观察者
  addObserver(observer) {
    this.observers.push(observer)
  }

  // 通知所有观察者
  notifyObservers(event, data) {
    this.observers.forEach((observer) => {
      if (observer.onBattleEvent) {
        observer.onBattleEvent(event, data)
      }
    })
  }

  // 单次战斗
  fight(attacker, defender) {
    console.log(`\n⚔️ ${attacker.name} VS ${defender.name}`)

    // 攻击者攻击
    let damage = attacker.attack()

    // 如果防御者是盗贼，尝试闪避
    if (defender instanceof Rogue && defender.dodge()) {
      damage = 0
    }
    // 如果防御者是战士，可以减少伤害
    else if (defender instanceof Warrior) {
      const defense = defender.defend()
      damage = Math.max(1, damage - defense)
    }

    if (damage > 0) {
      defender.takeDamage(damage)
    }

    // 通知观察者
    this.notifyObservers('attack', {
      attacker: attacker.name,
      defender: defender.name,
      damage: damage,
    })

    // 获得经验值
    if (defender.health === 0) {
      attacker.gainExperience(50)
      this.notifyObservers('victory', {
        winner: attacker.name,
        loser: defender.name,
      })
    }
  }

  // 回合制战斗
  turnBasedBattle(character1, character2) {
    console.log(`\n🏟️ 回合制战斗开始：${character1.name} VS ${character2.name}`)

    let turn = 1
    while (character1.health > 0 && character2.health > 0) {
      console.log(`\n--- 第 ${turn} 回合 ---`)

      // 角色1攻击
      if (character1.health > 0) {
        this.fight(character1, character2)
      }

      // 角色2反击
      if (character2.health > 0) {
        this.fight(character2, character1)
      }

      turn++

      // 防止无限循环
      if (turn > 10) {
        console.log('战斗时间过长，平局！')
        break
      }
    }

    // 宣布胜利者
    if (character1.health > 0 && character2.health <= 0) {
      console.log(`\n🏆 ${character1.name} 获得胜利！`)
    } else if (character2.health > 0 && character1.health <= 0) {
      console.log(`\n🏆 ${character2.name} 获得胜利！`)
    }
  }
}

/**
 * 战斗记录器 - 观察者模式示例
 */
class BattleLogger {
  constructor() {
    this.battleLog = []
  }

  onBattleEvent(event, data) {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = {
      time: timestamp,
      event: event,
      data: data,
    }

    this.battleLog.push(logEntry)

    if (event === 'attack') {
      console.log(
        `📝 [${timestamp}] ${data.attacker} 对 ${data.defender} 造成 ${data.damage} 点伤害`
      )
    } else if (event === 'victory') {
      console.log(`📝 [${timestamp}] ${data.winner} 击败了 ${data.loser}`)
    }
  }

  getBattleHistory() {
    return this.battleLog
  }
}

// 使用示例
console.log('=== 面向对象编程：游戏角色系统 ===')

// 创建不同类型的角色
const warrior = new Warrior('勇敢的亚瑟')
const mage = new Mage('智慧的梅林')
const rogue = new Rogue('敏捷的罗宾')

console.log('\n👥 角色创建完成：')
console.log(warrior.getStatus())
console.log(mage.getStatus())
console.log(rogue.getStatus())

// 展示各角色的特殊能力
console.log('\n🎯 角色技能展示：')
warrior.attack()
warrior.useSpecialAbility() // 怒气不足
warrior.attack() // 增加怒气
warrior.attack()
warrior.attack()
warrior.attack()
warrior.useSpecialAbility() // 现在可以使用了

console.log('\n✨ 法师技能展示：')
mage.attack()
mage.useSpecialAbility()
mage.restoreMana()

console.log('\n🗡️ 盗贼技能展示：')
rogue.useSpecialAbility() // 进入潜行
rogue.attack() // 潜行攻击

// 创建战斗系统和观察者
const battleSystem = new BattleSystem()
const logger = new BattleLogger()
battleSystem.addObserver(logger)

// 进行战斗
console.log('\n⚔️ 战斗演示：')
battleSystem.fight(warrior, mage)
battleSystem.fight(rogue, warrior)

// 治疗角色
console.log('\n💚 治疗时间：')
warrior.heal(30)
mage.heal(20)
mage.restoreMana(50)

// 回合制战斗
const newWarrior = new Warrior('新手战士')
const newMage = new Mage('新手法师')
battleSystem.turnBasedBattle(newWarrior, newMage)

// 显示战斗历史
console.log('\n📊 战斗历史：')
const history = logger.getBattleHistory()
history.forEach((entry, index) => {
  console.log(`${index + 1}. [${entry.time}] ${entry.event}:`, entry.data)
})

console.log('\n💡 高级 OOP 特性展示完毕！')
console.log('- 抽象类：GameCharacter 定义了通用接口')
console.log('- 多态：不同角色类型有不同的攻击和技能实现')
console.log('- 观察者模式：BattleLogger 监听战斗事件')
console.log('- 策略模式：不同角色有不同的战斗策略')

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { GameCharacter, Warrior, Mage, Rogue, BattleSystem, BattleLogger }
}
