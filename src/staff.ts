import { Vec2 } from './vec2'
import { createMemo, createSignal, createEffect } from 'solid-js'
import { read, write, owrite } from './play'
import { make_drag, make_ref } from './make_sticky'
import { make_position } from './make_util'



function make_drag_hooks(staff: Staff) {
  return { 
    on_hover(hover: Hover) {
      staff._overlay.vs = Vec2.make(...hover)
    },
    on_up(decay) {
      staff._overlay.overlay = undefined
    },
    on_click(click: [number, number]) {
    },
    find_inject_drag() {
    },
    on_drag_update(decay: Decay) {
    },
    find_on_drag_start(drag) {
    }
  }
}


export default class Staff {

  onScroll() {
    this.refs.forEach(_ => _.$clear_bounds())
  }

  get overlay() {
    return this._overlay.overlay
  }

  clef_mouse_down() {
    this._overlay.overlay = this.__clef_overlay
  }

  constructor(readonly hooks: UserHooks) {

    this.ref = make_ref()
    this.refs = []

    createEffect(() => {
      let $ref = this.ref.$ref
      if ($ref) {
        if (this.drag) {
          this.refs.splice(this.refs.indexOf(this.drag), 1)
        }
        this.drag = make_drag(make_drag_hooks(this), $ref)
        this.refs.push(this.drag)
      }
    })

    this._overlay = make_overlay(this)

    this.__clef_overlay = make_clef_overlay(this)


    this.sheet = make_sheet(this)
  }


}


const make_sheet = (staff: Staff) => {

  let _staves = createSignal([])

  return {
    get staves() {
      return read(_staves)
    },
    set staves(staves: Staves) {
      owrite(_staves, staves)
    }
  }

}


const make_bra_overlay_item = (staff: Staff, glyph: string, on_select: () => void) => {

  return {
    i: 'bra',
    glyph,
    on_select
  }
}

const make_clef_overlay = (staff: Staff) => {

  return ['gclef', 'bclef'].map(_ => make_bra_overlay_item(staff, _, () => {
    staff.hooks.user_new_staff(_)
  }))
}


const make_overlay = (staff: Staff) => {

  let _overlay = createSignal()

  let _pos = make_position(0, 0)

  let m_style = createMemo(() => ({
    transform: `translate(${_pos.x}px, ${_pos.y}px)`
  }))

  return {
    set vs(vs: Vec2) {
      if (read(_overlay)) {
        return
      }
      _pos.vs = vs
    },
    set overlay(overlay: Overlay) {
      owrite(_overlay, overlay)
    },
    get overlay() {
      return read(_overlay)
    },
    get style() { return m_style() }
  }
}
