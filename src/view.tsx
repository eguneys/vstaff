export const App = staff => props => {


  return (<>
     <vstaff>
      <staffs>
        <For each={[1,2,3,4,5,6,7]}>{ i =>
          <Staff/>
        }</For>
      </staffs>
     </vstaff>
     </>)
}


const Staff = props => {


  return (<staff>
       <line/>
       <line/>
       <line/>
       <line/>
       <line/>
      </staff>)
}
