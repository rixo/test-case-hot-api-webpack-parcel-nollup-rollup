import a from './a'

console.log('c.js:', a)

export default `c(${a})`

if (module.hot) {
  module.hot.dispose(() => {
    console.log('dispose', 'c.js')
  })

  module.hot.accept(() => {
    console.log('accept c.js', a)
    // webpack will churn a warning because of the following require call,
    // but it will affect test results since Webpack don't run accept handlers
    if (typeof require !== 'undefined') {
      require(module.id)
    }
  })
}
