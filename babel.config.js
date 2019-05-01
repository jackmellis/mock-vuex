const isTest = process.env.NODE_ENV === 'test';

const config = {
  presets: [],
  plugins: [],
};

config.presets.push('@babel/preset-typescript');
if (isTest) {
  config.presets.push([
    '@babel/preset-env',
    {
      targets: {
        node: 'current',
      },
      modules: 'commonjs',
      useBuiltIns: false,
    },
  ]);
} else {
  config.presets.push([
    '@babel/preset-env',
    {
      targets: {
        browsers: [ 'last 2 versions' ],
      },
      modules: false,
      useBuiltIns: false,
    },
  ]);
}

config.plugins.push('@babel/plugin-proposal-class-properties');

config.sourceMaps = isTest ? 'inline' : true;

module.exports = config;
