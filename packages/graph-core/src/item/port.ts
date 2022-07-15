import Base from './base'
import { uniqueId } from '../util/utils'
import { IPortModel, IPosition } from '../types'
import { BaseCfg, IPortCfg, IRect } from '../types/type'

export default class Port extends Base<
  IPortModel,
  Required<IPortCfg> & BaseCfg
> {
  static computePosition(rect: IRect, position: IPosition, indexRatio: number) {
    let x = 0
    let y = 0
    console.log(position)
    switch (position) {
      case 'left':
        x = rect.x
        y = rect.y + rect.height * indexRatio
        break
      case 'right':
        x = rect.x + rect.width
        y = rect.y + rect.height * indexRatio
        break
      case 'top':
        x = rect.x + rect.width * indexRatio
        y = rect.y
        break
      case 'bottom':
        x = rect.x + rect.width * indexRatio
        y = rect.y + rect.height
        break
      case 'center':
        x = rect.x + rect.width / 2
        y = rect.y + rect.height / 2
        break
    }

    return { x, y }
  }
  constructor(model: IPortModel, cfg: IPortCfg) {
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
