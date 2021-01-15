import Element from './element'
import { calculateCurve } from './util/util'
export default class Arrow extends Element {
  constructor() {
    super()
    this.draw()
    this.initHook()
  }

  draw() {
    const arrowPath = this.createDom('path', {
      class: 'arrow',
      d: ''
    })

    this.set('arrowPath', arrowPath)
  }

  initHook() {
    console.log(this.graph)
  }

  update() {
    const arrowPath = this.get('arrowPath')
    arrowPath.setAttribute('d', '123123')
  }
}
