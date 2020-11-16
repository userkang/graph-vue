import dagre from 'dagre'
import Graph from './graph'

export default class LayoutController {
  graph: Graph
  dagre = null

  constructor(graph: Graph) {
    this.graph = graph
  }

  init() {
    const rankdir = this.graph.get('drection') || 'TB'

    this.dagre = new dagre.graphlib.Graph()
    this.dagre.setGraph({
      width: 0,
      height: 0,
      rankdir
    })
    this.dagre.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  layout() {
    this.init()

    const { width, height } = this.graph.getNodeInfo()
    const nodes = this.graph.getNodes()
    const edges = this.graph.getEdges()

    nodes.forEach(item => {
      this.dagre.setNode(item.id, {
        label: '',
        width,
        height
      })
    })

    edges.forEach(item => {
      this.dagre.setEdge(item.fromNode.id, item.toNode.id)
    })

    dagre.layout(this.dagre)

    const group = this.dagre.graph()
    const svgInfo = this.graph.getSvgInfo()

    this.dagre.nodes().forEach((v: string) => {
      nodes.forEach(item => {
        if (item.id === v) {
          const { x, y } = this.dagre.node(v)
          // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
          const posX = x - (width + group.width - svgInfo.width) / 2
          const posY = y - (height + group.height - svgInfo.height) / 2
          item.updatePosition(posX, posY)
        }
      })
    })

    this.graph.fitCenter()
  }
}
