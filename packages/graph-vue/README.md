# 机器学习平台画布组件演示
### 介绍
graph-vue 是基于我们自研的 graph-core 图可视化引擎封装的 vue 图可视化组件库。通过引入 vue 组件的方式，就能实现图可视化、图编辑等功能。

您还可以通过 vue 插槽的方式，对节点、边等元素进行自定义定制，来满足不同业务场景的需求。

同时 graph-vue 还提供了小地图、操作控件和右键菜单等插件组件。

另外，graph-vue 完全支持使用 graph-core 底层的 API，通过组件 init 方法透传的 graph 实例，可以实现更高阶的功能。

### 主要特征
易于使用：封装成 vue 组件，会使用 vue 就可以上手，无需掌握过多的 svg 知识。

自由定制：组件可以通过 vue 插槽的方式，进行节点、边、连接端口等元素的定制。

快速渲染：底层基于 graph-core 逻辑与渲染分离的特点，graph-vue 重新实现了 graph-core 的渲染层，利用 vue 虚拟 dom，提高渲染性能。

插件扩展：右键菜单、小地图和工具控件等插件，可以自由通过 vue 默认插槽引入。也支持自行扩展其他插件，通过插槽引入。

### 如何运行
#### step1  clone仓库
```
git clone ssh://git@git.sankuai.com/~zhangkangkang02/mlp-graph.git
```

#### step2 安装依赖
```
yarn
```

#### step3 运行项目:
```
yarn start
```

#### step4  
打开浏览器，访问页面

### 如何打包
graph-vue 共用同一套代码，不同打包方式，同时支持 vue2 和 vue3。
打包时，分别进入 graph-vue/vue2 和 graph-vue/vue3 目录，执行 yarn build 即可。

### 如何发包
在打包完成后，在对应的目录下，修改 package.json 中的版本号。执行 mnpm publish 进行发包。