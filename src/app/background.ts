// import {Injectable} from '@angular/core';
import * as Spline from 'cubic-spline';
import {Band} from './band';

import * as PolyFit from './polyfit';
import {Spectrum} from './spectrum';

export interface Background {
  type: string;
  order: number;
  error: number;
  polyFit: any;
  fit: number[];
  ignoreBands: boolean;
  run: boolean;
}

// Injectable({providedIn: 'root'})
export class Background implements Background {
  constructor() {
    this.order = 1;
    this.ignoreBands = false;
    this.type = 'poly';

    this.run = false;
  }
  makeFit(spectrum: Spectrum, bands: Band[]) {
    if (!this.ignoreBands) {
      this.fit = [];
      spectrum.backgroundRemoved = [];
      this.polyFit =
          new PolyFit(spectrum.waveNumberSampled, spectrum.countsSampled);
      let solver = this.polyFit.getPolynomial(this.order);
      spectrum.waveNumberSampled.forEach(wave => {
        this.fit.push(solver(wave));
      });
      let index3 = 0;
       this.fit.forEach(fitValue =>{
        spectrum.backgroundRemoved.push(spectrum.countsSampled[index3] - fitValue);
        index3++;
      });
      let terms = this.polyFit.computeCoefficients(this.order);
      this.error = this.polyFit.standardError(terms);
    } else {
      let tempWaveNumber = [...spectrum.waveNumberSampled];
      let tempCounts = [...spectrum.countsSampled];
      bands.forEach(band => {
        for (let index = 0; index < tempCounts.length; index++) {
          if (index > band.start - spectrum.offset &&
              index < band.end - spectrum.offset) {
            tempCounts[index] = -1;
            // tempWaveNumber[index] = -1;
          }
        }
      });
      let waveNumberTrimmed = [];
      let countsTrimmed = [];

      for (let index = 0; index < tempCounts.length; index++) {
        if (tempCounts[index] == -1) {
          let tempIndex: number = index + 1;
          let looking: boolean = true;
          let start: number = tempCounts[index - 1];
          let end: number = tempCounts[index - 1];
          while (looking) {
            if (tempCounts[tempIndex] != -1) {
              end = tempCounts[tempIndex];
              looking = false;
            } else {
              tempIndex++;
            }
          }
          let slope: number = (end - start) / (tempIndex - index);
          for (let index2 = 0; index2 < tempIndex - index; index2++) {
            waveNumberTrimmed.push(tempWaveNumber[index + index2]);
            countsTrimmed.push(start + slope * index2);
          }
          index = tempIndex + 1
        } else {
          waveNumberTrimmed.push(tempWaveNumber[index]);
          countsTrimmed.push(tempCounts[index]);
        }
      }

      this.fit = [];
      this.polyFit = new PolyFit(waveNumberTrimmed, countsTrimmed);
      let solver = this.polyFit.getPolynomial(this.order);
      spectrum.waveNumberSampled.forEach(wave => {
        this.fit.push(solver(wave));
      });
      spectrum.backgroundRemoved = [];
      let index = 0;
      this.fit.forEach(fitValue =>{
        spectrum.backgroundRemoved.push(spectrum.countsSampled[index] - fitValue);
        index++;
      });
      //this.fit = countsTrimmed;// switch this for spline
      let terms = this.polyFit.computeCoefficients(this.order);
      this.error = this.polyFit.standardError(terms);
    }
  }
}