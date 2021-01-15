import { INode } from '../types'
import Element from './element'
export default class Node extends Element {
  node!: INode

  constructor(node: INode) {
    super()
    this.node = node
    this.draw()
    this.initHook()
  }

  draw() {
    const div = this.createDom('div', {
      class: 'graph-node'
    })
    // div.innerHTML as HTMLElement = this.node.model.nodeName
    const foreignObject = this.createDom('foreignObject', {
      transform: `translate(${this.node.x}, ${this.node.y})`,
      width: `${this.node.width}`,
      height: `${this.node.height}`,
      dataType: 'node',
      dataId: `${this.node.id}`
    })
    const g = this.createDom('g')

    foreignObject.appendChild(div)
    g.appendChild(foreignObject)
  }

  drawSlot() {

  }

  initHook() {
    console.log(this.graph)
  }

  update() {
    const newEdgePath = this.get('newEdgePath')
    newEdgePath.setAttribute('d', '123123')
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
