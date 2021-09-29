import { setGravityY, setRestitution, setMaxVelocity } from './dotPool.js';
import { setTrails } from "./clockFace.js";
export const init = () => {
    let gravitySlider = document.getElementById('gravity');
    ;
    gravitySlider.oninput = () => {
        document.getElementById('gravity-value').innerHTML = `    Gravity: ${gravitySlider.value}%`;
        setGravityY(parseInt(gravitySlider.value) * 20);
    };
    let bounceSlider = document.getElementById('bounce');
    ;
    bounceSlider.oninput = () => {
        document.getElementById('bounce-value').innerHTML = `    Bounce:   ${bounceSlider.value}%`;
        setRestitution(parseInt(bounceSlider.value) * 0.01);
    };
    let velocitySlider = document.getElementById('velocity');
    ;
    velocitySlider.oninput = () => {
        document.getElementById('velocity-value').innerHTML = `    Velocity:  ${velocitySlider.value}%`;
        setMaxVelocity(parseInt(velocitySlider.value) * 30);
    };
    let contrailSlider = document.getElementById('contrail');
    ;
    contrailSlider.oninput = () => {
        document.getElementById('contrail-value').innerHTML = `    Con-Trail:  ${contrailSlider.value}%`;
        let inv = 100 - parseInt(contrailSlider.value);
        setTrails((inv * 0.005).toFixed(2));
    };
};
