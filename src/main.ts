/// <reference lib="dom" />
import { SuperSlider } from "./components/slider.ts"

import { buildClockFace } from './clockFace.ts'
import { initDOM }  from './dom.ts'
customElements.define("super-slider", SuperSlider);  
// initialize all DOM references and event handlers.
initDOM()

// build -> render -> and animate our `dot-clock`
buildClockFace()
