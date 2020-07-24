import { Injectable } from '@angular/core';
import * as Spline from 'cubic-spline';

export interface Spectrum {
    counts: number[];
    spline: any;
}

@Injectable({ providedIn: 'root' })
export class Spectrum implements Spectrum {
    constructor(counts: number[], waveNumber: number[]){
        this.counts = counts;
        this.spline = new Spline(waveNumber, counts);
    }
}
