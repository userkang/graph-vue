import {
  ICircleLayout,
  IDagreLayout,
  ILayout,
  INode,
  INodeModel
} from '../types'
// https://github.com/dagrejs/dagre/wiki
import dagre from 'dagre'
import { store } from '../item/store'

const getDTheta = (nodesLength: number) => {
  const sweep = 2 * Math.PI - (2 * Math.PI) / nodesLength
  const dTheta = sweep / Math.max(1, nodesLength - 1)
  return dTheta
}

export default class LayoutController {
  private dagre: any = null
  private options: IDagreLayout | ICircleLayout = {}

  constructor(readonly graphId: string) {}

  initDagre(options?: IDagreLayout) {
    const graph = store.getters.graph(this.graphId)
    Object.assign(this.options, options)
    graph.set('direction', options?.rankdir || graph.get('direction'))

    this.dagre = new dagre.graphlib.Graph()
    this.dagre.setGraph({
      width: 0,
      height: 0,
      rankdir: graph.get('direction'),
      ...this.options
    })
    this.dagre.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  layout(cfg: ILayout, stack: boolean) {
    const graph = store.getters.graph(this.graphId)
    stack && graph.stackStart()
    let res
    if (cfg.type === 'circle') {
      res = this.circleLayout(cfg)
    } else {
      res = this.dagreLayout(cfg)
    }
    stack && graph.stackEnd()
    return res
  }

  dagreLayout(cfg: ILayout) {
    const graph = store.getters.graph(this.graphId)
    this.initDagre(cfg.options as IDagreLayout)

    const nodes = cfg.data?.nodes || graph.getNodes()
    const edges = cfg.data?.edges || graph.getEdges()

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
    const svgInfo = graph.getSvgInfo()
    const stackNode: INodeModel[] = []

    this.dagre.nodes().forEach((id: string) => {
      const node = graph.findNode(id) as INode
      const { x, y } = this.dagre.node(id)

      // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
      const posX = x - (node.width + group.width - svgInfo.width) / 2
      const posY = y - (node.height + group.height - svgInfo.height) / 2

      stackNode.push({ ...node.model })
      node.updatePosition(posX, posY)
    })

    return this.dagre
  }

  circleLayout(cfg: ILayout) {
    const graph = store.getters.graph(this.graphId)
    const options = Object.assign(
      {},
      this.options,
      cfg.options
    ) as ICircleLayout
    const svgInfo = graph.getSvgInfo()
    const nodes = (cfg.data?.nodes || graph.getNodes()).filter(
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

  destroy() {
    this.dagre = null
  }
}
