export default class Base {
  public _cfg: { [key: string]: unknown } = {}

  public get id() {
    return this.get('id')
  }

  public get<T = any>(key: string): T {
    return this._cfg[key] as T
  }

  public set(key: string, val: unknown) {
    this._cfg[key] = val
  }
}
