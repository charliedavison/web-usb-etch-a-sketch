const VALID_KEYS = [
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'w',
  'a',
  's',
  'd'
];

const START_PEN_X = 150;
const START_PEN_Y = 75;

let leftKnobDeg = '0';
let rightKnobDeg = '0';

let penPositionX, penPositionY;

const sketchCanvas = document.getElementById('sketch-canvas');
const ctx = sketchCanvas.getContext('2d');

const sketchContainer = document.getElementById('sketch-container');
const leftKnob = document.getElementById('knob-left');
const rightKnob = document.getElementById('knob-right');

const moveRight = () => {
  leftKnobDeg++;
  leftKnob.style.transform = `rotate(${leftKnobDeg}deg)`;
  ctx.lineTo(penPositionX++, penPositionY);
  ctx.stroke();
};

const moveLeft = () => {
  leftKnobDeg--;
  leftKnob.style.transform = `rotate(${leftKnobDeg}deg)`;
  ctx.lineTo(penPositionX--, penPositionY);
  ctx.stroke();
};

const moveDown = () => {
  rightKnobDeg--;
  rightKnob.style.transform = `rotate(${rightKnobDeg}deg)`;
  ctx.lineTo(penPositionX, penPositionY++);
  ctx.stroke();
};

const moveUp = () => {
  rightKnobDeg++;
  rightKnob.style.transform = `rotate(${rightKnobDeg}deg)`;
  ctx.lineTo(penPositionX, penPositionY--);
  ctx.stroke();
};

const onKeyDown = (event) => {
   if (!VALID_KEYS.includes(event.key)) return;

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

resetCanvas();
document.addEventListener('keydown', onKeyDown);