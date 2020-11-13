import Base from './base'
import { uniqueId } from '../util/utils'

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

  get x() {
    return this.get('x')
  }

  get y() {
    return this.get('y')
  }

  get type() {
    return this.get('type')
  }

  get node() {
    return this.get('node')
  }
}
