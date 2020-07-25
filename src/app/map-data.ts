import {Injectable} from '@angular/core';
import {Pixel} from './pixel';

export interface MapData {
  pixels: Pixel[][];
  width: number;
  height: number;
  wavelength: number;
  spectrumWidth: number;
  waveNumber: number[];
}

@Injectable({providedIn: 'root'})
export class MapData implements MapData {
  constructor(data: [][]) {
    this.pixels = [];
    this.wavelength = 637.96;
    this.height = 89;
    this.width = 100;
    this.makeWaveNumber(data[0]);
    for (let index = 0; index < this.height; index++) {
      let row = [];
      console.log(index)
      for (let index2 = 0; index2 < this.width; index2++) {
        let newPixel =
            new Pixel(data[index2 + index * this.width], this.waveNumber);
        row.push(newPixel);
      }

      this.pixels.push(row);
    }
    console.log('1,1 Sum: ' + this.pixels[1][1].bands[0].sum)
    console.log('1,2 Sum: ' + this.pixels[1][2].bands[0].sum)
  }
  makeWaveNumber(waveLenght: number[]) {
    this.waveNumber = [];
    waveLenght.forEach(wavelength => {
      let value = ((1E9 / this.wavelength) - (1E9 / wavelength)) * 1E-2;
      this.waveNumber.push(value);
    });
  }
  upDateBand(name: string, options: {start?: number, end?: number, center?: number}) {
    let index = this.pixels[1][1].getBandIndex(name);
      this.pixels.forEach(row => {
        row.forEach(pixel => {
            if (options.start != undefined) {pixel.bands[index].start = options.start;}
            if (options.end != undefined) {pixel.bands[index].start = options.end;}
            if (options.center != undefined) {pixel.bands[index].start = options.center;}
            pixel.bands[index].calculateSum(pixel.spectrum);
        });
      });
      console.log(this.pixels[1][1].bands[0].start);
  }
}
