import Graph from '@/controller/graph'

export default class ClickSelect {
  graph: Graph
  event: { [key: string]: any } = []

  // 当前拖动节点
  activeNode!: INodeType
  // 当前被选中节点
  selectedNode: INodeType[] = []
  // 移动的节点
  moveNode: INodeType[] = []

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('node.click', this.clickNode.bind(this))
    this.graph.on('edge.click', this.clickEdge.bind(this))
    this.graph.on('svg.click', this.clickSvg.bind(this))
  }

  clickNode(e: MouseEvent, item: INodeType) {
    this.activeNode = this.graph.findNode(item.nodeId)
  }

  clickEdge(e: MouseEvent, item: IEdgeType) {}

  clickSvg(e: MouseEvent) {}
}
