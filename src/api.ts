import { on, createEffect, createSignal, createMemo } from 'solid-js'
import { read, write, owrite } from './play'
import { Sheet, Staff } from 'lstaff'


export class Ctrl {
  constructor() {
    this.staff = make_staff(this)
  }
}


const make_staff = (ctrl: Ctrl) => {

  let _bra = createSignal('gclef\n\ngclef\n\ngclef\n\ngclef\n\ngclef\n\ngclef')

  let _staff = createSignal(Sheet.empty())

  let m_staff = createMemo(() => read(_staff))

  let m_staves = createMemo(() => m_staff().staves)

  createEffect(on(() => read(_bra), (bra) => {
    owrite(_staff, Sheet.from_bra(bra))
  }))

  return {
    get staves() {
      return m_staves()
    },
    local_sheet(fn: (_: Sheet) => Sheet) {
      owrite(_staff, _ => fn(_))
    }
  }
}


export function make_hooks(ctrl: Ctrl) {
  return {
    user_new_staff(clef: Clef) {
      ctrl.staff.local_sheet(_ => _.clone.add_staff_in(clef))
    }
  }
}


export function make_user(ctrl: Ctrl, staff: Staff) {


  createEffect(() => {
    staff.sheet.staves = ctrl.staff.staves
  })

}
