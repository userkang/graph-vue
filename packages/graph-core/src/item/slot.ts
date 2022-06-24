import Base from './base'
import { uniqueId } from '../util/utils'
import { ISlotModel } from '../types'

export default class Slot extends Base {
  constructor(model: ISlotModel, cfg: { [key: string]: unknown }) {
    super(model)

    if (!this.id) {
      const id = uniqueId('slot')
      this.set('id', id)
      this.get('model').id = id
    }

    this.set('nodeId', cfg.nodeId)
    this.set('x', cfg.x)
    this.set('y', cfg.y)
    this.set('type', cfg.type)
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
