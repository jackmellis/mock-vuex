import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';

const extensions = [ '.js', '.ts' ];

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/mock-vuex.cjs.js',
      format: 'cjs',
      // exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/mock-vuex.es.js',
      format: 'es',
      // exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({ extensions }),
    babel({
      exclude: 'node_modules/**',
      extensions,
    }),
  ],
  external: [
    'vue',
    'vuex',
  ],
};
