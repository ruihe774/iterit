import * as it from './lib'
import shuffle from 'lodash.shuffle'

test('index', () => {
  expect(it.index.name).toBe('index')
  expect(it.index.length).toBe(1)
  expect(
    {
      awd: 'dwa',
      def: 'ccc'
    }::it.index('awd')
  ).toBe('dwa')
  const sb1 = Symbol()
  const sb2 = Symbol()
  expect(
    {
      [sb1]: 'awd',
      [sb2]: 'dwa'
    }::it.index(sb2)
  ).toBe('dwa')
  class C {
    get awd() {
      return 'dwa'
    }
  }
  const o = new C()
  expect(o::it.index('awd')).toBe('dwa')
})

test('bind', () => {
  expect(it.bind.name).toBe('bind')
  expect(it.bind.length).toBe(1)
  function f() {
    return this
  }
  expect(f::it.bind(1)()).toBe(1)
  const o = {}
  expect(f::it.bind(o)()).toBe(o)
  expect(((...args) => args)::it.bind(null, 1, 2, 3)(4, 5)).toEqual([
    1,
    2,
    3,
    4,
    5
  ])
})

test('getBound', () => {
  expect(it.getBound.name).toBe('getBound')
  expect(it.getBound.length).toBe(1)
  class C {
    awd() {
      return this
    }
  }
  const o = new C()
  expect(o::it.getBound('awd')()).toBe(o)
  const o2 = {
    dwa() {
      return this
    }
  }
  expect(o2::it.getBound('dwa')()).toBe(o2)
})

test('typeOf', () => {
  expect(it.typeOf.name).toBe('typeOf')
  expect(it.typeOf.length).toBe(0)
  expect('awd'::it.typeOf()).toBe('string')
  expect({}::it.typeOf()).toBe('object')
  expect(Symbol()::it.typeOf()).toBe('symbol')
  expect(null::it.typeOf()).toBe('object')
  expect(1::it.typeOf()).toBe('number')
  expect((void 0)::it.typeOf()).toBe('undefined')
  let awd
  expect(awd::it.typeOf()).toBe('undefined')
  expect(true::it.typeOf()).toBe('boolean')
})

test('is', () => {
  expect(it.is.name).toBe('is')
  expect(it.is.length).toBe(1)
  expect((void 0)::it.is(void 0)).toBe(true)
  expect(null::it.is(null)).toBe(true)
  expect(true::it.is(true)).toBe(true)
  expect('foo'::it.is('foo')).toBe(true)
  expect(0::it.is(0)).toBe(true)
  expect((+0)::it.is(-0)).toBe(false)
  expect((+0)::it.is(0)).toBe(true)
  expect((-0)::it.is(0)).toBe(false)
  expect(0::it.is(false)).toBe(false)
  expect(''::it.is(false)).toBe(false)
  expect('0'::it.is(0)).toBe(false)
  expect('17'::it.is(17)).toBe(false)
  expect([1, 2]::it.is('1,2')).toBe(false)
  expect(new String('foo')::it.is('foo')).toBe(false)
  expect(null::it.is(void 0)).toBe(false)
  expect(NaN::it.is(NaN)).toBe(true)
})

test('sameValueZero', () => {
  expect(it.sameValueZero.name).toBe('sameValueZero')
  expect(it.sameValueZero.length).toBe(1)
  expect((void 0)::it.sameValueZero(void 0)).toBe(true)
  expect(null::it.sameValueZero(null)).toBe(true)
  expect(true::it.sameValueZero(true)).toBe(true)
  expect('foo'::it.sameValueZero('foo')).toBe(true)
  expect(0::it.sameValueZero(0)).toBe(true)
  expect((+0)::it.sameValueZero(-0)).toBe(true)
  expect((+0)::it.sameValueZero(0)).toBe(true)
  expect((-0)::it.sameValueZero(0)).toBe(true)
  expect(0::it.sameValueZero(false)).toBe(false)
  expect(''::it.sameValueZero(false)).toBe(false)
  expect('0'::it.sameValueZero(0)).toBe(false)
  expect('17'::it.sameValueZero(17)).toBe(false)
  expect([1, 2]::it.sameValueZero('1,2')).toBe(false)
  expect(new String('foo')::it.sameValueZero('foo')).toBe(false)
  expect(null::it.sameValueZero(void 0)).toBe(false)
  expect(NaN::it.sameValueZero(NaN)).toBe(true)
})

test('isTypeOf', () => {
  expect(it.isTypeOf.name).toBe('isTypeOf')
  expect(it.isTypeOf.length).toBe(1)
  expect('awd'::it.isTypeOf('string')).toBe(true)
  expect({}::it.isTypeOf('object')).toBe(true)
  expect(Symbol()::it.isTypeOf('symbol')).toBe(true)
  expect(null::it.isTypeOf('object')).toBe(true)
  expect(1::it.isTypeOf('number')).toBe(true)
  expect((void 0)::it.isTypeOf('undefined')).toBe(true)
  let awd
  expect(awd::it.isTypeOf('undefined')).toBe(true)
  expect(true::it.isTypeOf('boolean')).toBe(true)
  expect(0::it.isTypeOf('object')).toBe(false)
})

test('isIterable', () => {
  expect(it.isIterable.name).toBe('isIterable')
  expect(it.isIterable.length).toBe(0)
  expect({}::it.isIterable()).toBe(false)
  expect((void 0)::it.isIterable()).toBe(false)
  expect(null::it.isIterable()).toBe(false)
  class C {}
  const o = new C()
  expect(o::it.isIterable()).toBe(false)
  C.prototype[Symbol.iterator] = function() {
    return [1, 2, 3][Symbol.iterator]()
  }
  expect(o::it.isIterable()).toBe(true)
  expect([1, 2, 3]::it.isIterable()).toBe(true)
  expect(new Int32Array()::it.isIterable()).toBe(true)
  expect(new Map()::it.isIterable()).toBe(true)
  expect(new Set()::it.isIterable()).toBe(true)
  expect('awd'::it.isIterable()).toBe(true)
  expect(new WeakMap()::it.isIterable()).toBe(false)
  expect(new WeakSet()::it.isIterable()).toBe(false)
  expect([1, 2, 3].entries()::it.isIterable()).toBe(true)
  expect(new Map().entries()::it.isIterable()).toBe(true)
  expect(Object.keys({})::it.isIterable()).toBe(true)
  expect('awd'[Symbol.iterator]()::it.isIterable()).toBe(true)
  expect(
    function*() {
      yield 0
    }::it.isIterable()
  ).toBe(false)
  expect(
    (function*() {
      yield 0
    })()::it.isIterable()
  ).toBe(true)
})

