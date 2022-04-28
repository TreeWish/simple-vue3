import { reactivity } from '../reactivity'
import { effect } from '../effect'


describe('effect', () => {
  it('happy path', () => {
    let user = reactivity({
      age: 18
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

  it('return runner while effec call', () => {
    // effect(fn) => function runner => fn => return res
    // effec的runner可以获取到fn的返回值
    let foo = 1
    const runner = effect(() => {
      foo++
      return 'foo'
    })

    expect(foo).toBe(2)
    const r = runner()
    expect(foo).toBe(3)
    expect(r).toBe('foo')

  })
}) 