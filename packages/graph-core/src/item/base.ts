import EventEmitter from '../util/event-emitter'
import { IEdgeModel, INodeModel, ISlotModel } from '../types'
import { setGlobalId } from '../util/utils'

export default class Base extends EventEmitter {
  private _cfg: { [key: string]: unknown } = {
    id: '',
    model: {},
    states: {
      selected: false,
      linked: false,
      enable: false,
      locked: false,
      hide: false,
      skipLayout: false
    }
  }

  constructor(model: INodeModel | IEdgeModel | ISlotModel) {
    super()
    this.set('model', model)
    if (model.id !== undefined) {
      this.set('id', String(model.id))
      // 如果节点保存了之前自动生成的 id，需要累积，解决自动生成 id 重复的问题
      if (/(node|edge|slot)\d+/.test(model.id)) {
        setGlobalId(model.id)
      }
    }
  }

  protected get<T = any>(key: string): T {
    return this._cfg[key] as T
  }

  protected set(key: string, val: unknown) {
    this._cfg[key] = val
  }

  public get id() {
    return this.get('id')
  }

  public get model(): INodeModel | IEdgeModel | ISlotModel {
    return this.get('model')
  }

  public get view() {
    return this.get('view')
  }

  public get states() {
    return this.get('states')
  }

  public setState(state: string) {
    this.getStates()[state] = true
  }

  public hasState(state: string): boolean {
    return this.getStates()[state] || false
  }

  public getStates() {
    return this.get('states')
  }

  public clearState(state: string) {
    if (this.hasState(state)) {
      this.getStates()[state] = false
    }
  }
}
