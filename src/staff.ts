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


  get ties() {
    return this.sheet.ties
  }

  get beams() {
    return this.sheet.beams
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

    this.playback = make_playback(this)
    /*
    this.bras = [
      'gclef@0,0',
      'four_time@1,0',
      'four_time@1,-0.5',
      'sharp_accidental@2.125,-0.750',
      'sharp_accidental@2.5,-0.50',
      'sharp_accidental@1.75,-0.50',
      'quarter_note@4,0.5',
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
      '@6.265,-0.04,0.75',
      `@6,${0.75+0.04},0.75`,
      `@4.265,${0.5-0.04},0.75`,
      `@5.265,${0.5-0.04},0.75`,
    ]


    this.sheet.beams = [
      `@4.265,${0.5-0.04},${0.5-0.04}`,
      `@5.265,${0.5-0.04},${-0.04}`
    ]


    this.sheet.ties = [
      `flip@4.125,1.5,5.125`
    ]
   */
  }
}



const make_playback = (solsido: Solsido) => {

  let _show = createSignal(false)
  let _x = createSignal(1)
  let _w = createSignal(1)
  let _i = createSignal(100)

  let m_style = createMemo(() => ({
    transform: `translate(${read(_x)}em, 0)`,
    width: `${read(_w)}em`
  }))


  let m_line_style = createMemo(() => ({
    transform: `translate(${read(_w)* 0.01 * read(_i)}em, 0)`
  }))

  return {
    get show() {
      if (read(_show)) {
        return this
      }
    },
    get line_style() {
      return m_line_style()
    },
    get style() {
      return m_style()
    },
    set_play(v: boolean) {
      owrite(_show, v)
    },
    set_x(x: number) {
      owrite(_x, x)
    }
  }
}

const make_tie = (staff: Staff, tie: Tie) => {
  let [klass, o_pos] = tie.split('@')
  let [x, y, x2] = o_pos.split(',')
  x2 -= x
  x2 *= 100

  x2 = 20

  const m_style = createMemo(() => ({
    transform: `translate(${x}em, ${y}em)`
  }))

  return {
    x2,
    klass,
    get style() {
      return m_style()
    }
  }
}

const make_beam = (staff: Staff, beam: Beam) => {
  let [_, o_pos] = beam.split('@')
  let [x, y, y2] = o_pos.split(',')
  y2 -= y

  const m_style = createMemo(() => ({
    transform: `translate(${x}em, ${y}em)`
  }))

  return {
    get y2() {
      return y2 * 100
    },
    get style() {
      return m_style()
    }
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
    set xwi(xwi: XWI) {
      let [x, w, i] = xwi.split(',')

      owrite(_x, x)
      owrite(_w, w)
      owrite(_i, i)
    },
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

  let _beams = createSignal([])
  let m_beams = createMemo(mapArray(_beams[0], _ => make_beam(staff, _)))

  let _ties = createSignal([])
  let m_ties = createMemo(mapArray(_ties[0], _ => make_tie(staff, _)))

  return {
    set ties(ties: Array<Tie>) {
      owrite(_ties, ties)
    },
    get ties() {
      return m_ties()
    },

    set beams(beams: Array<Beam>) {
      owrite(_beams, beams)
    },
    get beams() {
      return m_beams()
    },
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
