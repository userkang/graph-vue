<template>
  <div class="container">
    <GraphVue :action="action" @init="initGraph" :defaultNode="nodeSize">
      <template #node="{ node }">
        <div
          v-if="node.model.type === 'group'"
          class="group-node"
          :class="{ red: node.model.position === 'center' }"
        >
          <div class="group-node-title">
            <div>{{ node.model.label }} {{ node.id }}</div>
          </div>
        </div>
        <div v-else class="normal-node">
          <div class="normal-node-left"></div>
          <div class="normal-node-right">
            <div class="normal-node-label">{{ node.model.label }}</div>
            <div class="normal-node-desc">{{ node.model.desc }}</div>
          </div>
        </div>
      </template>

      <template #edge="{ edge }">
        <path
          :marker-end="'url(#arrow)'"
          class="graph-custom-edge"
          :d="path(edge)"
        >
        </path>
      </template>

      <template #port></template>
      <ToolBox />
    </GraphVue>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import {
  ToolBox,
  MiniMap,
  GraphVue,
  Graph,
  INode
} from '@datafe/graph-vue'
import { nodes, edges } from '@/mock/mindLayout'

import GraphStore from '@/stores/graph'

const groupPadding = 20
const groupPaddingTop = 40

const action = [
  'drag-blank',
  'drag-node',
  'click-select',
  'connect-edge',
  'wheel-zoom',
  'brush-select',
  'wheel-move'
]

const nodeCellMock: any = {
  nodes: nodes,
  edges: edges
  // nodes: [
  //   {
  //     id: '10',
  //     label: 'main',
  //     desc: '节点组1',
  //     type: 'group',
  //     position: 'center'
  //   },
  //   {
  //     id: '1',
  //     label: 'main',
  //     desc: '节点组1',
  //     parentId: '10'
  //   },
  //   {
  //     id: '2',
  //     label: '节点组2',
  //     position: 'left',
  //     parentId: '12'
  //   },
  //   {
  //     id: '12',
  //     type: 'group',
  //     label: '节点组12',
  //     position: 'left'
  //   },
  //   {
  //     id: '3',
  //     label: '节点组3',
  //     position: 'right'
  //   },
  //   {
  //     id: '4',
  //     label: '节点组4',
  //     position: 'right',
  //     parentId: '11'
  //   },
  //   {
  //     id: '11',
  //     label: '节点组11',
  //     type: 'group',
  //     position: 'right'
  //   }
  // ],
  // edges: [
  //   {
  //     fromNodeId: '1',
  //     toNodeId: '2'
  //   },
  //   {
  //     fromNodeId: '1',
  //     toNodeId: '3'
  //   },
  //   {
  //     fromNodeId: '3',
  //     toNodeId: '4'
  //   }
  // ]
}

@Component({
  components: {
    GraphVue,
    ToolBox,
    MiniMap
  }
})
export default class MindLayout extends Vue {
  graph!: Graph
  dataMock = nodeCellMock
  graphState = GraphStore.state
  nodeSize = {
    width: 200,
    height: 56
  }

  get action() {
    return action
  }

  initGraph(graph: Graph) {
    this.graphState.graph = graph
    this.graph = graph

    this.fixPort()
    this.fixEdge()

    this.graph.data(this.dataMock)
    this.mindlayout()

    this.graph.fitView()

    this.initEvent()
  }

  mindlayout() {
    const mainNode = this.graph
      .getNodes()
      .find(item => item.model.position === 'center') as any

    const leftNodes = this.graph
      .getNodes()
      .filter(item => item.model.position === 'left')
    const rightNodes = this.graph
      .getNodes()
      .filter(item => item.model.position === 'right')

    const childNodes = mainNode.getChildren()

    this.graph.layout({
      options: {
        rankdir: 'LR',
        ranksep: 100
      },
      data: {
        nodes: [mainNode, ...childNodes, ...rightNodes],
        edges: []
      }
    })

    const mainInfo = {
      id: mainNode?.id,
      x: mainNode?.x,
      y: mainNode?.y
    }

    const nodes = [] as any
    this.graph.getNodes().forEach(item => {
      if (item.model.position === 'right') {
        nodes.push({
          id: item?.id,
          x: item?.x,
          y: item?.y
        })
      }
    })

    this.graph.layout({
      options: {
        rankdir: 'RL',
        ranksep: 100
      },
      data: {
        nodes: [mainNode, ...childNodes, ...leftNodes],
        edges: []
      }
    })

    const offset = {
      x: mainNode.x - mainInfo.x,
      y: mainNode.y - mainInfo.y
    }

    nodes.forEach(item => {
      const node = this.graph.findNode(item.id)
      node && node.updatePosition(node.x + offset.x, node.y + offset.y)
    })
  }

