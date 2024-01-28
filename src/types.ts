
/**
 * This type creates an array of physical locations
 * that will be used as a 4 x 7 dot matrix.
 * This array will be manipulted to represent a
 * seven segment numeric display.
 * Each dot position will be active or inactive
 * based on a set of numeric 'masks' that represent
 * the numbers 0 to 9
 */
export type ClockNumber = {
   x: number
   y: number
   drawPixels(px: number[][]): void
}
