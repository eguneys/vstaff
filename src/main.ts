import './fonts.css'
import './index.css'
import './theme.css'
import { render } from 'solid-js/web'

import Staff from './staff'
import { App } from './view'
import { Ctrl, make_hooks, make_user } from './api'

export default function VStaff(element: HTMLElement, options = {}) {

  let ctrl = new Ctrl(options)

  let staff = new Staff(make_hooks(ctrl), element)

  render(App(staff), element)

  return make_user(ctrl, staff)
}
