import Base from './base'
import { uniqueId } from '../util/utils'
import { IDirection, INode, IPort, IPortModel, IPosition } from '../types'
import { BaseCfg, IPortCfg, IRect } from '../types/type'

const PortTypeToPosition = {
  TB: {
    in: 'top',
    out: 'bottom'
  },
  LR: {
    in: 'left',
    out: 'right'
  },
  BT: {
    in: 'bottom',
    out: 'top'
  },
  RL: {
    in: 'right',
    out: 'left'
  }
} as const

export default class Port extends Base<
  IPortModel,
  Required<IPortCfg> & BaseCfg
> {
  static readonly containerMap = new WeakMap<Port, INode>()
  static computePosition(
    rect: IRect,
    position: IPosition,
    indexRatio: number = 0.5
  ) {
    let x = 0
    let y = 0
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
  static computePositions<T extends IPort | IPortModel>(
    items: Array<T>,
    rect: IRect,
    direction: IDirection
  ): { x: number; y: number }[] {
    const sideSizeMap: Record<IPosition, number> = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      center: 0
    }

    const itemSideList: Array<{ position: IPosition; index: number }> =
      items.map((item: T) => {
        const type = item.type as 'in' | 'out' | undefined
        const position =
          item.position ||
          (type && PortTypeToPosition[direction][type]) ||
          'center'
        const res = { position, index: sideSizeMap[position] }
        sideSizeMap[position]++
        return res
      })
    const posList = itemSideList.map(side => {
      const { position, index } = side
      const { x, y } = Port.computePosition(
        rect,
        position,
        (index + 1) / (sideSizeMap[position] + 1)
      )
      return { x, y }
    })
    return posList
  }

  constructor(model: IPortModel, cfg: IPortCfg) {
    super(model)

    if (!this.id) {
      const id = uniqueId('port')
      this.set('id', id)
      this.model.id = this.id
    }

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

  public get nodeId(): string | undefined {
    const container = Port.containerMap.get(this)
    return container?.id
  }

  public get position(): IPosition | undefined {
    return this.get('position')
  }

  update(x: number, y: number) {
    this.set('x', x)
    this.set('y', y)
  }

  setupNode(container: INode) {
    Port.containerMap.set(this, container)
    const onNodeChange = (target: INode, type: string, data?: any) => {
      if (type === 'position') {
        this.update(this.x + data.moveX, this.y + data.moveY)
      }
    }
    const onDeleted = (ids: string[]) => {
      if (ids.includes(this.id)) {
        Port.containerMap.delete(this)
        container.off('change', onNodeChange)
        setTimeout(() => container.off('port:deleted', onDeleted))
      }
    }
    container.on('change', onNodeChange)
    container.on('port:deleted', onDeleted)
  }
}
