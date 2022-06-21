import { IDataModel, ITreeDataModel } from '@datafe/graph-core'

interface GraphConfigState {
  layout: {
    rankdir: string
  }
  action: string[]
  data: IDataModel | ITreeDataModel
}

class GraphConfig {
  public state: GraphConfigState = {
    layout: {
      rankdir: 'TB'
    },
    action: [
      'drag-blank',
      'drag-node',
      'click-select',
      'connect-edge',
      // 'wheel-move',
      'wheel-zoom',
      'brush-select'
    ],
    data: {
      nodes: [],
      edges: []
    }
  }
}

export default new GraphConfig()
