import { onCleanup } from 'solid-js'
import g from './music/glyphs'

function unbindable(
  el: EventTarget,
  eventName: string,
  callback: EventListener,
  options?: AddEventListenerOptions
): Unbind {
  el.addEventListener(eventName, callback, options);
  return () => el.removeEventListener(eventName, callback, options);
}

export const App = staff => props => {


  let unbinds = [];

  unbinds.push(unbindable(document, 'scroll', () => staff.onScroll(), { capture: true, passive: true }));
  unbinds.push(unbindable(window, 'resize', () => staff.onScroll(), { passive: true }));

  onCleanup(() => unbinds.forEach(_ => _()));

  return (<>
     <vstaff style={staff.style} ref={_ => setTimeout(() => staff.ref.$ref = _)}>
       <staff>
        <Show when={staff.playback.show}>{cursor =>
          <div class='playback'>
            <span style={cursor.style} class='cursor'><span style={cursor.line_style} class='line'></span></span>
          </div>
        }</Show>
       <lines> <line/> <line/> <line/> <line/> <line/> </lines>
       <ledgers>
         <For each={staff.ledgers}>{ ledger =>
           <ledger style={ledger.style}></ledger>
         }</For>
         <For each={staff.bars}>{ bar =>
            <bar style={bar.style}></bar>
         }</For>
         <For each={staff.stems}>{ stem =>
            <stem style={stem.style}></stem>
         }</For>
         <For each={staff.beams}>{ beam =>
           <Beam style={beam.style} y2={beam.y2}/>
         }</For>
         <For each={staff.ties}>{ tie =>
           <Tie klass={tie.klass} style={tie.style} x2={tie.x2}/>
         }</For>
       </ledgers>
       <bravura>
         <For each={staff.bras}>{ bra =>
           <bra class={bra.klass} style={bra.style}>{g[bra.glyph]}</bra>
         }</For>
       </bravura>
       </staff>
       </vstaff>
     </>)
}


function tie_path(x) {

  return `M 0 ${x*0.5} c ${x} -${x*0.5}    ${x*4} -${x*0.5}    ${x*5} 0
    -${x} -${x*0.5-4} -${x*4} -${x*0.5-4} -${x*5} 0`

  return `M 0 ${x*0.5} c ${x} -${x*0.5}    ${x*4} -${x*0.5}    ${x*5} 0
    -${x} -${x*0.5-4} -${x*4} -${x*0.5-4} -${x*5} 0`

}

function beam_path(x2: number, y2: number) {
  let x = 0
  let y = 0
  let k = 10 
  return `M${x},${y+k}L${x},${y}L${x2},${y2}L${x2},${y2+k}L${x},${y+k}` 
}


const Tie = props => {
  return (<tie class={props.klass} style={props.style}>
    <svg width="1em" height="1em" viewBox={`0 0 100 100`}>
      <path d={tie_path(props.x2)}/>
    </svg>
  </tie>)
}

const Beam = props => {
  let minY = props.y2
  return (<beam style={props.style}>
    <svg width="1em" height="1em" viewBox={`0 0 100 100`}>
      <path d={beam_path(100, props.y2)}/>
    </svg>
  </beam>)
}



