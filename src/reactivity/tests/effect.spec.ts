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
}) 