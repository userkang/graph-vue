import { INode, INodeModel } from '../types'
import Element from './element'
import Graph from '../controller/graph'
export default class Node extends Element {
  node!: INode

  constructor(node: INode, graph: Graph) {
    super()
    this.node = node
    this.set('graph', graph)
    this.draw()
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

    this.set('foreignObject', foreignObject)
    this.set('div', div)
  }

  // drawSlot() {}

  initHook() {
    this.addEvent('dragingnode', this.updateTransform)
    this.addEvent('nodeselectchange', this.updateSelect)
  }

  updateTransform(moveNode: INode[]) {
    const node = moveNode.find(item => item.id === this.node.id)
    if (node) {
      this.node = node
      const foreignObject = this.get('foreignObject')
      foreignObject.setAttribute(
        'transform',
        `translate(${this.node.x}, ${this.node.y})`
      )
    }
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

// <g>
//     <foreignObject
//       :transform="`translate(${node.x}, ${node.y})`"
//       :width="node.width"
//       :height="node.height"
//       data-type="node"
//       :data-id="node.id"
//     >
//       <div
//         class="graph-node"
//         :style="{
//           'border-color': isNodeSelected ? '#606BE1' : '#DEDFEC',
//           background: isNodeSelected
//             ? 'rgba(185,200,245,0.9)'
//             : 'rgba(252,252,251,0.9)'
//         }"
//       >
//         {{ node.model.nodeName }}
//       </div>
//     </foreignObject>
//     <LinkSlot v-for="slot in node.slots" :key="slot.id" :item="slot" />
//   </g>
