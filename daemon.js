#!/usr/bin/env node
// 提供一个脚本用于不通过plus发布项进行测试
const childProcess = require('child_process')
childProcess.exec(
  `./node_modules/.bin/vue-cli-service serve`,
  { maxBuffer: 2 * 1024 * 1024 * 1024 },
  (err, stdout, stderr) => {
    if (err) {
      console.log(stderr)
    } else {
      console.log(stdout)
    }
  }
)
