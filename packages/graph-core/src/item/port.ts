import Base from './base'
import { uniqueId } from '../util/utils'
import { IDirection, INode, IPort, IPortModel, IPosition } from '../types'
import { BaseCfg, IPortCfg, IRect } from '../types/type'
import Store from '../controller/store'

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
        x = 0
        y = rect.height * indexRatio
        break
      case 'right':
        x = rect.width
        y = rect.height * indexRatio
        break
      case 'top':
        x = rect.width * indexRatio
        y = 0
        break
      case 'bottom':
        x = rect.width * indexRatio
        y = rect.height
        break
      case 'center':
        x = rect.width / 2
        y = rect.height / 2
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
  $store: Store
  constructor(model: IPortModel, cfg: IPortCfg) {
    super(model)

    if (!this.id) {
      const id = uniqueId('port')
      this.set('id', id)
      this.model.id = this.id
    }
    this.$store = cfg.store
    this.set('offsetX', cfg.x)
    this.set('offsetY', cfg.y)
    this.set('type', model.type)
    this.set('position', model.position)
  }

  public get x(): number {
    const node = Port.containerMap.get(this)
    return this.get('offsetX') + (node?.x || 0)
  }

  public get y(): number {
    const node = Port.containerMap.get(this)
    return this.get('offsetY') + (node?.y || 0)
  }

  public get offsetX(): number {
    return this.get('offsetX')
  }

  public get offsetY(): number {
    return this.get('offsetY')
  }

  public get index(): number {
    return this.get('index')
  }

  public get type(): string {
    return this.get('type')
  }

  public get nodeId(): string | undefined {
    const node = Port.containerMap.get(this)
    return node?.id
  }

  public get position(): IPosition | undefined {
    return this.get('position')
  }

  update(x: number, y: number) {
    this.set('offsetX', x)
    this.set('offsetY', y)
  }

  linkNode(container: INode) {
    Port.containerMap.set(this, container)
  }
  /**
   *  关闭事件 => 删除关联Item => 移出store => 删除视图 => 抛出事件
   */
  remove() {
    Port.containerMap.delete(this)

    this.$store.remove(this.id, Port)

    this.emit('removed', this)

    this.off()
  }
}
