<template>
  <div>
    <div class="addbtn">
      <mtd-button type="primary" @click="addGitVersion">新增版本</mtd-button>
    </div>
    <mtd-table :data="list">
      <mtd-table-column prop="name" label="名称">
        <template slot-scope="scope">
          <mtd-button type="text-primary" @click="lookup(scope.row)">{{ scope.row.name }}</mtd-button>
        </template>
      </mtd-table-column>
      <mtd-table-column prop="repos" label="git仓库"></mtd-table-column>
      <mtd-table-column prop="gitVersion" label="代码版本">
        <template slot-scope="scope">
          <span style="margin-right: 3px;">{{ scope.row.gitVersion }}</span>
          <mtd-tag size="small" v-if="scope.row.status === 'CURRENT'">当前使用</mtd-tag>
        </template>
      </mtd-table-column>
      <mtd-table-column prop="creator" label="创建人"></mtd-table-column>
      <mtd-table-column prop="created" label="创建日期"></mtd-table-column>
      <mtd-table-column prop="notes" label="描述"></mtd-table-column>
      <mtd-table-column label="操作">
        <template slot-scope="scope">
          <mtd-button type="text-primary" @click="edit(scope.row)">编辑</mtd-button>
          <mtd-button
            :disabled="scope.row.status === 'CURRENT'"
            type="text-primary"
            @click="del(scope.row)"
          >
            <mtd-tooltip
              v-if="scope.row.status === 'CURRENT'"
              content="当前版本正在运行中，请先停止作业在删除"
              placement="top"
            >
              <span>删除</span>
            </mtd-tooltip>
            <span v-else>删除</span>
          </mtd-button>
        </template>
      </mtd-table-column>
    </mtd-table>
    <mtd-pagination
      show-size-changer
      show-total
      @change="change"
      :total="page.totalCount"
      :current-page="page.currentPageNo"
      :page-size="page.pageSize"
      class="pager"
    ></mtd-pagination>
    <AddVersionModal
      :show.sync="isShowAddModal"
      :type="showType"
      :gitVersion="gitVersionData"
      @submit="submit"
      @edit="editSubmit"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { GitVersionStore } from '@/stores/stream/detail'
import AddVersionModal from './detail/AddVersionModal.vue'
import { StreamJobVersionVo, StreamJobVersionAddQuery } from '@/types/stream'

@Component({
  components: {
    AddVersionModal
  }
})
export default class GitVersion extends Vue {
  private gitState = GitVersionStore.state
  private isShowAddModal = false
  private gitVersionData = {}
  private showType = ''

  get list() {
    return this.gitState.list
  }

  get page() {
    return this.gitState.page
  }

  private change(page: number, size: number) {
    this.search({
      page: page ? page : 1, // FIXME: 可能是 mtd 的问题
      size
    })
  }

  private search(params: { size: number; page: number }) {
    const { taskId, jobId } = this.$route.params
    GitVersionStore.fetchGitList(params, {
      taskId,
      jobId
    })
  }

  private addGitVersion() {
    this.isShowAddModal = true
    this.showType = 'ADD'
    this.gitVersionData = {}
  }

  private edit(gitVersionData: StreamJobVersionAddQuery) {
    this.gitVersionData = gitVersionData
    this.isShowAddModal = true
    this.showType = 'EDIT'
  }

  private lookup(gitVersionData: StreamJobVersionAddQuery) {
    this.gitVersionData = gitVersionData
    this.isShowAddModal = true
    this.showType = 'SHOW'
  }

  private del(gitVersionData: StreamJobVersionVo) {
    this.$mtd
      .confirm({
        title: '提示',
        message: '删除版本同时会删除相关的发布历史，确认删除版本吗？',
        width: '430px',
        type: 'warning',
        showCancelButton: true,
        okButtonText: '确定'
      })
      .then((data: any) => {
        if (data.action === 'confirm') {
          const { taskId, jobId } = this.$route.params
          GitVersionStore.delGitVersion({
            taskId,
            jobId,
            versionId: gitVersionData.id
          }).then((v: boolean) => {
            if (v) {
              this.search({
                size: this.page.pageSize,
                page: this.page.currentPageNo
              })
            }
          })
        }
      })
  }

  private editSubmit(gitVersion: StreamJobVersionAddQuery) {
    const { taskId, jobId } = this.$route.params

    GitVersionStore.editGitVersion(
      {
        taskId,
        jobId,
        versionId: (this.gitVersionData as StreamJobVersionVo).id
      },
      gitVersion
    ).then((v: boolean) => {
      if (v) {
        this.$mtd.message({
          message: '成功！',
          type: 'success'
        })
        this.search({
          size: this.page.pageSize,
          page: 1
        })
      }
    })
  }

  private submit(gitVersion: StreamJobVersionAddQuery) {
    const { taskId, jobId } = this.$route.params

    GitVersionStore.addGitVersion(gitVersion, {
      taskId,
      jobId
    }).then((v: boolean) => {
      if (v) {
        this.$mtd.message({
          message: '成功！',
          type: 'success'
        })
        this.search({
          size: this.page.pageSize,
          page: 1
        })
      }
    })
  }

  private mounted() {
    this.search({
      size: this.page.pageSize,
      page: 1
    })
  }
}
</script>

<style lang="scss" scoped>
.addbtn {
  text-align: right;
  margin-bottom: 10px;
}
.pager {
  margin-top: 20px;
  text-align: right;
}
</style>
