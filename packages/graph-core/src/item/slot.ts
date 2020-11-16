import Base from './base'
import { uniqueId } from '../util/utils'
import { INode } from '../types'

export default class Slot extends Base {
  constructor(model: any, cfg: { [key: string]: unknown }) {
    super(model)

    if (!this.get('id')) {
      this.set('id', uniqueId('slot'))
    }

    this.set('node', cfg.node)
    this.set('x', cfg.x)
    this.set('y', cfg.y)
    this.set('type', cfg.type)
  }

  get x(): number {
    return this.get('x')
  }

  get y(): number {
    return this.get('y')
  }

  get type(): string {
    return this.get('type')
  }

  get node(): INode {
    return this.get('node')
  }
}
