<template>
  <div id="app">
    <div class="container">
      <div class="top-panel">
        <div class="name">graph-demo</div>
      </div>
      <div class="main-wrap">
        <TemplatePanel />
        <div class="main-center-wrap">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TemplatePanel from '@/components/template-panel.vue'

@Component({
  components: {
    TemplatePanel
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
.top-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 42px;
  background: #333;
  padding: 0px 10px;
  border-bottom: 1px solid #222;
  .name {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
  }
  .link {
    font-size: 12px;
    color: #eee;
    text-decoration: none;
    margin-right: 10px;
    user-select: none;
  }
}
.main-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 42px);
  display: flex;
}
.main-center-wrap {
  flex: 1;
  position: relative;
  background: #242424;
}
</style>
