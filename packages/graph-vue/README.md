# 图编排vue组件
### 介绍
graph-vue 是一个开箱即用的图可视化组件库。通过引入 vue 组件的方式，就能实现图可视化、图编辑等功能。

比如实现机器学习建模流程、思维导图、节点分组等场景。

**您还可以通过 vue 插槽的方式，对节点、边等元素进行自定义定制，来满足不同业务场景的需求。**

同时 graph-vue 还提供了小地图、操作控件和右键菜单等插件组件。


使用示例：
```
<GraphVue
  :data="dataMock"
  :action="action"
  :layout="layout"
  @init="initGraph"
  :defaultNode="defaultNode"
>
  <!-- 节点自定义能力 -->
  <template #node="{ node }">
    <div 
      class="component-item"
      :style="{
        'content-visibility': 'auto'
      }"
      :class="{ selected: node.hasState('selected') }"
    >
      {{node.model.label}}
    </div>
  </template>
</GraphVue>
```


### 依赖
vue 2.x

### 如何运行
#### step1  clone仓库
```
yarn add graph-vue
npm install graph-vue
```
