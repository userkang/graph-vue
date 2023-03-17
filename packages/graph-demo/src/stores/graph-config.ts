import { IDataModel, ITreeDataModel } from 'graph-logic'

interface GraphConfigState {
  layout: {
    options: {
      rankdir: string
      align: string | undefined
    }
  }
  action: string[]
  data: IDataModel | ITreeDataModel
}

class GraphConfig {
  public state: GraphConfigState = {
    layout: {
      options: {
        rankdir: 'TB',
        align: undefined
      }
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
