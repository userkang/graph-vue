import Base from './base'

export default class Element extends Base {
  constructor() {
    super()
  }

  get parent() {
    return this.get('parent')
  }
}