test('call', () => {
  expect(it.call.name).toBe('call')
  expect(it.call.length).toBe(0)
  function awd(...args) {
    return args
  }
  expect(awd::it.call(1, 2, 3)).toEqual([1, 2, 3])
})

test('iter', () => {
  expect(it.iter.name).toBe('iter')
  expect(it.iter.length).toBe(0)
  expect(() => void null::it.iter()).toThrow()
  expect(() => void {}::it.iter()).toThrow()
  class C {}
  const o = new C()
  expect(() => void o::it.iter()).toThrow()
  const sb = Symbol()
  C.prototype[Symbol.iterator] = function() {
    return sb
  }
  expect(o::it.iter()).toBe(sb)
  expect([...[1, 2, 3]::it.iter()]).toEqual([1, 2, 3])
  expect([1, 2, 3]::it.iter()).not.toEqual([1, 2, 3])
})

test('isIterator', () => {
  expect(it.isIterator.name).toBe('isIterator')
  expect(it.isIterator.length).toBe(0)
  const a = [1, 2, 3]
  expect(a::it.isIterator()).toBe(false)
  expect(a::it.iter()::it.isIterator()).toBe(true)
  const b = new Set(a)
  expect(b::it.values()::it.isIterator()).toBe(true)
  expect('awd'::it.isIterator()).toBe(false)
  expect('awd'::it.iter()::it.isIterator()).toBe(true)
  class C {
    [Symbol.iterator]() {
      return 'awd'
    }
  }
  const c = new C()
  expect(c::it.isIterable()).toBe(true)
  expect(c::it.isIterator()).toBe(false)
  C.prototype[Symbol.iterator] = function() {
    return this
  }
  expect(c::it.isIterator()).toBe(true)
  expect(null::it.isIterator()).toBe(false)
  expect({}::it.isIterator()).toBe(false)
})

test('keys', () => {
  expect(it.keys.name).toBe('keys')
  expect(it.keys.length).toBe(0)
  const o = { awd: 'dwa', def: 'ccc' }
  expect(o::it.keys()::it.isIterator()).toBe(true)
  expect([...o::it.keys()]).toEqual(['awd', 'def'])
  const a = [1, 2, 3]
  expect(a::it.keys()::it.isIterator()).toBe(true)
  expect([...a::it.keys()]).toEqual([0, 1, 2])
  const sb = Symbol()
  const m = new Map([['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']])
  expect(m::it.keys()::it.isIterator()).toBe(true)
  const cp = o => o.toString()
  expect([...m::it.keys()]).toEqual(['awd', 'def', sb])
  const s = new Set(a)
  expect(s::it.keys()::it.isIterator()).toBe(true)
  expect([...s::it.keys()]).toEqual([1, 2, 3])
  expect(1::it.keys).toThrow()
  expect(sb::it.keys).toThrow()
})

test('values', () => {
  expect(it.values.name).toBe('values')
  expect(it.values.length).toBe(0)
  const o = { awd: 'dwa', def: 'ccc' }
  expect(o::it.values()::it.isIterator()).toBe(true)
  expect([...o::it.values()]).toEqual(['dwa', 'ccc'])
  const a = [1, 2, 3]
  expect(a::it.values()::it.isIterator()).toBe(true)
  expect([...a::it.values()]).toEqual([1, 2, 3])
  const sb = Symbol()
  const m = new Map([['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']])
  expect(m::it.values()::it.isIterator()).toBe(true)
  const cp = o => o.toString()
  expect([...m::it.values()]).toEqual(['dwa', 'ccc', 'zzz'])
  const s = new Set(a)
  expect(s::it.values()::it.isIterator()).toBe(true)
  expect([...s::it.values()]).toEqual([1, 2, 3])
  expect(1::it.values).toThrow()
  expect(sb::it.values).toThrow()
})

test('entries', () => {
  expect(it.entries.name).toBe('entries')
  expect(it.entries.length).toBe(0)
  const o = { awd: 'dwa', def: 'ccc' }
  expect(o::it.entries()::it.isIterator()).toBe(true)
  expect([...o::it.entries()]).toEqual([['awd', 'dwa'], ['def', 'ccc']])
  const a = [1, 2, 3]
  expect(a::it.entries()::it.isIterator()).toBe(true)
  expect([...a::it.entries()]).toEqual([[0, 1], [1, 2], [2, 3]])
  const sb = Symbol()
  const m = new Map([['awd', 'dwa'], ['def', 'ccc'], [sb, 'zzz']])
  expect(m::it.entries()::it.isIterator()).toBe(true)
  const cp = o => o.toString()
  expect([...m::it.entries()]).toEqual([
    ['awd', 'dwa'],
    ['def', 'ccc'],
    [sb, 'zzz']
  ])
  const s = new Set(a)
  expect(s::it.entries()::it.isIterator()).toBe(true)
  expect([...s::it.entries()]).toEqual([[1, 1], [2, 2], [3, 3]])
  expect(1::it.entries).toThrow()
  expect(sb::it.entries).toThrow()
})

test('isNullish', () => {
  expect(it.isNullish.name).toBe('isNullish')
  expect(it.isNullish.length).toBe(0)
  expect(null::it.isNullish()).toBe(true)
  expect((void 0)::it.isNullish()).toBe(true)
  expect(false::it.isNullish()).toBe(false)
})

test('not', () => {
  expect(it.not.name).toBe('not')
  expect(it.not.length).toBe(0)
  expect(true::it.not()).toBe(false)
  expect(false::it.not()).toBe(true)
  expect(1::it.not()).toBe(false)
  expect(0::it.not()).toBe(true)
})

