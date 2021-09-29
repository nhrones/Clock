
import { buildClockFace } from './clockFace.js'
import * as DomEvents  from './dom.js'

// wait for it ...
window.addEventListener('DOMContentLoaded', (e) => {
    // we can now reliably access our DOM objects
    // and setup all of our DOM event handlers.
    DomEvents.init()
    // now, let's build -> render -> and animate this 'clock'
    buildClockFace()
})