export default class EventEmitter {
  _events: any = {}

  on(evt: string, callback: (...args: any) => void) {
    if (!this._events[evt]) {
      this._events[evt] = []
    }
    this._events[evt].push(callback)
    return this
  }

  emit(evt: string, ...args: any) {
    if (!this._events[evt]) {
      return
    }

    this._events[evt].forEach((callback: () => void) => {
      callback.apply(this, args)
    })
  }

  off(evt?: string, callback?: (...args: any) => void) {
    if (!evt) {
      // evt 为空全部清除
      this._events = {}
    } else {
      if (!callback) {
        // evt 存在，callback 为空，清除事件所有方法
        delete this._events[evt]
      } else {
        // evt 存在，callback 存在，清除匹配的
        const events = this._events[evt] || []
        let length_1 = events.length
        for (let i = 0; i < length_1; i++) {
          if (events[i] === callback) {
            events.splice(i, 1)
            length_1--
            i--
          }
        }
        if (events.length === 0) {
          delete this._events[evt]
        }
      }
    }
    return this
  }

  getEvent() {
    return this._events
  }
}
