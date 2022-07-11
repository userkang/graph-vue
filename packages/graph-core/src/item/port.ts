import Base from './base'
import { uniqueId } from '../util/utils'
import { IPortModel } from '../types'

export default class Port extends Base<IPortModel> {
  constructor(model: IPortModel, cfg: { [key: string]: unknown }) {
    super(model)

    if (!this.id) {
      const id = uniqueId('port')
      this.set('id', id)
      this.model.id = this.id
    }

    this.set('nodeId', cfg.nodeId)
    this.set('x', cfg.x)
    this.set('y', cfg.y)
    this.set('type', model.type)
  }

  public get x(): number {
    return this.get('x')
  }

  public get y(): number {
    return this.get('y')
  }

  public get type(): string {
    return this.get('type')
  }

  public get nodeId(): string {
    return this.get('nodeId')
  }

  update(x: number, y: number) {
    this.set('x', x)
    this.set('y', y)
  }
}
