import Element from './element'
import { uniqueId } from '../util/utils'
import Group from './group'
import Graph from '../controller/graph'
import NewEdge from './newEdge'
import Arrow from './arrow'
import { insertCss } from './util/dom'
import content from './css/index'

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
  }

  draw() {
    const el = this.createDom('svg', {
      width: '100%',
      height: '100%',
      xmlns: 'http://www.w3.org/2000/svg'
    })
    this.container.innerHTML = ''
    el.id = this.id
    this.container.appendChild(el)
  }

  initGroup() {
    const rootGroup = this.addGroup({
      class: 'root-group',
      transform: 'matrix(1,0,0,1,0,0)'
    })
    const edgeGroup = rootGroup.addGroup({
      class: 'edge-group'
    })
    const nodeGroup = rootGroup.addGroup({
      class: 'node-group'
    })
    this.set('rootGroup', rootGroup)
    this.set('edgeGroup', edgeGroup)
    this.set('nodeGroup', nodeGroup)
  }

  initNewEdge() {
    const newEdge = new NewEdge()
    const arrow = new Arrow()
    const rootGroup = this.get('rootGroup')
    const newEdgeGroup = rootGroup.addGroup({
      class: 'new-edge-group'
    })
    newEdgeGroup.add(newEdge)
    newEdgeGroup.add(arrow)
  }

  addGroup(attrs) {
    const group = new Group(attrs)
    this.add(group)
    return group
  }
}
