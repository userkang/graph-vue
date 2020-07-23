<template>
  <div :style="{ width, height }">
    <div class="code-handle-panel">
      <MtdTooltip v-if="isScroll" content="停止滚动">
        <i @click="disableScroll" class="handle-icon fixed-scroll"></i>
      </MtdTooltip>
      <MtdTooltip content="允许滚动" v-else>
        <i @click="enableScroll" class="handle-icon not-fixed-scroll"></i>
      </MtdTooltip>
    </div>
    <div class="vue-ace-wrap" id="vueAceComponent" ref="editor"></div>
  </div>
</template>

<style scoped lang="scss">
.vue-ace-wrap {
  width: 100%;
  height: 100%;
  font-size: 14px;
  font-weight: 300;
  border-radius: 4px;
  text-align: left;
  .code-handle-panel {
    width: 120px;
    height: 40px;
    box-sizing: border-box;
    padding: 10px 20px;
    position: absolute;
    right: -120px;
    top: 0;
    z-index: 999;
  }

  .handle-icon {
    display: inline-block;
    font: normal normal normal 14px/1 FontAwesome;
    font-size: inherit;
    text-rendering: auto;
    -webkit-font-smoothing: antialiased;
    color: rgba(0, 0, 0, 0.39);
    cursor: pointer;
  }

  .fixed-scroll {
    &:before {
      content: '\f08d';
    }
  }

  .not-fixed-scroll {
    &:before {
      content: '\f103';
    }
  }
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
interface CommandType {
  name: string
  bindKey: any
  exec: () => any
  readOnly: boolean
}

const ace = (window as any).ace
// 支持搜索框和语法工具
ace.require('ace/ext/language_tools')
ace.require('ace/ext/searchbox')
@Component
export default class CodeEditor extends Vue {
  @Prop()
  private value!: string
  @Prop()
  private lang!: string
  @Prop()
  private theme!: string
  @Prop({
    type: String,
    default: '100%'
  })
  private width!: string
  @Prop({
    type: String,
    default: '100%'
  })
  private height!: string
  @Prop()
  private readOnly!: boolean
  @Prop()
  private commands!: CommandType[]
  @Prop()
  private undo!: string

  private editor: any = null
  private lastContent = ''
  private isFullScreen = false
  private showSetting = false
  private isScroll = true
  private lastScrollLength = 0

  private changeFullScreen() {
    const editor = this.$refs.editor as HTMLDivElement
    if (!this.isFullScreen) {
      editor.style.width = document.body.clientWidth + 15 + 'px'
      editor.style.height = document.body.clientHeight + 'px'
      editor.style.position = 'fixed'
      editor.style.top = '0px'
      editor.style.left = '0px'
      editor.style.zIndex = '999'
      this.editor.resize()
      document.body.style.overflow = 'auto'
      this.isFullScreen = true
    } else {
      editor.style.width = '100%'
      editor.style.height = '600px'
      editor.style.position = 'relative'
      editor.style.zIndex = 'inherit'
      this.editor.resize()
      this.isFullScreen = false
    }
  }

  private triggerSettings() {
    this.showSetting = !this.showSetting
  }

  private disableScroll() {
    localStorage.setItem('isLogScroll', 'false')
    this.isScroll = false
  }

  private enableScroll() {
    localStorage.setItem('isLogScroll', 'true')
    this.isScroll = true
  }

  private handleScroll() {
    if (!this.isScroll) {
      this.editor.scrollToLine(this.lastScrollLength, false, true)
    } else {
      const length = this.editor.session.getLength()
      this.lastScrollLength = length
      this.editor.scrollToLine(length, false, true)
    }
  }

  private created() {
    const isLogScroll = localStorage.getItem('isLogScroll')
    if (isLogScroll) {
      this.isScroll = isLogScroll === 'true'
    }
  }

  private mounted() {
    this.editor = ace.edit(this.$refs.editor)
    // 语法高亮和背景色
    const lang = this.lang || 'etl'
    const theme = this.theme || 'pastel_on_dark'

    ace.require(`ace/mode/${lang}`)
    ace.require(`ace/theme/${theme}`)

    this.editor.getSession().setMode(`ace/mode/${lang}`)
    this.editor.setTheme(`ace/theme/${theme}`)

    this.$emit('init', this.editor)

    this.editor.$blockScrolling = Infinity
    // 自动补全
    this.editor.setOption({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    })

    // 设置只读
    this.editor.setReadOnly(this.readOnly)
    this.editor.setShowPrintMargin(false);
    this.editor.getSession().setUseWrapMode(true)
    this.editor.getSession().setUndoManager(new ace.UndoManager())
    // tslint:disable-next-line
    this.value && this.editor.setValue(this.value, 1)
    this.editor.on('blur', () => {
      const content = this.editor.getValue()
      this.$emit('onBlur', content)
    })

    this.editor.on('change', () => {
      const content = this.editor.getValue()
      this.$emit('input', content)
      this.lastContent = content
      this.$emit('onChange', content)
    })

    let commands: CommandType[] = [
      {
        name: 'fullscreen',
        bindKey: { win: 'Ctrl-Enter', mac: 'Command-Enter' },
        exec: () => {
          this.changeFullScreen()
        },
        readOnly: true
      },
      {
        name: 'settings',
        bindKey: { win: 'Ctrl-,', mac: 'Command-,' },
        exec: () => {
          this.triggerSettings()
        },
        readOnly: true
      }
    ]
    commands = commands.concat(this.commands || [])
    this.editor.commands.addCommands(commands)
  }

  @Watch('value')
  private watchValue(value: string) {
    if (this.editor && this.lastContent !== value) {
      try {
        this.editor.setValue(value, 1)
        this.handleScroll()
      } catch (error) {
        // tslint:disable-next-line
        console.log('一次性渲染量超过ace的极限，将启用增量渲染')
        this.editor.setValue(value.slice(0, 2000000), 1)
        this.editor.session.insert(
          {
            row: this.editor.session.getLength(),
            column: 0
          },
          value.slice(2000000)
        )
        this.handleScroll()
      }
    }
  }
}
</script>
