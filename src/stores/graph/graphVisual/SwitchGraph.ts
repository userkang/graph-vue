import { GraphItemType } from '@/types/graph'
import {
  GraphRequestStore,
  GraphVisualStore
} from '@/stores/graph/graphVisual/GraphContent'
import { HistoryListController } from '@/stores/graph/graphVisual/HistoryList'
import store from '../../global'
import router from '../../../router'

class SwitchGraph {
  public async set(value: GraphItemType, isToStart = false) {
    const { graphId, name, execId } = value
    if (graphId) {
      // fetch data of active graph
      const dagId = await GraphRequestStore.request(
        {
          graphId,
          execId
        },
        true
      )
      if (dagId) {
        const data = {
          name,
          graphId,
          execId,
          dagId
        }
        // set global brief graph info
        store.commit('setActiveGraph', data)
        await HistoryListController.setActive(data, isToStart)
      }
    }
    // just modify url not fire page refresh,
    // need to remember: showing graphId and execId in route,
    // using graphId and dagId as unique version
    router.push({
      name: 'graphVisual',
      params: {
        id: String(graphId),
        execId: String(execId)
      },
      query: {
        name
      }
    })
  }

  public async testSet(value: GraphItemType) {
    const { graphId, name, execId } = value
    // fetch data of active graph
    const dagId = await GraphRequestStore.request(
      {
        graphId,
        execId
      },
      true
    )
    if (dagId) {
      const data = {
        name,
        graphId: GraphVisualStore.state.value.graphId,
        execId: 0,
        dagId
      }
      // set global brief graph info
      store.commit('setActiveGraph', data)
    }
  }
}

export const SwitchGraphController = new SwitchGraph()
