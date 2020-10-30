import dagre from 'dagre'
import Graph from './graph'

export default class LayoutController {
  graph: Graph
  dagre: any = null

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    const rankdir = this.graph.config.drection
      ? this.graph.config.drection
      : 'TB'

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
    const { graph } = this
    const viewController = graph.viewController

    graph.nodes.forEach(item => {
      this.dagre.setNode(item.nodeId, {
        label: item.nodeName,
        width: viewController.nodeInfo.width,
        height: viewController.nodeInfo.height
      })
    })

    graph.edges.forEach(item => {
      this.dagre.setEdge(item.fromNodeId, item.toNodeId)
    })

    dagre.layout(this.dagre)

    this.dagre.nodes().forEach((v: string) => {
      const nodes = this.graph.getNodes()
      nodes.forEach(item => {
        if (String(item.nodeId) === v) {
          const { x, y } = this.dagre.node(v)
          // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
          item.posX = x - 80
          item.posY = y - 80
          this.graph.setSlotPoint(item)
        }
      })
    })
    // NodeStore.updateNodePosition(graph.nodes)

    viewController.translateToCenter()
  }
}
