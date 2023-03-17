type K<EventType, Extensible> = Extensible extends true ? string : EventType
export default class EventEmitter<
  EventType extends string = '',
  Extensible extends boolean = true
> {
  private _events: Record<string, Array<() => void>> = {}

  public on(
    evt: K<EventType, Extensible> | K<EventType, Extensible>[],
    callback: (...args: any[]) => void
  ) {
    const bind = (e: string) => {
      if (!this._events[e]) {
        this._events[e] = []
      }
      this._events[e].push(callback)
    }

    if (Array.isArray(evt)) {
      evt.forEach(item => {
        bind(item)
      })
    } else {
      bind(evt)
    }
  }

  public emit(evt: K<EventType, Extensible>, ...args: unknown[]) {
    if (!this._events[evt]) {
      return
    }

    this._events[evt].forEach((callback: (...args: unknown[]) => void) => {
      callback.apply(this, args)
    })
  }

  public off(
    evt?: K<EventType, Extensible>,
    callback?: (...args: any[]) => void
  ) {
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
