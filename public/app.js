import { ClockFace } from './clockFace.js';
import { DomEvents } from './dom.js';
window.addEventListener('DOMContentLoaded', (e) => {
    DomEvents.init();
    let _ = new ClockFace();
});
