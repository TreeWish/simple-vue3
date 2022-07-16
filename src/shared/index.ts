/*
 * @Description: Show me the flower
 * @Version: 1.0
 * @Author: Wei Yunlong
 * @Date: 2022-05-09 17:15:15
 * @LastEditors: TreeWish
 * @LastEditTime: 2022-07-16 12:13:28
 */
export const extend = Object.assign

export const isObject = val => {
  return val !== null && typeof val === "object"
}

export const hasChanged = (val, newValue) => {
  return !Object.is(val, newValue);
};
