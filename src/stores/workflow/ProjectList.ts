import Base from '../base'

class ProjectList extends Base {
  state = {
    list: [],
    bizList: [],
    bizSubject: ''
  }

  setBizSubject(v: string) {
    this.state.bizSubject = v
  }

  async getBizList() {
    try {
      const value = await this.$requestHandle('get', '/workflow/biz/info/mlp')
      this.state.bizList = value.data.data
      // tslint:disable-next-line
    } catch (e) {}
  }

  // 数据结构处理
  formatTreeList(v = []) {
    v.forEach((item: any) => {
      this.formatProjectItem(item)

      item.workflows.forEach((it: any) => {
        this.formatWorkflowItem(it)
      })

      if (item.subGroups && item.subGroups.length) {
        item.children = item.subGroups.concat(item.workflows)
      } else {
        item.children = item.workflows
      }

      // 为了兼容空文件夹，仍显示文件夹样式的情况
      if (!item.children.length) {
        item.children = [{}]
        item.isProject = true
      }

      this.formatTreeList(item.subGroups)
    })
  }

  getGroup(value: any, groupId: number | string) {
    let res
    ;(function findGroup(data, id) {
      for (const i in data) {
        if (data[i].id === id) {
          res = data[i]
          break
        } else {
          findGroup(data[i].subGroups, id)
        }
      }
    })(value, groupId)
    return res
  }

  formatProjectItem(item: any) {
    item.type = 'project'
    item.title = item.groupName
    item.treeId = `${item.parentGroupId}-${item.id}`
    item.parentId = item.parentGroupId
  }

  formatWorkflowItem(item: any) {
    item.type = 'workflow'
    item.title = item.workflowName
    item.treeId = `${item.groupId}-${item.id}`
    item.parentId = item.groupId
  }

  async getProjectList() {
    if (!this.state.bizSubject) {
      return
    }
    try {
      const value = await this.$requestHandle('get', '/workflow/group', {
        bizSubject: this.state.bizSubject
      })
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      // tslint:disable-next-line
    } catch (e) {}
  }

  async getAsyncList(workflowGroupId: number) {
    try {
      const value = await this.$requestHandle(
        'get',
        `/workflow/group/${workflowGroupId}`
      )
      // tslint:disable-next-line
    } catch (e) {}
  }

  async moveGroup(workflowGroupId: number, targetGroupId: number) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/workflow/group/${workflowGroupId}/${targetGroupId}/move`
      )
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      // tslint:disable-next-line
    } catch (e) {
      this.getProjectList()
    }
  }

  async moveWorkflow(workflowId: number, targetGroupId: number) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/group/${targetGroupId}/move`
      )
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      // tslint:disable-next-line
    } catch (e) {
      this.getProjectList()
    }
  }

  async addProject(payload: Workflow.ProjectPayload) {
    try {
      const value = await this.$requestHandle(
        'post',
        '/workflow/group',
        payload
      )
      if (value.data.code === 0) {
        value.data.message = '添加成功！'
      }
      this.$showMessage(value.data.message)
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      // tslint:disable-next-line
    } catch (e) {
      throw null
    }
    return null
  }

  async addWorkflow(
    payload: Workflow.WorkflowPayload
  ): Promise<{ id: number; name: string }> {
    try {
      const value = await this.$requestHandle('post', '/workflow', payload)
      if (value.data.code === 0) {
        value.data.message = '添加成功！'
      }
      this.$showMessage(value.data.message)
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      const group = this.getGroup(value.data.data, payload.groupId)
      let workflow
      if (group) {
        workflow = group.workflows[group.workflows.length - 1]
      }
      return {
        id: workflow ? workflow.id : 0,
        name: workflow.workflowName
      }
      // tslint:disable-next-line
    } catch (e) {
      throw null
    }
  }

  async copyProject(groupId: number) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/workflow/group/${groupId}/copy`
      )
      if (value.data.code === 0) {
        value.data.message = '复制成功！'
      }
      this.$showMessage(value.data.message)
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      return {
        groupId: value.data.data.id,
        groupName: value.data.data.groupName
      }
      // tslint:disable-next-line
    } catch (e) {}
  }

  async copyWorkflow(workflowId: number) {
    try {
      const value = await this.$requestHandle(
        'post',
        `/workflow/${workflowId}/copy`
      )
      if (value.data.code === 0) {
        value.data.message = '复制成功！'
      }
      this.$showMessage(value.data.message)

      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      return {
        groupId: value.data.data.id,
        groupName: value.data.data.groupName
      }
      // tslint:disable-next-line
    } catch (e) {}
  }

  async updateProject(payload: Workflow.UpdateProjectPayload) {
    const { workflowGroupId, groupName, groupDesc } = payload
    try {
      const value = await this.$requestHandle(
        'patch',
        `/workflow/group/${workflowGroupId}`,
        {
          groupName,
          groupDesc
        }
      )
      if (value.data.code === 0) {
        value.data.message = '更新成功！'
      }
      this.$showMessage(value.data.message)

      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      return {
        groupId: value.data.data.id,
        groupName: value.data.data.groupName
      }
      // tslint:disable-next-line
    } catch (e) {
      throw null
    }
  }

  async updateWorkflow(
    payload: Workflow.UpdateWorkflowPayload
  ): Promise<{ id: number; name: string }> {
    const { workflowId, groupId, workflowName, owner, workflowDesc } = payload
    try {
      const value = await this.$requestHandle(
        'patch',
        `/workflow/${workflowId}`,
        {
          workflowName,
          groupId,
          owner,
          workflowDesc
        }
      )
      if (value.data.code === 0) {
        value.data.message = '更新成功！'
      }
      this.$showMessage(value.data.message)
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      return {
        id: workflowId,
        name: workflowName
      }
      // tslint:disable-next-line
    } catch (e) {
      throw null
    }
  }

  async deleteProject(id: number) {
    try {
      const value = await this.$requestHandle(
        'deleted',
        `/workflow/group/${id}`
      )
      if (value.data.code === 0) {
        value.data.message = '删除成功！'
      }
      this.$showMessage(value.data.message)
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      // tslint:disable-next-line
    } catch (e) {}
  }

  async deleteWorkflow(id: number) {
    try {
      const value = await this.$requestHandle('deleted', `/workflow/${id}`)
      if (value.data.code === 0) {
        value.data.message = '删除成功！'
      }
      this.$showMessage(value.data.message)
      this.state.list = value.data.data
      this.formatTreeList(this.state.list)
      // tslint:disable-next-line
    } catch (e) {}
  }
}

export const ProjectListStore = new ProjectList()
