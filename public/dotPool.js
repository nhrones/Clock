import { canvasCTX, width, height } from './clockFace.js';
export const Dot = {
    GravityX: 0,
    GravityY: 100,
    Restitution: 0.8,
    Radius: 14.0,
    HalfRadius: 7.0,
    Radius_Sqrd: 14 * 14,
    MaxVelocity: 200.0,
    Color: '#44f',
    render: (x, y, color) => {
        canvasCTX.fillStyle = color || Dot.Color;
        canvasCTX.beginPath();
        canvasCTX.arc(x, y, Dot.HalfRadius, 0, 2 * Math.PI, true);
        canvasCTX.closePath();
        canvasCTX.fill();
    }
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
export class DotPool {
    constructor() {
        this.tailPointer = 0;
        this.lastTime = Date.now();
        this.posX = [];
        this.posY = [];
        this.lastX = [];
        this.lastY = [];
        this.velocityX = [];
        this.velocityY = [];
        this.initializeDotPool();
    }
    randomVelocity() {
        return (Math.random() - 0.4) * Dot.MaxVelocity;
    }
    initializeDotPool() {
        for (i = 0; i < DotPool.POOL_SIZE; i++) {
            this.posX[i] = -1;
            this.posY[i] = 0;
            this.lastX[i] = -1;
            this.lastY[i] = 0;
            this.velocityX[i] = this.randomVelocity();
            this.velocityY[i] = this.randomVelocity();
        }
    }
    tick(thisTime) {
        delta = ((thisTime - this.lastTime) / 1000.0, 0.1);
        this.lastTime = thisTime;
        this.updateDotPositions(delta);
        this.testForCollisions(delta);
    }
    updateDotPositions(delta) {
        for (i = 0; i < this.tailPointer + 2; i++) {
            if (this.posX[i] === -1) {
                continue;
            }
            this.velocityX[i] += (Dot.GravityX * delta);
            this.velocityY[i] += (Dot.GravityY * delta);
            this.posX[i] += (this.velocityX[i] * delta);
            this.posY[i] += (this.velocityY[i] * delta);
            if ((this.posX[i] <= Dot.Radius) || (this.posX[i] >= (width))) {
                if (this.posY[i] >= height - 2) {
                    this.posX[i] = -1;
                    if (i === this.tailPointer) {
                        this.tailPointer--;
                    }
                    continue;
                }
                else {
                    if (this.posX[i] <= Dot.Radius) {
                        this.posX[i] = Dot.Radius;
                    }
                    if (this.posX[i] >= (width)) {
                        this.posX[i] = width;
                    }
                    this.velocityX[i] *= -Dot.Restitution;
                }
            }
            if (this.posY[i] >= height) {
                this.posY[i] = height;
                this.velocityY[i] *= -Dot.Restitution;
            }
            if (this.posY[i] <= Dot.Radius) {
                this.posY[i] = Dot.Radius;
                this.velocityY[i] *= -Dot.Restitution;
            }
            this.renderFreeDot(i);
        }
    }
    testForCollisions(delta) {
        for (i = 0; i < this.tailPointer + 2; i++) {
            if (this.posX[i] === -1) {
                continue;
            }
            for (j = 0; j < this.tailPointer + 2; j++) {
                if (i === j) {
                    continue;
                }
                if (this.posX[j] === -1) {
                    continue;
                }
                distanceX = Math.abs(this.posX[i] - this.posX[j]);
                distanceY = Math.abs(this.posY[i] - this.posY[j]);
                thisDistanceSquared = distanceX ** 2 + distanceY ** 2;
                if (thisDistanceSquared < Dot.Radius_Sqrd) {
                    if (this.newDistanceSquared(delta, i, j) > thisDistanceSquared) {
                        continue;
                    }
                    this.collideDots(i, j, distanceX, distanceY);
                }
            }
        }
    }
    collideDots(dotA, dotB, distanceX, distanceY) {
        thisDistanceSquared = distanceX ** 2 + distanceY ** 2;
        velocityDiffX = this.velocityX[dotA] - this.velocityX[dotB];
        velocityDiffY = this.velocityY[dotA] - this.velocityY[dotB];
        actualDistance = Math.sqrt(thisDistanceSquared);
        ratioX = distanceX / actualDistance;
        ratioY = distanceY / actualDistance;
        impactSpeed = (velocityDiffX * ratioX) + (velocityDiffY * ratioY);
        this.velocityX[dotA] -= ratioX * impactSpeed;
        this.velocityY[dotA] -= ratioY * impactSpeed;
        this.velocityX[dotB] += ratioX * impactSpeed;
        this.velocityY[dotB] += ratioY * impactSpeed;
    }
    newDistanceSquared(delta, a, b) {
        newDotAx = this.posX[a] + (this.velocityX[a] * delta);
        newDotAy = this.posY[a] + (this.velocityY[a] * delta);
        newDotBx = this.posX[b] + (this.velocityX[b] * delta);
        newDotBy = this.posY[b] + (this.velocityY[b] * delta);
        return (Math.abs(newDotAx - newDotBx) ** 2) + (Math.abs(newDotAy - newDotBy) ** 2);
    }
    activate(x, y) {
        for (idx = 0; idx < this.tailPointer + 2; idx++) {
            if (this.posX[idx] === -1) {
                this.posX[idx] = x;
                this.posY[idx] = y;
                this.lastX[idx] = x;
                this.lastY[idx] = y;
                this.velocityX[idx] = this.randomVelocity();
                this.velocityY[idx] = this.randomVelocity();
                if (idx > this.tailPointer)
                    this.tailPointer = idx;
                break;
            }
        }
    }
    renderFreeDot(i) {
        canvasCTX.beginPath();
        canvasCTX.fillStyle = Dot.Color;
        canvasCTX.strokeStyle = Dot.Color;
        canvasCTX.lineWidth = Dot.Radius;
        canvasCTX.moveTo(this.lastX[i] - Dot.Radius, this.lastY[i] - Dot.Radius);
        canvasCTX.lineTo(this.posX[i] - Dot.Radius, this.posY[i] - Dot.Radius);
        canvasCTX.stroke();
        canvasCTX.closePath();
        canvasCTX.fill();
        this.lastX[i] = this.posX[i];
        this.lastY[i] = this.posY[i];
    }
}
DotPool.POOL_SIZE = 500;
DotPool.Color = Dot.Color;
