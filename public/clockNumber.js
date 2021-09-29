import { renderDot, activateDot } from './dotPool.js';
import { DOT_WIDTH, DOT_HEIGHT } from './clockFace.js';
export const MatrixWidth = 4;
export const MatrixHeight = 7;
let dot = { x: 0, y: 0 };
export function createNumber(x, y) {
    let left = x;
    let top = y;
    let currentPixelMask;
    let dotLocations;
    dotLocations = new Array(MatrixHeight);
    for (let i = 0; i < MatrixHeight; ++i) {
        dotLocations[i] = new Array(MatrixWidth);
    }
    for (let y = 0; y < MatrixHeight; ++y) {
        for (let x = 0; x < MatrixWidth; ++x) {
            let xx = left + (x * DOT_WIDTH);
            let yy = top + (y * DOT_HEIGHT);
            dotLocations[y][x] = {
                x: xx,
                y: yy
            };
        }
    }
    function drawPixels(newPixelMask) {
        console.info(newPixelMask);
        for (y = 0; y < MatrixHeight; ++y) {
            for (x = 0; x < MatrixWidth; ++x) {
                dot = dotLocations[y][x];
                if (currentPixelMask != null) {
                    if ((currentPixelMask[y][x] !== 0) && (newPixelMask[y][x] === 0)) {
                        activateDot(dot.x, dot.y);
                    }
                }
                if (newPixelMask[y][x] === 1) {
                    renderDot(dot.x, dot.y);
                }
            }
        }
        currentPixelMask = newPixelMask;
    }
    return { x: left, y: top, drawPixels: drawPixels };
}
export const PIXELS = [
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
