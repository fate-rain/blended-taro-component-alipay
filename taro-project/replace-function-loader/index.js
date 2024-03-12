const fs = require('fs-extra')
const path = require('path')

const createNativeComponentConfig = fs.readFileSync(path.resolve(__dirname, 'createNativeComponentConfig.js'), 'utf8')

/**
 * 替换`createNativeComponentConfig`函数，支持`alipay`原生`Component`
 * 支付宝小程序Component生命周期：https://opendocs.alipay.com/mini/framework/component-lifecycle?pathHash=9b628e01
 */
module.exports = function(source) {
  return source.replace(
    /function\s+createNativeComponentConfig\([^)]*\)\s*{[\s\S]*?\n}/gs,
    createNativeComponentConfig
  );
};
