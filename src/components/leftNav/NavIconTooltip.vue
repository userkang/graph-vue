<template>
  <MtdTooltip :content="title" placement="right">
    <div style="height: 46px" class="active-navicon-wrap" @click.capture="handleClick">
      <NavIconFont :icon="icon" class="fold-nav-font" :isFold="true" />
    </div>
  </MtdTooltip>
</template>

<style lang="scss">
.file-icon {
  display: inline-block;
  width: 14px;
  height: 15px;
  margin-right: 9px;
  margin-top: -2px;
  color: #8a94c2;
}
.router-link-active .active-navicon-wrap {
  background: #ebeefa;
  .file-icon-font {
    color: #606be1;
    font-weight: normal;
  }
}
</style>
<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import NavIconFont from './NavIconFont.vue'

@Component({
  components: {
    NavIconFont
  }
})
export default class NavIconTooltip extends Vue {
  @Prop({
    type: String,
    // img/icon
    default: 'img'
  })
  private navType!: string

  @Prop({
    required: true
  })
  private title!: string

  @Prop({
    type: String,
    default: ''
  })
  private icon!: string

  @Prop({
    required: true
  })
  private isFold!: boolean

  private handleClick() {
    this.$emit('click')
  }
}
</script>
