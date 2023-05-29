<template>
  <circle
    class="graph-vue-port"
    :class="{
      'graph-vue-port-enable': enable,
      'graph-vue-port-active': port.type === 'out',
      'graph-vue-port-linked': linked
    }"
    :r="enable ? highlightCircleR : circleR"
  ></circle>
</template>

<script>
export default {
  props: ['port'],
  data() {
    return {
      circleR: 4,
      highlightCircleR: 6,
      enable: false,
      linked: false
    }
  },
  methods: {
    refreshPort() {
      this.enable = this.port.hasState('enable')
      this.linked = !this.enable && this.port.hasState('linked')
    }
  },
  created() {
    this.refreshPort()
    this.port.on('change', this.refreshPort)
  },
  beforeDestroy() {
    console.log(22333)
    this.port.off('change', this.refreshPort)
  }
}
</script>

<style lang="scss">
.graph-vue-port {
  stroke: #dddeeb;
  fill: #fff;
  stroke-width: 1;
  cursor: pointer;
}
.graph-vue-port-linked {
  fill: #606be1;
  stroke: #606be1;
}
.graph-vue-port-active:hover {
  stroke: #606be1;
  stroke-width: 2;
  fill: #fff;
}
.graph-vue-port-enable {
  stroke: rgba(96, 107, 225, 0.7);
  stroke-width: 4;
  fill: #fff;
}
.graph-vue-port-enable:hover {
  stroke-width: 6;
  fill: rgba(96, 107, 225);
}
</style>
