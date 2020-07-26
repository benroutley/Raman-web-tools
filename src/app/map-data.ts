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
  addBand() {
    this.pixels.forEach(row => {row.forEach(pixel => {
                          pixel.addBand();
                        })});
  }
  deleteBand(index: number) {
    console.log(index);
    this.pixels.forEach(row => {row.forEach(pixel => {
                          pixel.deleteBand(index);
                        })});
  }
  upDateBand(
      index: number,
      options: {start: number, end: number, center: number, name: string}) {
    this.pixels.forEach(row => {
      row.forEach(pixel => {
        pixel.bands[index].start = options.start;
        pixel.bands[index].end = options.end;
        pixel.bands[index].center = options.center;
        pixel.bands[index].label = options.name;
        pixel.bands[index].calculateSum(pixel.spectrum);
      });
    });
  }
}
