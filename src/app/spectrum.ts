//import {Injectable} from '@angular/core';
import * as Spline from 'cubic-spline';

export interface Spectrum {
  counts: number[];
  countsSampled: number[];
  spline: any;
  offset: number;
  waveNumber: number[];
  waveNumberSampled: number[];
  backgroundRemoved: number[];
}

export interface SpectrumTrace {
    spectrum: Spectrum;
    name: string;
}

//@Injectable({providedIn: 'root'})
export class Spectrum implements Spectrum {
  constructor(counts: number[], waveNumber: number[]) {
    this.counts = counts;
    this.waveNumber = waveNumber;
    this.spline = new Spline(waveNumber, counts);
    this.offset = waveNumber[0];
    this.countsSampled = [];
    this.waveNumberSampled = [];
    for (let index = this.offset; index < waveNumber[waveNumber.length - 1];
         index++) {
      this.countsSampled.push(this.spline.at(index));
      this.waveNumberSampled.push(index);
    }
  }
}
