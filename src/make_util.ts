import { createEffect, untrack, mapArray, createMemo, createSignal, batch } from 'solid-js'
import { read, write, owrite } from './play'
import { Vec2 } from './vec2'

export function make_position(x, y) {
  let _x = createSignal(x)
  let _y = createSignal(y)

  let m_p = createMemo(() => point(read(_x), read(_y)))
  let m_vs = createMemo(() => Vec2.make(read(_x), read(_y)))

  return {
    get point() { return m_p() },
    get x() { return read(_x) },
    set x(v: number) { owrite(_x, v) },
    get y() { return read(_y) },
    set y(v: number) { owrite(_y, v) },
    lerp(x: number, y: number, t: number = 0.5) {
      owrite(_x, _ => rlerp(_, x, ease(t)))
      owrite(_y, _ => rlerp(_, y, ease(t)))
    },
    lerp_vs(vs: Vec2, t: number = 0.5) { 
      batch(() => {
        owrite(_x, _ => rlerp(_, vs.x, ease(t))) 
        owrite(_y, _ => rlerp(_, vs.y, ease(t)))
      })
    },
    get vs() { return m_vs() },
    set vs(vs: Vec2) {
      batch(() => {
        owrite(_x, vs.x)
        owrite(_y, vs.y)
      })
    },
    get clone() {
      return untrack(() => make_position(read(_x), read(_y)))
    }
  }
}


const make_id_gen = () => { let id = 0; return () => ++id }
const id_gen = make_id_gen()


/* https://gist.github.com/gre/1650294 */
function ease(t: number) {
  return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function rlerp(a: number, b: number, t: number) {
  let res = lerp(a, b, t)

  return Math.round(res * 1000) / 1000
}

export type Point = string

export function point(x: number, y: number) {
    return `${x} ${y} ${id_gen()}`
}

export function point_xy(p: Point) {
    return p.split(' ').map(_ => parseFloat(_))
}

export const point_zero = point(0, 0)



export function make_array<A, B>(arr: Array<A>, map: (_: A) => B) {
  let _arr = createSignal(arr, { equals: false })

  let _ = createMemo(mapArray(_arr[0], map))

  return {
    get values() { return _() },
    get head() { return _()[0] },
    push(a: A) {
      write(_arr, _ => _.push(a))
    },
    pop() {
      let res 
      write(_arr, _ => res = _.pop())
      return res
    },
    enqueue(a: A) {
      write(_arr, _ => _.unshift(a))
    },
    dequeue() {
      let res
      write(_arr, _ => res = _.shift())
      return res
    },
    remove(a: A) {
      write(_arr, _ => {
        _.splice(_.indexOf(a), 1)
      })
    },
    clear() {
      owrite(_arr, [])
    }
  }
}