test('map', () => {
  expect(it.map.name).toBe('map')
  expect(it.map.length).toBe(1)
  const a = [1, 2, 3]
  const m2 = x => x * 2
  expect(a::it.map(m2)::it.isIterator()).toBe(true)
  expect([...a::it.map(m2)]).toEqual([2, 4, 6])
  expect([...a::it.iter()::it.map(m2)]).toEqual([2, 4, 6])
  const etf = (item, idx) => [item, idx]
  expect([...a::it.map(etf)]).toEqual([[1, 0], [2, 1], [3, 2]])
  const slf = (item, idx, it) => it
  expect([...a::it.map(slf)][2]).toBe(a)
  let iter = a::it.iter()
  expect([...iter::it.map(slf)][2]).toBe(iter)
  iter = a::it.iter()
  const skp = (item, idx, it) => it.next().value
  expect([...iter::it.map(skp)]).toEqual([2, void 0])
  const thr = () => {
    throw 'awd'
  }
  expect(a::it.map(thr)::it.isIterator()).toBe(true)
  expect(a::it.map(thr).next).toThrow()
  function ths(x) {
    return x * this
  }
  expect(a::it.map(ths, 2)::it.toArray()).toEqual([2, 4, 6])
  iter = it.range(10)
  expect(
    iter::it.map(x => {
      if (x === 5) throw 'awd'
    })::it.toArray
  ).toThrow()
  expect(iter::it.toArray()).toEqual([6, 7, 8, 9])
  iter = it.range(10)
  ;iter::it.map(x => {
    if (x === 5) throw 'awd'
  })
  expect(iter::it.toArray()).toEqual(it.range(10)::it.toArray())
})

test('forEach', () => {
  expect(it.forEach.name).toBe('forEach')
  expect(it.forEach.length).toBe(1)
  const a = [1, 2, 3]
  let times = 0
  const tru = () => {
    ++times
    return true
  }
  expect(a::it.forEach(tru)).toBe(void 0)
  expect(times).toBe(3)
  const fls = () => {
    --times
    return false
  }
  expect(a::it.forEach(fls)).toBe(void 0)
  expect(times).toBe(0)
  let rst = []
  ;a::it.forEach((item, idx, it) => rst.push([item, idx, it]))
  rst.forEach((item, idx) => {
    expect(item[0]).toBe(a[idx])
    expect(item[1]).toBe(idx)
    expect(item[2]).toBe(a)
  })
  rst = []
  let iter = a::it.iter()
  ;iter::it.forEach((item, idx, it) => rst.push([item, idx, it]))
  rst.forEach((item, idx) => {
    expect(item[0]).toBe(a[idx])
    expect(item[1]).toBe(idx)
    expect(item[2]).toBe(iter)
  })
  expect(iter.next().done).toBe(true)
  ;iter::it.forEach(() => {
    throw 'awd'
  })
  rst = []
  function thr(x) {
    this.push(x)
    if (x >= 2) throw 'awd'
  }
  expect(() => a::it.forEach(thr, rst)).toThrow()
  expect(rst).toEqual([1, 2])
  iter = it.range(10)
  expect(() =>
    iter::it.forEach(x => {
      if (x === 5) throw 'awd'
    })
  ).toThrow()
  expect(iter::it.toArray()).toEqual([6, 7, 8, 9])
})

test('filter', () => {
  expect(it.filter.name).toBe('filter')
  expect(it.filter.length).toBe(1)
  const a = [1, 2, 3, 4, 5, 6]
  expect(a::it.filter(x => x % 2)::it.isIterator()).toBe(true)
  expect(a::it.filter(x => x % 2)::it.toArray()).toEqual([1, 3, 5])
  expect(
    a
      ::it.filter(function(x) {
        return x % this
      }, 3)
      ::it.toArray()
  ).toEqual([1, 2, 4, 5])
  const iter = a::it.iter()
  let r
  const idxs = []
  expect(
    iter
      ::it.filter(function(x, idx, it) {
        this.push(idx)
        r = it
        return x % 2
      }, idxs)
      ::it.toArray()
  ).toEqual([1, 3, 5])
  expect(r).toBe(iter)
  expect(idxs).toEqual([0, 1, 2, 3, 4, 5])
})

test('concat', () => {
  expect(it.concat.name).toBe('concat')
  expect(it.concat.length).toBe(0)
  const a = () => it.range(10)
  const b = () => it.range(10, 20)
  const c = () => it.range(20, 30)
  const rst = it.range(30)::it.toArray()
  expect(
    a()
      ::it.concat(b(), c())
      ::it.isIterator()
  ).toBe(true)
  expect(
    a()
      ::it.concat(b(), c())
      ::it.toArray()
  ).toEqual(rst)
  expect([]::it.concat(a(), b(), c())::it.toArray()).toEqual(rst)
  expect(
    (function*() {})()
      ::it.concat(a(), b(), c())
      ::it.toArray()
  ).toEqual(rst)
  expect([1]::it.concat(2, [3], [[4]])::it.toArray()).toEqual([1, 2, 3, [4]])
})

test('next', () => {
  expect(it.next.name).toBe('next')
  expect(it.next.length).toBe(0)
  const a = [1, 2, 3]
  expect(a::it.iter()::it.next()).toEqual(a::it.iter().next())
  expect(a::it.next).toThrow()
})

