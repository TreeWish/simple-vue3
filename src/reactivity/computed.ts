import { ReactivityEffect } from "./effect"
class ComputedRefImpl {
  private _lock: boolean = true
  private _value: any
  private _effect: ReactivityEffect
  constructor(getter) {
    // 利用 effect trigger 来控制
    this._effect = new ReactivityEffect(getter, () => {
      if (!this._lock) {
        this._lock = true
      }
    })
  }

  get value() {
    if (this._lock) {
      this._lock = false
      this._value = this._effect.run()
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}
