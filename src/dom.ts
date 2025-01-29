import { CTX } from './constants.ts';
import { setAlpha } from "./clockFace.ts";

/** a utility to save a few keystrokes */ 
const $ = (id: string) => document.getElementById(id)

/** the applications canvas 2D context */
export let canvasCTX: CanvasRenderingContext2D

/** initialize the clocks canvas */
export function initCanvas() {
   const canvas = $('canvas-content') as HTMLCanvasElement
   canvasCTX = canvas.getContext('2d') as CanvasRenderingContext2D
   const width = canvas.clientWidth
   const height = canvas.clientHeight
   canvas.width = width
   canvas.height = height
}

/** initialize DOM elements */
export function initDOM() {

   /** Gravity */
   $('gravity')!.addEventListener('change', (ev: any) => {
      CTX.GravityY = (parseInt(ev.data) * 50) | 0
   });

   /** Bounce == coefficient of restitution (COR) */
   $('bounce')!.addEventListener('change', (ev: any) => {
      CTX.Restitution = parseInt(ev.data) * .01
   });

   /** Velocity */
   $('velocity')!.addEventListener('change', (ev: any) => {
      CTX.MaxVelocity = (parseInt(ev.data) * 50) | 0
   });

   /** Partical trails */
   $('trails')!.addEventListener('change', (ev: any) => {
      setAlpha(parseInt(ev.data));
   });
}
