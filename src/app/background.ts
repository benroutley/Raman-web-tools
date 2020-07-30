//import {Injectable} from '@angular/core';
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

//Injectable({providedIn: 'root'})
export class Background implements Background {
  constructor() {
    this.order = 12;
    this.ignoreBands = false;
    this.run = false;
  }
  makeFit(spectrum: Spectrum, bands: Band[]) {
    if (!this.ignoreBands) {
      this.fit = [];

      this.polyFit =
          new PolyFit(spectrum.waveNumberSampled, spectrum.countsSampled);
      let solver = this.polyFit.getPolynomial(this.order);
      spectrum.waveNumberSampled.forEach(wave => {
        this.fit.push(solver(wave));
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
            tempWaveNumber[index] = -1;
          }
        }
      });
      let waveNumberTrimmed = [];
      let countsTrimmed = [];
      for (let index = 0; index < tempCounts.length; index++) {
        if (tempCounts[index] != -1) {
          waveNumberTrimmed.push(tempWaveNumber[index]);
          countsTrimmed.push(tempCounts[index]);
        }
      }

      this.fit = [];
      this.polyFit = new PolyFit(tempWaveNumber, tempCounts);
      let solver = this.polyFit.getPolynomial(this.order);
      spectrum.waveNumberSampled.forEach(wave => {
        this.fit.push(solver(wave));
      });
      let terms = this.polyFit.computeCoefficients(this.order);
      this.error = this.polyFit.standardError(terms);
    }
  }
}