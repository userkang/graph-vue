import Base from '@/stores/base'

interface ITypeNoticeState {
  value: {
    noticeCom: string
    wikiName: string
    wikiUrl: string
  }
}

class SyncTypeNotice extends Base {
  public state: ITypeNoticeState = {
    value: {
      noticeCom: '',
      wikiName: '',
      wikiUrl: ''
    }
  }

  public async getTypeNotice(payload: string) {
    try {
      const value = await this.$requestHandle(
        'get',
        '/workflow/toolTaskXt/syncTypeNotice/get',
        {
          syncType: payload
        }
      )
      this.$setState(this.state, value)
      // tslint:disable-next-line
    } catch (e) {}
    return this.state
  }
}

export const SyncTypeNoticeStore = new SyncTypeNotice()
