import Element from './element'
import { uniqueId } from '../util/utils'
import Group from './group'
import Graph from '../controller/graph'
import NewEdge from './newEdge'
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
    this.initDefs()
    this.initGroup()
    this.initNewEdge()
    this.initBrushing()
    this.initHook()
  }

  initHook() {
    this.addEvent('zoom', this.updateTransform)
    this.addEvent('translate', this.updateTransform)
  }

  updateTransform() {
    const rootGroup = this.get('rootGroup')
    const zoom = this.graph.getZoom()
    const translate = this.graph.getTranslate()
    rootGroup.el.setAttribute(
      'style',
      `transform: scale(${zoom}) translate(${translate.x}px, ${translate.y}px)`
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
    this.set('el', el)
  }

  initDefs() {
    const defs = this.createDom('defs')
    const marker = this.createDom('marker', {
      id: 'arrow',
      orient: 'auto',
      overflow: 'visible',
      markerUnits: 'userSpaceOnUse'
    })
    const path = this.createDom('path', {
      d: 'M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z',
      transform: 'rotate(180)',
      class: 'graph-arrow'
    })
    const markerActive = this.createDom('marker', {
      id: 'arrow-active',
      orient: 'auto',
      overflow: 'visible',
      markerUnits: 'userSpaceOnUse'
    })
    const pathActive = this.createDom('path', {
      d: 'M 0 0 L 7 -3.5 L 5.25 0 L 7 3.5 Z',
      transform: 'rotate(180)',
      class: 'graph-arrow-active'
    })
    marker.appendChild(path)
    defs.appendChild(marker)
    markerActive.appendChild(pathActive)
    defs.appendChild(markerActive)
    this.get('el').appendChild(defs)
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
    const rootGroup = this.get('rootGroup')
    const newEdgeGroup = rootGroup.addGroup({
      class: 'graph-new-edge-group'
    })
    newEdgeGroup.add(newEdge)
  }

  initBrushing() {
    const brushing = new Brushing(this.graph)
    this.add(brushing)
  }

  addGroup(attrs: { [key: string]: string }) {
    const group = new Group(attrs)
    this.add(group)
    return group
  }
}
