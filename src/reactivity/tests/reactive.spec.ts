import { isReactive, reactive } from "../reactive"

describe('reactive', () => {
  it('happy path', () => {
    let original = { foo: 1 }
    let observed = reactive(original)

    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
     // isReadonly isReactive 
     expect(isReactive(original)).toBe(false)
     expect(isReactive(observed)).toBe(true)
  })
})