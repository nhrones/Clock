import { Dot } from './dotPool.js';
import { DOT_WIDTH, DOT_HEIGHT, animatedDots } from './clockFace.js';
export const MatrixWidth = 4;
export const MatrixHeight = 7;
let dot = { x: 0, y: 0 };
let y = 0;
let x = 0;
export class ClockNumber {
    constructor(left, top) {
        this.x = left;
        this.y = top;
        this.dotLocations = new Array(MatrixHeight);
        for (let i = 0; i < MatrixHeight; ++i) {
            this.dotLocations[i] = new Array(MatrixWidth);
        }
        for (let y = 0; y < MatrixHeight; ++y) {
            for (let x = 0; x < MatrixWidth; ++x) {
                let xx = this.x + (x * DOT_WIDTH);
                let yy = this.y + (y * DOT_HEIGHT);
                this.dotLocations[y][x] = {
                    x: xx,
                    y: yy
                };
            }
        }
    }
    drawPixels(newPixelMask) {
        for (y = 0; y < MatrixHeight; ++y) {
            for (x = 0; x < MatrixWidth; ++x) {
                dot = this.dotLocations[y][x];
                if (this.currentPixelMask != null) {
                    if ((this.currentPixelMask[y][x] !== 0) && (newPixelMask[y][x] === 0)) {
                        animatedDots.activate(dot.x, dot.y);
                    }
                }
                if (newPixelMask[y][x] === 1) {
                    Dot.render(dot.x, dot.y);
                }
            }
        }
        this.currentPixelMask = newPixelMask;
    }
    static PIXELS() {
        return [
            [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            [
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ],
            [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            [
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ],
            [
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1],
                [1, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1]
            ],
            [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1]
            ],
            [
                [1, 1, 1, 1],
                [1, 0, 0, 1],
                [1, 0, 0, 1],
                [1, 1, 1, 1],
                [0, 0, 0, 1],
                [0, 0, 0, 1],
                [1, 1, 1, 1]
            ]
        ];
    }
}
