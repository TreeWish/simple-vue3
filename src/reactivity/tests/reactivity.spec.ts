import { reactivity } from "../reactivity"

describe('reactivity', () => {
  it('happy path', () => {
    let original = { foo: 1 }
    let observed = reactivity(original)

    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
  })
})