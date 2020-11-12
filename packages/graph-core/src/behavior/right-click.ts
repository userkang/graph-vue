import Graph from '../controller/graph'

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

  onNodeMenu(e: MouseEvent, id: string) {
    const node = this.graph.findNode(id)
    this.showMenu(e, 'node', node)
    this.graph.emit('showmenu', this.menu)
  }

  onEdgeMenu(e: MouseEvent, id: string) {
    const edge = this.graph.findEdge(id)
    this.showMenu(e, 'edge', edge)
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
