import { IDataModel, INodeModel } from '@datafe/graph-core'

interface GraphConfigState {
  layout: {
    rankdir: string
  }
  action: string[]
  data: IDataModel | INodeModel
}

class GraphConfig {
  public state: GraphConfigState = {
    layout: {
      rankdir: 'TB'
    },
    action: [
      'drag-svg',
      'drag-node',
      'click-select',
      'create-edge',
      'wheel-move',
      'wheel-zoom',
      'brush-select',
    ],
    data: {
      nodes: [],
      edges: [],
    },
  }
}

export default new GraphConfig()
