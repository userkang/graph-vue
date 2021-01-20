import Base from './base'
import { createSVGElement } from './util/dom'

export default abstract class Element extends Base {
  constructor() {
    super()
  }

  get el() {
    return this.get('el')
  }

  get parent(): Element {
    return this.get('parent')
  }

  get children(): Element[] {
    if (this.get('children')) {
      return this.get('children')
    } else {
      return []
    }
  }

  abstract draw()

  createDom(type: string, attrs?: { [key: string]: string }) {
    const el = createSVGElement(type) as SVGAElement

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
    const children = this.children
    children.push(element)
    this.set('children', children)
    this.el.appendChild(element.el)
  }

  remove(element?: Element) {
    if (element) {
      element.destory()
      this.el.removeChild(element.el)
    } else {
      this.children.forEach(item => {
        item.destory()
      })
      this.el.innerHTML = ''
    }
  }
}