test('range', () => {
  expect(it.range.name).toBe('range')
  expect(it.range.length).toBe(1)
  expect(it.range).toThrow(TypeError)
  expect(it.range(10)::it.isIterator()).toBe(true)
  expect(it.range(10)::it.toArray()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  expect(it.range(-10)::it.toArray()).toEqual([])
  expect(it.range(2, 5)::it.toArray()).toEqual([2, 3, 4])
  expect(it.range(2, 8, 2)::it.toArray()).toEqual([2, 4, 6])
  expect(it.range(8, 2, -2)::it.toArray()).toEqual([8, 6, 4])
  expect(it.range(2, 8, -2)::it.toArray()).toEqual([])
})

test('loop', () => {
  expect(it.loop.name).toBe('loop')
  expect(it.loop.length).toBe(1)
  let times = 0
  ;(() => ++times)::it.loop(5)
  expect(times).toBe(5)
})

test('times', () => {
  expect(it.times.name).toBe('times')
  expect(it.times.length).toBe(1)
  let times = 0
  ;5::it.times(() => ++times)
  expect(times).toBe(5)
})

test('drop', () => {
  expect(it.drop.name).toBe('drop')
  expect(it.drop.length).toBe(0)
  const a = [1, 2, 3, 4, 5]
  expect(a::it.drop()::it.isIterator()).toBe(true)
  expect(a::it.drop()::it.toArray()).toEqual([2, 3, 4, 5])
  expect(a::it.drop(2)::it.toArray()).toEqual([3, 4, 5])
  const iter = a::it.iter()
  expect(
    iter
      ::it.drop()
      ::it.drop(2)
      ::it.toArray()
  ).toEqual([4, 5])
  expect(a::it.drop(0)::it.toArray()).toEqual([1, 2, 3, 4, 5])
})

test('reduce', () => {
  expect(it.reduce.name).toBe('reduce')
  expect(it.reduce.length).toBe(1)
  const a = [10, 2, 3]
  expect(a::it.reduce((a, b) => a ** b)).toBe(1000000)
  let accs = []
  let idxs = []
  let its = []
  expect(
    a::it.reduce((a, b, i, it) => {
      accs.push(a)
      idxs.push(i)
      its.push(it)
      return a ** b
    })
  ).toBe(1000000)
  expect(accs).toEqual([10, 100])
  expect(idxs).toEqual([1, 2])
  expect(its[0]).toBe(a)
  accs = []
  idxs = []
  its = []
  const iter = a::it.iter()
  expect(
    iter::it.reduce((a, b, i, it) => {
      accs.push(a)
      idxs.push(i)
      its.push(it)
      return a ** b
    }, 2)
  ).toBe(1152921504606846976)
  expect(accs).toEqual([2, 1024, 1048576])
  expect(idxs).toEqual([0, 1, 2])
  expect(its[0]).toBe(iter)
  expect([]::it.reduce).toThrow()
})

test('every', () => {
  expect(it.every.name).toBe('every')
  expect(it.every.length).toBe(1)
  expect([1, 3, 5, 7]::it.every(x => x % 2)).toBe(true)
  let times = 0
  expect(
    [1, 3, 0, 7]::it.every(function(x) {
      ++times
      return x % this
    }, 2)
  ).toBe(false)
  expect(times).toBe(3)
})

test('some', () => {
  expect(it.some.name).toBe('some')
  expect(it.some.length).toBe(1)
  expect([1, 3, 5, 7]::it.some(x => (x % 2) - 1)).toBe(false)
  let times = 0
  expect(
    [1, 3, 0, 7]::it.some(function(x) {
      ++times
      return (x % this) - 1
    }, 2)
  ).toBe(true)
  expect(times).toBe(3)
})

test('find', () => {
  expect(it.find.name).toBe('find')
  expect(it.find.length).toBe(1)
  let times = 0
  expect(
    [2, 3, 4, 5]::it.find(x => {
      ++times
      return x % 2
    })
  ).toBe(3)
  expect(times).toBe(2)
  expect(
    [2, 4, 6, 8]::it.find(function(x) {
      return x % this
    }, 2)
  ).toBeUndefined()
})

test('findIndex', () => {
  expect(it.findIndex.name).toBe('findIndex')
  expect(it.findIndex.length).toBe(1)
  let times = 0
  expect(
    [2, 3, 4, 5]::it.findIndex(x => {
      ++times
      return x % 2
    })
  ).toBe(1)
  expect(times).toBe(2)
  expect(
    [2, 4, 6, 8]::it.findIndex(function(x) {
      return x % this
    }, 2)
  ).toBe(-1)
})

test('isInstanceOf', () => {
  expect(it.isInstanceOf.name).toBe('isInstanceOf')
  expect(it.isInstanceOf.length).toBe(0)
  class C {}
  class D extends C {}
  class E extends C {}
  const o = new D()
  expect(o::it.isInstanceOf(D)).toBe(true)
  expect(o::it.isInstanceOf(C)).toBe(true)
  expect(o::it.isInstanceOf(C, D)).toBe(true)
  expect(o::it.isInstanceOf(E)).toBe(false)
  expect(o::it.isInstanceOf(E, C)).toBe(true)
})

test('isSubclassOf', () => {
  expect(it.isSubclassOf.name).toBe('isSubclassOf')
  expect(it.isSubclassOf.length).toBe(0)
  class C {}
  class D extends C {}
  class E extends C {}
  expect(D::it.isSubclassOf(D)).toBe(true)
  expect(D::it.isSubclassOf(C)).toBe(true)
  expect(D::it.isSubclassOf(C, D)).toBe(true)
  expect(D::it.isSubclassOf(E)).toBe(false)
  expect(D::it.isSubclassOf(E, C)).toBe(true)
  expect(null::it.isSubclassOf(C)).toBe(false)
  expect(C::it.isSubclassOf(null)).toBe(true)
})

test('flat', () => {
  expect(it.flat.name).toBe('flat')
  expect(it.flat.length).toBe(0)
  const a = [
    1,
    2,
    [3, 4, [5, 6]],
    '78',
    '9X'::it.iter(),
    new Set([10, 11, new Set([12, 13])]),
    new Map([[14, 15], [16, 17]])
  ]
  expect(a::it.flat()::it.isIterator()).toBe(true)
  expect(a::it.flat()::it.toArray()).toEqual([
    1,
    2,
    3,
    4,
    [5, 6],
    '78',
    '9',
    'X',
    10,
    11,
    new Set([12, 13]),
    [14, 15],
    [16, 17]
  ])
  expect(a::it.flat()::it.toArray()).toEqual([
    1,
    2,
    3,
    4,
    [5, 6],
    '78',
    10,
    11,
    new Set([12, 13]),
    [14, 15],
    [16, 17]
  ])
  expect(a::it.flat(0)::it.toArray()).toEqual(a)
  expect(a::it.flat(-0)::it.toArray()).toEqual(a)
  expect(a::it.flat(2)::it.toArray()).toEqual([
    1,
    2,
    3,
    4,
    5,
    6,
    '78',
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17
  ])
})

test('flatMap', () => {
  expect(it.flatMap.name).toBe('flatMap')
  expect(it.flatMap.length).toBe(1)
  const a = [1, 2, [3, 4]]
  expect(
    a
      ::it.flatMap(function(x) {
        return [x * this]
      }, 2)
      ::it.toArray()
  ).toEqual([2, 4, NaN])
  expect(a::it.flatMap(x => [x * 2])::it.toArray()).toEqual([2, 4, NaN])
})

test('includes', () => {
  expect(it.includes.name).toBe('includes')
  expect(it.includes.length).toBe(1)
  expect(it.range(10)::it.includes(5)).toBe(true)
  expect(it.range(10)::it.includes(15)).toBe(false)
  expect(it.range(10)::it.includes(5, 5)).toBe(true)
  expect(it.range(10)::it.includes(5, 6)).toBe(false)
  const iter = it.range(10)
  expect(iter::it.includes(5, 2)).toBe(true)
  expect(iter::it.toArray()).toEqual([6, 7, 8, 9])
  expect([1, -0, -1]::it.includes(0)).toBe(true)
  expect([NaN]::it.includes(NaN)).toBe(true)
})

test('indexOf', () => {
  expect(it.indexOf.name).toBe('indexOf')
  expect(it.indexOf.length).toBe(1)
  expect(it.range(10)::it.indexOf(5)).toBe(5)
  expect(it.range(10)::it.indexOf(15)).toBe(-1)
  expect(it.range(10)::it.indexOf(5, 5)).toBe(5)
  expect(it.range(10)::it.indexOf(5, 6)).toBe(-1)
  const iter = it.range(10)
  expect(iter::it.indexOf(5, 2)).toBe(5)
  expect(iter::it.toArray()).toEqual([6, 7, 8, 9])
  expect([1, -0, -0, 0, 1]::it.indexOf(0)).toBe(1)
  expect([NaN]::it.indexOf(NaN)).toBe(-1)
})

test('join', () => {
  expect(it.join.name).toBe('join')
  expect(it.join.length).toBe(1)
  const a = [1, null, '2', void 0, 3]
  expect(a::it.iter()::it.join()).toBe('1,,2,,3')
  expect(a::it.iter()::it.join('-')).toBe('1--2--3')
  expect([]::it.join()).toBe('')
})

test('lastItem', () => {
  expect(it.lastItem.name).toBe('lastItem')
  expect(it.lastItem.length).toBe(0)
  const a = [1, 2, 3]
  expect(a::it.lastItem()).toBe(3)
  expect([]::it.lastItem()).toBeUndefined()
})

test('take', () => {
  expect(it.take.name).toBe('take')
  expect(it.take.length).toBe(1)
  const iter = it.range(10)
  expect(iter::it.take(3)::it.toArray()).toEqual([0, 1, 2])
  ;iter::it.take(3)
  expect(iter::it.take(3)::it.toArray()).toEqual([3, 4, 5])
  expect(iter::it.take(0)::it.toArray()).toEqual([])
})

test('step', () => {
  expect(it.step.name).toBe('step')
  expect(it.step.length).toBe(1)
  expect(
    it
      .range(10)
      ::it.step(1)
      ::it.isIterator()
  ).toBe(true)
  expect(
    it
      .range(10)
      ::it.step(1)
      ::it.toArray()
  ).toEqual(it.range(10)::it.toArray())
  expect(
    it
      .range(10)
      ::it.step(2)
      ::it.toArray()
  ).toEqual([0, 2, 4, 6, 8])
  expect(
    it
      .range(10)
      ::it.step(3)
      ::it.toArray()
  ).toEqual([0, 3, 6, 9])
})

test('piece', () => {
  expect(it.piece.name).toBe('piece')
  expect(it.piece.length).toBe(1)
  const a = it.range(20)
  expect(a::it.piece(5)::it.toArray()).toEqual([0, 1, 2, 3, 4])
  expect(a::it.piece).toThrow()
  expect(a::it.piece(1, 5)::it.toArray()).toEqual([6, 7, 8, 9])
  expect(a::it.piece(1, 5, 2)::it.toArray()).toEqual([11, 13])
})

test('slice', () => {
  expect(it.slice.name).toBe('slice')
  expect(it.slice.length).toBe(2)
  const a = [1, 2, 3, 4, 5]
  expect(a::it.slice(2)::it.isIterator()).toBe(true)
  expect(a::it.slice(2)::it.toArray()).toEqual([3, 4, 5])
  expect(a::it.slice(2, 4)::it.toArray()).toEqual([3, 4])
  expect(a::it.slice()::it.toArray()).toEqual(a)
  expect(a::it.slice()::it.toArray()).not.toBe(a)
})

test('toArray', () => {
  expect(it.toArray.name).toBe('toArray')
  expect(it.toArray.length).toBe(0)
  expect('awd'::it.toArray()).toEqual(['a', 'w', 'd'])
  expect('????'::it.toArray()).toEqual(['????'])
})

// test('sort', () => {
//   expect(it.sort.name).toBe('sort')
//   expect(it.sort.length).toBe(0)
//   const a = [4, 3, 5, 2, 1]
//   expect(a::it.sort()).toEqual([1, 2, 3, 4, 5])
//   expect(a).toEqual([4, 3, 5, 2, 1])
//   expect(a::it.sort((a, b) => a < b)).toEqual([5, 4, 3, 2, 1])
// })

test('chunk', () => {
  expect(it.chunk.name).toBe('chunk')
  expect(it.chunk.length).toBe(1)
  expect(
    it
      .range(4)
      ::it.chunk()
      ::it.toArray()
  ).toEqual([[0], [1], [2], [3]])
  expect(
    it
      .range(4)
      ::it.chunk(2)
      ::it.toArray()
  ).toEqual([[0, 1], [2, 3]])
  expect(
    it
      .range(4)
      ::it.chunk(3)
      ::it.toArray()
  ).toEqual([[0, 1, 2], [3]])
})

test('compact', () => {
  expect(it.compact.name).toBe('compact')
  expect(it.compact.length).toBe(0)
  expect([0, 1, false, 2, '', 3, NaN]::it.compact()::it.toArray()).toEqual([
    1,
    2,
    3
  ])
})

test('dropWhile', () => {
  expect(it.dropWhile.name).toBe('dropWhile')
  expect(it.dropWhile.length).toBe(1)
  const a = [2, 4, 6, 7, 8, 9, 10]
  expect(a::it.dropWhile(x => x % 2 === 0)::it.toArray()).toEqual([7, 8, 9, 10])
  expect(
    a
      ::it.dropWhile(function(x) {
        return x % this === 0
      }, 2)
      ::it.toArray()
  ).toEqual([7, 8, 9, 10])
  expect([1, 3, 5, 7]::it.dropWhile(x => x % 2)::it.toArray()).toEqual([])
})

test('fill', () => {
  expect(it.fill.name).toBe('fill')
  expect(it.fill.length).toBe(1)
  const a = [1, 2, 3]
  expect(a::it.fill('a')::it.toArray()).toEqual(['a', 'a', 'a'])
  expect(
    Array(3)
      ::it.fill(2)
      ::it.toArray()
  ).toEqual([2, 2, 2])
  expect([4, 6, 8, 10]::it.fill('*', 1, 3)::it.toArray()).toEqual([
    4,
    '*',
    '*',
    10
  ])
})

test('flatDeep', () => {
  expect(it.flatDeep.name).toBe('flatDeep')
  expect(it.flatDeep.length).toBe(0)
  expect([1, [2, [3, [4]], 5]]::it.flatDeep()::it.toArray()).toEqual([
    1,
    2,
    3,
    4,
    5
  ])
})

test('fromEntries', () => {
  expect(it.fromEntries.name).toBe('fromEntries')
  expect(it.fromEntries.length).toBe(0)
  expect([['a', 1], ['b', 2]]::it.fromEntries()).toEqual({ a: 1, b: 2 })
  expect(new Map([['a', 1], ['b', 2]])::it.fromEntries()).toEqual({
    a: 1,
    b: 2
  })
})

test('firstItem', () => {
  expect(it.firstItem.name).toBe('firstItem')
  expect(it.firstItem.length).toBe(0)
  expect([1, 2, 3]::it.firstItem()).toBe(1)
  expect([]::it.firstItem()).toBeUndefined()
})

test('dropLast', () => {
  expect(it.dropLast.name).toBe('dropLast')
  expect(it.dropLast.length).toBe(0)
  expect([1, 2, 3]::it.dropLast()::it.toArray()).toEqual([1, 2])
  expect(
    it
      .range(1, 4)
      ::it.dropLast()
      ::it.toArray()
  ).toEqual([1, 2])
})

test('nth', () => {
  expect(it.nth.name).toBe('nth')
  expect(it.nth.length).toBe(1)
  const a = 'abcd'
  expect(a::it.nth()).toBe('a')
  expect(a::it.nth(1)).toBe('b')
  expect(a::it.nth(4)).toBeUndefined()
})

test('takeWhile', () => {
  expect(it.takeWhile.name).toBe('takeWhile')
  expect(it.takeWhile.length).toBe(1)
  const a = [1, 3, 5, 8, 11, 13]
  expect(
    a
      ::it.takeWhile(function(x) {
        return x % this
      }, 2)
      ::it.toArray()
  ).toEqual([1, 3, 5])
  expect([2, 4, 6]::it.takeWhile(x => x % 2)::it.toArray()).toEqual([])
})

test('concatFront', () => {
  expect(it.concatFront.name).toBe('concatFront')
  expect(it.concatFront.length).toBe(0)
  const a = () => it.range(10)
  const b = () => it.range(10, 20)
  const c = () => it.range(20, 30)
  const rst = it.range(30)::it.toArray()
  expect(
    c()
      ::it.concatFront(a(), b())
      ::it.isIterator()
  ).toBe(true)
  expect(
    c()
      ::it.concatFront(a(), b())
      ::it.toArray()
  ).toEqual(rst)
  expect([]::it.concatFront(a(), b(), c())::it.toArray()).toEqual(rst)
  expect(
    (function*() {})()
      ::it.concatFront(a(), b(), c())
      ::it.toArray()
  ).toEqual(rst)
  expect([1]::it.concatFront(2, [3], [[4]])::it.toArray()).toEqual([
    2,
    3,
    [4],
    1
  ])
})

test('zip', () => {
  expect(it.zip.name).toBe('zip')
  expect(it.zip.length).toBe(0)
  expect([1, 2, 3]::it.zip([4, 5, 6, 7])::it.toArray()).toEqual([
    [1, 4],
    [2, 5],
    [3, 6]
  ])
  expect(null::it.zip([1, 2, 3], [4, 5, 6, 7])::it.toArray()).toEqual([
    [1, 4],
    [2, 5],
    [3, 6]
  ])
  expect([1, 2, 3]::it.zip([4, 5, 6, 7], [8, 9])::it.toArray()).toEqual([
    [1, 4, 8],
    [2, 5, 9]
  ])
})

test('zipLongest', () => {
  expect(it.zipLongest.name).toBe('zipLongest')
  expect(it.zipLongest.length).toBe(0)
  expect([1, 2, 3]::it.zipLongest([4, 5, 6, 7])::it.toArray()).toEqual([
    [1, 4],
    [2, 5],
    [3, 6],
    [void 0, 7]
  ])
  expect(null::it.zipLongest([1, 2, 3], [4, 5, 6, 7])::it.toArray()).toEqual([
    [1, 4],
    [2, 5],
    [3, 6],
    [void 0, 7]
  ])
  expect([1, 2, 3]::it.zipLongest([4, 5, 6, 7], [8, 9])::it.toArray()).toEqual([
    [1, 4, 8],
    [2, 5, 9],
    [3, 6, void 0],
    [void 0, 7, void 0]
  ])
})

test('count', () => {
  expect(it.count.name).toBe('count')
  expect(it.count.length).toBe(0)
  expect(
    it
      .count()
      ::it.take(5)
      ::it.toArray()
  ).toEqual([0, 1, 2, 3, 4])
  expect(
    it
      .count(1)
      ::it.take(5)
      ::it.toArray()
  ).toEqual([1, 2, 3, 4, 5])
  expect(
    it
      .count(1, -1)
      ::it.take(5)
      ::it.toArray()
  ).toEqual([1, 0, -1, -2, -3])
})

test('enumerate', () => {
  expect(it.enumerate.name).toBe('enumerate')
  expect(it.enumerate.length).toBe(0)
  expect([1, 2, 3]::it.enumerate()::it.toArray()).toEqual([
    [1, 0],
    [2, 1],
    [3, 2]
  ])
})

test('unzip', () => {
  expect(it.unzip.name).toBe('unzip')
  expect(it.unzip.length).toBe(0)
  expect([['a', 1, true], ['b', 2, false]]::it.unzip()::it.toArray()).toEqual([
    ['a', 'b'],
    [1, 2],
    [true, false]
  ])
})

test('splice', () => {
  expect(it.splice.name).toBe('splice')
  expect(it.splice.length).toBe(2)
  const a = it.range(5)::it.toArray()
  expect(a::it.splice(0)::it.toArray()).toEqual([])
  expect(a::it.splice(1)::it.toArray()).toEqual([0])
  expect(a::it.splice(1, 0)::it.toArray()).toEqual([0, 1, 2, 3, 4])
  expect(a::it.splice(1, 3)::it.toArray()).toEqual([0, 4])
  expect(a::it.splice(1, 3, 5, 6, 7, 8)::it.toArray()).toEqual([
    0,
    5,
    6,
    7,
    8,
    4
  ])
})

test('countBy', () => {
  expect(it.countBy.name).toBe('countBy')
  expect(it.countBy.length).toBe(1)
  expect([6.1, 4.2, 6.3]::it.countBy(Math.floor)::it.isInstanceOf(Map)).toBe(
    true
  )
  expect([6.1, 4.2, 6.3]::it.countBy(Math.floor)::it.toArray()).toEqual([
    [6, 2],
    [4, 1]
  ])
  expect(
    ['one', 'two', 'three']::it.countBy(x => x.length)::it.toArray()
  ).toEqual([[3, 2], [5, 1]])
})

test('groupBy', () => {
  expect(it.groupBy.name).toBe('groupBy')
  expect(it.groupBy.length).toBe(1)
  expect([6.1, 4.2, 6.3]::it.groupBy(Math.floor)::it.isInstanceOf(Map)).toBe(
    true
  )
  expect([6.1, 4.2, 6.3]::it.groupBy(Math.floor)::it.toArray()).toEqual([
    [6, [6.1, 6.3]],
    [4, [4.2]]
  ])
  expect(
    ['one', 'two', 'three']::it.groupBy(x => x.length)::it.toArray()
  ).toEqual([[3, ['one', 'two']], [5, ['three']]])
})

test('keyBy', () => {
  expect(it.keyBy.name).toBe('keyBy')
  expect(it.keyBy.length).toBe(1)
  expect([6.1, 4.2, 6.3]::it.keyBy(Math.floor)::it.isInstanceOf(Map)).toBe(true)
  expect([6.1, 4.2, 6.3]::it.keyBy(Math.floor)::it.toArray()).toEqual([
    [6, 6.3],
    [4, 4.2]
  ])
  expect(
    ['one', 'two', 'three']::it.keyBy(x => x.length)::it.toArray()
  ).toEqual([[3, 'two'], [5, 'three']])
})

test('partition', () => {
  expect(it.partition.name).toBe('partition')
  expect(it.partition.length).toBe(1)
  const a = it.range(10)::it.toArray()
  expect(Array.isArray(a::it.partition(x => x % 2))).toBe(true)
  expect(
    a
      ::it.partition(x => x % 2)
      ::it.map(r => r::it.toArray())
      ::it.toArray()
  ).toEqual([[1, 3, 5, 7, 9], [0, 2, 4, 6, 8]])
  expect(
    a
      ::it.partition(function(x) {
        return x % this
      }, 2)
      ::it.unzip()
      ::it.toArray()
  ).toEqual([[1, 0], [3, 2], [5, 4], [7, 6], [9, 8]])
  expect(
    a
      ::it.drop()
      ::it.partition(x => x % 2)
      ::it.unzip()
      ::it.toArray()
  ).toEqual([[1, 2], [3, 4], [5, 6], [7, 8]])
})

test('reject', () => {
  expect(it.reject.name).toBe('reject')
  expect(it.reject.length).toBe(1)
  const a = [1, 2, 3, 4, 5, 6]
  expect(a::it.reject(x => x % 2)::it.isIterator()).toBe(true)
  expect(a::it.reject(x => x % 2)::it.toArray()).toEqual([2, 4, 6])
  expect(
    a
      ::it.reject(function(x) {
        return x % this
      }, 3)
      ::it.toArray()
  ).toEqual([3, 6])
  const iter = a::it.iter()
  let r
  const idxs = []
  expect(
    iter
      ::it.reject(function(x, idx, it) {
        this.push(idx)
        r = it
        return x % 2
      }, idxs)
      ::it.toArray()
  ).toEqual([2, 4, 6])
  expect(r).toBe(iter)
  expect(idxs).toEqual([0, 1, 2, 3, 4, 5])
})

test('length', () => {
  expect(it.length.name).toBe('length')
  expect(it.length.length).toBe(0)
  const a = it.range(10)::it.toArray()
  expect(a::it.length()).toBe(10)
  expect(a::it.iter()::it.length()).toBe(10)
  expect('awd'::it.length()).toBe(3)
  expect(new Set([1, 2, 3])::it.length()).toBe(3)
  expect({}::it.length).toThrow
  expect(it.range(10)::it.length()).toBe(10)
})

test('cycle', () => {
  expect(it.cycle.name).toBe('cycle')
  expect(it.cycle.length).toBe(0)
  expect(
    it
      .range(5)
      ::it.cycle(2)
      ::it.toArray()
  ).toEqual([]::it.concat(it.range(5), it.range(5))::it.toArray())
  expect([0, 1, 2, 3, 4]::it.cycle(2)::it.toArray()).toEqual(
    []::it.concat(it.range(5), it.range(5))::it.toArray()
  )
  expect(
    it
      .range(5)
      ::it.cycle()
      ::it.take(20)
      ::it.toArray()
  ).toEqual(
    []
      ::it.concat(it.range(5), it.range(5), it.range(5), it.range(5))
      ::it.toArray()
  )
  expect(
    it
      .range(5)
      ::it.cycle(0)
      ::it.toArray()
  ).toEqual([])
})

test('tee', () => {
  expect(it.tee.name).toBe('tee')
  expect(it.tee.length).toBe(0)

  const n = 200
  let a, b, c, d
  ;[a, b] = []::it.tee() // test empty iterator
  expect(a::it.toArray()).toEqual([])
  expect(b::it.toArray()).toEqual([])
  ;[a, b] = it.range(n)::it.tee() // test 100% interleaved
  expect(null::it.zip(a, b)::it.toArray()).toEqual(
    [it.range(n)::it.toArray(), it.range(n)::it.toArray()]
      ::it.unzip()
      ::it.toArray()
  )
  ;[a, b] = it.range(n)::it.tee() // test 0% interleaved
  expect(a::it.toArray()).toEqual(it.range(n)::it.toArray())
  expect(b::it.toArray()).toEqual(it.range(n)::it.toArray())
  ;[a, b] = it.range(n)::it.tee() // test dealloc of leading iterator
  for (const i of it.range(100)) expect(a::it.firstItem()).toBe(i)
  a = void 0
  expect(b::it.toArray()).toEqual(it.range(n)::it.toArray())
  ;[a, b] = it.range(n)::it.tee() // test dealloc of trailing iterator
  for (const i of it.range(100)) expect(a::it.firstItem()).toBe(i)
  b = void 0
  expect(a::it.toArray()).toEqual(it.range(100, n)::it.toArray())

  for (const j of it.range(5)) {
    // test randomly interleaved
    const order = shuffle(
      Array(2 * n)
        .fill(0, 0, n)
        .fill(1, n)
    )
    const lists = [[], []]
    const its = it.range(n)::it.tee()
    for (const i of order) {
      const value = its[i]::it.firstItem()
      lists[i].push(value)
    }
    expect(lists[0]).toEqual(it.range(n)::it.toArray())
    expect(lists[1]).toEqual(it.range(n)::it.toArray())
  }

  // test long-lagged and multi-way split
  ;[a, b, c] = it.range(2000)::it.tee(3)
  for (const i of it.range(100)) expect(a::it.firstItem()).toBe(i)
  expect(b::it.toArray()).toEqual(it.range(2000)::it.toArray())
  expect([c::it.firstItem(), c::it.firstItem()]).toEqual(
    it.range(2)::it.toArray()
  )
  expect(a::it.toArray()).toEqual(it.range(100, 2000)::it.toArray())
  expect(c::it.toArray()).toEqual(it.range(2, 2000)::it.toArray())

  // test values of n
  for (const n of it.range(5)) {
    const result = 'abc'::it.tee(n)
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBe(n)
    expect(result::it.map(o => o::it.toArray())::it.toArray()).toEqual(
      Array(n).fill([...'abc'])
    )
  }

  // tee pass-through to copyable iterator
  ;[a, b] = it.range(3)::it.tee()
  expect(a::it.firstItem()).toBe(0)
  ;[c, d] = a::it.tee()
  expect(a::it.firstItem()).toBe(1)
  expect(a).toBe(c)
  expect(d::it.toArray()).toEqual([1, 2])
  expect(d::it.tee(0)).toEqual([])

  // tee Array
  expect(
    [1, 2, 3, 4, 5]
      ::it.tee()
      ::it.unzip()
      ::it.toArray()
  ).toEqual([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]])
})

