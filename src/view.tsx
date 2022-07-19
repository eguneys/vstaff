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
        <For each={staff.sheet.staves}>{ stave =>
          <Stave stave={stave}/>
        }</For>
        <EmptyStaff staff={staff}/>
      </staffs>
      <Show when={staff.overlay}>{ overlay =>
      <overlay style={staff._overlay.style}>
      <flex-list>
       <For each={overlay}>{ l =>
         <Dynamic component={overlay_items[l.i]} item={l}/>
       }</For>
      </flex-list>
      </overlay>
      }</Show>
     </vstaff>
     </>)
}


const BraText = props => {
  return (<bratext onMouseUp={_ => props.item.on_select() }>{g[props.item.glyph]}</bratext>)
}

const overlay_items = {
  bra: BraText
}

const clef_styles = {
gclef: {
  transform: `translate(0, 0.125em)`
       },
bclef: {
transform: `translate(0, -0.375em)`
       }
}

const Stave = props => {

  return (<staff>
      <lines>
       <line/>
       <line/>
       <line/>
       <line/>
       <line/>
       </lines>
       <bravura>
        <bra style={clef_styles[props.stave.clef]}>{g[props.stave.clef]}</bra>
       </bravura>
      </staff>)

}



const EmptyStaff = props => {


  return (<staff>
       <lines>
       <line/>
       <line/>
       <line/>
       <line/>
       <line/>
       </lines>
       <bravura>
        <bra style={clef_styles['gclef']} onMouseDown={_ => props.staff.clef_mouse_down()} class={'ghost'}>{g['gclef']}</bra>
       </bravura>
      </staff>)
}
