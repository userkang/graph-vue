import dagre from 'dagre'
import Graph from './graph'

export default class LayoutController {
  graph: Graph
  layout: any = null

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.layout = new dagre.graphlib.Graph()
    this.layout.setGraph({
      width: 0,
      height: 0
    })
    this.layout.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  execute() {
    const { graph } = this
    const viewController = graph.viewController

    graph.nodes.forEach(item => {
      this.layout.setNode(item.nodeId, {
        label: item.nodeName,
        width: viewController.nodeInfo.width,
        height: viewController.nodeInfo.height
      })
    })

    graph.edges.forEach(item => {
      this.layout.setEdge(item.fromNodeId, item.toNodeId)
    })

    dagre.layout(this.layout)

    this.layout.nodes().forEach((v: string) => {
      graph.nodes.forEach(item => {
        if (String(item.nodeId) === v) {
          const { x, y } = this.layout.node(v)
          // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
          item.posX = x - 80
          item.posY = y - 80
        }
      })
    })
    // NodeStore.updateNodePosition(graph.nodes)

    viewController.translateToCenter()
  }
}
