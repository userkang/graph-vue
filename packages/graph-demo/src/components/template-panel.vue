<template>
  <div class="temp-panel">
    <div class="title">模板</div>
    <ul class="demo">
      <li
        class="demo-item"
        :class="{ selected: activeTemplate === item.type }"
        v-for="item in demoTemplates"
        :key="item.id"
        @click="getDemo(item.type)"
      >
        <ToolTip :message="item.desc" placement="right">
          <div class="demo-item-wrap">
            <img class="image" :src="item.img" />
          </div>
        </ToolTip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ToolTip from '@/components/tool-tip.vue'
import demoDefault from '@/assets/imgs/demo-default.jpg'
import demoTree from '@/assets/imgs/demo-tree.jpg'

const getRandomId = () => Math.random().toString().slice(2)

enum demoTypes {
  DEFAULT = 'dag',
  TREE = 'tree',
  MINDMAP = 'mindMap',
  NODEGROUP = 'nodeCell',
  CIRCLE_LAYOUT = 'circleLayout'
}

@Component({
  components: {
    ToolTip
  }
})
export default class ComponentPanel extends Vue {
  activeTemplate: string = demoTypes.DEFAULT

  demoTemplates = [
    {
      id: getRandomId(),
      type: demoTypes.DEFAULT,
      desc: 'dag 图',
      img: demoDefault
    },
    {
      id: getRandomId(),
      type: demoTypes.TREE,
      desc: '树型结构',
      img: demoTree
    },
    {
      id: getRandomId(),
      type: demoTypes.MINDMAP,
      desc: '思维导图',
      img: demoTree
    },
    {
      id: getRandomId(),
      type: demoTypes.NODEGROUP,
      desc: '节点组',
      img: demoTree
    },
    {
      id: getRandomId(),
      type: demoTypes.CIRCLE_LAYOUT,
      desc: '圆形布局',
      img: demoTree
    }
  ]

  async getDemo(type: string) {
    this.activeTemplate = type
    this.$router.push({ path: type })
  }

  initActiveTemplate() {
    const hash = location.hash
    const templateType = hash.split('/')[1]
    this.activeTemplate = templateType
  }

  created() {
    this.initActiveTemplate()
  }
}
</script>

<style lang="scss" scoped>
.temp-panel {
  position: relative;
  width: 190px;
  height: 100%;
  box-sizing: border-box;
  background: #333;
  border-right: 1px solid #222;
}
.title {
  font-size: 12px;
  color: #ddd;
  text-align: left;
  margin: 5px 10px;
}
.component-item {
  display: flex;
  height: 35px;
  box-sizing: border-box;
  color: #ddd;
  font-size: 12px;
  padding-left: 40px;
  align-items: center;
  cursor: pointer;
  user-select: none;
  .iconfont {
    margin-right: 6px;
  }
  &:hover {
    background: #484848;
  }
}
.active {
  border: 1px dashed #999;
  cursor: grabbing;
}
.demo {
  width: 100%;
  &-item {
    position: relative;
    margin-top: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80%;
    height: 100px;
    margin-left: 10%;
    overflow: hidden;
    box-sizing: border-box;
    &-wrap {
      position: relative;
      width: 100%;
      height: 100%;
      transition: all 0.5s;
      box-sizing: border-box;
      &:hover {
        transform: scale(1.1);
      }
      .image {
        width: 100%;
        height: 100%;
      }
    }
  }
  .selected {
    border: 1px solid #4e73ff;
  }
}
</style>
