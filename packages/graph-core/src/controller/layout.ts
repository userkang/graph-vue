import { ICircleLayout, IDagreLayout, IEdge, ILayout, INode } from '../types'
// https://github.com/dagrejs/dagre/wiki
import dagre from 'dagre'
import Graph, { useGraph } from './graph'
import EventEmitter from '../util/event-emitter'
import { valuesType, IVirtualEdge } from '../types/type'

const getDTheta = (nodesLength: number) => {
  const sweep = 2 * Math.PI - (2 * Math.PI) / nodesLength
  const dTheta = sweep / Math.max(1, nodesLength - 1)
  return dTheta
}

const EVENT_TYPES = ['layout'] as const

export default class LayoutController extends EventEmitter<
  valuesType<typeof EVENT_TYPES>,
  false
> {
  private $graph: Graph
  private dagre: any = null
  private options: IDagreLayout | ICircleLayout = {}
  private outterEdges: Record<string, Array<IEdge | IVirtualEdge>> = {}
  private groupPadding = [50, 20, 20, 20]

  constructor() {
    super()
    this.$graph = useGraph()
  }

  initDagre(options?: IDagreLayout) {
    const graph = this.$graph
    Object.assign(this.options, options)
    graph.set('direction', options?.rankdir || graph.direction)

    this.dagre = new dagre.graphlib.Graph()
    this.dagre.setGraph({
      width: 0,
      height: 0,
      rankdir: graph.direction,
      ...this.options
    })
    this.dagre.setDefaultEdgeLabel(() => {
      return {}
    })
  }

  layout = (cfg: ILayout = {}) => {
    const hasGroup = this.$graph.getNodes().find(node => node.model.parentId)

    let res
    if (cfg.type === 'circle') {
      res = this.circleLayout(cfg)
    } else if (hasGroup) {
      this.groupPadding =
        (cfg.options as IDagreLayout)?.groupPadding || this.groupPadding
      res = this.groupLayout(cfg)
    } else {
      res = this.dagreLayout(cfg)
    }
    this.emit('layout')

    const nodes = cfg.data?.nodes || this.$graph.getNodes()
    nodes.forEach(node => {
      node.updatePorts()
    })
    return res
  }

  dagreLayout(cfg: ILayout) {
    const graph = this.$graph
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
      this.dagre.setEdge(item.fromNodeId, item.toNodeId)
    })
    dagre.layout(this.dagre)

    const svgInfo = this.$graph.getSvgInfo()
    const group = this.dagre.graph()
    this.dagre.nodes().forEach((id: string) => {
      const node = graph.findNode(id) as INode
      const { x, y } = this.dagre.node(id)

      // 输出的 x,y 坐标是节点中心点坐标， 需要修改为左上角坐标
      const posX = x - node.width / 2 + svgInfo.width / 2 - group.width / 2
      const posY = y - node.height / 2 + svgInfo.height / 2 - group.height / 2
      node.updatePosition(posX, posY, { emit: false })
    })
    return this.dagre
  }

  groupLayout(cfg: ILayout) {
    Object.assign(this.options, cfg.options)
    this.outterEdges = {}

    const nodes = cfg.data?.nodes || this.$graph.getNodes()

    // 获取根节点
    const rootNodes = nodes.filter(item => !item.model.parentId)
    this.layoutCellNode(rootNodes)
  }

  layoutCellNode(nodes: INode[]) {
    const childrenEdges: Record<string, IEdge | IVirtualEdge> = {}
    const childrenId = nodes.map(node => node.id)
    // 处理组内节点布局
    nodes.forEach(node => {
      this.layoutCellNode(node.getChildren())

      // 将下级传上来的边进行合并
      const outterEdges: Record<string, IEdge | IVirtualEdge> = {}
      if (this.outterEdges[node.id]) {
        this.outterEdges[node.id].forEach(outterEdge => {
          outterEdges[outterEdge.id] = {
            id: outterEdge.id,
            fromNodeId: outterEdge.model._fromNodeId,
            toNodeId: outterEdge.model._toNodeId,
            model: {
              _fromNodeId: outterEdge.model._fromNodeId,
              _toNodeId: outterEdge.model._toNodeId
            }
          }
        })
      }
      const mergeEdges = [...node.getEdges(), ...Object.values(outterEdges)]

      // 收集所有子节点的边
      mergeEdges.forEach(edge => {
        if (
          !childrenEdges[edge.id] &&
          childrenId.includes(edge.fromNodeId) &&
          childrenId.includes(edge.toNodeId)
        ) {
          childrenEdges[edge.id] = edge
        } else if (
          !childrenId.includes(edge.fromNodeId) ||
          !childrenId.includes(edge.toNodeId)
        ) {
          let toNodeId = edge.model._toNodeId || edge.toNodeId
          let fromNodeId = edge.model._fromNodeId || edge.fromNodeId

          // virtualEdge 用来向上传递边参数，realEdge 用来跨节点传递参数，因此两者都得修改
          const realEdge = this.$graph.findEdge(edge.id)
          const parent = node.getParent()

          if (parent) {
            // 如果该边的 fromNode 和 toNode 都不是同级节点，就进行上报
            if (!childrenId.includes(edge.toNodeId)) {
              fromNodeId = parent.id
            }
            if (!childrenId.includes(edge.fromNodeId)) {
              toNodeId = parent.id
            }

            if (realEdge) {
              realEdge.model._fromNodeId = fromNodeId
              realEdge.model._toNodeId = toNodeId
            }
            edge.model._fromNodeId = fromNodeId
            edge.model._toNodeId = toNodeId

            if (this.outterEdges[parent.id]) {
              this.outterEdges[parent.id].push(edge)
            } else {
              this.outterEdges[parent.id] = [edge]
            }
          }
        }
      })
    })

    // 对子节点布局。默认布局不能满足需求，需要获取实例自定义布局位置
    if (nodes.length) {
      this.initDagre(this.options as IDagreLayout)

      nodes.forEach(item => {
        this.dagre.setNode(item.id, {
          label: '',
          width: item.width,
          height: item.height
        })
      })

      const edges = Object.values(childrenEdges)
      edges.forEach(item => {
        this.dagre.setEdge(item.fromNodeId, item.toNodeId)
      })
      dagre.layout(this.dagre)

      // 通过布局实例返回的坐标点，自定义布局位置。
      this.dagre.nodes().forEach((v: string) => {
        const node = this.$graph.findNode(v) as INode
        if (this.dagre.node(v)) {
          const { x, y } = this.dagre.node(v)
          const posX = x - node.width / 2
          const posY = y - node.height / 2
          this.moveChildren(node, posX - node.x, posY - node.y)
          node.updatePosition(posX, posY, { emit: false })
        }
      })

      // 同级节点布局完后，resize父级group
      this.resizeGroup(nodes[0].getParent())
    }
  }

  moveChildren(node: INode, moveX: number, moveY: number) {
    const children = node.getChildren()

    while (children.length) {
      const child = children.shift()
      if (child) {
        const posX = child.x + node.x + moveX + this.groupPadding[3]
        const posY = child.y + node.y + moveY + this.groupPadding[0]
        child.updatePosition(posX, posY, { emit: false })
        const next = child.getChildren()
        children.push(...next)
      }
    }
  }

  resizeGroup(node: INode) {
    if (!node) {
      return
    }

    const children = node.getChildren().filter(item => !item.hasState('hide'))
    if (children.length) {
      const bbox = this.$graph.getNodesBBox(children)
      node.update({
        width: bbox.width + this.groupPadding[3] + this.groupPadding[1],
        height: bbox.height + this.groupPadding[0] + this.groupPadding[2],
        x: bbox.left - this.groupPadding[3],
        y: bbox.top - this.groupPadding[0]
      })
    }
  }

  circleLayout(cfg: ILayout) {
    const graph = this.$graph
    const options = Object.assign(
      {},
      this.options,
      cfg.options
    ) as ICircleLayout
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
      const posX = radius * Math.cos(theta)
      const posY = radius * Math.sin(theta)
      node.updatePosition(posX, posY, { emit: false })
    }
  }

  destroy() {
    this.dagre = null
  }
}
