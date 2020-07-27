import {Component, Input, OnInit} from '@angular/core';
import * as Spline from 'cubic-spline';
import * as PolyFit from '../polyfit';
import {Spectrum} from '../spectrum';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  constructor() {}

  @Input() data: Spectrum;

  ngOnInit(): void {}

  fit() {
    let poly = new PolyFit(this.data.waveNumberSampled, this.data.countsSampled);
    let solver = poly.getPolynomial(3);
    console.log(solver(2400));
    let terms = poly.computeCoefficients(3);
    console.log(poly.standardError(terms));
  }
}
