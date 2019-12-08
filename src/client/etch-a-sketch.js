import EscPosEncoder from 'esc-pos-encoder';

const SERVER_URL = "http://localhost:3000/print";

const PRINTER_INTERFACE = 0x00;
const PRINTER_ENDPOINT = 1;
const PRINTER_VENDOR_ID = 0x0416;
const PRINTER_PRODUCT_ID = 0x5011;


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
const resetButton = document.getElementById('reset-button');
const printNodeButton = document.getElementById('print-node-button');
const printUSBButton = document.getElementById('print-usb-button');


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

const printWebUSB = async () => {
  const options = {
    filters: [
      {
        vendorId: PRINTER_VENDOR_ID,
        productId: PRINTER_PRODUCT_ID
      }
    ]
  };

  try {
    const printer = await navigator.usb.requestDevice(options);

    await printer.open();
    await printer.selectConfiguration(1);
    await printer.claimInterface(PRINTER_INTERFACE);
    await printer.controlTransferOut({
      requestType: 'class',
      recipient: 'interface',
      request: 0x22,
      value: 0x01,
      index: PRINTER_INTERFACE
    });
  } catch (e) {
    console.error('Could not initialise web usb device:', e);
    return;
  }

  const imageSource = await getWebUSBImageSource();
  const posEncoder = new EscPosEncoder();
  const encodedImage = posEncoder
      .initialize()
      .image(imageSource, 320, 320, 'threshold')
      .encode();

  printer.transferOut(PRINTER_ENDPOINT, encodedImage);

};

const getWebUSBImageSource = () => {
  return new Promise(resolve => {
    sketchCanvas.toBlob(blob => {
      const blobURL = URL.createObjectURL(blob);
      const image = new Image();
      image.src = blobURL;
      image.onload = () => resolve(image);
    });
  });
};

resetCanvas();

document.addEventListener('keydown', onKeyDown);

resetButton.onclick = resetCanvas;
printNodeButton.onclick = printNode;
printUSBButton.onclick = printWebUSB;
