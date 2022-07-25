import './fonts.css'
import './index.css'
import { render } from 'solid-js/web'

import Staff from './staff'
import { App } from './view'

export default function VStaff(element: HTMLElement, options = {}) {

  let staff = new Staff(element)

  render(App(staff), element)

  return {
  }
}
