import Graph from '../controller/graph'
import Element from './element'

export default class Brushing extends Element {
  constructor(graph: Graph) {
    super()
    this.set('graph', graph)
    this.draw()
    this.initHook()
  }

  draw() {
    const brushingPath = this.createDom('path', {
      class: 'graph-brushing',
      d: ''
    })

    this.set('el', brushingPath)
    this.set('brushingPath', brushingPath)
  }

  initHook() {
    this.addEvent('brushing', this.update)
  }

  update(path: string) {
    const brushingPath = this.get('brushingPath')
    brushingPath.setAttribute('d', path)
  }
}
