import { INode, INodeModel } from '../types'
import Element from './element'
import Graph from '../controller/graph'
import Slot from './slot'
export default class Node extends Element {
  node!: INode
  slots!: Slot[]

  constructor(node: INode, graph: Graph) {
    super()
    this.node = node
    this.set('graph', graph)
    this.draw()
    this.drawSlot()
    this.initHook()
  }

  draw() {
    const div = this.createDom('div', {
      class: 'graph-node'
    })
    div.innerHTML = this.node.model.nodeName as string
    const foreignObject = this.createDom('foreignObject', {
      transform: `translate(${this.node.x}, ${this.node.y})`,
      width: `${this.node.width}`,
      height: `${this.node.height}`,
      'data-type': 'node',
      'data-id': `${this.node.id}`
    })
    const g = this.createDom('g')

    foreignObject.appendChild(div)
    g.appendChild(foreignObject)

    this.set('g', g)
    this.set('foreignObject', foreignObject)
    this.set('div', div)
  }

  drawSlot() {
    const slots = []
    this.node.slots.forEach(item => {
      slots.push(new Slot(item, this, this.graph))
    })
    this.slots = slots
  }

  initHook() {
    this.addEvent('dragingnode', this.updateTransform)
    this.addEvent('afterdragnode', this.transform)
    this.addEvent('afterlayout', this.transform)
    this.addEvent('nodeselectchange', this.updateSelect)
  }

  updateTransform(moveNode: INode[]) {
    const node = moveNode.find(item => item.id === this.node.id)
    if (node) {
      this.node = node
      this.transform()
    }
  }

  transform() {
    const foreignObject = this.get('foreignObject')
    foreignObject.setAttribute(
      'transform',
      `translate(${this.node.x}, ${this.node.y})`
    )
    this.slots.forEach(item => {
      item.updateTransform()
    })
  }

  updateSelect(selelctNodes: INodeModel[]) {
    const node = selelctNodes.find(item => String(item.id) === this.node.id)
    const div = this.get('div')
    if (node) {
      div.classList.add('graph-node-active')
    } else {
      div.classList.remove('graph-node-active')
    }
  }
}
