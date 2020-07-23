import { NodeVoType, DagVoType } from '../../../types/graph'
import { StringNumberMap } from '@/types/common'

interface MenuTipsState {
  value: {
    isShow: boolean
    x: number
    y: number
    data?: NodeVoType
    isDagActived?: boolean
  }
}
export interface MenuTipsPayload {
  x: number
  y: number
  data: NodeVoType
  isDagActived: boolean
}

class MenuTips {
  public state: MenuTipsState = {
    value: {
      isShow: false,
      data: undefined,
      isDagActived: false,
      x: 0,
      y: 0
    }
  }

  public show(payload: MenuTipsPayload) {
    this.state.value = {
      ...payload,
      isShow: true
    }
  }

  public hide() {
    this.state.value = {
      data: undefined,
      x: 0,
      y: 0,
      isDagActived: false,
      isShow: false
    }
  }
}

export const MenuTipsController = new MenuTips()

interface WarningTipsPayload {
  x: number
  y: number
  text: string
}

interface WarningTipsState {
  isShow: boolean
  value: WarningTipsPayload
}

class WaringTips {
  public state: WarningTipsState = {
    isShow: false,
    value: {
      x: 100,
      y: 100,
      text: ''
    }
  }

  public show(payload: WarningTipsPayload) {
    this.state.value = payload
    this.state.isShow = true
  }

  public hide() {
    this.state.isShow = false
  }
}

export const WarningTipsController = new WaringTips()

interface CreateLineState {
  value: {
    isShow: boolean
    fromX: number
    fromY: number
    toX: number
    toY: number
  }
}

class CreateLine {
  public state: CreateLineState = {
    value: {
      isShow: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
    }
  }

  public add(fromX: number, fromY: number) {
    this.state.value = {
      ...this.state.value,
      isShow: true,
      fromX,
      fromY
    }
  }

  public move(toX: number, toY: number) {
    this.state.value = {
      ...this.state.value,
      toX,
      toY
    }
  }

  public reset() {
    this.state.value = {
      isShow: false,
      fromX: 0,
      fromY: 0,
      toX: 0,
      toY: 0
    }
  }
}

export const CreateLineController = new CreateLine()

interface ActiveNodeState {
  value: {
    nodeId: number
    componentName: string
    componentDesc: string
  }
}

class ActiveNode {
  public state: ActiveNodeState = {
    value: {
      nodeId: 0,
      componentName: '',
      componentDesc: ''
    }
  }
  public setState(
    nodeId: number,
    componentName: string,
    componentDesc: string
  ) {
    this.state.value = {
      nodeId,
      componentName,
      componentDesc
    }
  }
}

export const ActiveNodeController = new ActiveNode()

export interface ActiveGraphPayload {
  isActive: boolean
  graphId: number
  graphName: string
  version: string
  createTime: string
  desc: string
  persist: boolean
  dagActive: boolean
}

interface ActiveGraphState {
  value: ActiveGraphPayload
}

class ActiveGraph {
  public state: ActiveGraphState = {
    value: {
      isActive: true,
      graphId: 0,
      graphName: '',
      version: '',
      createTime: '',
      desc: '',
      persist: false,
      dagActive: false
    }
  }

  public set(payload: ActiveGraphPayload) {
    this.state.value = payload
  }

  public show() {
    this.state.value = {
      ...this.state.value,
      isActive: true
    }
  }

  public hide() {
    this.state.value = {
      ...this.state.value,
      isActive: false
    }
  }

  public clean() {
    this.state.value = {
      isActive: true,
      graphId: 0,
      graphName: '',
      version: '',
      createTime: '',
      desc: '',
      persist: true,
      dagActive: false
    }
  }
}

export const ActiveGraphController = new ActiveGraph()

export interface EditorModalPayload {
  isShow: boolean
  nodeId: number
  paramId: number
  value: string
}

interface EditorModalState {
  value: EditorModalPayload
}
class EditorModalDisplay {
  public state: EditorModalState = {
    value: {
      isShow: false,
      nodeId: 0,
      paramId: 0,
      value: ''
    }
  }

  public show(payload: EditorModalPayload) {
    this.state.value = payload
  }

  public hide() {
    this.state.value = {
      isShow: false,
      nodeId: 0,
      paramId: 0,
      value: ''
    }
  }
}

export const EditorModalDisplayController = new EditorModalDisplay()

interface PositionTransformState {
  value: StringNumberMap
}

class PositionTransform {
  public state: PositionTransformState = {
    value: {
      scale: 1,
      translateX: 0,
      translateY: 0
    }
  }

  public set(key: string, value: number) {
    this.state.value[key] = value
  }
}

export const PositionTransformController = new PositionTransform()
