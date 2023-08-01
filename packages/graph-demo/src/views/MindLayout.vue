<template>
  <div class="container">
    <GraphVue
      :data="dataMock"
      :action="action"
      :layout="layoutOptions"
      @init="initGraph"
      :defaultNode="nodeSize"
    >
      <template #node="{ node }">
        <div class="normal-node">
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
  INode,
  ILayout
} from '@datafe/graph-vue'

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

const nodeCellMock = {
  nodes: [
    {
      id: '1',
      label: 'main',
      desc: '节点组1',
      ports: [
        { id: '1_port_left', type: 'out', position: 'left' },
        { id: '1_port_right', type: 'out', position: 'right' }
      ]
    },
    {
      id: '2',
      label: '节点组2',
      type: 'left',
      ports: [
        { id: '2_port_left', type: 'out', position: 'left' },
        { id: '2_port_right', type: 'in', position: 'right' }
      ]
    },
    {
      id: '3',
      label: '节点组3',
      type: 'right'
    },
    {
      id: '4',
      label: '节点组4',
      type: 'right'
    }
  ],
  edges: [
    {
      fromPortId: '1_port_left',
      toNodeId: '2'
    },
    {
      fromPortId: '1_port_right',
      toNodeId: '3'
    },
    {
      fromNodeId: '3',
      toNodeId: '4'
    }
  ]
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
  layoutOptions: ILayout = { options: { rankdir: 'LR' } }
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

    const mainNode = this.graph.findNode('1') as any
    const leftNodes = this.graph.findNode('2')
    const rightNodes = this.graph
      .getNodes()
      .filter(item => item.model.type === 'right')

    this.graph.layout({
      options: {
        rankdir: 'LR'
      },
      data: {
        nodes: [mainNode, ...rightNodes],
        edges: [
          {
            fromNodeId: '1',
            toNodeId: '3'
          },
          {
            fromNodeId: '3',
            toNodeId: '4'
          }
        ]
      }
    })
    const mainInfo = {
      id: mainNode?.id,
      x: mainNode?.x,
      y: mainNode?.y
    }
    const nodes = [] as any
    this.graph.getNodes().forEach(item => {
      if (item.model.type === 'right') {
        nodes.push({
          id: item?.id,
          x: item?.x,
          y: item?.y
        })
      }
    })

    this.graph.layout({
      options: {
        rankdir: 'RL'
      },
      data: {
        nodes: [mainNode, leftNodes],
        edges: [
          {
            fromNodeId: '1',
            toNodeId: '2'
          }
        ]
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

    this.graph.fitCenter()

    this.initEvent()
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
    const { x: x1, y: y1 } = edge.fromPort
    const { x: x2, y: y2 } = edge.toPort
    const radius = 8

    const xc = (x2 - x1) / 2
    let xRadius = x1 < x2 ? radius : -radius
    let yRadius =
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
</style>
