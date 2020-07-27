import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';
import {Injectable} from '@angular/core';
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
}

Injectable({providedIn: 'root'})
export class Background implements Background {
  constructor() {}
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
        bands.forEach(band=>{
            
        })
    }
  }
}