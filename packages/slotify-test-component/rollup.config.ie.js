// This rollup config is used to bundle and compile a version of the component for IE11
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/slotify-test-component-entry-legacy.js',
  output: {
    file: 'dist/slotify-test-component-legacy.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    babel({
      presets: [
        ["@babel/env", {"modules": false}] // Putting this in a separate .babelrc file doesn't seem to work
      ],
    })
  ]
};
