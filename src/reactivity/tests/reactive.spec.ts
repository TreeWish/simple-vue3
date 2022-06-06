import { isProxy, isReactive, reactive } from "../reactive"

describe('reactive', () => {
  it('happy path', () => {
    let original = { foo: 1 }
    let observed = reactive(original)

    expect(observed).not.toBe(original)
    expect(observed.foo).toBe(1)
     // isReadonly isReactive 
     expect(isReactive(original)).toBe(false)
     expect(isReactive(observed)).toBe(true)
    // isProxy
     expect(isProxy(observed)).toBe(true)
     
  })

  test("nested reactives", () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }],
    };
    //  nested reactives
    const observed = reactive(original);
    expect(isReactive(observed.nested)).toBe(true);
    expect(isReactive(observed.array)).toBe(true);
    expect(isReactive(observed.array[0])).toBe(true);
  });
})