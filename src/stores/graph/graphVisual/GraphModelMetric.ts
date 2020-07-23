import Base from '../../base'

interface GraphMetricState {
  show: boolean
  nodeId: string | number
  graphId: string | number
}

class GraphMetric extends Base {
  public state: GraphMetricState = {
    show: false,
    nodeId: '',
    graphId: ''
  }

  public setState(data: GraphMetricState) {
    this.state.show = data.show
    this.state.nodeId = data.nodeId
    this.state.graphId = data.graphId
  }
}

export const GraphMetricStore = new GraphMetric()
