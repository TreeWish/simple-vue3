import { extend } from '../shared/index';
class ReactivityEffect {
  private _fn: any
  public scheduler
  deps = []
  active = true
  onStop?: () => void
  constructor(fn,  scheduler?) {
    this._fn = fn
    this.scheduler = scheduler
  }

  run() {
    // 在初始化调用fn的时候获取到当前effect实例
    activeEffect = this
    return this._fn()
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
  });
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

  // 不调用run 时，activeEffect 为 undifinded
  if (!activeEffect) return

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
  for (const effect of dep) {
    // 传入scheduler情况处理
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

let activeEffect
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
