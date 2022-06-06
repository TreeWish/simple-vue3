import { mutableHandlers, readonlyHandlers } from "./baseHanlders"

export function reactive(row) {
  return createReactiveObject(row, mutableHandlers)
}

export function readonly(row) {
  return createReactiveObject(row, readonlyHandlers)
}

function createReactiveObject(row, baseHandles) {
  return new Proxy(row, baseHandles)
}