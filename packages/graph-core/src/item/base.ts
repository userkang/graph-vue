import { IEdgeModel, INodeModel, ISlotModel } from '../types'
import { setGlobalId } from '../util/utils'

export default class Base {
  public _cfg: { [key: string]: unknown } = {
    id: '',
    model: {},
    states: []
  }

  constructor(model: INodeModel | IEdgeModel | ISlotModel) {
    this.set('model', model)

    if (model.id !== undefined) {
      this.set('id', String(model.id))
      // 如果节点保存了之前自动生成的 id，需要累积，解决自动生成 id 重复的问题
      if (/(node|edge|slot)\d+/.test(model.id)) {
        setGlobalId(model.id)
      }
    }
  }

  public get id() {
    return this.get('id')
  }

  public get model(): INodeModel | IEdgeModel | ISlotModel {
    return this.get('model')
  }

  public get<T = any>(key: string): T {
    return this._cfg[key] as T
  }

  public set(key: string, val: unknown) {
    this._cfg[key] = val
  }

  public setState(state: string) {
    if (this.hasState(state)) {
      return
    }
    const states = this.get('states')
    states.push(state)
  }

  public hasState(state: string): boolean {
    const states = this.get('states')
    return states.includes(state)
  }

  public getStates() {
    return this.get('states')
  }

  public clearState(state: string) {
    const states = this.get('states')
    if (states.indexOf(state) > -1) {
      states.splice(states.indexOf(state), 1)
    }
  }
}
