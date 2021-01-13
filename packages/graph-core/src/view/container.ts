import Element from './element'
import Group from './group'

export default class container extends Element {
  addGroup(attrs: any) {
    const group = new Group(attrs)
    
    
    return group
  }
}
