import DragSvg from './drag-svg'
import DragNode from './drag-node'
import ClickSelect from './click-select'
import CreateEdge from './create-edge'

// 维护一个 behavior 注册表
const behaviors: { [key: string]: any } = {
  'drag-svg': DragSvg,
  'drag-node': DragNode,
  'click-select': ClickSelect,
  'create-edge': CreateEdge
}

export default behaviors
