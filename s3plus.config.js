const { join } = require('path')

const env = process.env

const prodEnvList = ['staging', 'production']

const isProd = prodEnvList.indexOf(env.NODE_ENV) > -1

const tenantId = isProd ? '生产环境S3tenantId' : '测试环境S3tenantId'
const s3plusHost = isProd ? 's3plus.sankuai.com' : 'msstest-corp.sankuai.com'

module.exports = {
  tenantId,
  s3plusHost,
  deployCatalog: join(__dirname, 'dist'), // 默认是项目根目录下 dist 文件夹，可以根据项目需要自行改动
  bucket: env.NODE_ENV, // 可选值production、staging、test、beta、dev，由PLUS环境变量中配置
  customPath: '项目位置 自定义'
}
