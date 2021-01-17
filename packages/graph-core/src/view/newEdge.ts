import Element from './element'
import { calculateCurve } from './util/util'
export default class NewEdge extends Element {
  constructor() {
    super()
    this.draw()
    this.initHook()
  }

  draw() {
    const newEdgePath = this.createDom('path', {
      class: 'new-edge',
      d: ''
    })

    this.set('newEdgePath', newEdgePath)
  }

  initHook() {}

  update() {
    const newEdgePath = this.get('newEdgePath')
    newEdgePath.setAttribute('d', '123123')
  }
}
