import Element from './element'

export default class Group extends Element {
  attrs: { [key: string]: string } = {}

  constructor(attrs?: { [key: string]: string }) {
    super()
    if (attrs) {
      this.attrs = attrs
    }
    this.draw()
  }

  draw() {
    const group = this.createDom('g', this.attrs)
    this.set('el', group)
  }

  addGroup(attrs?: { [key: string]: string }) {
    const group = new Group(attrs)
    this.add(group)
    return group
  }
}
