import DragSvg from './drag-svg'
import DragNode from './drag-node'
import ClickSelect from './click-select'
import CreateEdge from './create-edge'
import WheelMove from './wheel-move'
import WheelZoom from './wheel-zoom'
import BrushSelect from './brush-select'

// 维护一个 behavior 注册表
const behaviors: { [key: string]: any } = {
  'drag-svg': DragSvg,
  'drag-node': DragNode,
  'click-select': ClickSelect,
  'create-edge': CreateEdge,
  'wheel-move': WheelMove,
  'wheel-zoom': WheelZoom,
  'brush-select': BrushSelect
}

export default behaviors
