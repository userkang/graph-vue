import Vue from 'vue'
import Vuex from 'vuex'
import { GraphItemType } from '@/types/graph'
import { generateDefaultGraph } from '@/mock/graph'

Vue.use(Vuex)
// using vuex to save frequent and simple global state

export interface GlobalState {
  activeGraphExec: GraphItemType
  activeProject: string
  isLeftNavFold: boolean
  isRightTableShow: boolean
  isCurrentGraphCanBeEdit: boolean
}

const store = new Vuex.Store<GlobalState>({
  state: {
    activeGraphExec: generateDefaultGraph(),
    activeProject: '',
    isLeftNavFold: true,
    isRightTableShow: true,
    isCurrentGraphCanBeEdit: true
  },
  mutations: {
    setActiveGraph(state: GlobalState, payload: GraphItemType) {
      state.activeGraphExec = payload
    },
    cleanActiveGraph(state: GlobalState) {
      state.activeGraphExec = generateDefaultGraph()
    },
    setActiveProject(state: GlobalState, projectName: string) {
      state.activeProject = projectName
    },
    changeLeftNavFold(state: GlobalState, payload: boolean) {
      state.isLeftNavFold = payload
    },
    changeRightTableFold(state: GlobalState) {
      state.isRightTableShow = !state.isRightTableShow
    },
    showRightTableFold(state: GlobalState) {
      state.isRightTableShow = true
    },
    changeCurrentGraphEdit(state: GlobalState, payload: boolean) {
      state.isCurrentGraphCanBeEdit = payload
    }
  }
})

export default store
