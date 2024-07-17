//@ts-nocheck

//@ts-nocheck

//@ts-nocheck

//@ts-nocheck

//@ts-nocheck

//@ts-nocheck

// src/constants.ts
var NUMBER_SPACING = 16;
var DOT_WIDTH = 16;
var DOT_HEIGHT = 16;
var MATRIX_WIDTH = 4;
var MATRIX_HEIGHT = 7;
var PIXELS = [
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

// src/dotPool.ts
function tickDots(thisTime) {
  delta = (thisTime - lastTime) / 1000;
  lastTime = thisTime;
  updateDotPositions(delta);
  testForCollisions(delta);
}
function activateDot(x, y) {
  for (let idx = 0;idx < tailPointer + 2; idx++) {
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
var updateDotPositions = function(delta) {
  for (let i = 0;i < tailPointer + 2; i++) {
    if (posX[i] === 0) {
      continue;
    }
    velocityX[i] += CTX.GravityX * delta;
    velocityY[i] += CTX.GravityY * delta;
    posX[i] += velocityX[i] * delta;
    posY[i] += velocityY[i] * delta;
    if (posX[i] <= Radius || posX[i] >= width) {
      if (posY[i] >= height - 2) {
        posX[i] = 0;
        if (i === tailPointer) {
          tailPointer--;
        }
        continue;
      } else {
        if (posX[i] <= Radius) {
          posX[i] = Radius;
        }
        if (posX[i] >= width) {
          posX[i] = width;
        }
        velocityX[i] *= -CTX.Restitution;
      }
    }
    if (posY[i] >= height) {
      posY[i] = height;
      velocityY[i] *= -CTX.Restitution;
    }
    if (posY[i] <= Radius) {
      posY[i] = Radius;
      velocityY[i] *= -CTX.Restitution;
    }
    renderFreeDot(i);
  }
};
var testForCollisions = function(delta) {
  for (let i = 0;i < tailPointer + 2; i++) {
    if (posX[i] === 0) {
      continue;
    }
    for (let j = 0;j < tailPointer + 2; j++) {
      if (i === j) {
        continue;
      }
      if (posX[j] === 0) {
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
};
var collideDots = function(dotA, dotB, distanceX, distanceY) {
  thisDistanceSquared = distanceX ** 2 + distanceY ** 2;
  velocityDiffX = velocityX[dotA] - velocityX[dotB];
  velocityDiffY = velocityY[dotA] - velocityY[dotB];
  actualDistance = Math.sqrt(thisDistanceSquared);
  ratioX = distanceX / actualDistance;
  ratioY = distanceY / actualDistance;
  impactSpeed = velocityDiffX * ratioX + velocityDiffY * ratioY;
  velocityX[dotA] -= ratioX * impactSpeed;
  velocityY[dotA] -= ratioY * impactSpeed;
  velocityX[dotB] += ratioX * impactSpeed;
  velocityY[dotB] += ratioY * impactSpeed;
};
var newDistanceSquared = function(delta, a, b) {
  newDotAx = posX[a] + velocityX[a] * delta;
  newDotAy = posY[a] + velocityY[a] * delta;
  newDotBx = posX[b] + velocityX[b] * delta;
  newDotBy = posY[b] + velocityY[b] * delta;
  return Math.abs(newDotAx - newDotBx) ** 2 + Math.abs(newDotAy - newDotBy) ** 2;
};
var renderFreeDot = function(i) {
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
var randomVelocity = function() {
  return (Math.random() - 0.4) * CTX.MaxVelocity;
};
var CTX = {
  GravityX: 0,
  GravityY: 750,
  Restitution: 0.5,
  MaxVelocity: 750
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
var POOL_SIZE = 1e4;
var posX = Array(POOL_SIZE);
var posY = Array(POOL_SIZE);
var lastX = Array(POOL_SIZE);
var lastY = Array(POOL_SIZE);
var velocityX = Array(POOL_SIZE);
var velocityY = Array(POOL_SIZE);
for (let i = 0;i < POOL_SIZE; i++) {
  posX[i] = 0;
  posY[i] = 0;
  lastX[i] = 0;
  lastY[i] = 0;
  velocityX[i] = 0;
  velocityY[i] = 0;
}
var tailPointer = 0;
var lastTime = Date.now();

// src/dom.ts
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
var $ = (id) => document.getElementById(id);
var canvasCTX;

// src/clockNumber.ts
function createNumber(x, y) {
  const left = x;
  const top = y;
  let currentPixelMask;
  const dotLocations = new Array(MATRIX_HEIGHT);
  for (let i = 0;i < MATRIX_HEIGHT; ++i) {
    dotLocations[i] = new Array(MATRIX_WIDTH);
  }
  for (let y2 = 0;y2 < MATRIX_HEIGHT; ++y2) {
    for (let x2 = 0;x2 < MATRIX_WIDTH; ++x2) {
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
      for (y = 0;y < MATRIX_HEIGHT; ++y) {
        for (x = 0;x < MATRIX_WIDTH; ++x) {
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
var dot = { x: 0, y: 0 };

// src/clockFace.ts
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
var tick = function(timestamp) {
  canvasCTX.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
  canvasCTX.fillRect(0, 0, width, height);
  canvasCTX.fillStyle = "black";
  renderDot(colon1X, currentY + 2 * DOT_HEIGHT);
  renderDot(colon1X, currentY + 4 * DOT_HEIGHT);
  renderDot(colon2X, currentY + 2 * DOT_HEIGHT);
  renderDot(colon2X, currentY + 4 * DOT_HEIGHT);
  updateTime(new Date);
  tickDots(timestamp);
  self.requestAnimationFrame(tick);
};
var updateTime = function(now) {
  setDigits(pad2(now.getHours()), hours);
  setDigits(pad2(now.getMinutes()), minutes);
  setDigits(pad2(now.getSeconds()), seconds);
};
var setDigits = function(digits, numbers) {
  numbers[0].drawPixels(PIXELS[parseInt(digits[0])]);
  numbers[1].drawPixels(PIXELS[parseInt(digits[1])]);
};
var createNumbers = function() {
  hSize = (DOT_WIDTH * MATRIX_WIDTH + NUMBER_SPACING) * 6 + (DOT_WIDTH + NUMBER_SPACING) * 2 - NUMBER_SPACING;
  vSize = DOT_HEIGHT * MATRIX_HEIGHT;
  currentY = (height - vSize) * 0.33;
  currentX = (width - hSize) * 0.4;
  buildNumber(hours);
  colon1X = currentX + 8;
  currentX += DOT_WIDTH + 2 * NUMBER_SPACING;
  buildNumber(minutes);
  colon2X = currentX + 8;
  currentX += DOT_WIDTH + 2 * NUMBER_SPACING;
  buildNumber(seconds);
};
var buildNumber = function(digits) {
  for (i = 0;i < 2; ++i) {
    digits[i] = createNumber(currentX, currentY);
    currentX += DOT_WIDTH * MATRIX_WIDTH + NUMBER_SPACING;
  }
};
var pad2 = function(num) {
  return num < 10 ? "0" + num.toString() : num.toString();
};
var width;
var height;
var hSize = 0;
var vSize = 0;
var i;
var currentX = 0;
var currentY = 0;
var alpha = "0.1";
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

// src/main.ts
initDOM();
buildClockFace();
