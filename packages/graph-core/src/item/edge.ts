import Base from './base'
import { uniqueId } from '../util/utils'
import Node from '../item/node'

export default class Edge extends Base {
  constructor(model, fromNode, toNode) {
    super(model)
    if (!this.get('id')) {
      this.set('id', uniqueId('edge'))
    }

    this.set('fromNode', fromNode)
    this.set('toNode', toNode)

    this.setPoint()

    // 将边与其对应节点关联
    this.fromNode.addEdge(this)
    this.toNode.addEdge(this)
  }

  public get fromNode(): Node {
    return this.get('fromNode')
  }

  public get toNode(): Node {
    return this.get('toNode')
  }

  public get fromSlot() {
    return this.get('fromSlot')
  }

  public get toSlot() {
    return this.get('toSlot')
  }

  public get fromPoint() {
    return this.get('fromPoint')
  }

  public get toPoint() {
    return this.get('toPoint')
  }

  public setPoint() {
    const model = this.model
    const fromNode = this.fromNode
    const toNode = this.toNode

    fromNode.slots.find(item => {
      if (
        (model.fromSlotId &&
          item.id === model.fromSlotId &&
          item.type === 'out') ||
        (!model.fromNodeId && item.type === 'out')
      ) {
        this.set('fromSlot', item)
        this.set('fromPoint', { x: item.x, y: item.y })
        return true
      }
    })

    toNode.slots.find(item => {
      if (
        (model.toSlotId && item.id === model.toSlotId && item.type === 'in') ||
        (!model.toNodeId && item.type === 'in')
      ) {
        this.set('toSlot', item)
        this.set('toPoint', { x: item.x, y: item.y })
        return true
      }
    })
  }
}
