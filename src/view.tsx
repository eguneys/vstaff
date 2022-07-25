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
     <staffs>
        <For each={staff.staves}>{ stave =>
          <Stave stave={stave}/>
        }</For>
     </staffs>
     </vstaff>
     </>)
}


const Stave = props => {
  return (<staff>
      <lines> <line/> <line/> <line/> <line/> <line/> </lines>
      <bravura>
        <bra style={clef_styles[props.stave.clef]}>{g[props.stave.clef]}</bra>
      </bravura>
    </staff>)
}
