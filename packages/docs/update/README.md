## 更新日志

 ## @datafe/graph-core@0.3.10

- 【graph-core】在使用内部渲染时，支持节点和边自定义方式。

- 【graph-core】修复刷新节点状态不更新问题。

- 【graph-core】优化元素查询逻辑和group计算逻辑，性能有较大提升。

- 【graph-core】优化箭头渲染逻辑。

### @datafe/graph-core@0.3.9

- 【graph-core】node 不传坐标值时默认为 0；

- 【graph-core】过滤掉不存在起始节点/目标节点的无效边

- 【graph-core】graph 实例添加 detectDirectedCycle 方法，判断图是否为有向无环图。

---

### @datafe/graph-core@0.3.8

- 【graph-core】graph 实例添加 getData 方法，可以直接获取 model 数据

- 【graph-core】所有涉及该字段的地方：drection => direction。升级该版本及以上版本需要注意。

- 【graph-core】node 坐标为 0 时报错问题修复

- 【文档】事件处理函数接收了两个参数，但文档上只有一个，已经更新

---

### @datafe/graph-core@0.3.7

- 【graph-core】fix: 画布 scroll 脱离可视区后，居中偏离问题。

---

### @datafe/graph-core@0.3.5

- 【graph-core】fix: 画布 resize 后，缩放坐标位置偏移问题

- 【graph-core】feat: layout 方法支持参数配置，支持用户配置自定义布局

- 【graph-vue】fix：svg 中 translate3D 改为 translate。解决画布节点点击样式不刷新问题。

---

### @datafe/graph-core@0.3.4

- 【graph-core】feat: 如果有明确的 slotId，连线时，支持仅传 slotId，对 nodeId 进行推断。

- 【graph-core】fix: 画布移动时，暂时去掉对边界的限制，修复大图剩余部分无法展示的场景。

- 【graph-core】fix: 修复 ts 中 updateNode、updateEdge 类型报错问题

---

### @datafe/graph-core@0.3.3

- 【graph-core】feat: 添加更新节点和边的接口，返回相对应实例

- 【graph -core】fix: 更新节点方法中 高度获取错误 this.set('height', this.model.height || this.width)

---

### @datafe/graph-core@0.3.2

- 【graph-core】fix: 选择节点和边时不能切换问题

- 【graph-core】fix: 修复连接边时 slot 状态变化问题

- 【graph-core】feat: 添加更新节点和边的接口，updateNode, updateEdge

---

### @datafe/graph-core@0.3.1

- 【graph-core】优化按需渲染，减少 dom 操作

- 【graph-core】fix：data 方法执行数据更新时，自渲染需要先清除画布元素

- 【graph-core】fix：解决自渲染，点击边元素，箭头不高亮的问题。

- 【graph-core】fix：点击节点和边行为，edgeselelctchange 和 nodeselectchange 触发逻辑优化。

- 【graph-core】feat：节点信息如果无 slots 字段，边信息可省去 fromSlotId 和 toSlotId 信息。内部代码自动补全。

- 【graph-core】fix：节点的显示字段由 nodeName 改为 label。出于通用考虑

---

## 大版本更新

### @datafe/graph-core@0.3.0

---

- 【graph-core】添加默认渲染层。

---

### @datafe/graph-core@0.2.13

- 【graph-core】修复利用自增 id 渲染，新增节点 id 重复问题

---

### @datafe/graph-core@0.2.12

- 【graph-core】改回 esnext 打包，去掉 package.json 中的 browser 字段。这个字段影响 require 入口点次序。https://docs.npmjs.com/cli/v6/configuring-npm/package-json#browser

---

### @datafe/graph-core@0.2.11

- 【graph-core】采用 CommonJS 方式打包

---

### @datafe/graph-core@0.2.10

- 【graph-core】采用 UMD 方式打包

---

### @datafe/graph-core@0.2.9

- 【graph-core】修改 graph-core 引入方式。import Graph from '@datafe/graph-core' => import { Graph } from '@datafe/graph-core'

---

### @datafe/graph-core@0.2.8

- 【graph-core】【事件管理】修复 nodeselectchange, edgeselectchange 在未空值时也会触发的问题。

- 【graph-core】【事件管理】添加 datachange 钩子，目前：afteraddnode, afteraddedge, nodeselectchange, edgeselectchange, afterdeletenode, afterdeleteedge, afterdragnode, afterlayout 可以自动触发该事件。

- 【graph-core】【事件管理】将之前 data-type 当前节点只能传递 id 值，改成传递 dataset 全部自定义值。方便用户绑定事件时，传递更多自定义值。

-【graph-core】【事件管理】wheel 事件绑定目标节点更改（window 改为画布节点）。

- 【graph-core】【项目配置】package.json 中 types 指定路径修改。

- 【graph-core】【API】添加 addAction 和 removeAction 接口

- 【graph-vue】边添加运行时动画

- 【graph-vue】 添加 demo 页配置面板，修改 demo 页面样式为 dark 模式

---

### @datafe/graph-core@0.2.7

- 【撤销功能】删除节点后，节点相关撤销报错问题

- 【批量删除功能】修复批量删除后回撤功能问题

- 【Edge 实例参数调整】去掉原有 fromPoint、toPoint 参数。用户可改用为 fromSlot 和 toPoint。

- 【graph-vue】添加边对箭头的支持

---

### @datafe/graph-core@0.2.6

- 添加了撤销和回撤功能

---

### @datafe/graph-core@0.2.5

- 兼容用户传入所有的数据类型，挂载到实例 model 下

---

### @datafe/graph-core@0.2.4

- 支持 id 传入 number 类型

- 完善对 TS 开发的支持

---

### @datafe/graph-core@0.2.2

- 规范配置数据格式

- 规范部分 hooks 的命名

- 支持多插槽配置

---

### @datafe/graph-core@0.1.12

- 修改 afterdragnode 触发时机

---

### @datafe/graph-core@0.1.8

- 对外包发布

---
