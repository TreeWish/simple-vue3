import { track, trigger } from "./effect"


export function reactivity(row) {
  return new Proxy(row, {

    // get
    get(target, key) {
      const res =  Reflect.get(target, key)
      // TODO 依赖收集
      track(target, key)

      return res
    },

    // set
    set(target, key, value) {
      const res =  Reflect.set(target, key, value)
      // TODO 触发依赖
      trigger(target, key)

      return res
    }
  })
}