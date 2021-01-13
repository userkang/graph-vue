import Container from './container'
import { createSVGElement } from './util/dom'

export default class Group extends Container {
  attrs = {}

  constructor(attrs: any) {
    super()
    this.attrs = attrs
    this.initGroup()
  }

  initGroup() {
    const el = this.createDom()

    Object.keys(this.attrs).forEach(key => {
      el.setAttribute(key, this.attrs[key])
    })

    el.id = this.id
    this.parent.appendChild(el)
  }

  createDom() {
    const element = createSVGElement('g')
    // this.set('el', element);
    // const parent = this.getParent();
    // if (parent) {
    //   let parentNode = parent.get('el');
    //   if (parentNode) {
    //     parentNode.appendChild(element);
    //   } else {
    //     // parentNode maybe null for group
    //     parentNode = (parent as IGroup).createDom();
    //     parent.set('el', parentNode);
    //     parentNode.appendChild(element);
    //   }
    // }
    return element
  }
}
