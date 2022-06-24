import { IDagreLayout, ILayout, INode, INodeModel } from '../types'
// https://github.com/dagrejs/dagre/wiki
import dagre from 'dagre'
import Graph from './graph'

export default class LayoutController {
  graph: Graph
  dagre: any = null

  constructor(graph: Graph) {
    this.graph = graph
  }

  initDagre(options?: IDagreLayout) {
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

  layout(cfg: ILayout) {
    this.initDagre(cfg.options)

    const nodes = cfg.data?.nodes || this.graph.getNodes()

    const edges = cfg.data?.edges || this.graph.getEdges()

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

    this.dagre.nodes().forEach((id: string) => {
      const node = this.graph.findNode(id) as INode
      const { x, y } = this.dagre.node(id)

      // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
      const posX = x - (node.width + group.width - svgInfo.width) / 2
      const posY = y - (node.height + group.height - svgInfo.height) / 2

      stackNode.push({ ...node.model })
      node.updatePosition(posX, posY)
    })

    this.graph.pushStack('updateNodePosition', { nodes: stackNode })

    return this.dagre
  }

  destroy() {
    this.dagre = null
    ;(this.graph as null | Graph) = null
  }
}
