import { ClockNumber, MatrixWidth, MatrixHeight } from './clockNumber.js';
import { Dot, DotPool } from './dotPool.js';
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
export let animatedDots;
let currentX = 0;
let currentY = 0;
export class ClockFace {
    constructor() {
        this.colon1X = 0;
        this.colon2X = 0;
        this.tick = (timestamp) => {
            canvasCTX.fillStyle = 'rgba(0, 0, 0, ' + ClockFace.trails + ')';
            canvasCTX.fillRect(0, 0, width, height);
            canvasCTX.fillStyle = "black";
            Dot.render(this.colon1X, currentY + (2.0 * DOT_HEIGHT));
            Dot.render(this.colon1X, currentY + (4.0 * DOT_HEIGHT));
            Dot.render(this.colon2X, currentY + (2.0 * DOT_HEIGHT));
            Dot.render(this.colon2X, currentY + (4.0 * DOT_HEIGHT));
            this.updateTime(new Date());
            animatedDots.tick(timestamp);
            window.requestAnimationFrame(this.tick);
        };
        this.initCanvas();
        this.hours = [new ClockNumber(0, 0), new ClockNumber(0, 0)];
        this.minutes = [new ClockNumber(0, 0), new ClockNumber(0, 0)];
        this.seconds = [new ClockNumber(0, 0), new ClockNumber(0, 0)];
        animatedDots = new DotPool();
        canvasCTX.fillStyle = "black";
        canvasCTX.fillRect(0, 0, width, height);
        canvasCTX.lineCap = "round";
        this.createNumbers();
        window.requestAnimationFrame(this.tick);
    }
    initCanvas() {
        canvas = document.getElementById('canvas-content');
        canvasCTX = canvas.getContext('2d');
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }
    updateTime(now) {
        this.setDigits(pad2(now.getHours()), this.hours);
        this.setDigits(pad2(now.getMinutes()), this.minutes);
        this.setDigits(pad2(now.getSeconds()), this.seconds);
    }
    setDigits(digits, numbers) {
        numbers[0].drawPixels(ClockNumber.PIXELS()[parseInt(digits[0])]);
        numbers[1].drawPixels(ClockNumber.PIXELS()[parseInt(digits[1])]);
    }
    createNumbers() {
        hSize = ((DOT_WIDTH * MatrixWidth) +
            NUMBER_SPACING) * 6 +
            ((DOT_WIDTH + NUMBER_SPACING) * 2) - NUMBER_SPACING;
        vSize = DOT_HEIGHT * MatrixHeight;
        currentY = (height - vSize) * 0.33;
        currentX = (width - hSize) * 0.45;
        this.buildNumber(this.hours);
        this.colon1X = currentX + 8;
        currentX += DOT_WIDTH + (2 * NUMBER_SPACING);
        this.buildNumber(this.minutes);
        this.colon2X = currentX + 8;
        currentX += DOT_WIDTH + (2 * NUMBER_SPACING);
        this.buildNumber(this.seconds);
    }
    buildNumber(digits) {
        for (i = 0; i < 2; ++i) {
            digits[i] = new ClockNumber(currentX, currentY);
            currentX += (DOT_WIDTH * MatrixWidth) + NUMBER_SPACING;
        }
    }
}
ClockFace.trails = '0.15';
const pad2 = (num) => {
    return (num < 10) ? "0" + num.toString() : num.toString();
};
