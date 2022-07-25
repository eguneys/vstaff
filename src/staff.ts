import { createEffect, createSignal, createMemo, mapArray } from 'solid-js'
import { make_ref } from './make_sticky'
import { read, write, owrite } from './play'


export default class Staff {


  onScroll() {
    this.ref.$clear_bounds()
  }

  set bras(bras: Array<Bra>) {
    this.sheet.bras = bras
  }
  
  get stems() {
    return this.sheet.stems
  }

  get bars() {
    return this.sheet.bars
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
      'gclef@0,0',
      'four_time@1,0',
      'four_time@1,-0.5',
      'sharp_accidental@2.125,-0.750',
      'sharp_accidental@2.5,-0.50',
      'sharp_accidental@1.75,-0.50',
      'quarter_note@4,0.5',
      'quarter_note@5,0.5',
      'quarter_note@5,0.5',
      'quarter_note@6,0',
      'eighth_flag_up@6.265,-0.85',
      'sixtyfourth_flag_down@6,0.85',
    ]


    this.sheet.ledgers = [
      '@4,0.750',
      '@5,0.5',
      '@5,0.750'
    ]


    this.sheet.bars = [
      '@7'
    ]


    this.sheet.stems = [
      '@6.265,-0.04,0.750',
      '@6,0.79,0.750'
    ]
  }
}

const make_stem = (staff: Staff, stem: Stem) => {
  let [_, o_pos] = stem.split('@')
  let [x, y, h] = o_pos.split(',')

  const m_style = createMemo(() => ({
    transform: `translate(${x}em, ${y}em)`,
    height: `${h}em`
  }))

  return {
    get style() {
      return m_style()
    }
  }
}

const make_bar = (staff: Staff, bar: Bar) => {
  let [_, o_pos] = bar.split('@')
  let [x] = o_pos.split(',')

  const m_style = createMemo(() => ({
    transform: `translate(${x}em, 0)`
  }))

  return {
    get style() {
      return m_style()
    }
  }
}

const make_ledger = (staff: Staff, ledger: Ledger) => {

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

const make_bra = (staff: Staff, bra: Bra) => {

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

const make_sheet = (staff: Staff) => {

  let _bras = createSignal([])
  let m_bras = createMemo(mapArray(_bras[0], _ => make_bra(staff, _)))

  let _ledgers = createSignal([])
  let m_ledgers = createMemo(mapArray(_ledgers[0], _ => make_ledger(staff, _)))

  let _bars = createSignal([])
  let m_bars = createMemo(mapArray(_bars[0], _ => make_bar(staff, _)))

  let _stems = createSignal([])
  let m_stems = createMemo(mapArray(_stems[0], _ => make_stem(staff, _)))

  return {
    set stems(stems: Array<Stem>) {
      owrite(_stems, stems)
    },
    get stems() {
      return m_stems()
    },
    set bars(bars: Array<Bar>) {
      owrite(_bars, bars)
    },
    get bars() {
      return m_bars()
    },
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
