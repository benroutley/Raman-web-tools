import {Injectable} from '@angular/core';

import {Background} from './background';
import {Band} from './band';
import {Spectrum} from './spectrum';

export interface Pixel {
  background: Background;
  spectrum: Spectrum;
  bands: Band[];
}


Injectable({providedIn: 'root'})
export class Pixel implements Pixel {
  constructor(counts: number[], waveNumber: number[]) {
    this.bands = [];
    this.background = new Background();
    this.spectrum = new Spectrum(counts, waveNumber);
    let fullBand = new Band(
        waveNumber[0], waveNumber[waveNumber.length - 1], waveNumber[0],
        'Full');
    this.bands.push(fullBand);
    this.bands[0].calculateSum(this.spectrum);
  }
  getBandIndex(name: string): number {
    let index = 0;
    let count = 0;
    this.bands.forEach(band => {
      if (band.label === name) {
        index = count;
      }
      count++;
    });
    return index;
  }
  addBand() {
    let fullBand = new Band(
        this.spectrum.waveNumber[0],
        this.spectrum.waveNumber[this.spectrum.waveNumber.length - 1],
        this.spectrum.waveNumber[0], 'Full');
    this.bands.push(fullBand);
    this.bands[this.bands.length -1].calculateSum(this.spectrum);
  }
  deleteBand(index: number){
    this.bands.splice(index,1);
  }
}
