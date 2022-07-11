import Base from './base'
import { uniqueId } from '../util/utils'
import { IEdgeCfg, IEdgeModel, INode } from '../types'
import edgeView from '../view/edge'
import Graph from '../controller/graph'

export default class Edge extends Base<IEdgeModel> {
  constructor(
    model: IEdgeModel,
    cfg: IEdgeCfg | undefined,
    fromNode: INode,
    toNode: INode
  ) {
    super(model)
    if (!this.id) {
      const id = uniqueId('edge')
      this.set('id', id)
      this.model.id = this.id
    }

    this.set('cfg', cfg)

    this.set('fromNode', fromNode)
    this.set('toNode', toNode)

    this.setPoint()

    // 将边与其对应节点关联
    this.fromNode.addEdge(this)
    this.toNode.addEdge(this)
  }

  public get cfg() {
    return this.get('cfg')
  }

  public get fromNode(): INode {
    return this.get('fromNode')
  }

  public get toNode(): INode {
    return this.get('toNode')
  }

  public get fromPort() {
    return this.get('fromPort')
  }

  public get toPort() {
    return this.get('toPort')
  }

  public setPoint() {
    const fromPortId = String(this.model.fromPortId)
    const toPortId = String(this.model.toPortId)
    const fromNode = this.fromNode
    const toNode = this.toNode

    fromNode.ports.find(item => {
      if (
        !item.type ||
        (fromPortId && item.id === fromPortId && item.type === 'out') ||
        (!this.fromNode.id && item.type === 'out')
      ) {
        item.setState('linked')
        this.set('fromPort', item)
        return true
      }
    })

    toNode.ports.find(item => {
      if (
        !item.type ||
        (toPortId && item.id === toPortId && item.type === 'in') ||
        (!this.toNode.id && item.type === 'in')
      ) {
        item.setState('linked')
        this.set('toPort', item)
        return true
      }
    })

    if (!this.fromPort) {
      this.set(
        'fromPort',
        fromNode.ports.find(item => {
          if (item.type === 'out') {
            item.setState('linked')
            return true
          }
        })
      )
    }

    if (!this.toPort) {
      this.set(
        'toPort',
        toNode.ports.find(item => {
          if (item.type === 'in') {
            item.setState('linked')
            return true
          }
        })
      )
    }
  }

  public update(model?: IEdgeModel) {
    if (model) {
      // 不允许更新边的起始和目标节点
      delete model.fromNodeId
      delete model.toNodeId
      delete model.fromPortId
      delete model.toPortId
      Object.assign(this.model, model)
    }
    this.setPoint()
  }

  public refresh() {
    const view = this.get('view')
    view.update()
  }

  public render(graph: Graph) {
    const view = new edgeView(this, graph)
    this.set('view', view)
    return view
  }
}
