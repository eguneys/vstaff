import { createEffect, createSignal, createMemo, mapArray } from 'solid-js'
import { make_ref } from './make_sticky'
import { read, write, owrite } from './play'


export default class Staff {

  set bras(bras: Array<Bra>) {
    this.sheet.bras = bras
  }

  get bras() {
    return this.sheet.bras
  }

  get ledgers() {
    return this.sheet.ledgers
  }

  constructor() {

    this.ref = make_ref()

    this.sheet = make_sheet(this)

    this.bras = [
      'gclef@0,0.125',
      'four_time@1,0.125',
      'four_time@1,-0.375',
      'sharp_accidental@2.125,-0.625',
      'sharp_accidental@2.5,-0.500',
      'sharp_accidental@1.75,-0.250',
      'quarter_note@4,0.625',
      'quarter_note@5,0.625',
      'quarter_note@5,0.625',
    ]


    this.sheet.ledgers = [
      '@4,0.875',
      '@5,0.625',
      '@5,0.875'
    ]
  }
}

export const make_ledger = (staff: Staff, ledger: Ledger) => {

  let [_, o_pos] = ledger.split('@')
  let [x, y] = o_pos.split(',')

  const m_style = createMemo(() => ({
    transform: `translate(${x}em, ${y}em)`
  }))

  return {

    get style() {
      return m_style()
    }
  }
}

export const make_bra = (staff: Staff, bra: Bra) => {

  let [glyph, o_pos] = bra.split('@')
  let [x, y] = o_pos.split(',')

  const m_style = createMemo(() => ({
    transform: `translate(${x}em, ${y}em)`
  }))

  return {
    get glyph() {
      return glyph
    },
    get style() {
      return m_style()
    }
  }
}

export const make_sheet = (staff: Staff) => {

  let _bras = createSignal([])
  let m_bras = createMemo(mapArray(_bras[0], _ => make_bra(staff, _)))

  let _ledgers = createSignal([])
  let m_ledgers = createMemo(mapArray(_ledgers[0], _ => make_ledger(staff, _)))

  return {
    get ledgers() {
      return m_ledgers()
    },
    set ledgers(ledgers: Array<Ledger>) {
      owrite(_ledgers, ledgers)
    },
    get bras() {
      return m_bras()
    },
    set bras(bras: Array<Bra>) {
      owrite(_bras, bras)
    }
  }
}
