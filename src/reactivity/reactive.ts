import { mutableHandlers, readonlyHandlers } from "./baseHanlders"

export const enum ReactiveFlags {
  IS_READONLY = '_v_isReadonly',
  IS_REACTIVE = 'v_isReactive'
}

export function reactive(row) {
  return createReactiveObject(row, mutableHandlers)
}

export function readonly(row) {
  return createReactiveObject(row, readonlyHandlers)
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
 
