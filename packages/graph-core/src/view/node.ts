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
    this.drawDom()
    const div = this.get('div')

    const foreignObject = this.createDom('foreignObject', {
      transform: `translate(${this.node.x}, ${this.node.y})`,
      width: `${this.node.width}`,
      height: `${this.node.height}`,
      'graph-type': 'node',
      'graph-id': `${this.node.id}`
    })
    const g = this.createDom('g')

    foreignObject.appendChild(div)
    g.appendChild(foreignObject)

    this.set('g', g)
    this.set('foreignObject', foreignObject)
    this.set('el', g)
  }

  drawDom() {
    const htmlFunction = this.node.get('cfg').html
    let div: HTMLElement = document.createElement('div')
    // TODO: vue 渲染
    if (htmlFunction) {
      const content = htmlFunction(this.node)
      debugger
      if (content) {
        if (typeof content === 'string') {
          div.insertAdjacentHTML('afterbegin', content)
          div = div.firstElementChild as HTMLElement
        } else {
          div = content
        }
      }
    } else {
      div.classList.add('graph-node')
      div.innerHTML = this.node.model.label as string
    }

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
    this.addEvent('afterdragnode', this.updateTransform)
    this.addEvent('afterlayout', this.transform)
    this.addEvent('nodeselectchange', this.updateSelect)
    this.addEvent('brushing', this.updateSelect)
  }

  updateTransform(moveNodes: INodeModel[]) {
    const nodeModel = moveNodes.find(item => String(item.id) === this.node.id)

    if (nodeModel) {
      const node = this.graph.findNode(nodeModel.id)
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

  updateSelect() {
    const div = this.get('div')
    if (this.node.hasState('selected')) {
      div.classList.add('graph-node-active')
    } else {
      div.classList.remove('graph-node-active')
    }
  }

  update(node: INode) {
    this.node = node
    this.drawDom()
    const foreignObject = this.get('foreignObject')
    const div = this.get('div')
    foreignObject.setAttribute('width', this.node.width)
    foreignObject.setAttribute('height', this.node.height)
    foreignObject.innerHTML = ''
    foreignObject.appendChild(div)
    this.updateSelect()

    this.transform()
  }
}
