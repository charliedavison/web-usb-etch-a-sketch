const escpos = require('escpos');

const usbDevice = new escpos.USB(0x0416, 0x5011);
const options = { encoding: "utf8" };
const printer = new escpos.Printer(usbDevice, options);

const print = (buffer, callback) => {
  usbDevice.open(err => {
    if (err) return err;

    escpos.Image.load(buffer.toString(), image => {
      printer.align('CT').image(image);
      printer.text('\n').cut().close();
      callback();
    });
  });
};

module.exports = print;