test('repeat', () => {
  expect(it.repeat.name).toBe('repeat')
  expect(it.repeat.length).toBe(1)
  expect(it.repeat('a', 3)::it.toArray()).toEqual(['a', 'a', 'a'])
  expect(null::it.zip(it.range(3), it.repeat('a'))::it.toArray()).toEqual([
    [0, 'a'],
    [1, 'a'],
    [2, 'a']
  ])
  expect(it.repeat('a', 3)::it.toArray()).toEqual(['a', 'a', 'a'])
  expect(
    it
      .repeat('a')
      ::it.take(3)
      ::it.toArray()
  ).toEqual(['a', 'a', 'a'])
  expect(it.repeat('a', 0)::it.toArray()).toEqual([])
})

test('accumulate', () => {
  expect(it.accumulate.name).toBe('accumulate')
  expect(it.accumulate.length).toBe(0)
  expect(
    it
      .range(10)
      ::it.accumulate()
      ::it.toArray()
  ).toEqual([0, 1, 3, 6, 10, 15, 21, 28, 36, 45]) // one positional arg
  expect('abc'::it.accumulate()::it.toArray()).toEqual(['a', 'ab', 'abc']) // works with non-numeric
  expect([]::it.accumulate()::it.toArray()).toEqual([]) // empty iterable
  expect([7]::it.accumulate()::it.toArray()).toEqual([7]) // iterable of length one

  const s = [2, 8, 9, 5, 7, 0, 3, 4, 1, 6]
  expect(s::it.accumulate(Math.min)::it.toArray()).toEqual([
    2,
    2,
    2,
    2,
    2,
    0,
    0,
    0,
    0,
    0
  ])
  expect(s::it.accumulate(Math.max)::it.toArray()).toEqual([
    2,
    8,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9
  ])
  expect(s::it.accumulate((a, b) => a * b)::it.toArray()).toEqual([
    2,
    16,
    144,
    720,
    5040,
    0,
    0,
    0,
    0,
    0
  ])
})

