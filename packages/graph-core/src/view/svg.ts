import Container from './container'
import { createSVGElement } from './util/dom'
import { uniqueId } from '../util/utils'

export default class Svg extends Container {
  container = undefined

  constructor(container: HTMLElement) {
    super()
    this.set('id', uniqueId('svg'))
    this.container = container
    this.initSVG()
    this.initGroup()
  }

  initSVG() {
    const el = this.createSvg()
    el.id = this.id
    this.set('el', el)
    this.container.appendChild(el)
  }

  initGroup() {
    const group = this.addGroup({
      class: 'root-group'
    })
    group.addGroup({
      class: 'edge-group'
    })
    group.addGroup({
      class: 'node-group'
    })
  }

  createSvg() {
    const element = createSVGElement('svg') as SVGSVGElement
    element.setAttribute('width', '100%')
    element.setAttribute('height', '100%')
    return element
  }
}


