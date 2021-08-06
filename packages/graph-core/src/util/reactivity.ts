type baseType = string | number | boolean | undefined | null | symbol
type getter = () => any
interface CallbackMap {
  [key: string]: Array<() => void>
}

let computedCallback: null | (() => void) = null

export const computed = (getterFunc: getter) => {
  let lastValue
  const onUpdate = () => {
    lastValue = getterFunc()
  }
  computedCallback = onUpdate
  onUpdate()
  computedCallback = null
  return {
    get value() {
      return lastValue
    }
  }
}

const computedMap = new WeakMap<object, CallbackMap>()

const tracker = (target: object, k) => {
  if (!computedCallback) {
    return
  }
  const key = String(k)
  const callbackMap: CallbackMap = computedMap.get(target) || {}
  callbackMap[key] = callbackMap[key] || []
  callbackMap[key].push(computedCallback)
  computedMap.set(target, callbackMap)
}

const trigger = (target: object, k) => {
  const key = String(k)
  if (!(key in target)) {
    return
  }
  const callbackMap: CallbackMap | null = computedMap.get(target)
  if (!callbackMap || !Array.isArray(callbackMap[key])) {
    return
  }
  callbackMap[key].forEach(callback => {
    if (typeof callback === 'function') {
      callback()
    }
  })
}

export const ref = (value: baseType) => {
  const obj = { value }
  const proxy = new Proxy(obj, {
    get(target, key) {
      const res = Reflect.get(target, key)
      tracker(target, key)
      return res
    },
    set(target, key, val) {
      const res = Reflect.set(target, key, val)
      trigger(target, key)
      return res
    }
  })
  return proxy
}

const reactiveMap = new WeakMap<object, object>()

export const reactive = <T extends object>(obj: T): T => {
  const existProxy = reactiveMap.get(obj)
  if (existProxy) {
    return existProxy as T
  }
  const proxy = new Proxy(obj, {
    get(target, key) {
      const res = Reflect.get(target, key)
      tracker([target], key)
      return res instanceof Object ? reactive(res) : res
    },
    set(target, key, val) {
      const res = Reflect.set(target, key, val)
      trigger(target, key)
      return res
    }
  })
  reactiveMap.set(obj, proxy)
  return proxy
}
