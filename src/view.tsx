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
     <vstaff ref={_ => setTimeout(() => staff.ref.$ref = _)}>
       <staff>
       <lines> <line/> <line/> <line/> <line/> <line/> </lines>
       <ledgers>
         <For each={staff.ledgers}>{ ledger =>
           <ledger style={ledger.style}></ledger>
         }</For>
         <For each={staff.bars}>{ bar =>
            <bar style={bar.style}></bar>
         }</For>
       </ledgers>
       <bravura>
         <For each={staff.bras}>{ bra =>
           <bra style={bra.style}>{g[bra.glyph]}</bra>
         }</For>
       </bravura>
       </staff>
       </vstaff>
     </>)
}
