import { mutableHandlers, readonlyHandlers, shallowReadonlyHandlers } from "./baseHanlders"

export const enum ReactiveFlags {
  IS_READONLY = '_v_isReadonly',
  IS_REACTIVE = '_v_isReactive'
}

export function reactive(row) {
  return createReactiveObject(row, mutableHandlers)
}

export function readonly(row) {
  return createReactiveObject(row, readonlyHandlers)
}

export function shallowReadonly(row) {
  return createReactiveObject(row, shallowReadonlyHandlers)
}

function createReactiveObject(row, baseHandles) {
  return new Proxy(row, baseHandles)
}

export function isReadonly(row) {
  return !!row[ReactiveFlags.IS_READONLY]
}

export function isReactive(row) {
  return !!row[ReactiveFlags.IS_REACTIVE]
}

export function isProxy(row) {
  return isReadonly(row) || isReactive(row)
}


