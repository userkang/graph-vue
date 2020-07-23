import { SortType } from '@/types/common';
import Base from '@/stores/base'


interface IHistoryPayload {
  workflowId: string
  page: number
  size: number
  sort?: SortType
}

interface IWorkflowHisoryItem {
  workflowId: number
  updateTime: string
  operator: string
  opType: number
  opTarget: string
  opInfo: string
}

interface IWorkflowHisoryState {
  value: {
    totalCount: number
    items: IWorkflowHisoryItem[]
  }
  loadingStatus: string
}

function generateSortQuery(sort?: SortType) {
  if (!sort) { return null }
  const { prop, order: _order } = sort
  const order = _order?.replace('ending', '')
  return order ? [prop, order].filter(Boolean).join(',') : null
}

class EditHistory extends Base {
  public state: IWorkflowHisoryState = {
    value: {
      totalCount: 0,
      items: []
    },
    loadingStatus: ''
  }

  public async getEditHistory(payload: IHistoryPayload) {
    try {
      this.state.loadingStatus = this.$STATUS_LOADING
      this.state.value.items = []
      const value = await this.$requestHandle(
        'get',
        `/workflow/editor-history`,
        {
          page: payload.page,
          size: payload.size,
          workflowId: payload.workflowId,
          sort: generateSortQuery(payload.sort)
        }
      )
      // this.state.value.items = value.data.data
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    this.state.loadingStatus = this.$STATUS_LOADED
    return this.state
  }
}

export const EditHistoryStore = new EditHistory()
