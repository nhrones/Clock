/// <reference lib="dom" />
import { CTX } from './constants.ts';
import { setAlpha } from "./clockFace.ts";

// a utility to save a few keystrokes
const $ = (id: string) => document.getElementById(id)

/** the applications canvas 2D context */ 
export let canvasCTX : CanvasRenderingContext2D 

/** initialize the clocks canvas */
export function initCanvas() {
   const canvas = $('canvas-content') as HTMLCanvasElement
   canvasCTX = canvas.getContext('2d') as CanvasRenderingContext2D
   const width = canvas.clientWidth
   const height = canvas.clientHeight
   canvas.width = width
   canvas.height = height
}


/**
 * initialize DOM elements
 */
export function initDOM() {

   const gravitySlider = $('gravity') as HTMLInputElement;
   const gravityValue = $('gravity-value') as HTMLInputElement;
   const bounceSlider = $('bounce') as HTMLInputElement;
   const bounceValue = $('bounce-value') as HTMLAnchorElement
   const velocitySlider = $('velocity') as HTMLInputElement;
   const velocityValue = $('velocity-value') as HTMLInputElement;
   const trailsSlider = $('trails-slider') as HTMLInputElement;
   const trailsValue = $('trails-value') as HTMLInputElement;
  
   // gravity
   gravitySlider.oninput = () => {
      gravityValue.innerHTML = `    Gravity: ${gravitySlider.value}%`;
      CTX.GravityY = (parseInt(gravitySlider.value) * 50) | 0
   }

   // coefficient of restitution (COR) -- bounce
   bounceSlider.oninput = () => {
      bounceValue.innerHTML = `    COR Restitution:   ${bounceSlider.value}%`;
      CTX.Restitution = parseInt(bounceSlider.value) * .01
   }

   // velocity
   velocitySlider.oninput = () => {
      velocityValue.innerHTML = `    Velocity:  ${velocitySlider.value}%`;
      CTX.MaxVelocity = (parseInt(velocitySlider.value) * 50) | 0
   }

   // partical trails -- 
   trailsSlider.oninput = () => {
      trailsValue.innerHTML = `    Partical-Trails:  ${trailsSlider.value}%`;
      setAlpha(parseInt(trailsSlider.value));
   }
}
