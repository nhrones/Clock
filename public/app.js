import { buildClockFace } from './clockFace.js';
import * as DomEvents from './dom.js';
window.addEventListener('DOMContentLoaded', (e) => {
    DomEvents.init();
    buildClockFace();
});
