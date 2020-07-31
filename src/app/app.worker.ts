/// <reference lib="webworker" />

import {Pixel} from './pixel';


addEventListener('message', ({ data }) => {
  let pixel = data as Pixel;
  let pixelClass:Pixel = new Pixel([1,1],[1,1])
  pixelClass.background.order = pixel.background.order;
  pixelClass.background.ignoreBands = pixel.background.ignoreBands;
  pixelClass.background.type = pixel.background.type;
  pixelClass.background.makeFit(pixel.spectrum, pixel.bands);
  pixel.background = pixelClass.background;
  pixel.background.run = true;
  postMessage(pixel);
});
