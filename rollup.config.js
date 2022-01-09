import ts2 from 'rollup-plugin-typescript2'

const getOutput = (config) => ({
  paths: './build',
  sourcemap: true,
  ...config
})

export default {
  input: './src/index.ts',
  plugins: [
    ts2({ config: './tsconfig.json', extensions: ['.js', '.ts', '.tsx']})
  ],
  output: [
    getOutput({
      file: './lib/index.umd.js',
      format: 'umd',
      name: 'juln-hooks'
    }),
    getOutput({
      file: './lib/index.es.js',
      format: 'es',
    }),
  ]
}
