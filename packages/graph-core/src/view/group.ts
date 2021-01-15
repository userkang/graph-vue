import Element from './element'

export default class Group extends Element {
  attrs = {}

  constructor(attrs?: { [key: string]: string }) {
    super()
    this.attrs = attrs
    this.draw()
  }

  draw() {
    this.createDom('g', this.attrs)
  }

  addGroup(attrs?: { [key: string]: string }) {
    const group = new Group(attrs)
    this.add(group)
    return group
  }
}
