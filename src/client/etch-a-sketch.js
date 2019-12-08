const SERVER_URL = "http://localhost:3000/print";

// Start in the middle of the canvas
const START_PEN_X = 150;
const START_PEN_Y = 75;

// The speed at which the knobs rotate
// Visually more satisfying if its a bit quicker.
const KNOB_TURN_SPEED = 10;

let leftKnobDeg = 0;
let rightKnobDeg = 0;

let penPositionX, penPositionY;

const sketchCanvas = document.getElementById('sketch-canvas');
const ctx = sketchCanvas.getContext('2d');
ctx.lineWidth = 1;

const sketchContainer = document.getElementById('sketch-container');
const leftKnob = document.getElementById('knob-left');
const rightKnob = document.getElementById('knob-right');

const moveRight = () => {
  leftKnobDeg += KNOB_TURN_SPEED;
  leftKnob.style.transform = `rotate(${leftKnobDeg}deg)`;
  ctx.lineTo(penPositionX++, penPositionY);
  ctx.stroke();
};

const moveLeft = () => {
  leftKnobDeg -= KNOB_TURN_SPEED;
  leftKnob.style.transform = `rotate(${leftKnobDeg}deg)`;
  ctx.lineTo(penPositionX--, penPositionY);
  ctx.stroke();
};

const moveDown = () => {
  rightKnobDeg -= KNOB_TURN_SPEED;
  rightKnob.style.transform = `rotate(${rightKnobDeg}deg)`;
  ctx.lineTo(penPositionX, penPositionY++);
  ctx.stroke();
};

const moveUp = () => {
  rightKnobDeg += KNOB_TURN_SPEED;
  rightKnob.style.transform = `rotate(${rightKnobDeg}deg)`;
  ctx.lineTo(penPositionX, penPositionY--);
  ctx.stroke();
};

const onKeyDown = (event) => {
   switch (event.key) {
     case 'ArrowUp':
     case 'w':
       moveUp();
       break;

     case 'ArrowDown':
     case 's':
       moveDown();
       break;

     case 'ArrowLeft':
     case 'a':
       moveLeft();
       break;

     case 'ArrowRight':
     case 'd':
       moveRight();
       break;
   }
};

const resetCanvas = () => {
  penPositionX = START_PEN_X;
  penPositionY = START_PEN_Y;

  sketchContainer.classList.add('reset-sketch');

  setTimeout(() => { sketchContainer.classList.remove('reset-sketch') }, 1000);

  ctx.clearRect(0, 0, sketchCanvas.width, sketchCanvas.height);

  ctx.beginPath();
  ctx.moveTo(penPositionX, penPositionY);
};

const printNode = () => {
  const sketchData = sketchCanvas.toDataURL('image/png');
  const req = new XMLHttpRequest();
  req.open("POST", SERVER_URL);
  req.setRequestHeader("Content-type", "image/png");
  req.onload = () => {
    if (req.readyState === 4) {
      if (req.status === 200) {
        alert('Successfully printed');
      } else {
        alert('An error occurred!');
        console.error(req.statusText);
      }
    }
  };

  req.send(sketchData);

};

resetCanvas();
document.addEventListener('keydown', onKeyDown);