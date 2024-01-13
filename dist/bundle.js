// deno-lint-ignore-file

// src/dotPool.ts
var GravityX = 0;
var GravityY = 1600;
var setGravityY = (value) => {
  GravityY = value * 20;
};
var Restitution = 0.8;
var setRestitution = (value) => {
  Restitution = value * 0.01;
};
var Radius = 14;
var HalfRadius = 7;
var Radius_Sqrd = 14 * 14;
var MaxVelocity = 2400;
var setMaxVelocity = (value) => {
  MaxVelocity = value * 30;
};
var Color = "#44f";
var renderDot = (x, y, color) => {
  canvasCTX.fillStyle = color || Color;
  canvasCTX.beginPath();
  canvasCTX.arc(x, y, HalfRadius, 0, 2 * Math.PI, true);
  canvasCTX.closePath();
  canvasCTX.fill();
};
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
var POOL_SIZE = 500;
var posX = [];
var posY = [];
var lastX = [];
var lastY = [];
var velocityX = [];
var velocityY = [];
var tailPointer = 0;
var lastTime = Date.now();
var randomVelocity = () => {
  return (Math.random() - 0.4) * MaxVelocity;
};
function initializeDotPool() {
  for (let i2 = 0; i2 < POOL_SIZE; i2++) {
    posX[i2] = -1;
    posY[i2] = 0;
    lastX[i2] = -1;
    lastY[i2] = 0;
    velocityX[i2] = randomVelocity();
    velocityY[i2] = randomVelocity();
  }
  lastTime = Date.now();
}
var tickDots = (thisTime) => {
  delta = (thisTime - lastTime) / 1e3;
  lastTime = thisTime;
  updateDotPositions(delta);
  testForCollisions(delta);
};
function updateDotPositions(delta2) {
  for (let i2 = 0; i2 < tailPointer + 2; i2++) {
    if (posX[i2] === -1) {
      continue;
    }
    velocityX[i2] += GravityX * delta2;
    velocityY[i2] += GravityY * delta2;
    posX[i2] += velocityX[i2] * delta2;
    posY[i2] += velocityY[i2] * delta2;
    if (posX[i2] <= Radius || posX[i2] >= width) {
      if (posY[i2] >= height - 2) {
        posX[i2] = -1;
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
        velocityX[i2] *= -Restitution;
      }
    }
    if (posY[i2] >= height) {
      posY[i2] = height;
      velocityY[i2] *= -Restitution;
    }
    if (posY[i2] <= Radius) {
      posY[i2] = Radius;
      velocityY[i2] *= -Restitution;
    }
    renderFreeDot(i2);
  }
}
function testForCollisions(delta2) {
  for (let i2 = 0; i2 < tailPointer + 2; i2++) {
    if (posX[i2] === -1) {
      continue;
    }
    for (let j = 0; j < tailPointer + 2; j++) {
      if (i2 === j) {
        continue;
      }
      if (posX[j] === -1) {
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
function activateDot(x, y) {
  for (let idx = 0; idx < tailPointer + 2; idx++) {
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
var renderFreeDot = (i2) => {
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
};

// src/clockNumber.ts
var MatrixWidth = 4;
var MatrixHeight = 7;
var dot = { x: 0, y: 0 };
function createNumber(x, y) {
  const left = x;
  const top = y;
  let currentPixelMask;
  let dotLocations;
  dotLocations = new Array(MatrixHeight);
  for (let i2 = 0; i2 < MatrixHeight; ++i2) {
    dotLocations[i2] = new Array(MatrixWidth);
  }
  for (let y2 = 0; y2 < MatrixHeight; ++y2) {
    for (let x2 = 0; x2 < MatrixWidth; ++x2) {
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
      for (y = 0; y < MatrixHeight; ++y) {
        for (x = 0; x < MatrixWidth; ++x) {
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
  ]
];

// src/dom.ts
var $ = (id) => document.getElementById(id);
var init = () => {
  const gravitySlider = $("gravity");
  const gravityValue = $("gravity-value");
  const bounceSlider = $("bounce");
  const bounceValue = $("bounce-value");
  const velocitySlider = document.getElementById("velocity");
  const velocityValue = $("velocity-value");
  const trailsSlider = document.getElementById("trails-slider");
  const trailsValue = $("trails-value");
  setGravityY(parseInt(gravitySlider.value));
  setRestitution(parseInt(bounceSlider.value));
  setMaxVelocity(parseInt(velocitySlider.value));
  setTrails(parseInt(trailsSlider.value));
  gravitySlider.oninput = () => {
    gravityValue.innerHTML = `    Gravity: ${gravitySlider.value}%`;
    setGravityY(parseInt(gravitySlider.value));
  };
  bounceSlider.oninput = () => {
    bounceValue.innerHTML = `    COR Restitution:   ${bounceSlider.value}%`;
    setRestitution(parseInt(bounceSlider.value));
  };
  velocitySlider.oninput = () => {
    velocityValue.innerHTML = `    Velocity:  ${velocitySlider.value}%`;
    setMaxVelocity(parseInt(velocitySlider.value));
  };
  trailsSlider.oninput = () => {
    trailsValue.innerHTML = `    Partical-Trails:  ${trailsSlider.value}%`;
    setTrails(parseInt(trailsSlider.value));
  };
};
function toLog(position) {
  const minp = 0;
  const maxp = 100;
  const minv = Math.log(0.5);
  const maxv = Math.log(0.025);
  const scale = (maxv - minv) / (maxp - minp);
  return Math.exp(minv + scale * (position - minp));
}

// src/clockFace.ts
var width;
var height;
var NUMBER_SPACING = 16;
var DOT_WIDTH = 16;
var DOT_HEIGHT = 16;
var canvas;
var canvasCTX;
var hSize = 0;
var vSize = 0;
var i;
var animatedDots;
var currentX = 0;
var currentY = 0;
var _trails = "0.07";
var setTrails = (value) => {
  _trails = toLog(value).toFixed(2);
};
var hours;
var minutes;
var seconds;
var colon1X = 0;
var colon2X = 0;
var buildClockFace = () => {
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
var initCanvas = () => {
  canvas = document.getElementById("canvas-content");
  canvasCTX = canvas.getContext("2d");
  width = canvas.clientWidth;
  height = canvas.clientHeight;
  canvas.width = width;
  canvas.height = height;
};
var tick = (timestamp) => {
  canvasCTX.fillStyle = "rgba(0, 0, 0, " + _trails + ")";
  canvasCTX.fillRect(0, 0, width, height);
  canvasCTX.fillStyle = "black";
  renderDot(colon1X, currentY + 2 * DOT_HEIGHT);
  renderDot(colon1X, currentY + 4 * DOT_HEIGHT);
  renderDot(colon2X, currentY + 2 * DOT_HEIGHT);
  renderDot(colon2X, currentY + 4 * DOT_HEIGHT);
  updateTime(/* @__PURE__ */ new Date());
  tickDots(timestamp);
  window.requestAnimationFrame(tick);
};
var updateTime = (now) => {
  setDigits(pad2(now.getHours()), hours);
  setDigits(pad2(now.getMinutes()), minutes);
  setDigits(pad2(now.getSeconds()), seconds);
};
var setDigits = (digits, numbers) => {
  numbers[0].drawPixels(PIXELS[parseInt(digits[0])]);
  numbers[1].drawPixels(PIXELS[parseInt(digits[1])]);
};
var createNumbers = () => {
  hSize = (DOT_WIDTH * MatrixWidth + NUMBER_SPACING) * 6 + (DOT_WIDTH + NUMBER_SPACING) * 2 - NUMBER_SPACING;
  vSize = DOT_HEIGHT * MatrixHeight;
  currentY = (height - vSize) * 0.33;
  currentX = (width - hSize) * 0.2;
  buildNumber(hours);
  colon1X = currentX + 8;
  currentX += DOT_WIDTH + 2 * NUMBER_SPACING;
  buildNumber(minutes);
  colon2X = currentX + 8;
  currentX += DOT_WIDTH + 2 * NUMBER_SPACING;
  buildNumber(seconds);
};
var buildNumber = (digits) => {
  for (i = 0; i < 2; ++i) {
    digits[i] = createNumber(currentX, currentY);
    currentX += DOT_WIDTH * MatrixWidth + NUMBER_SPACING;
  }
};
var pad2 = (num) => {
  return num < 10 ? "0" + num.toString() : num.toString();
};

// src/main.ts
init();
buildClockFace();
