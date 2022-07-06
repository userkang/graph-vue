import {
  ICircleLayout,
  IDagreLayout,
  ILayout,
  INode,
  INodeModel
} from '../types'
// https://github.com/dagrejs/dagre/wiki
import dagre from 'dagre'
import Graph from './graph'

const getDTheta = (nodesLength: number) => {
  const sweep = 2 * Math.PI - (2 * Math.PI) / nodesLength
  const dTheta = sweep / Math.max(1, nodesLength - 1)
  return dTheta
}

export default class LayoutController {
  private graph: Graph
  private dagre: any = null
  private options: IDagreLayout | ICircleLayout = {}

  constructor(graph: Graph) {
    this.graph = graph
  }

  initDagre(options?: IDagreLayout) {
    Object.assign(this.options, options)
    this.graph.set('direction', options?.rankdir || this.graph.get('direction'))

    this.dagre = new dagre.graphlib.Graph()
    this.dagre.setGraph({
      width: 0,
      height: 0,
      rankdir: this.graph.get('direction'),
      ...this.options
    })
    this.dagre.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  layout(cfg: ILayout, stack: boolean) {
    if (cfg.type === 'circle') {
      return this.circleLayout(cfg, stack)
    } else {
      return this.dagreLayout(cfg, stack)
    }
  }

  realDagreLayout = (cfg: ILayout) => {
    this.initDagre(cfg.options as IDagreLayout)

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

    return this.dagre
  }
  dagreLayout(cfg: ILayout, stack: boolean) {
    const func = stack
      ? this.graph.withStack(this.realDagreLayout)
      : this.realDagreLayout
    return func(cfg)
  }

  realCircleLayout = (cfg: ILayout) => {
    const options = Object.assign(
      {},
      this.options,
      cfg.options
    ) as ICircleLayout
    const svgInfo = this.graph.getSvgInfo()
    const nodes = (cfg.data?.nodes || this.graph.getNodes()).filter(
      node => !node.parentId
    )

    const radius =
      Math.max(...nodes.map(node => node.width + node.height)) +
      (options.addRadius || 0)

    const dTheta =
      getDTheta(nodes.length) * (options.clockwise === false ? -1 : 1)

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const theta = i * dTheta + (options.startAngle || 0)
      const posX = radius * Math.cos(theta) + svgInfo.width / 2
      const posY = radius * Math.sin(theta) + svgInfo.height / 2
      node.updatePosition(posX, posY)
    }
  }
  circleLayout(cfg: ILayout, stack: boolean) {
    const func = stack
      ? this.graph.withStack(this.realCircleLayout)
      : this.realCircleLayout
    return func(cfg)
  }

  destroy() {
    this.dagre = null
    ;(this.graph as null | Graph) = null
  }
}
