import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { ActiveNodeStore } from '@/stores/workflow/graphVisual/activeNode'

@Component
export default class NodeInfoMixin extends Vue {
  activeNodeTypeState = ActiveNodeStore.state

  get NodeInfoMixin__nodeId() {
    return String(this.activeNodeTypeState.value.id)
  }

  get NodeInfoMixin__workflowId() {
    return String(this.activeNodeTypeState.value.workflowId)
  }

  get NodeInfoMixin__nodeType() {
    return this.activeNodeTypeState.value.componentType
  }

  get NodeInfoMixin__toolType() {
    return this.activeNodeTypeState.value.categoryType
  }
}
