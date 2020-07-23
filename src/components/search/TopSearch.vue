<template>
  <div class="projectTree">
    <mtd-popover
      v-model="popoverVal"
      ref="popover"
      placement="bottom-start"
      width="332"
      popper-class="title-popover"
      trigger="click"
      :show-arrow="false"
    >
      <div class="top-zone">
        <span class="title">{{value}}</span>
        <i class="mtdicon mtdicon-triangle" />
      </div>
      <template slot="content">
        <SearchContent :data="projectList" @change="handleChange" />
      </template>
    </mtd-popover>
  </div>
</template>

<script lang='ts'>
import { Vue, Component, Watch, Inject } from 'vue-property-decorator'
import { ProjectListStore } from '../../stores/graph/GraphList'
import { WXProjectVoType } from '../../types/graph'
import SearchContent from './SearchContent.vue'
import { escapeHtml } from '../../common/utils'

@Component({
  components: {
    SearchContent
  }
})
export default class SideNavTitle extends Vue {
  @Inject()
  private reload!: () => void

  private value = ''
  private projectInfo!: WXProjectVoType

  private currentProject = ''

  private popoverVal = false

  private projectList: WXProjectVoType[] = []

  get projectNames() {
    return this.projectList.map(item => item.name)
  }

  private handleEmptyProject() {
    this.$mtd.message({
      message: '您目前还没有项目组，即将跳转到个人工作台',
      type: 'error'
    })
    setTimeout(() => {
      location.href = `${location.origin}/personal-panel/#/projectOwner`
    }, 5000)
  }

  private saveProjectName(projectInfo: WXProjectVoType) {
    const projectName = projectInfo.name
    // the logic for handling cookie is sync, so save cookie firstly, then jump to the page
    document.cookie = `ml.projectName=${projectName};max-age=${60 *
      60 *
      24 *
      365};path=/`
    localStorage.setItem('ml.projectName', projectName)
    localStorage.setItem('ml.projectInfo', JSON.stringify(projectInfo))
    this.$store.commit('setActiveProject', projectName)
  }

  private handleChange(value: WXProjectVoType) {
    this.popoverVal = false
    this.value = value.name
    this.projectInfo = value
    this.saveProjectName(value)
    this.reload()
  }

  private handleDefaultProject() {
    if (!this.projectList || this.projectList.length === 0) {
      // if user do not have project, jump to personal workbench
      // this.handleEmptyProject();
      // todo need modify
    } else {
      const lastProjectName = localStorage.getItem('ml.projectName')
      const lastProjectInfo = localStorage.getItem('ml.projectInfo')
      if (lastProjectName) {
        this.value = lastProjectName
      } else {
        const defaultItem = this.projectList[0]
        this.value = defaultItem.name
      }

      if (lastProjectInfo) {
        this.projectInfo = JSON.parse(lastProjectInfo as string)
      } else {
        this.projectInfo = this.projectList[0]
      }

      // if current project do not belong to current user, just give a warning
      if (!this.projectNames.includes(this.value)) {
        this.$mtd.message({
          type: 'warning',
          message: '当前访问的项目组不在你所在的项目列表中，请重新选择'
        })
      } else {
        this.saveProjectName(this.projectInfo)
      }
    }
  }

  private async created() {
    const value = await ProjectListStore.request()
    this.projectList = value
    this.handleDefaultProject()
  }
}
</script>

<style lang='scss' scoped>
.projectTree {
  width: 240px;
  .top-zone {
    display: flex;
    align-items: center;
    width: 240px;
    height: 34px;
    background: rgba(164, 169, 221, 0.15);
    border: 1px solid #4b5080;
    border-radius: 4px;
    .title {
      cursor: pointer;
      margin: 0 6px 0 12px;
      font-family: PingFangSC-Medium;
      width: 196px;
      font-size: 14px;
      color: #c0c4e0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .mtdicon-triangle {
      color: #cbcde2;
      border-radius: 1px;
      font-size: 12px;
    }
  }
}
</style>