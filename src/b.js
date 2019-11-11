import a from './a'

console.log('b.js:', a)

export default `b(${a})`

if (module.hot) {
  module.hot.dispose(() => {
    console.log('dispose', 'b.js')
  })

  module.hot.accept(() => {
    console.log('accept b.js', a)
    // webpack will churn a warning because of the following require call,
    // but it will affect test results since Webpack don't run accept handlers
    if (typeof require !== 'undefined') {
      require(module.id)
    }
  })
}
