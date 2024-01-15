// deno-lint-ignore-file

// src/constants.ts
var NUMBER_SPACING = 16;
var DOT_WIDTH = 16;
var DOT_HEIGHT = 16;
var MATRIX_WIDTH = 4;
var MATRIX_HEIGHT = 7;
var PIXELS = [
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
  ],
  // 'ten - space'
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ]
];

// src/dotPool.ts
var CTX = {
  /** 
   * A false gravitational pull in the X direction    
   * (positive = right and negative = left)   
   * default = 0
   */
  GravityX: 0,
  /** 
   * A gravitational pull in the positive Y direction(down to floor)     
   * Have some fun! ... try a negative value
   * default = 1600
   */
  GravityY: 2500,
  /**
   * The coefficient of restitution (COR) is the ratio     
   * of the final to initial relative velocity between     
   * two objects after they collide.    
   * 
   * This represents the amount of 'bounce' a dot will exibit.    
   * 1.0 = full rebound, and 0.5 will rebound only    
   * half as high as the distance fallen.    
   * default = 0.8
   */
  Restitution: 0.5,
  /** 
   * The Maximum Velocity that a dot may take when it recieves a random velocity.     
   * default = 2400
   */
  MaxVelocity: 2500
};
var Radius = 14;
var HalfRadius = Radius * 0.5;
var Radius_Sqrd = Radius * Radius;
var Color = "#44f";
var distanceX = 0;
var distanceY = 0;
var delta = 0;
var thisDistanceSquared = 0;
var velocityDiffX = 0;
var velocityDiffY = 0;
var actualDistance = 0;
var ratioX = 0;
var ratioY = 0;
var impactSpeed = 0;
var newDotAx = 0;
var newDotAy = 0;
var newDotBx = 0;
var newDotBy = 0;
var POOL_SIZE = 1e3;
var posX = Array.from({ length: POOL_SIZE }, () => 0);
var posY = Array.from({ length: POOL_SIZE }, () => 0);
var lastX = Array.from({ length: POOL_SIZE }, () => 0);
var lastY = Array.from({ length: POOL_SIZE }, () => 0);
var velocityX = Array.from({ length: POOL_SIZE }, () => randomVelocity());
var velocityY = Array.from({ length: POOL_SIZE }, () => randomVelocity());
var tailPointer = 0;
var lastTime = Date.now();
function tickDots(thisTime) {
  delta = (thisTime - lastTime) / 1e3;
  lastTime = thisTime;
  updateDotPositions(delta);
  testForCollisions(delta);
}
function activateDot(x, y) {
  for (let idx = 0; idx < tailPointer + 2; idx++) {
    if (posX[idx] === 0) {
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
function renderDot(x, y, color) {
  canvasCTX.fillStyle = color || Color;
  canvasCTX.beginPath();
  canvasCTX.arc(x, y, HalfRadius, 0, 2 * Math.PI, true);
  canvasCTX.closePath();
  canvasCTX.fill();
}
function updateDotPositions(delta2) {
  for (let i2 = 0; i2 < tailPointer + 2; i2++) {
    if (posX[i2] === 0) {
      continue;
    }
    velocityX[i2] += CTX.GravityX * delta2;
    velocityY[i2] += CTX.GravityY * delta2;
    posX[i2] += velocityX[i2] * delta2;
    posY[i2] += velocityY[i2] * delta2;
    if (posX[i2] <= Radius || posX[i2] >= width) {
      if (posY[i2] >= height - 2) {
        posX[i2] = 0;
        if (i2 === tailPointer) {
          tailPointer--;
        }
        continue;
      } else {
        if (posX[i2] <= Radius) {
          posX[i2] = Radius;
        }
        if (posX[i2] >= width) {
          posX[i2] = width;
        }
        velocityX[i2] *= -CTX.Restitution;
      }
    }
    if (posY[i2] >= height) {
      posY[i2] = height;
      velocityY[i2] *= -CTX.Restitution;
    }
    if (posY[i2] <= Radius) {
      posY[i2] = Radius;
      velocityY[i2] *= -CTX.Restitution;
    }
    renderFreeDot(i2);
  }
}
function testForCollisions(delta2) {
  for (let i2 = 0; i2 < tailPointer + 2; i2++) {
    if (posX[i2] === 0) {
      continue;
    }
    for (let j = 0; j < tailPointer + 2; j++) {
      if (i2 === j) {
        continue;
      }
      if (posX[j] === 0) {
        continue;
      }
      distanceX = Math.abs(posX[i2] - posX[j]);
      distanceY = Math.abs(posY[i2] - posY[j]);
      thisDistanceSquared = distanceX ** 2 + distanceY ** 2;
      if (thisDistanceSquared < Radius_Sqrd) {
        if (newDistanceSquared(delta2, i2, j) > thisDistanceSquared) {
          continue;
        }
        collideDots(i2, j, distanceX, distanceY);
      }
    }
  }
}
function collideDots(dotA, dotB, distanceX2, distanceY2) {
  thisDistanceSquared = distanceX2 ** 2 + distanceY2 ** 2;
  velocityDiffX = velocityX[dotA] - velocityX[dotB];
  velocityDiffY = velocityY[dotA] - velocityY[dotB];
  actualDistance = Math.sqrt(thisDistanceSquared);
  ratioX = distanceX2 / actualDistance;
  ratioY = distanceY2 / actualDistance;
  impactSpeed = velocityDiffX * ratioX + velocityDiffY * ratioY;
  velocityX[dotA] -= ratioX * impactSpeed;
  velocityY[dotA] -= ratioY * impactSpeed;
  velocityX[dotB] += ratioX * impactSpeed;
  velocityY[dotB] += ratioY * impactSpeed;
}
function newDistanceSquared(delta2, a, b) {
  newDotAx = posX[a] + velocityX[a] * delta2;
  newDotAy = posY[a] + velocityY[a] * delta2;
  newDotBx = posX[b] + velocityX[b] * delta2;
  newDotBy = posY[b] + velocityY[b] * delta2;
  return Math.abs(newDotAx - newDotBx) ** 2 + Math.abs(newDotAy - newDotBy) ** 2;
}
function renderFreeDot(i2) {
  canvasCTX.beginPath();
  canvasCTX.fillStyle = Color;
  canvasCTX.strokeStyle = Color;
  canvasCTX.lineWidth = Radius;
  canvasCTX.moveTo(lastX[i2] - Radius, lastY[i2] - Radius);
  canvasCTX.lineTo(posX[i2] - Radius, posY[i2] - Radius);
  canvasCTX.stroke();
  canvasCTX.closePath();
  canvasCTX.fill();
  lastX[i2] = posX[i2];
  lastY[i2] = posY[i2];
}
function randomVelocity() {
  return (Math.random() - 0.4) * CTX.MaxVelocity;
}

// src/dom.ts
var $ = (id) => document.getElementById(id);
var canvasCTX;
function initCanvas() {
  const canvas = $("canvas-content");
  canvasCTX = canvas.getContext("2d");
  const width2 = canvas.clientWidth;
  const height2 = canvas.clientHeight;
  canvas.width = width2;
  canvas.height = height2;
}
function initDOM() {
  const gravitySlider = $("gravity");
  const gravityValue = $("gravity-value");
  const bounceSlider = $("bounce");
  const bounceValue = $("bounce-value");
  const velocitySlider = $("velocity");
  const velocityValue = $("velocity-value");
  const trailsSlider = $("trails-slider");
  const trailsValue = $("trails-value");
  gravitySlider.oninput = () => {
    gravityValue.innerHTML = `    Gravity: ${gravitySlider.value}%`;
    CTX.GravityY = parseInt(gravitySlider.value) * 50 | 0;
  };
  bounceSlider.oninput = () => {
    bounceValue.innerHTML = `    COR Restitution:   ${bounceSlider.value}%`;
    CTX.Restitution = parseInt(bounceSlider.value) * 0.01;
  };
  velocitySlider.oninput = () => {
    velocityValue.innerHTML = `    Velocity:  ${velocitySlider.value}%`;
    CTX.MaxVelocity = parseInt(velocitySlider.value) * 50 | 0;
  };
  trailsSlider.oninput = () => {
    trailsValue.innerHTML = `    Partical-Trails:  ${trailsSlider.value}%`;
    setAlpha(parseInt(trailsSlider.value));
  };
}

// src/clockNumber.ts
var dot = { x: 0, y: 0 };
function createNumber(x, y) {
  const left = x;
  const top = y;
  let currentPixelMask;
  const dotLocations = new Array(MATRIX_HEIGHT);
  for (let i2 = 0; i2 < MATRIX_HEIGHT; ++i2) {
    dotLocations[i2] = new Array(MATRIX_WIDTH);
  }
  for (let y2 = 0; y2 < MATRIX_HEIGHT; ++y2) {
    for (let x2 = 0; x2 < MATRIX_WIDTH; ++x2) {
      const xx = left + x2 * DOT_WIDTH;
      const yy = top + y2 * DOT_HEIGHT;
      dotLocations[y2][x2] = {
        x: xx,
        y: yy
      };
    }
  }
  return {
    x: left,
    y: top,
    drawPixels: (newPixelMask) => {
      for (y = 0; y < MATRIX_HEIGHT; ++y) {
        for (x = 0; x < MATRIX_WIDTH; ++x) {
          dot = dotLocations[y][x];
          if (currentPixelMask != null) {
            if (currentPixelMask[y][x] !== 0 && newPixelMask[y][x] === 0) {
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
  };
}

// src/clockFace.ts
var width;
var height;
var hSize = 0;
var vSize = 0;
var i;
var currentX = 0;
var currentY = 0;
var alpha = "0.11";
var setAlpha = (position) => {
  const minVal = Math.log(0.5);
  const maxVal = Math.log(0.025);
  const scale = (maxVal - minVal) / 100;
  alpha = Math.exp(minVal + scale * position).toFixed(2);
};
var hours;
var minutes;
var seconds;
var colon1X = 0;
var colon2X = 0;
function buildClockFace() {
  initCanvas();
  width = canvasCTX.canvas.clientWidth;
  height = canvasCTX.canvas.clientHeight;
  hours = [createNumber(0, 0), createNumber(0, 0)];
  minutes = [createNumber(0, 0), createNumber(0, 0)];
  seconds = [createNumber(0, 0), createNumber(0, 0)];
  canvasCTX.fillStyle = "black";
  canvasCTX.fillRect(0, 0, width, height);
  canvasCTX.lineCap = "round";
  createNumbers();
  self.requestAnimationFrame(tick);
}
function tick(timestamp) {
  canvasCTX.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
  canvasCTX.fillRect(0, 0, width, height);
  canvasCTX.fillStyle = "black";
  renderDot(colon1X, currentY + 2 * DOT_HEIGHT);
  renderDot(colon1X, currentY + 4 * DOT_HEIGHT);
  renderDot(colon2X, currentY + 2 * DOT_HEIGHT);
  renderDot(colon2X, currentY + 4 * DOT_HEIGHT);
  updateTime(/* @__PURE__ */ new Date());
  tickDots(timestamp);
  self.requestAnimationFrame(tick);
}
function updateTime(now) {
  let hour = now.getHours();
  hour = hour > 12 ? hour - 12 : hour;
  setDigits(pad2(hour, true), hours);
  setDigits(pad2(now.getMinutes()), minutes);
  setDigits(pad2(now.getSeconds()), seconds);
}
function setDigits(digits, numbers) {
  const firstNum = digits[0] === " " ? 10 : 0;
  numbers[0].drawPixels(PIXELS[firstNum]);
  numbers[1].drawPixels(PIXELS[parseInt(digits[1])]);
}
function createNumbers() {
  hSize = (DOT_WIDTH * MATRIX_WIDTH + NUMBER_SPACING) * 6 + (DOT_WIDTH + NUMBER_SPACING) * 2 - NUMBER_SPACING;
  vSize = DOT_HEIGHT * MATRIX_HEIGHT;
  currentY = (height - vSize) * 0.33;
  currentX = (width - hSize) * 0.2;
  buildNumber(hours);
  colon1X = currentX + 8;
  currentX += DOT_WIDTH + 2 * NUMBER_SPACING;
  buildNumber(minutes);
  colon2X = currentX + 8;
  currentX += DOT_WIDTH + 2 * NUMBER_SPACING;
  buildNumber(seconds);
}
function buildNumber(digits) {
  for (i = 0; i < 2; ++i) {
    digits[i] = createNumber(currentX, currentY);
    currentX += DOT_WIDTH * MATRIX_WIDTH + NUMBER_SPACING;
  }
}
function pad2(num, hr = false) {
  const pad = hr ? " " : "0";
  return num < 10 ? pad + num.toString() : num.toString();
}

// src/main.ts
initDOM();
buildClockFace();
