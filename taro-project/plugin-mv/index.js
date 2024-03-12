const fs = require('fs-extra')
const path = require('path')

function copy(rootPath, dir) {
  const appPath = path.join(rootPath, dir)
  const outputPath = path.resolve(__dirname, '../dist')
  const destPath = path.join(appPath, 'taro')

  if (fs.existsSync(destPath)) {
    fs.removeSync(destPath)
  }

  console.log(`taro-project/dist -> ${destPath}`);

  fs.copySync(outputPath, destPath)
}

export default (ctx) => {
  ctx.onBuildFinish(() => {
    const isBuildComponent = ctx.runOpts._[1]

    if (!isBuildComponent) return

    console.log('编译结束！')

    const rootPath = path.resolve(__dirname, '../..')

    if (process.env.TARO_ENV === 'alipay') {
      copy(rootPath, 'mini-alipay')
    }

    if (process.env.TARO_ENV === 'weapp') {
      copy(rootPath, 'mini-weapp')
    }

    console.log('拷贝结束！')
  })
}
