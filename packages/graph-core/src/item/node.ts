import Base from './base'
import Slot from './slot'
import { uniqueId } from '../util/utils'
import { INodeModel, ISlot, IEdge, ISlotModel, INode } from '../types'
import nodeView from '../view/node'
import Graph from '../controller/graph'

export default class Node extends Base {
  constructor(
    model: INodeModel,
    cfg: { [key: string]: unknown },
    direction: string
  ) {
    super(model)
    if (!this.id) {
      const id = uniqueId('node')
      this.set('id', id)
      this.get('model').id = id
    }

    this.set('cfg', cfg)

    this.set('direction', cfg.direction || direction)
    this.set('width', model.width || cfg.width)
    this.set('height', model.height || cfg.height)
    this.set('zIndex', model.zIndex || 0)
    this.set('parentId', model.parentId && String(model.parentId))

    this.set('slots', [])
    // 保存与节点相关的边
    this.set('edges', [])
    this.set('children', [])

    // 如果没有传坐标，默认为0
    model.x = model.x ? model.x : 0
    model.y = model.y ? model.y : 0

    this.setSlotsPoint()
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get parentId(): string {
    return this.get('parentId')
  }

  public get x(): number {
    return this.model.x
  }

  public get y(): number {
    return this.model.y
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

  public get zIndex(): number {
    return this.get('zIndex')
  }

  public set zIndex(value: number) {
    this.set('zIndex', value)
  }

  public setZIndex(value: number) {
    if (this.model.zIndex) {
      this.model.zIndex = value
    }
    this.set('zIndex', value)
    this.emit('change:zIndex', this)
  }

  public getEdges(): IEdge[] {
    return this.get('edges')
  }

  public getInEdges(): IEdge[] {
    return this.getEdges().filter(edge => edge.toNode.id === this.id)
  }

  public getOutEdges(): IEdge[] {
    return this.getEdges().filter(edge => edge.fromNode.id === this.id)
  }

  public lock() {
    this.setState('locked', true)
  }

  public unlock() {
    this.setState('locaked', false)
  }

  public show() {
    this.clearState('hide')
    this.getEdges().forEach(edge => {
      edge.clearState('hide')
    })
  }

  public hide() {
    this.setState('hide')
    this.getEdges().forEach(edge => {
      edge.setState('hide')
    })
  }

  public addChild(node: INode) {
    this.get('children').push(node)
  }

  public deleteChild(id: string) {
    const childNodes = this.getChildren()
    const index = childNodes.findIndex(item => item.id === id)
    if (index > -1) {
      this.getChildren().splice(index, 1)
    }
  }

  public getChildren(): INode[] {
    return this.get('children')
  }

  public setParent(node: INode) {
    this.set('parent', node)
  }

  public getParent(): INode {
    return this.get('parent')
  }

  public getSourceNodes(): INode[] {
    const nodes: INode[] = []
    this.getInEdges().forEach(edge => {
      nodes.push(edge.fromNode)
    })
    return nodes
  }

  public getTargetNodes() {
    const nodes: INode[] = []
    this.getOutEdges().forEach(edge => {
      nodes.push(edge.toNode)
    })

    return nodes
  }

  public getAllSourceNodes() {
    const nodes: { [key: string | number]: boolean } = { [this.id]: true }
    const tempNodes: INode[] = this.getSourceNodes()

    let i = 0

    while (i < tempNodes.length) {
      const node = tempNodes[i]
      if (nodes[node.id]) {
        break
      }
      nodes[node.id] = true
      tempNodes.push(...tempNodes[i].getSourceNodes())
      i++
    }

    return tempNodes
  }

  public getAllTargetNodes() {
    const nodes: { [key: string | number]: boolean } = { [this.id]: true }
    const tempNodes: INode[] = this.getTargetNodes()

    let i = 0

    while (i < tempNodes.length) {
      const node = tempNodes[i]
      if (nodes[node.id]) {
        break
      }
      nodes[node.id] = true
      tempNodes.push(...tempNodes[i].getTargetNodes())
      i++
    }

    return tempNodes
  }

  public addEdge(edge: IEdge) {
    this.get('edges').push(edge)
  }

  public deleteEdge(id: string) {
    const edges = this.getEdges()
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
      slot.update(slot.x + moveX, slot.y + moveY)
    })
  }

  /**
   * 更新节点数据信息
   * @param model
   */
  public update(model: INodeModel) {
    if (model.x || model.y) {
      const x = model.x ? model.x : this.x
      const y = model.y ? model.y : this.y
      this.updatePosition(x, y)
    }

    Object.assign(this.model, model)

    if (model.width || model.height) {
      this.set('width', this.model.width || this.width)
      this.set('height', this.model.height || this.height)
      this.model.width = this.width
      this.model.height = this.height
    }

    this.updateSlots()

    this.getEdges().forEach(edge => {
      edge.update()
    })

    this.emit('update', this)
  }

  /**
   * 刷新自渲染节点视图
   */
  public refresh() {
    const view = this.get('view')
    view.update(this)

    this.getEdges().forEach(edge => {
      edge.refresh()
    })
  }

  /**
   * 更新节点 slot 位置信息
   */
  public updateSlots() {
    const inSlots: ISlot[] = []
    const outSlots: ISlot[] = []

    this.slots.forEach(item => {
      if (item.type && item.type === 'out') {
        outSlots.push(item)
      } else {
        inSlots.push(item)
      }
    })

    const inSlotLen = inSlots.length
    const outSlotLen = outSlots.length

    const width = this.get('width')
    const height = this.get('height')
    if (this.get('direction') === 'TB') {
      inSlots.forEach((item, index) => {
        const x = this.x + (width / (inSlotLen + 1)) * (index + 1)
        const y = this.y
        item.update(x, y)
      })

      outSlots.forEach((item, index) => {
        const x = this.x + (width / (outSlotLen + 1)) * (index + 1)
        const y = this.y + height
        item.update(x, y)
      })
    } else {
      inSlots.forEach((item, index) => {
        const x = this.x
        const y = this.y + (height / (inSlotLen + 1)) * (index + 1)
        item.update(x, y)
      })

      outSlots.forEach((item, index) => {
        const x = this.x + width
        const y = this.y + (height / (outSlotLen + 1)) * (index + 1)
        item.update(x, y)
      })
    }
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
      // 默认一进一出
      inSlots = [{}]
      outSlots = [{}]
    }

    const inSlotLen = inSlots.length
    const outSlotLen = outSlots.length

    if (this.get('direction') === 'TB') {
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
    const slot = new Slot(item, {
      x,
      y,
      type,
      nodeId: this.id
    })
    this.get('slots').push(slot)
  }

  /**
   * 节点自渲染
   * @param graph
   */
  public render(graph: Graph) {
    const view = new nodeView(this, graph)
    this.set('view', view)
    return view
  }
}
