import Base from '../base'
import { DagStore } from './dag'
import { IEdgeType } from '@/types/dag'

class Edge extends Base {
  public state = {
    createLine: {
      show: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
    }
  }

  public addEdge(item: IEdgeType) {
    // 生成唯一edgeId
    item.edgeId = JSON.stringify(item.fromNodeId + '' + item.toNodeId)
    console.log(item.edgeId)
    DagStore.state.dag.edges.push(item)
  }

  public setNewLineStart(fromX: number, fromY: number) {
    this.state.createLine = {
      ...this.state.createLine,
      fromX,
      fromY,
      show: true
    }
  }

  public setNewLineMove(toX: number, toY: number) {
    this.state.createLine = {
      ...this.state.createLine,
      toX,
      toY
    }
  }

  public setResetLine() {
    this.state.createLine = {
      show: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
    }
  }

  public deleteEdge(id: number) {
    const edges = DagStore.state.dag.edges
    edges.splice(
      edges.findIndex(item => item.edgeId === id),
      1
    )
  }
}

export const EdgeStore = new Edge()
