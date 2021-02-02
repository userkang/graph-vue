import Element from './element'
import { uniqueId } from '../util/utils'
import Group from './group'
import Graph from '../controller/graph'
import NewEdge from './newEdge'
import Arrow from './arrow'
import { insertCss } from './util/dom'
import content from './css/index'
import Brushing from './brushing'

export default class Svg extends Element {
  container!: HTMLElement

  constructor(graph: Graph) {
    super()
    this.set('graph', graph)
    this.set('id', uniqueId('svg'))
    this.container = graph.get('container')
    this.draw()
    insertCss(content)
    this.initGroup()
    this.initNewEdge()
    this.initBrushing()
    this.initHook()
  }

  initHook() {
    this.addEvent('afterzoom', this.updateTransform)
    this.addEvent('aftertranslate', this.updateTransform)
  }

  updateTransform() {
    const rootGroup = this.get('rootGroup')
    const zoom = this.graph.getZoom()
    const translate = this.graph.getTranslate()
    rootGroup.el.setAttribute(
      'style',
      `transform: scale(${zoom}) translate3D(${translate.x}px, ${translate.y}px, 0)`
    )
  }

  draw() {
    const el = this.createDom('svg', {
      width: '100%',
      height: '100%',
      xmlns: 'http://www.w3.org/2000/svg',
      class: 'graph-svg'
    })
    this.container.innerHTML = ''
    el.id = this.id
    this.container.appendChild(el)
  }

  initGroup() {
    const rootGroup = this.addGroup({
      class: 'graph-root-group',
      'transform-origin': 'center'
    })
    const edgeGroup = rootGroup.addGroup({
      class: 'graph-edge-group'
    })
    const nodeGroup = rootGroup.addGroup({
      class: 'graph-node-group'
    })
    this.set('rootGroup', rootGroup)
    this.set('edgeGroup', edgeGroup)
    this.set('nodeGroup', nodeGroup)
  }

  initNewEdge() {
    const newEdge = new NewEdge(this.graph)
    const arrow = new Arrow(this.graph)
    const rootGroup = this.get('rootGroup')
    const newEdgeGroup = rootGroup.addGroup({
      class: 'graph-new-edge-group'
    })
    newEdgeGroup.add(newEdge)
    newEdgeGroup.add(arrow)
  }

  initBrushing() {
    const brushing = new Brushing(this.graph)
    this.add(brushing)
  }

  addGroup(attrs) {
    const group = new Group(attrs)
    this.add(group)
    return group
  }
}
