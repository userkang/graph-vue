import Graph from '@/controller/graph'

export default class RightClick {
  graph: Graph

  menu: IMenu = {
    show: false,
    x: 0,
    y: 0,
    type: 'node',
    item: undefined
  }

  constructor(graph: Graph) {
    this.graph = graph
    this.init()
  }

  init() {
    this.graph.on('contextmenu', this.onSvgMenu.bind(this))
    this.graph.on('node.contextmenu', this.onNodeMenu.bind(this))
    this.graph.on('edge.contextmenu', this.onEdgeMenu.bind(this))
  }

  onSvgMenu(e: MouseEvent) {
    this.showMenu(e, 'svg', {})
    this.graph.emit('showmenu', this.menu)
  }

  onNodeMenu(e: MouseEvent, item: INodeType) {
    this.showMenu(e, 'node', item)
    this.graph.emit('showmenu', this.menu)
  }

  onEdgeMenu(e: MouseEvent, item: IEdgeType) {
    this.showMenu(e, 'edge', item)
    this.graph.emit('showmenu', this.menu)
  }

  showMenu(e: MouseEvent, type: string, item: any = {}) {
    this.menu = {
      x: e.x,
      y: e.y,
      type,
      item,
      show: true
    }
  }

  hideMenu() {
    this.menu.show = false
  }
}
