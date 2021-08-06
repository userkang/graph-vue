const exec = require('child_process').exec

const withExecPromise = cmd =>
  new Promise((resolve, reject) =>
    exec(String(cmd), (err, out) => (err ? reject(err) : resolve(out)))
  )

const getCurrentBranch = () =>
  withExecPromise('git rev-parse --symbolic --abbrev-ref HEAD')
const docsBranchName = 'docs'
const deployUrl = `https://docs.sankuai.com/hook/mt/~zhangkangkang02/mlp-graph/${docsBranchName}/`
const deploy = () => withExecPromise(`curl ${deployUrl}`)
Promise.resolve()
  .then(() => getCurrentBranch())
  .then(branchName => {
    if (branchName.trim() === docsBranchName) {
      return deploy().then(res => console.log(res))
    }
  })
