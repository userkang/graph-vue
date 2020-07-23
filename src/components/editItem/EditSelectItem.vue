<template>
  <EditItem :text="localText" @submit="handleSubmit" @cancel="handleCancel">
    <MtdSelect v-model="localText">
      <MtdOption
        v-for="option in options"
        :label="option.label"
        :value="option.value"
        :key="option.value"
      />
    </MtdSelect>
  </EditItem>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import EditItem from '@/components/editItem/EditItem.vue'
interface OptionType {
  label: string
  value: string
}

@Component({
  components: {
    EditItem
  }
})
export default class EditInputItem extends Vue {
  @Prop({
    required: true
  })
  private text!: string

  @Prop({
    type: Array,
    default: [],
    required: true
  })
  private options!: OptionType[]

  private localText = this.text

  public handleCancel() {
    this.localText = this.text
  }

  public handleSubmit() {
    this.$emit('valueChange', this.localText)
  }

  @Watch('text')
  private watchText(value: string) {
    this.localText = value
  }
}
</script>
