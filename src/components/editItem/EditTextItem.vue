<template>
  <EditItem :text="localText" @submit="handleSubmit" @cancel="handleCancel">
    <MtdInput v-if="compType === 'input'" v-model="localText" />
    <MtdTextarea v-if="compType === 'textarea'" v-model="localText" />
  </EditItem>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import EditItem from '@/components/editItem/EditItem.vue'
@Component({
  components: { EditItem }
})
export default class EditInputItem extends Vue {
  @Prop({
    required: true
  })
  private text!: string

  @Prop({
    type: String,
    default: 'input' // input or textarea
  })
  private compType!: string

  private localText = this.text

  public handleCancel() {
    this.localText = this.text
  }

  public handleSubmit() {
    this.$emit('submit', this.localText)
  }

  @Watch('text')
  private watchText(value: string) {
    this.localText = value
  }
}
</script>
