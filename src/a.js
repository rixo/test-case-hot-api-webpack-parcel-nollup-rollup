const a = 'a'

console.log('a.js :=', a)

export default a

if (module.hot) {
  module.hot.dispose(() => {
    console.log('dispose a')
  })
}
