
import { buildClockFace } from './clockFace.js'
import * as DomEvents  from './dom.js'

// wait for it ...
window.addEventListener('DOMContentLoaded', (e) => {
    // setup all DOM event handlers.
    DomEvents.init()
    // build -> render -> and animate a `clock`
    buildClockFace()
})