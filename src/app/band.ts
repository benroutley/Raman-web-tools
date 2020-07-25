import {Injectable} from '@angular/core';
import {Spectrum} from './spectrum';

export interface Band {
  start: number;
  end: number;
  center: number;
  height: number;
  sum: number;
  label: string;
}

Injectable({providedIn: 'root'})
export class Band implements Band {
  constructor(start: number, end: number, center: number, label: string) {
    this.center = center;
    this.start = start;
    this.end = end;
    this.height = 0;
    this.sum = 0;
    this.label = label;
  }
  calculateSumOld(spectrum: Spectrum) {
    let sum = 0;
    for (let index = this.start; index < this.end; index++) {
      sum += spectrum.spline.at(index);
    }
    this.sum = sum;
  }

  calculateSum(spectrum: Spectrum) {
    let sum = 0;
    let start = Math.round(this.start - spectrum.offset)
    let end = Math.round(spectrum.countsSampled.length - 1 - spectrum.offset)
    for (let index = start; index < end; index++) {
      //let spectrumIndex = index - spectrum.offset;
      //if (spectrumIndex < 0) {spectrumIndex = 0 }
      //let value = spectrum.countsSampled[spectrumIndex];
      //if(value != NaN){
        //sum += value;
      //} 
      sum += spectrum.countsSampled[index];
    }
    this.sum = sum;
  }


  calculateHeight(spectrum: Spectrum) {
    let baseSlope =
        (spectrum.spline.at(this.end) - spectrum.spline.at(this.start)) /
        (this.end - this.start);
    let centerSlopeValue =
        spectrum.spline.at(this.start) + baseSlope * (this.center - this.start);
    this.height = spectrum.spline.at(this.center) - centerSlopeValue;
  }
}
