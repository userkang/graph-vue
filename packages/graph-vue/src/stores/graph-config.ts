interface GraphConfigState {
  drection: 'TB' | 'LR'
  action: string[]
}

class GraphConfig {
  public state: GraphConfigState = {
    drection: 'TB',
    action: [
      'drag-svg',
      'drag-node',
      'click-select',
      'create-edge',
      'wheel-move',
      'wheel-zoom',
      'brush-select'
    ]
  }
}

export const GraphConfigStore = new GraphConfig()
