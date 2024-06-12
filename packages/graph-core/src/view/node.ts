import { INode } from '../types'
import Element from './element'
import Graph from '../controller/graph'
import Port from './port'
export default class Node extends Element {
  node!: INode
  ports!: Port[]

  constructor(node: INode, graph: Graph) {
    super()
    this.node = node
    this.set('graph', graph)
    this.draw()
    this.drawPort()
    this.initHook()
  }

  draw() {
    this.drawDom()
    const div = this.get('div')

    const foreignObject = this.createDom('foreignObject', {
      width: `${this.node.width}`,
      height: `${this.node.height}`,
      'graph-type': 'node',
      'graph-id': `${this.node.id}`
    })

    const nodeWrapper = this.createDom('g', {
      transform: `translate(${this.node.x}, ${this.node.y})`
    })
    const g = this.createDom('g')

    foreignObject.appendChild(div)
    nodeWrapper.appendChild(foreignObject)
    g.appendChild(nodeWrapper)

    this.set('nodeWrapper', nodeWrapper)
    this.set('g', g)
    this.set('foreignObject', foreignObject)
    this.set('el', g)
  }

  drawDom() {
    const htmlFunction = this.node.cfg.html
    let div: HTMLElement = document.createElement('div')
    // TODO: vue 渲染
    if (htmlFunction) {
      const content = htmlFunction(this.node)
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

  drawPort() {
    const ports: Port[] = []
    this.node.ports.forEach(item => {
      ports.push(new Port(item, this, this.graph))
    })
    this.ports = ports
  }

  initHook() {
    this.addEvent('node:moving', this.updateTransform)
    this.addEvent('node:moved', this.updateTransform)
    this.addEvent('layout', this.transform)
    this.addEvent('datachange', this.transform)
    this.addEvent('node:change:selected', this.updateSelect)
    this.addEvent('brushing', this.updateSelect)
  }

  updateTransform(moveNode: INode) {
    if (moveNode.id === this.node.id) {
      this.node = moveNode
      this.transform()
    }
  }

  transform() {
    const nodeWrapper = this.get('nodeWrapper')
    nodeWrapper.setAttribute(
      'transform',
      `translate(${this.node.x}, ${this.node.y})`
    )
    this.ports.forEach(item => {
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
