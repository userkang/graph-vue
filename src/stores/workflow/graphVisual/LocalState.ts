import { StringNumberMap } from '@/types/common'

interface MenuTipsState {
  value: {
    isShow: boolean
    x: number
    y: number
    data?: Workflow.WorkflowNodeVo | Workflow.WorkflowNodeGroupVo
    type?: string
  }
}
export interface MenuTipsPayload {
  x: number
  y: number
  data: Workflow.WorkflowNodeVo | Workflow.WorkflowNodeGroupVo
  type?: string
}

class MenuTips {
  public state: MenuTipsState = {
    value: {
      isShow: false,
      data: undefined,
      x: 0,
      y: 0,
      type: ''
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
      isShow: false,
      type: ''
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
    nodeName: string
    nodeDesc: string
  }
}

class ActiveNode {
  public state: ActiveNodeState = {
    value: {
      nodeId: 0,
      nodeName: '',
      nodeDesc: ''
    }
  }
  public setState(nodeId: number, nodeName: string, nodeDesc: string) {
    this.state.value = {
      nodeId,
      nodeName,
      nodeDesc
    }
  }
}

export const ActiveNodeController = new ActiveNode()

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
