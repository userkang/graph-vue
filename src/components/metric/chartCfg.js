/* tslint:disable */
export default {
  title: {
    textStyle: {
      fontSize: 12,
      color: '#6f6f6f'
    },
    x_center: {
      x: 'center',
      bottom: 28
    },
    x_right_bottom: {
      x: 'right',
      bottom: 70
    },
    x_left_bottom: {
      x: 'left',
      bottom: 108,
      left: -2
    },
    y_top: {
      y: 35
    }
  },
  legend: {
    bottom: 40,
    // top: 0,
    left: 'center'
  },
  grid: {
    top: '5%',
    left: '4%',
    right: '4%',
    bottom: 150,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    // showDelay: 50,
    backgroundColor: 'rgba(255,255,255,0.98)',
    extraCssText: 'box-shadow: rgba(190,198,218,0.80)',
    borderColor: 'rgba(190,198,218,0.40)',
    borderWidth: 1
  },
  xAxis: {
    type: 'category', // 现在无法在最后添加末尾的点，必须是 value
    min: 'dataMin',
    max: 'dataMax',
    boundaryGap: false,
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    }
  },
  yAxis: {
    type: 'value',
    // min: 0,
    // max: 1,
    // splitNumber: 9,
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  series: {
    type: 'line',
    // style：图标 https://www.echartsjs.com/option.html#series-line.showAllSymbol
    // showSymbol: false
    // symbol: 'rect',
    symbolSize: 6,
    showAllSymbol: false
  },
  lineColors: ['#268ef3', '#82ECCD', '#FFA924', '#CF260C']
}
