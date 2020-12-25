import Base from './base'
import Slot from './slot'
import { uniqueId } from '../util/utils'
import { INodeModel, ISlot, IEdge, ISlotModel } from '../types'

export default class Node extends Base {
  constructor(model: INodeModel, cfg: { [key: string]: unknown }) {
    super(model)
    if (!this.id) {
      const id = uniqueId('node')
      this.set('id', id)
      this.get('model').id = id
    }

    // TODO: 这部分把一些 graph 的配置传进来，后期希望 item 能不依赖 graph
    this.set('drection', cfg.drection)
    this.set('width', model.width || cfg.width)
    this.set('height', model.height || cfg.height)

    this.set('slots', [])
    // 保存与节点相关的边
    this.set('edges', [])

    if (model.x && model.y) {
      this.setSlotsPoint()
    }
  }

  public get x() {
    return this.model.x as number
  }

  public get y() {
    return this.model.y as number
  }

  public get width(): number {
    return this.get('width')
  }

  public get height(): number {
    return this.get('height')
  }

  public get slots(): ISlot[] {
    return this.get('slots')
  }

  public get edges(): IEdge[] {
    return this.get('edges')
  }

  public addEdge(edge: IEdge) {
    this.get('edges').push(edge)
  }

  public deleteEdge(id: string) {
    const edges = this.edges
    const index = edges.findIndex(item => item.id === id)

    if (index > -1) {
      edges.splice(index, 1)
    }
  }

  public updatePosition(x: number, y: number) {
    // 记录移动距离
    const moveX = x - this.x
    const moveY = y - this.y
    // 节点位置更新
    this.model.x = x
    this.model.y = y
    // slot 位置更新
    this.slots.forEach(slot => {
      slot.set('x', slot.x + moveX)
      slot.set('y', slot.y + moveY)
    })
  }

  public setSlotsPoint() {
    const model = this.model
    const width = this.get('width')
    const height = this.get('height')

    this.set('slots', [])
    let inSlots: ISlotModel[] = []
    let outSlots: ISlotModel[] = []
    if (Array.isArray(model.slots)) {
      model.slots.forEach(item => {
        if (item.type && item.type === 'out') {
          outSlots.push(item)
        } else {
          inSlots.push(item)
        }
      })
    } else {
      model.slots = []
      inSlots = [{}]
      outSlots = [{}]
    }

    const inSlotLen = inSlots.length
    const outSlotLen = outSlots.length

    if (this.get('drection') === 'TB') {
      inSlots.forEach((item, index) => {
        const x = Number(model.x) + (width / (inSlotLen + 1)) * (index + 1)
        const y = Number(model.y)
        this.setSlot(item, x, y, 'in')
      })

      outSlots.forEach((item, index) => {
        const x = Number(model.x) + (width / (outSlotLen + 1)) * (index + 1)
        const y = Number(model.y) + height
        this.setSlot(item, x, y, 'out')
      })
    } else {
      inSlots.forEach((item, index) => {
        const x = Number(model.x)
        const y = Number(model.y) + (height / (inSlotLen + 1)) * (index + 1)
        this.setSlot(item, x, y, 'in')
      })

      outSlots.forEach((item, index) => {
        const x = Number(model.x) + width
        const y = Number(model.y) + (height / (outSlotLen + 1)) * (index + 1)
        this.setSlot(item, x, y, 'out')
      })
    }
  }

  private setSlot(item: ISlotModel, x: number, y: number, type: string) {
    const isModelEmpty = !Object.keys(item).length

    const slot = new Slot(item, {
      x,
      y,
      type,
      nodeId: this.id
    })
    this.get('slots').push(slot)

    if (isModelEmpty) {
      slot.model.type = type
      ;(this.model.slots as ISlotModel[]).push(slot.model)
    }
  }
}
