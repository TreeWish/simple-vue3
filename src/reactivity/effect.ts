class ReactivityEffect {
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }

  run() {
    // 在初始化调用fn的时候获取到当前effect实例
    activeEffect = this
    this._fn()
  }
}

// 依赖收集
const targetMap = new Map()
export function track(target, key) {
  // target => key => dep
  let depsMap = targetMap.get(target)
  // 初始化depsMap
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  // 存放当前 target[key] 下面所有依赖(保证fn唯一，使用set)
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  // 存放当前effect实例
  dep.add(activeEffect)
}

// 触发依赖
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  // 触发当前key下面的所有依赖
  for (const effct of dep) {
    effct.run()
  }
}

let activeEffect
export function effect(fn) {
  const _effect = new ReactivityEffect(fn)
  //  调用effect 触发run函数
  _effect.run()
}
