import { PIXELS, createNumber, MatrixWidth, MatrixHeight } from './clockNumber.js';
import { renderDot, initializeDotPool, tickDots } from './dotPool.js';
export let width;
export let height;
export const NUMBER_SPACING = 16;
export const DOT_WIDTH = 16;
export const DOT_HEIGHT = 16;
export let canvas;
export let canvasCTX;
let hSize = 0;
let vSize = 0;
let i;
let animatedDots;
let currentX = 0;
let currentY = 0;
let _trails = '0.15';
export const setTrails = (value) => _trails = value;
let hours;
let minutes;
let seconds;
let colon1X = 0;
let colon2X = 0;
export const buildClockFace = () => {
    initCanvas();
    hours = [createNumber(0, 0), createNumber(0, 0)];
    minutes = [createNumber(0, 0), createNumber(0, 0)];
    seconds = [createNumber(0, 0), createNumber(0, 0)];
    animatedDots = initializeDotPool();
    canvasCTX.fillStyle = "black";
    canvasCTX.fillRect(0, 0, width, height);
    canvasCTX.lineCap = "round";
    createNumbers();
    window.requestAnimationFrame(tick);
};
const initCanvas = () => {
    canvas = document.getElementById('canvas-content');
    canvasCTX = canvas.getContext('2d');
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width;
    canvas.height = height;
};
export const tick = (timestamp) => {
    canvasCTX.fillStyle = 'rgba(0, 0, 0, ' + _trails + ')';
    canvasCTX.fillRect(0, 0, width, height);
    canvasCTX.fillStyle = "black";
    renderDot(colon1X, currentY + (2.0 * DOT_HEIGHT));
    renderDot(colon1X, currentY + (4.0 * DOT_HEIGHT));
    renderDot(colon2X, currentY + (2.0 * DOT_HEIGHT));
    renderDot(colon2X, currentY + (4.0 * DOT_HEIGHT));
    updateTime(new Date());
    tickDots(timestamp);
    window.requestAnimationFrame(tick);
};
const updateTime = (now) => {
    setDigits(pad2(now.getHours()), hours);
    setDigits(pad2(now.getMinutes()), minutes);
    setDigits(pad2(now.getSeconds()), seconds);
};
const setDigits = (digits, numbers) => {
    numbers[0].drawPixels(PIXELS[parseInt(digits[0])]);
    numbers[1].drawPixels(PIXELS[parseInt(digits[1])]);
};
const createNumbers = () => {
    hSize = ((DOT_WIDTH * MatrixWidth) +
        NUMBER_SPACING) * 6 +
        ((DOT_WIDTH + NUMBER_SPACING) * 2) - NUMBER_SPACING;
    vSize = DOT_HEIGHT * MatrixHeight;
    currentY = (height - vSize) * 0.33;
    currentX = (width - hSize) * 0.45;
    buildNumber(hours);
    colon1X = currentX + 8;
    currentX += DOT_WIDTH + (2 * NUMBER_SPACING);
    buildNumber(minutes);
    colon2X = currentX + 8;
    currentX += DOT_WIDTH + (2 * NUMBER_SPACING);
    buildNumber(seconds);
};
const buildNumber = (digits) => {
    for (i = 0; i < 2; ++i) {
        digits[i] = createNumber(currentX, currentY);
        currentX += (DOT_WIDTH * MatrixWidth) + NUMBER_SPACING;
    }
};
const pad2 = (num) => {
    return (num < 10) ? "0" + num.toString() : num.toString();
};
