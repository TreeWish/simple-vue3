import { track, trigger } from "./effect"

function createGetter(isReadonly = false) {
  return function get(target, key) {
    const res = Reflect.get(target, key)
    // TODO 依赖收集
    if (!isReadonly) {
      track(target, key)
    }

    return res
  }
}

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value)
    // TODO 触发依赖
    trigger(target, key)
    return res
  }
}

export const mutableHandlers = {
  get: createGetter(),
  set: createSetter(),
}

export const readonlyHandlers = {
  get: createGetter(),
  set(target, key, value) {
    console.warn(
      `key :"${String(key)}" set failed, beacuse target is readonly type`,
      target
    )
    return true
  },
}
