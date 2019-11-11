import b from './b'
import c from './c'

console.log('main.js')

const interval = setInterval(() => {
  console.log('main.js:', b, c)
}, 1000)

if (module.hot) {
  module.hot.dispose(() => {
    console.log('dispose', 'main.js')
    clearInterval(interval)
  })
}