  fixPort() {
    const mainNode = this.dataMock.nodes.find(
      item => item.position === 'center'
    )

    this.dataMock.nodes = this.dataMock.nodes.map(item => {
      // 位于左侧节点需要将port位置左右交换
      if (item.position === 'left') {
        item.ports = [
          { id: `${item.id}_port_left`, type: 'out', position: 'left' },
          { id: `${item.id}_port_right`, type: 'in', position: 'right' }
        ]
      }
      // 位于左侧节点需要将port位置左右交换
      if (item.position === 'right') {
        item.ports = [
          { id: `${item.id}_port_left`, type: 'in', position: 'left' },
          { id: `${item.id}_port_right`, type: 'out', position: 'right' }
        ]
      }
      // 主节点下子节点需要左右都有输出port
      if (item.parentId === mainNode.id) {
        item.ports = [
          { id: `${item.id}_port_left`, type: 'out', position: 'left' },
          { id: `${item.id}_port_right`, type: 'out', position: 'right' }
        ]
      }

      return item
    })
  }

  fixEdge() {
    const mainNode = this.dataMock.nodes.find(
      item => item.position === 'center'
    )

    const childNodesId = this.dataMock.nodes
      .filter(item => item.parentId === mainNode.id)
      .map(item => item.id)

    this.dataMock.edges = this.dataMock.edges.map(item => {
      if (childNodesId.includes(item.fromNodeId)) {
        const toNode = this.dataMock.nodes.find(
          node => node.id === item.toNodeId
        )
        item.fromPortId = `${item.fromNodeId}_port_${toNode.position}`
      }

      return item
    })
  }

  initEvent() {
    this.graph.on('node:moving', this.handleNodeMoving)
  }

  handleNodeMoving(node: INode) {
    const parent = node.getParent()
    if (parent) {
      this.resizeGroup(parent)
    }
  }

  path(edge) {
    // 直角边
    const { x: x1, y: y1 } = edge.source
    const { x: x2, y: y2 } = edge.target
    const radius = 8

    // const v = (Math.abs(x2 - x1) / 3) * 2
    // const d = v < 20 ? 20 : v
    // const qx1 = x1 + d
    // const qy1 = y1
    // const qx2 = x2 - d
    // const qy2 = y2
    // return `M ${x1} ${y1} C ${qx1} ${qy1} ${qx2} ${qy2} ${x2} ${y2}`

    const xc = (x2 - x1) / 2
    const xRadius = x1 < x2 ? radius : -radius
    const yRadius =
      Math.abs(y2 - y1) < 2 * radius
        ? (y2 - y1) / 2
        : y2 > y1
        ? radius
        : -radius

    return `M ${x1} ${y1}
              L ${x1 + xc - xRadius} ${y1}
              Q ${x1 + xc} ${y1} ${x1 + xc} ${y1 + yRadius}
              L ${x1 + xc} ${y2 - yRadius}
              Q ${x1 + xc} ${y2} ${x1 + xc + xRadius} ${y2}
              L ${x2} ${y2}`
  }

  resizeGroup(node: INode) {
    const children = node.getChildren()
    const bbox = this.graph.getNodesBBox(children)
    node.update({
      width: bbox.width + 2 * groupPadding,
      height: bbox.height + 2 * groupPadding + groupPaddingTop,
      x: bbox.left - groupPadding,
      y: bbox.top - groupPadding - groupPaddingTop
    })
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  background: #f4f5f7;
}
.group-node,
.normal-node {
  width: 100%;
  height: 100%;
}
.normal-node {
  width: 100%;
  height: 100%;
  background: #fff;
  border-radius: 6px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #111925;
  letter-spacing: 0;
  line-height: 22px;
  font-weight: 500;
  box-shadow: 0 2px 6px 0 rgba(17, 25, 37, 0.03);
  display: flex;
  box-sizing: border-box;
  .normal-node-left {
    width: 6px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    height: 100%;
    background: #347bed;
  }
  .normal-node-right {
    padding: 0 15px;
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .normal-node-desc {
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: rgba(17, 25, 37, 0.65);
    line-height: 20px;
    font-weight: 400;
  }
}
.group-node {
  background: rgba(52, 123, 237, 0.1);
  border: 1px solid #347bed;
  border-radius: 10px;
  transition: all 0.2s linear;
  .group-node-title {
    height: 36px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    background: rgba(52, 123, 237, 0.1);
    border-top-left-radius: 9px;
    border-top-right-radius: 9px;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #111925;
    letter-spacing: 0;
    line-height: 22px;
    font-weight: 500;
  }
  .group-node-icon {
    height: 100%;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: -4px -20px 0 0;
    font-size: 20px;
    cursor: pointer;
  }
}
.graph-custom-edge {
  stroke: #999;
  stroke-width: 2px;
  fill: none;
  /* stroke-dasharray: 5;
  animation: dash 20s linear infinite; */
}
.graph-custom-edge:hover {
  stroke: #27ae60;
}
::v-deep .graph-vue-arrow {
  fill: #999;
  stroke: #999;
}
.red {
  background: #2d72d263;
}
</style>
