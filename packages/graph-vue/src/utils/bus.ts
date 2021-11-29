class EventListener {
  handler: {
    [key: string]: {
      cbs: Array<(...params: unknown[]) => unknown>
    }
  } = {}
  on(eventName: string, callback: (...params: unknown[]) => unknown) {
    if (!this.handler.hasOwnProperty(eventName)) {
      this.handler[eventName] = { cbs: [] }
    }
    this.handler[eventName].cbs.push(callback)
  }
  emit(eventName: string, ...params: unknown[]) {
    if (!this.handler.hasOwnProperty(eventName)) {
      return
    }
    const cbs = this.handler[eventName].cbs
    cbs.forEach(cb => cb.apply(null, params))
  }
  off(eventName: string, callback: (...params: unknown[]) => unknown) {
    if (!this.handler.hasOwnProperty(eventName)) {
      return
    }
    const cbs = this.handler[eventName].cbs
    const index = cbs.indexOf(callback)
    if (index === -1) {
      return
    }
    cbs.splice(index, 1)
  }
  offAll(eventName: string) {
    this.handler[eventName] = undefined
  }
  once(eventName: string, callback: (...params: unknown[]) => unknown) {
    const cbs = this.handler[eventName].cbs
    const cb = (...params: unknown[]) => {
      callback.apply(null, params)
      this.off(eventName, cb)
    }
    this.on(eventName, cb)
  }
}

export default new EventListener()