test('compress', () => {
  expect(it.compress.name).toBe('compress')
  expect(it.compress.length).toBe(1)

  expect('ABCDEF'::it.compress([1, 0, 1, 0, 1, 1])::it.join('')).toBe('ACEF')
  expect('ABCDEF'::it.compress([1, 0, 1, 0, 1, 1])::it.join('')).toBe('ACEF')
  expect('ABCDEF'::it.compress([0, 0, 0, 0, 0, 0])::it.join('')).toBe('')
  expect('ABCDEF'::it.compress([1, 1, 1, 1, 1, 1])::it.join('')).toBe('ABCDEF')
  expect('ABCDEF'::it.compress([1, 0, 1])::it.join('')).toBe('AC')
  expect('ABC'::it.compress([0, 1, 1, 1, 1, 1])::it.join('')).toBe('BC')
  const n = 10000
  const data = it.range(6)::it.cycle(n)
  const selectors = [0, 1]::it.cycle()
  expect(data::it.compress(selectors)::it.toArray()).toEqual(
    [1, 3, 5]::it.cycle(n)::it.toArray()
  )
})

test('spreadMap', () => {
  expect(it.spreadMap.name).toBe('spreadMap')
  expect(it.spreadMap.length).toBe(1)
  expect(
    null
      ::it.zip(it.range(3), it.range(1, 7))
      ::it.spreadMap(Math.pow)
      ::it.toArray()
  ).toEqual([0 ** 1, 1 ** 2, 2 ** 3])
  expect(
    null
      ::it.zip(it.count(), it.count(1))
      ::it.spreadMap(Math.pow)
      ::it.take(3)
      ::it.toArray()
  ).toEqual([0 ** 1, 1 ** 2, 2 ** 3])
  expect([]::it.spreadMap(Math.pow)::it.toArray()).toEqual([])
  expect([[4, 5]::it.iter()]::it.spreadMap(Math.pow)::it.toArray()).toEqual([
    4 ** 5
  ])
})

// test('product', () => {
//   expect(it.product.name).toBe('product')
//   expect(it.product.length).toBe(0)
//   for (const [args, result] of [
//     [[], [[]]], // zero iterables
//     [['ab'], [['a'], ['b']]], // one iterable
//     [
//       [it.range(2), it.range(3)],
//       [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]]
//     ], // two iterables
//     [[it.range(0), it.range(2), it.range(3)], []], // first iterable with zero length
//     [[it.range(2), it.range(0), it.range(3)], []], // middle iterable with zero length
//     [[it.range(2), it.range(3), it.range(0)], []] // last iterable with zero length
//   ]) {
//     expect(null::it.product(...args)::it.toArray()).toEqual(result)
//     for (const r of it.range(4))
//       expect(null::it.product(...args::it.cycle(r))).toEqual(
//         null::it.product(...args, r)
//       )
//   }
// })

test('sum', () => {
  expect(it.sum.name).toBe('sum')
  expect(it.sum.length).toBe(0)
  expect(it.range(101)::it.sum()).toBe(5050)
})
