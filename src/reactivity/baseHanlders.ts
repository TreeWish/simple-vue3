import { track, trigger } from "./effect"
import { ReactiveFlags } from "./reactive"

function createGetter(isReadonly = false) {
  return function get(target, key) {
    // isReadonly 和 isReactive 逻辑处理
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

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
  get: createGetter(true),
  set(target, key, value) {
    console.warn(
      `key :"${String(key)}" set failed, beacuse target is readonly type`,
      target
    )
    return true
  },
}
