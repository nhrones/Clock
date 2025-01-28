/// <reference lib="dom" />
import "./components/slider.ts"

import { buildClockFace } from './clockFace.ts'
import { initDOM }  from './dom.ts'
 

// initialize all DOM references and event handlers.
initDOM()

// build -> render -> and animate our `dot-clock`
buildClockFace()
