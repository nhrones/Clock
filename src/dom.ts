import { Dot } from './dotPool.js';
import { ClockFace } from "./clockFace.js";
export const DomEvents = {
    init: () => {
        let gravitySlider = document.getElementById('gravity') as HTMLInputElement;
        gravitySlider.oninput = () => {
            document.getElementById('gravity-value').innerHTML = '.    Gravity: ' + gravitySlider.value;
            Dot.GravityY = parseInt(gravitySlider.value);
        };
        let bounceSlider = document.getElementById('bounce') as HTMLInputElement;
        bounceSlider.oninput = () => {
            document.getElementById('bounce-value').innerHTML = '.    Bounce: ' + bounceSlider.value;
            Dot.Restitution = (parseInt(bounceSlider.value) * 0.01);
        };
        let velocitySlider = document.getElementById('velocity') as HTMLInputElement;
        velocitySlider.oninput = () => {
            document.getElementById('velocity-value').innerHTML = '.    Velocity: ' + velocitySlider.value;
            Dot.MaxVelocity = parseInt(velocitySlider.value);
        };
        let contrailSlider = document.getElementById('contrail') as HTMLInputElement;
        contrailSlider.oninput = () => {
            document.getElementById('contrail-value').innerHTML = '.    Con-Trail: ' + contrailSlider.value;
            ClockFace.trails = (parseInt(contrailSlider.value) * 0.01).toFixed(2);
        };
    }
};
