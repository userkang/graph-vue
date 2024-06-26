import EventEmitter from '../util/event-emitter'
import { IEdgeModel, INodeModel, IPortModel } from '../types'
import { setGlobalId } from '../util/utils'
import { BaseCfg } from '../types/type'
import Graph from '../controller/graph'

type States = BaseCfg['states']

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

export default class Base<
  M extends INodeModel | IEdgeModel | IPortModel,
  T extends BaseCfg
> extends EventEmitter {
  private _cfg: T = defaultCfg() as T

  constructor(model: M) {
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

  protected get<K extends keyof T>(key: K): T[K] {
    return this._cfg[key]
  }

  protected set<K extends keyof T>(key: K, val: T[K]) {
    this._cfg[key] = val
  }

  public get id() {
    return this.get('id')
  }

  public get model() {
    return this.get('model')
  }

  public get view() {
    return this.get('view')
  }

  public get zIndex(): number {
    const zIndex = Number(this.get('zIndex'))
    return zIndex || 0
  }

  public set zIndex(value: number) {
    this.set('zIndex', value)
  }

  public setZIndex(
    value: number,
    options: {
      emit: boolean
    } = { emit: true }
  ) {
    if (this.model.zIndex) {
      ;(this.model as any).zIndex = value
    }
    this.set('zIndex', value)
    options.emit && this.emit('change', this, 'zIndex')
  }

  public setState<K extends keyof States>(
    state: K,
    options: {
      emit: boolean
    } = { emit: true }
  ) {
    if (this.hasState(state)) {
      return
    }
    this.getStates()[state] = true
    options.emit && this.emit('change', this, state)
  }

  public hasState<K extends keyof States>(state: K): States[K] {
    return this.getStates()[state]
  }

  public getStates(): States {
    return this.get('states')
  }

  public clearState<K extends keyof States>(state: K) {
    if (this.hasState(state)) {
      this.getStates()[state] = false
      this.emit('change', this, state)
    }
  }
}
