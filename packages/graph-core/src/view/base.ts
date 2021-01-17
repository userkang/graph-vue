export default class Base {
  public _cfg: { [key: string]: unknown } = {}
  public eventQueue = []

  public get id() {
    return this.get('id')
  }

  public get graph() {
    return this.get('graph')
  }

  public get<T = any>(key: string): T {
    return this._cfg[key] as T
  }

  public set(key: string, val: unknown) {
    this._cfg[key] = val
  }

  addEvent(type: string, callback: (...args: any[]) => void) {
    const bindFunc = callback.bind(this)
    this.eventQueue.push({ type, bindFunc })
    this.graph.on(type, bindFunc)
  }

  destory() {
    this.eventQueue.forEach(item => {
      this.graph.off(item.type, item.bindFunc)
    })
  }
}
