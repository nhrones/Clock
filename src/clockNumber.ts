import {Dot} from './dotPool.js'
import {DOT_WIDTH, DOT_HEIGHT, animatedDots} from './clockFace.js'

export const MatrixWidth = 4;
export const MatrixHeight = 7;
let dot = { x: 0, y: 0 }
let y = 0
let x = 0

/**
 * This class creates an array of physical locations
 * that will be used as a 4 x 7 dot matrix.
 * This array will be manipulted to represent a
 * seven segment numeric display.
 * Each dot position will be active or inactive
 * based on a set of numeric 'masks' that represent
 * the numbers 0 to 9
 */
export class ClockNumber {


    /** the horizontal(left) location of this display */
    x: number


    /** the vertical(top) location of this display */
    y: number


    /** A 2 dimensional array of point locations(dots) as a 4 x 7 matrix */
    dotLocations: { x: number, y: number }[][]


    /**
     * A 2 dimensional array of points
     * as a 4 x 7 matrix, that contains a mask
     * of values 0 or 1 to indicate active pixels
     */
    currentPixelMask: number[][]

    /**
     * Create a new ClockNumber object and
     * initialize its dot array based on the
     * passed in location parameters.
     */
    constructor(left: number, top: number) {

        // set location for this display
        this.x = left
        this.y = top

        // initialize our location arrays
        this.dotLocations = new Array(MatrixHeight)
        for (let i = 0; i < MatrixHeight; ++i) {
            this.dotLocations[i] = new Array(MatrixWidth)
        }

        // calculate/set each location of our dots
        for (let y = 0; y < MatrixHeight; ++y) {
            for (let x = 0; x < MatrixWidth; ++x) {
                let xx = this.x + (x * DOT_WIDTH)
                let yy = this.y + (y * DOT_HEIGHT)
                this.dotLocations[y][x] = {
                    x: xx,
                    y: yy
                }
            }
        }
    }


    /**
     * Draw the visual pixels(dots) for a given number,
     * based on a lookup in an array of pixel masks.
     * SEE: the PIXELS array below.
     * If a value in the mask is set to 1, that position in
     * the display will have a visual dot displayed.
     * .
     * .
     * On a number change, any active dot that is not required
     * to be active in the new number, will be set free ...
     * That is, it will be 'activated' in the DotPool, becoming
     * an animated dot.
     */
    drawPixels(newPixelMask: number[][]) {
        //dot: { x: number, y: number }
        for (y = 0; y < MatrixHeight; ++y) {
            for (x = 0; x < MatrixWidth; ++x) {
                dot = this.dotLocations[y][x]
                if (this.currentPixelMask != null) {
                    // if this dot is 'on', and it is not required for the new number
                    if ((this.currentPixelMask[y][x] !== 0) && (newPixelMask[y][x] === 0)) {
                        // activate it as a 'free' animated dot
                        animatedDots.activate(dot.x, dot.y)
                    }
                }
                // if this dot is an active member of this number mask
                if (newPixelMask[y][x] === 1) {
                    // render it to the canvas
                    Dot.render(dot.x, dot.y)
                }
            }
        }
        // Set the current pixel mask to this new mask. Used to
        // evaluate pixels to be 'freed' during next update.
        this.currentPixelMask = newPixelMask
    }

    /**
     * A lookup array of 10 pixel masks(0-9).
     * Each mask(array) represents the pixels of
     * a 4 x 7 matrix of dots that are used to
     * display a 7 segment numeric display.
     * If a value in the mask is set to 1, that position
     * in this display will have a visual dot displayed.
     * A value of 0 will not be displayed.
     */
    static PIXELS() {
        return [
            // 'zero'
            [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            // 'one'
            [
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ],
            // 'two'
            [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1]
            ],
            // 'three'
            [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            // 'four'
            [
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ],
            // 'five'
            [
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            // 'six'
            [
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            // 'seven'
            [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ],
            // 'eight'
            [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            // 'nine'
            [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ]
        ]
    }
}