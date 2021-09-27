import { IDataModel, INodeModel } from '@datafe/graph-core'

interface GraphConfigState {
  direction: 'TB' | 'LR'
  action: string[]
  data: IDataModel|INodeModel
}

class GraphConfig {
  public state: GraphConfigState = {
    direction: 'TB',
    action: [
      'drag-svg',
      'drag-node',
      'click-select',
      'create-edge',
      'wheel-move',
      'wheel-zoom',
      'brush-select'
    ],
    data: {
      nodes: [],
      edges: []
    }
  }
}

export const GraphConfigStore = new GraphConfig()
