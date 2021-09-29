import { canvasCTX, width, height } from './clockFace.js';
let GravityX = 0;
let GravityY = 2000;
export const setGravityY = (value) => { GravityY = value; };
let Restitution = 0.5;
export const setRestitution = (value) => { Restitution = value; };
const Radius = 14.0;
const HalfRadius = 7.0;
const Radius_Sqrd = 14 * 14;
let MaxVelocity = 1500.0;
export const setMaxVelocity = (value) => { MaxVelocity = value; };
const Color = '#44f';
export const renderDot = (x, y, color) => {
    canvasCTX.fillStyle = color || Color;
    canvasCTX.beginPath();
    canvasCTX.arc(x, y, HalfRadius, 0, 2 * Math.PI, true);
    canvasCTX.closePath();
    canvasCTX.fill();
};
let idx = 0;
let i = 0;
let j = 0;
let distanceX = 0;
let distanceY = 0;
let delta = 0;
let thisDistanceSquared = 0;
let velocityDiffX = 0;
let velocityDiffY = 0;
let actualDistance = 0;
let ratioX = 0;
let ratioY = 0;
let impactSpeed = 0;
let newDotAx = 0;
let newDotAy = 0;
let newDotBx = 0;
let newDotBy = 0;
const POOL_SIZE = 500;
const posX = [];
const posY = [];
const lastX = [];
const lastY = [];
const velocityX = [];
const velocityY = [];
let tailPointer = 0;
let lastTime = Date.now();
const randomVelocity = () => {
    return (Math.random() - 0.4) * MaxVelocity;
};
export function initializeDotPool() {
    for (i = 0; i < POOL_SIZE; i++) {
        posX[i] = -1;
        posY[i] = 0;
        lastX[i] = -1;
        lastY[i] = 0;
        velocityX[i] = randomVelocity();
        velocityY[i] = randomVelocity();
    }
    lastTime = Date.now();
}
export const tickDots = (thisTime) => {
    delta = ((thisTime - lastTime) / 1000.0);
    lastTime = thisTime;
    updateDotPositions(delta);
    testForCollisions(delta);
};
function updateDotPositions(delta) {
    for (i = 0; i < tailPointer + 2; i++) {
        if (posX[i] === -1) {
            continue;
        }
        velocityX[i] += (GravityX * delta);
        velocityY[i] += (GravityY * delta);
        posX[i] += (velocityX[i] * delta);
        posY[i] += (velocityY[i] * delta);
        if ((posX[i] <= Radius) || (posX[i] >= (width))) {
            if (posY[i] >= height - 2) {
                posX[i] = -1;
                if (i === tailPointer) {
                    tailPointer--;
                }
                continue;
            }
            else {
                if (posX[i] <= Radius) {
                    posX[i] = Radius;
                }
                if (posX[i] >= (width)) {
                    posX[i] = width;
                }
                velocityX[i] *= -Restitution;
            }
        }
        if (posY[i] >= height) {
            posY[i] = height;
            velocityY[i] *= -Restitution;
        }
        if (posY[i] <= Radius) {
            posY[i] = Radius;
            velocityY[i] *= -Restitution;
        }
        renderFreeDot(i);
    }
}
function testForCollisions(delta) {
    for (i = 0; i < tailPointer + 2; i++) {
        if (posX[i] === -1) {
            continue;
        }
        for (j = 0; j < tailPointer + 2; j++) {
            if (i === j) {
                continue;
            }
            if (posX[j] === -1) {
                continue;
            }
            distanceX = Math.abs(posX[i] - posX[j]);
            distanceY = Math.abs(posY[i] - posY[j]);
            thisDistanceSquared = distanceX ** 2 + distanceY ** 2;
            if (thisDistanceSquared < Radius_Sqrd) {
                if (newDistanceSquared(delta, i, j) > thisDistanceSquared) {
                    continue;
                }
                collideDots(i, j, distanceX, distanceY);
            }
        }
    }
}
function collideDots(dotA, dotB, distanceX, distanceY) {
    thisDistanceSquared = distanceX ** 2 + distanceY ** 2;
    velocityDiffX = velocityX[dotA] - velocityX[dotB];
    velocityDiffY = velocityY[dotA] - velocityY[dotB];
    actualDistance = Math.sqrt(thisDistanceSquared);
    ratioX = distanceX / actualDistance;
    ratioY = distanceY / actualDistance;
    impactSpeed = (velocityDiffX * ratioX) + (velocityDiffY * ratioY);
    velocityX[dotA] -= ratioX * impactSpeed;
    velocityY[dotA] -= ratioY * impactSpeed;
    velocityX[dotB] += ratioX * impactSpeed;
    velocityY[dotB] += ratioY * impactSpeed;
}
function newDistanceSquared(delta, a, b) {
    newDotAx = posX[a] + (velocityX[a] * delta);
    newDotAy = posY[a] + (velocityY[a] * delta);
    newDotBx = posX[b] + (velocityX[b] * delta);
    newDotBy = posY[b] + (velocityY[b] * delta);
    return (Math.abs(newDotAx - newDotBx) ** 2) + (Math.abs(newDotAy - newDotBy) ** 2);
}
export function activateDot(x, y) {
    for (idx = 0; idx < tailPointer + 2; idx++) {
        if (posX[idx] === -1) {
            posX[idx] = x;
            posY[idx] = y;
            lastX[idx] = x;
            lastY[idx] = y;
            velocityX[idx] = randomVelocity();
            velocityY[idx] = randomVelocity();
            if (idx > tailPointer)
                tailPointer = idx;
            break;
        }
    }
}
const renderFreeDot = (i) => {
    canvasCTX.beginPath();
    canvasCTX.fillStyle = Color;
    canvasCTX.strokeStyle = Color;
    canvasCTX.lineWidth = Radius;
    canvasCTX.moveTo(lastX[i] - Radius, lastY[i] - Radius);
    canvasCTX.lineTo(posX[i] - Radius, posY[i] - Radius);
    canvasCTX.stroke();
    canvasCTX.closePath();
    canvasCTX.fill();
    lastX[i] = posX[i];
    lastY[i] = posY[i];
};
