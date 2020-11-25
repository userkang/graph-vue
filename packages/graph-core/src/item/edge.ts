import Base from './base'
import { uniqueId } from '../util/utils'
import Node from '../item/node'
import { IEdgeModel } from '../types'

export default class Edge extends Base {
  constructor(model: IEdgeModel, fromNode: Node, toNode: Node) {
    super(model)
    if (!this.id) {
      const id = uniqueId('edge')
      this.set('id', id)
      this.get('model').id = id
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

  public setPoint() {
    const fromSlotId = String(this.model.fromSlotId)
    const toSlotId = String(this.model.toSlotId)
    const fromNode = this.fromNode
    const toNode = this.toNode

    fromNode.slots.find(item => {
      if (
        (fromSlotId && item.id === fromSlotId && item.type === 'out') ||
        (!this.fromNode.id && item.type === 'out')
      ) {
        item.setState('linked')
        this.set('fromSlot', item)
        return true
      }
    })

    toNode.slots.find(item => {
      if (
        (toSlotId && item.id === toSlotId && item.type === 'in') ||
        (!this.toNode.id && item.type === 'in')
      ) {
        item.setState('linked')
        this.set('toSlot', item)
        return true
      }
    })
  }
}
