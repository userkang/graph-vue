import EventEmitter from '../util/event-emitter'
import { BaseCfg, IEdgeModel, INodeModel, IPortModel, States } from '../types'
import { setGlobalId } from '../util/utils'

const defaultCfg = (): Pick<BaseCfg, 'id' | 'model' | 'states'> => ({
  id: '',
  model: {},
  states: {
    selected: false,
    linked: false,
    enable: false,
    locked: false,
    hide: false
  }
})

export default class Base extends EventEmitter {
  private _cfg: BaseCfg = defaultCfg()

  constructor(model: INodeModel | IEdgeModel | IPortModel) {
    super()
    this.set('model', model)
    if (model.id !== undefined) {
      this.set('id', String(model.id))
      // 如果节点保存了之前自动生成的 id，需要累积，解决自动生成 id 重复的问题
      if (/(node|edge|port)\d+/.test(model.id)) {
        setGlobalId(model.id)
      }
    }
  }

  protected get<K extends keyof BaseCfg>(key: K): BaseCfg[K] {
    return this._cfg[key]
  }

  protected set<K extends keyof BaseCfg>(key: K, val: BaseCfg[K]) {
    this._cfg[key] = val
  }

  public get id() {
    return this.get('id')
  }

  public get model(): INodeModel | IEdgeModel | IPortModel {
    return this.get('model')
  }

  public get view() {
    return this.get('view')
  }

  public get zIndex(): number {
    return this.get('zIndex') || 0
  }

  public set zIndex(value: number) {
    this.set('zIndex', value)
  }

  public setZIndex(value: number) {
    if (this.model.zIndex) {
      this.model.zIndex = value
    }
    this.set('zIndex', value)
    this.emit('change', this, 'zIndex')
  }

  public setState<K extends keyof States>(state: K) {
    if (this.hasState(state)) {
      return
    }
    this.getStates()[state] = true
    this.emit('change', this, state)
  }

  public hasState<K extends keyof States>(state: K): States[K] {
    return this.getStates()[state]
  }

  public getStates() {
    return this.get('states')
  }

  public clearState<K extends keyof States>(state: K) {
    if (this.hasState(state)) {
      this.getStates()[state] = false
      this.emit('change', this, state)
    }
  }
}
