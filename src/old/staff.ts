import { Vec2 } from './vec2'
import { on, mapArray, createMemo, createSignal, createEffect } from 'solid-js'
import { read, write, owrite } from './play'
import { make_drag, make_ref } from './make_sticky'
import { make_position } from './make_util'



function make_drag_hooks(staff: Staff) {
  return { 
    on_hover(v_h: Vec2) {
      staff._overlay.vs = v_h
      staff.sheet.find_hover(v_h)
    },
    on_up(decay) {
      staff._overlay.overlay = undefined
      staff.toolbar.clear_mouse()
    },
    on_click(click: [number, number]) {
    },
    find_inject_drag() {
    },
    on_drag_update(decay: Decay) {
      staff.sheet.find_drag_update(decay.target.vs)
    },
    find_on_drag_start(drag) {
      let vs = Vec2.make(...drag.move)
      let _bra = staff.toolbar.find_on_drag_start()

      if (_bra) {
        staff.drag_piece.begin(_bra.item, vs)
        return staff.drag_piece
      }
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

  get mode() {
    return this._mode.mode
  }

  next_mode() {
    this._mode.next()
  }

  clef_mouse_down() {
    this._overlay.overlay = this.__clef_overlay
  }

  get cur_drag_piece() {
    return this.drag_piece.cur
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

        createEffect(on(() => this.drag?.decay, (decay, prev) => {
          if (!decay) {
            if (prev) {
              this.drag_piece.drop()
            } else {
            }
          }
        }))
      }
    })

    this.sheet_ref = make_ref()
    this.refs.push(this.sheet_ref)

    this._mode = make_mode(this)
    this._overlay = make_overlay(this)

    this.__clef_overlay = make_clef_overlay(this)


    this.sheet = make_sheet(this)


    this.toolbar = make_toolbar(this)


    this.drag_piece = make_drag_piece(this)

    createEffect(on(() => this.sheet.nb_staves, _ => {
      this.sheet_ref.$clear_bounds()
    }))
  }


}




const make_toolbar_item = (staff: Staff, item: string) => {

  return {
    item,
  }
}

const make_toolbar = (staff: Staff) => {

  let _list = createSignal(['barline_single',
                           'barline_double'])

  let m_list = createMemo(() => read(_list).map(_ => make_toolbar_item(staff, _)))

  return {
    get list() {
      return m_list()
    },
    find_on_drag_start() {
      return m_list().find(_ => !!_.mouse_down)
    },
    clear_mouse() {
      m_list().forEach(_ => _.mouse_down = undefined)
    }
  }
}


let modes = ['normal', 'insert']

const make_mode = (staff: Staff) => {

  let _mode = createSignal('normal')

  return {
    get mode() {
      return read(_mode)
    },
    next() {
      owrite(_mode, _ => modes[(modes.indexOf(_) + 1) % 2])
    }
  }
}

const make_staff = (staff: Staff, _i: number, _staff: _Staff) => {

  let m_rect = createMemo(() => {
    let { orig, size } = staff.sheet_ref

    if (orig && size) {
      let y = orig.y + size.y * _i()
      let x = orig.x

      return Vec2.make(x, y)
    }
  })
  
  return {
    highlight(vs: Vec2) {
      console.log(m_rect())
    }
  }
}


const make_sheet = (staff: Staff) => {

  let _staves = createSignal([])

  let m_staves = createMemo(mapArray(_staves[0], (_, i) => make_staff(staff, () => i() / m_nb_staves(), _)))
  let m_nb_staves = createMemo(() => read(_staves).length + (staff.mode === 'insert' ? 1 : 0))

  return {
    get nb_staves() {
      return m_nb_staves()
    },
    get staves() {
      return read(_staves)
    },
    set staves(staves: Staves) {
      owrite(_staves, staves)
    },
    find_hover(v_h: Vec2) {
      let v = staff.sheet_ref.get_normal_at_abs_pos(v_h)
    },
    find_drag_update(vs: Vec2) {
      let v = staff.sheet_ref.get_normal_at_abs_pos(vs)

      let yy = v.y * m_nb_staves()
      let i = Math.floor(yy)
      let y = yy - i
      let x = v.x

      m_staves()[i]?.highlight(Vec2.make(x, y))
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
    transform: `translate(${_pos.x}px, calc(${_pos.y}px - 50%))`
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



const make_drag_piece = (staff: Staff) => {

  let _dragging = createSignal(false)
  let _piece = createSignal('')
  let pos = make_position(0, 0)

  let m_style = createMemo(() => ({
    transform: `translate(calc(${pos.x}px - 50%), calc(${pos.y}px - 50%))`
  }))

  let m_klass = createMemo(() => read(_piece))

  return {
    get cur() {
      if (read(_dragging)) {
        return this
      }
    },
    drop() {
      owrite(_dragging, false)
    },
    get vs() {
      return pos.vs
    },
    lerp_vs(vec: Vec2) {
      pos.lerp_vs(vec)
    },
    get piece() {
      return read(_piece)
    },
    begin(piece: string, vs: Vec2) {
      owrite(_dragging, true)
      pos.vs = vs
      owrite(_piece, piece)
    },
    get klass() {
      return m_klass()
    },
    get style() {
      return m_style()
    }
  }
}
