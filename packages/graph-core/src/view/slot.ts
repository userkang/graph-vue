import { ISlot, INode, INodeModel } from '../types'
import Element from './element'
import Graph from '../controller/graph'
import Node from './node'
export default class Slot extends Element {
  slot!: ISlot
  node!: Node

  constructor(slot: ISlot, node: Node, graph: Graph) {
    super()
    this.slot = slot
    this.node = node
    this.set('graph', graph)
    this.draw()
    this.drawStyle()
    this.initHook()
  }

  draw() {
    const circle = this.createDom('circle', {
      class: `graph-slot`,
      'graph-type': 'port',
      'graph-id': this.slot.id,
      r: '4',
      transform: `translate(${this.slot.x}, ${this.slot.y})`
    })

    this.node.get('g').appendChild(circle)

    this.set('el', circle)
    this.set('circle', circle)
  }

  drawStyle() {
    const circle = this.get('circle')

    if (this.slot.type === 'out') {
      circle.classList.add('graph-slot-active')
    }

    const enable = this.slot.hasState('enable')
    const linked = this.slot.hasState('linked')

    if (enable) {
      circle.classList.add('graph-slot-enable')
      circle.setAttribute('r', '6')
    } else {
      circle.classList.remove('graph-slot-enable')
      circle.setAttribute('r', '4')
    }

    if (linked && !enable) {
      circle.classList.add('graph-slot-linked')
    } else {
      circle.classList.remove('graph-slot-linked')
    }
  }

  initHook() {
    this.addEvent('edge:connect', this.drawStyle)
    this.addEvent('datachange', this.drawStyle)
    this.addEvent('edge:added', this.drawStyle)
    this.addEvent('mouseup', this.drawStyle)
  }

  updateTransform() {
    const circle = this.get('circle')
    circle.setAttribute(
      'transform',
      `translate(${this.slot.x}, ${this.slot.y})`
    )
  }
}
