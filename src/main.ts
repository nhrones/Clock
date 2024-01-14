/// <reference lib="dom" />
import { buildClockFace } from './clockFace.ts'
import * as DomEvents  from './dom.ts'
    
// setup all DOM event handlers.
DomEvents.init()

// build -> render -> and animate a `clock`
buildClockFace()
