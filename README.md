## 介绍
该项目是是一个支持*声明式架构*的图可视化引擎，声明式的好处是用户可以用自己习惯的方式来做定制，几乎没有学习成本。

下面是一个基于 vue 框架进行节点定制的示例，大家可以体验下便利之处：

```vue
<GraphVue :data="dataMock">
  <template #node="{ node }">
    <div class="custom-node">
      <div class="custom-node-label">{{ node.model.label }}</div>
      <div class="custom-node-desc">{{ node.model.desc }}</div>
    </div>
  </template>
</GraphVue>
```

如上，可以完全按照写 vue slot 定制的方式来完成图可视化场景的开发。


## 子项目
仓库由三个子项目组成：

**graph-logic**：基于 svg 开发，封装了图的数据处理、交互事件、状态等逻辑。因为是声明式架构，所以该层即实现了内部渲染层，也支持用户自定义实现渲染层。

**graph-vue**：在 graph-logic 的基础上，用 vue 实现了渲染层，方便使用 vue 的同学开发定制。同时里面还实现了一些好用的组件，比如工具栏、小地图、右键菜单等。

**graph-demo**：用 graph-vue 实现的一些示例，方便查看和调试。

## 运行

### 安装

```
yarn install
```

### 运行

```
yarn start
```

## 联系
邮箱：zkk_kangkang@163.com