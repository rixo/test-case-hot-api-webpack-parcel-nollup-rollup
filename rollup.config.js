import hot from 'rollup-plugin-hot'
import serve from 'rollup-plugin-serve'
import staticFiles from 'rollup-plugin-static-files'

const NOLLUP = !!process.env.NOLLUP

const plugins = NOLLUP
  ? []
  : [
      hot({
        rewriteModuleHot: true,
        public: 'public',
      }),
      serve('public'),
    ]

export default {
  input: './src/main.js',
  output: [
    {
      // works with Rollup:
      file: 'public/build/bundle.js',
    },
    {
      // also works with Rollup:
      dir: 'public/build',
      entryFileNames: 'build/shared.js',
    },
  ],
  plugins,
}
