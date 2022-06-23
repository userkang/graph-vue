import { ILayout, INode, INodeModel } from '../types'
import dagre from 'dagre'
import Graph from './graph'
console.log('dagre', dagre)

export default class LayoutController {
  graph: Graph
  dagre: any = null

  constructor(graph: Graph) {
    this.graph = graph
  }

  init(options: ILayout) {
    const rankdir = this.graph.get('direction') || 'TB'

    this.dagre = new dagre.graphlib.Graph()
    this.dagre.setGraph({
      width: 0,
      height: 0,
      rankdir,
      ...options
    })
    this.dagre.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  layout(options: ILayout) {
    this.init(options)

    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()

    nodes.forEach(item => {
      this.dagre.setNode(item.id, {
        label: '',
        width: item.width,
        height: item.height
      })
    })

    edges.forEach(item => {
      this.dagre.setEdge(item.fromNode.id, item.toNode.id)
    })
    dagre.layout(this.dagre)

    const group = this.dagre.graph()
    const svgInfo = this.graph.getSvgInfo()
    const stackNode: INodeModel[] = []

    this.dagre.nodes().forEach((v: string) => {
      nodes.forEach(item => {
        if (item.id === v) {
          const { x, y } = this.dagre.node(v)
          // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
          const posX = x - (item.width + group.width - svgInfo.width) / 2
          const posY = y - (item.height + group.height - svgInfo.height) / 2
          stackNode.push({ ...item.model })
          item.updatePosition(posX, posY)
        }
      })
    })

    this.graph.pushStack('updateNodePosition', { nodes: stackNode })

    this.graph.fitCenter()
  }

  layovt(options: ILayout) {
    this.init(options)

    const nodeMap: { [id: number]: INode } = {}
    this.graph.getNodes().forEach(node => {
      const { id, width, height } = node
      nodeMap[id] = node
      this.dagre.setNode(id, { label: '', width, height })
    })

    this.graph.getEdges().forEach(edge => {
      this.dagre.setEdge(edge.fromNode.id, edge.toNode.id)
    })

    dagre.layout(this.dagre)

    const group = this.dagre.graph()
    const svgInfo = this.graph.getSvgInfo()
    const stackNode: INodeModel[] = []

    this.dagre.nodes().forEach((id: string) => {
      const node = nodeMap[id]
      if (node) {
        stackNode.push({ ...node.model })
        const { x, y } = this.dagre.node(id)
        // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
        const posX = x - (node.width + group.width - svgInfo.width) / 2
        const posY = y - (node.height + group.height - svgInfo.height) / 2
        node.updatePosition(posX, posY)
      }
    })

    this.graph.pushStack('updateNodePosition', { nodes: stackNode })

    this.graph.fitCenter()
  }

  destroy() {
    this.dagre = null
    ;(this.graph as null | Graph) = null
  }
}
