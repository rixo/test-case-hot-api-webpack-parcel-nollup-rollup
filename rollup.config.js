import hot from 'rollup-plugin-hot'
import serve from 'rollup-plugin-serve'
import staticFiles from 'rollup-plugin-static-files'

const HOT = !!process.env.ROLLUP_WATCH
const NOLLUP = !HOT

const plugins = NOLLUP
  ? []
  : [
      staticFiles({
        include: ['./public'],
      }),
      hot({
        enabled: true,
        rewriteModuleHot: true,
        public: 'dist',
      }),
      serve('dist'),
    ]

export default {
  input: './src/main.js',
  output: {
    file: NOLLUP ? 'main.js' : 'dist/main.js',
    format: 'esm',
  },
  plugins,
}
