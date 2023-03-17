import { INode, IPort } from '../types'
import Graph from '../controller/graph'
import Base from './base'

export default class CreateEdge extends Base {
  fromPort!: IPort
  fromNode!: INode
  isMoveing = false
  createEdge = {
    fromPoint: {
      x: 0,
      y: 0
    },
    toPoint: {
      x: 0,
      y: 0
    }
  }

  constructor(graph: Graph) {
    super(graph)
    this.init()
  }

  init() {
    this.addEvent('port:mousedown', this.portMouseDown)
    this.addEvent('mousemove', this.mouseMove)
    this.addEvent('port:mouseup', this.portMouseUp)
    this.addEvent('mouseup', this.mouseUp)
  }

  portMouseDown({ target }: { target: IPort }) {
    // 初始化连线的起点和移动位置
    const port = target
    if (!port || port.type === 'in') {
      return
    }

    const fromNode = this.graph.findNode(port.nodeId || '')
    if (!fromNode) {
      return
    }

    const { x, y } = port
    this.setNewEdgeStart(x, y)
    this.setNewEdgeMove(x, y)
    this.fromPort = port
    this.fromNode = fromNode
    this.setEnablePort()
    this.graph.emit('edge:connect', port)
  }

  mouseMove(e: MouseEvent) {
    if (!this.isMoveing) {
      return
    }
    const { x, y } = this.graph.getPointByClient(e.x, e.y)
    this.setNewEdgeMove(x, y)
    this.graph.emit('edge:connecting', this.createEdge)
  }

  portMouseUp({ e, target }: { e: MouseEvent; target: IPort }) {
    e.stopPropagation()

    const port = target
    if (!port) {
      return
    }

    if (port.hasState('enable')) {
      // 这里要传 model 下的 id，保证用户数据类型正确
      // 当 model 下无 id 时，再取自生成 id
      const node = this.graph.findNode(port.nodeId || '')

      if (!node) {
        return
      }

      const edgeInfo = {
        fromNodeId: this.fromNode.model.id || this.fromNode.id,
        toNodeId: node.id
      }

      if (this.fromNode.model.ports) {
        Object.assign(edgeInfo, {
          fromPortId: this.fromPort.model.id || this.fromPort.id
        })
      }

      if (node.model.ports) {
        Object.assign(edgeInfo, {
          toPortId: port.id
        })
      }

      this.graph.emit('edge:connected', edgeInfo)
    }

    this.setResetEdge()
    this.graph.emit('edge:connecting', null)
  }

  mouseUp() {
    if (this.isMoveing) {
      this.setResetEdge()
      this.graph.emit('edge:connecting', null)
    }
  }

  setEnablePort() {
    const nodes = this.graph.getNodes()

    nodes.forEach(node => {
      node.ports.forEach(port => {
        if (
          port.type === 'in' &&
          node.id !== this.fromNode.id &&
          !this.isDirectLinked(port)
        ) {
          port.setState('enable')
        }
      })
    })
  }

  isDirectLinked(port: IPort) {
    let linked = false

    for (const item of this.fromNode.getEdges()) {
      linked =
        item.fromPort.id === this.fromPort.id && item.toPort.id === port.id
      if (linked) {
        break
      }
    }
    return linked
  }

  setNewEdgeStart(fromX: number, fromY: number) {
    this.isMoveing = true
    this.createEdge.fromPoint.x = fromX
    this.createEdge.fromPoint.y = fromY
  }

  setNewEdgeMove(toX: number, toY: number) {
    this.createEdge.toPoint.x = toX
    this.createEdge.toPoint.y = toY
  }

  setResetEdge() {
    this.isMoveing = false
    this.createEdge.fromPoint = { x: 0, y: 0 }
    this.createEdge.toPoint = { x: 0, y: 0 }
    const nodes = this.graph.getNodes()
    nodes.forEach(item => {
      item.ports.forEach(port => {
        if (port.hasState('enable')) {
          port.clearState('enable')
        }
      })
    })
  }
}
