import * as lib from './lib'
import isArrowFunction from 'is-arrow-function'

Object.entries(lib).forEach(([key, value]) => {
  if (isArrowFunction(value)) {
    exports[key] = value
  } else {
    const f = (...args) => subject => value.apply(subject, args)
    Object.defineProperties(f, {
      name: Object.assign(Object.getOwnPropertyDescriptor(f, 'name'), {
        value: value.name
      }),
      length: Object.assign(Object.getOwnPropertyDescriptor(f, 'length'), {
        value: value.length
      })
    })
    exports[key] = f
  }
})