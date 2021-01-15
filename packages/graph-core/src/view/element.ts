import Base from './base'
import { createSVGElement } from './util/dom'

export default abstract class Element extends Base {
  constructor() {
    super()
  }

  get el() {
    return this.get('el')
  }

  get parent() {
    return this.get('parent')
  }

  abstract draw()

  createDom(type: string, attrs?: { [key: string]: string }) {
    const el = createSVGElement(type) as SVGSVGElement

    this.set('el', el)

    if (attrs) {
      Object.keys(attrs).forEach(key => {
        el.setAttribute(key, attrs[key])
      })
    }

    return el
  }

  add(element: Element) {
    element.set('parent', this)
    this.el.appendChild(element.el)
  }

  remove(element: Element) {
    this.el.removeChild(element.el)
  }
}
