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
     <vstaff class={staff.mode} ref={_ => setTimeout(() => staff.ref.$ref = _)}>
     <div class='drag-overlay'>
       <Show when={staff.cur_drag_piece}>{ drag_piece =>
         <bratext class={drag_piece.klass} style={drag_piece.style}>
           <bra>{g[drag_piece.piece]}</bra>
         </bratext>
       }</Show>
     </div>
     <sheet>
     <staffs ref={_ => setTimeout(() => staff.sheet_ref.$ref = _)}>
        <For each={staff.sheet.staves}>{ stave =>
          <Stave stave={stave}/>
        }</For>
        <Show when={staff.mode==='insert'}>
          <EmptyStaff staff={staff}/>
        </Show>
      </staffs>
      </sheet>
      <bars>
        <toolbar class={staff.mode==='insert'?'open':''}>
          <bratext>
            <For each={staff.toolbar.list}>{bar =>
            <bra onMouseDown={_ => bar.mouse_down = true }>{g[bar.item]}</bra>
            }</For>
          </bratext>
        </toolbar>
        <modebar>
         <label onClick={_ => staff.next_mode() } class={staff.mode}>{staff.mode}</label>
        </modebar> 
        <statusbar>
          Placed there
        </statusbar>
      </bars>
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
