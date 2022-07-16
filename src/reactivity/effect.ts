import { extend } from "../shared/index"

let activeEffect
let shouldTrack = true
class ReactivityEffect {
  private _fn: any
  public scheduler
  deps = []
  active = true
  onStop?: () => void
  constructor(fn, scheduler?) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    if (!this.active) {
      return this._fn()
    }

    // 依赖收集之后 立刻变为false
    shouldTrack = true
    // 在初始化调用fn的时候获取到当前effect实例

    activeEffect = this

    const result = this._fn()

    shouldTrack = false
    return result
  }
  stop() {
    // 使用active对 stop做优化处理
    if (this.active) {
      clearupEffect(this)
      // onStop事件处理
      if (this.onStop) {
        this.onStop()
      }
      this.active = false
    }
  }
}

// 清理effect
function clearupEffect(effect) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  })
  // deps删除后应该将length置为0
  effect.deps.length = 0
}

// 依赖收集
const targetMap = new Map()
export function track(target, key) {
  // 判断是否要进行依赖收集
  if (!isTracking()) return

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
  trackEffect(dep)
}

// 重构activeEffect处理逻辑，并且用于ref
export function trackEffect(dep) {
  // 优化处理： 当dep中添加过 当前activeEffect， 若存在不做处理
  if (dep.has(activeEffect)) return
  // 存放当前effect实例
  dep.add(activeEffect)
  // 给当前activeEffect存放dep
  activeEffect.deps.push(dep)
}

// 触发依赖
export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  // 触发当前key下面的所有依赖
  triggerEffect(dep)
}

// 重构trigger fn处理逻辑，并且用于ref
export function triggerEffect(dep) {
  // 触发当前key下面的所有依赖
  for (const effect of dep) {
    // 传入scheduler情况处理
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactivityEffect(fn, options.scheduler)
  //  调用effect 触发run函数
  _effect.run()
  // 合并当前两个对象
  extend(_effect, options)
  // effect 存在 this操作，保证调用runner函数this指向不变
  return _effect.run.bind(_effect)
}

export function stop(runner) {
  activeEffect.stop(runner)
}

export function isTracking() {
  // 不调用run 时，activeEffect 为 undifinded
  return shouldTrack && activeEffect !== undefined
}
