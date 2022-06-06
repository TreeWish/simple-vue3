import { reactive } from "../reactive"
import { effect, stop } from "../effect"

describe("effect", () => {
  // 基础功能
  it("happy path", () => {
    let user = reactive({
      age: 18,
    })

    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })

    expect(nextAge).toBe(19)

    // update
    user.age++
    expect(nextAge).toBe(20)
  })

  // effec的runner可以获取到fn的返回值
  it("return runner while effec call", () => {
    // effect(fn) => function runner => fn => return res
    let foo = 1
    const runner = effect(() => {
      foo++
      return "foo"
    })

    expect(foo).toBe(2)
    const r = runner()
    expect(foo).toBe(3)
    expect(r).toBe("foo")
  })

  // scheduler
  it('scheduler', () => {
    // 1. 通过effect的第二个options参数，给定了一个 scheduler fn
    // 2. effect初始化执行时会执行fn
    // 3. 当响应式对象发生 set update 时，不会执行fn 而是执行 scheduler
    // 4. 执行 runner 的时候会 执行 fn
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1})
    const runner  = effect(() => {
      dummy = obj.foo
    }, { scheduler })
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // 第一次调用时触发
    obj.foo++
    expect(scheduler).toBeCalledTimes(1)
    // 这时不执行run
    expect(dummy).toBe(1)
    run()
    // 更新
    expect(dummy).toBe(2)

  })

  // stop
  it('stop', () => {
    // 调用stop，effect不发生更新
    // 当调用runner 数据才更新
    let dummy
    const obj = reactive({ foo: 1})
    const runner = effect(() => {
      dummy = obj.foo
    })
    obj.foo = 2
    expect(dummy).toBe(2)
    // 停止effect更新知道 调用runner
    stop(runner)
    obj.foo = 3
    expect(dummy).toBe(2)
    runner()
    expect(dummy).toBe(3)
    
  })

  // onStop
  it('events: onStop', () => {
    // 调用stop，effect不发生更新
    // 当调用runner 数据才更新
    let dummy
    const onStop = jest.fn()
    const obj = reactive({ foo: 1})
    const runner = effect(() => {
      dummy = obj.foo
    }, { onStop })
    obj.foo = 2
    stop(runner)
  
    expect(onStop).toHaveBeenCalled()
    
  })
})
