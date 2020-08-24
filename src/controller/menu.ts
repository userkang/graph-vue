export default class MenuController {
  graph: any = null

  private menu: IMenu

  constructor(graph: any) {
    this.graph = graph
    this.menu = {
      show: false,
      x: 0,
      y: 0,
      type: 'node',
      item: undefined
    }
  }

  showMenu(v: IMenu) {
    this.menu = {
      ...v,
      show: true
    }
  }

  hideMenu() {
    this.menu.show = false
  }
}
