import { createSignal } from 'solid-js'
import { make_ref } from './make_sticky'


export default class Staff {

  get staves() {
    return this.sheet.staves
  }

  constructor() {

    this.ref = make_ref()

    this.sheet = make_sheet(this)

  }
}


export const make_sheet = (staff: Staff) => {

  let _staves = createSignal([])



  return {
    get staves() {
      return m_staves()
    }
  }
}
