### 简介

![avatar](../guide/assets/graph.gif#pic_left)

[mlp-graph](http://w.sankuai.com/zhangkangkang02/mlp-graph/index.html#/graph) 是一套图可视化的解决方案。它提供了图的绘制、布局、分析、交互等图可视化的基础能力。可用于流程图，图分析，实验建模等常见的业务场景。

### 设计理念

该方案由 graph-core 基础库和 graph-vue 项目组成。

graph-core 库封装了一些常见的图的底层逻辑和交互处理，但不包含渲染部分。

graph-vue 项目是基于 graph-core 库和 vue 框架对渲染层进行了实现。

#### 1、为什么要进行 graph-core 和 graph-vue 的拆分？

- 将图的核心逻辑处理和渲染分开，这个正是着手开发该项目的原因之一；
- 对业界常见的图可视化引擎进行调研，大致分两类：
  1. 包含图的逻辑和渲染（如 G6）。问题：渲染层对用户透明，自定义样式和扩展比较麻烦，尤其配置化的文档对于新手不友好；
  2. 只包含图的逻辑处理（如 dagre）。问题：缺乏交互相关的封装，渲染层对 D3 支持较好，但学习成本较高；
- 拆分后，将渲染交给用户去实现。用户可以根据自己熟悉的框架实现样式，交互的自定义，很大程度上降低了上手成本，提高了开发效率。

#### 2、我是用户，我该如何判断选择哪个库？

- 按照业务场景去选择
  - 如果是简单做展示用，样式上也没有太多定制。可以直接使用基于 graph-core 封装的业务组件；
  - 如果自定义程度较高。可以基于 graph-core 库，自己扩展交互，定制渲染层。

### 安装 & 引用

#### 方式一：在项目中使用 NPM 包引入

1. 使用命令行在项目目录下执行以下命令：

```shell
# npm
mnpm install @datafe/graph-core

# yarn
yarn add --registry=http://r.npm.sankuai.com @datafe/graph-core
```

2. 在需要用的 Graph 的 JS 文件中导入：

```shell
import { Graph } from '@datafe/graph-core'
```

#### 方式二：在 HTML 中使用 CDN 引入

```shell
<script src="https://s3plus.meituan.net/v1/mss_55f8d9a6b05d4008ae93823a3e424f50/graph-core/0.3.1/core.min.js"></script>
```
