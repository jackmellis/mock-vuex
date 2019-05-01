const alias = require('module-alias');
require('@babel/register')({
  extensions: [ '.ts' ],
  ignore: [ 'node_modules/**' ],
});
// require('@babel/polyfill');
require('browser-env')();

// require('vue/dist/vue.common.prod')

alias.addAlias('vue', 'vue/dist/vue.min');
