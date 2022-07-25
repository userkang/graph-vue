import { IPort, INode, INodeModel } from '../types'
import Element from './element'
import Graph from '../controller/graph'
import Node from './node'
export default class Port extends Element {
  port!: IPort
  node!: Node

  constructor(port: IPort, node: Node, graph: Graph) {
    super()
    this.port = port
    this.node = node
    this.set('graph', graph)
    this.draw()
    this.drawStyle()
    this.initHook()
  }

  draw() {
    const circle = this.createDom('circle', {
      class: `graph-port`,
      'graph-type': 'port',
      'graph-id': this.port.id,
      r: '4',
      transform: `translate(${this.port.x}, ${this.port.y})`
    })

    this.node.get('g').appendChild(circle)

    this.set('el', circle)
    this.set('circle', circle)
  }

  drawStyle() {
    const circle = this.get('circle')

    if (this.port.type === 'out') {
      circle.classList.add('graph-port-active')
    }

    const enable = this.port.hasState('enable')
    const linked = this.port.hasState('linked')

    if (enable) {
      circle.classList.add('graph-port-enable')
      circle.setAttribute('r', '6')
    } else {
      circle.classList.remove('graph-port-enable')
      circle.setAttribute('r', '4')
    }

    if (linked && !enable) {
      circle.classList.add('graph-port-linked')
    } else {
      circle.classList.remove('graph-port-linked')
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
      `translate(${this.port.x}, ${this.port.y})`
    )
  }
}
