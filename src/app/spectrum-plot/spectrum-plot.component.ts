import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js-dist';

import {SpectrumTrace} from '../spectrum';

@Component({
  selector: 'app-spectrum-plot',
  templateUrl: './spectrum-plot.component.html',
  styleUrls: ['./spectrum-plot.component.scss']
})
export class SpectrumPlotComponent implements AfterViewInit, OnChanges {
  @Input() spectrumTraces: SpectrumTrace[];
  @Input() update: boolean;
  @ViewChild('plot') plotRef: ElementRef;

  inti: boolean = false;
  constructor() {}


  ngOnChanges(changes: SimpleChanges): void {
    if (this.inti && this.spectrumTraces.length != 0) {
      this.upDatePlot();
    }
  }

  ngAfterViewInit(): void {
    this.inti = true;
  }
  upDatePlot() {
    var traces = [];
    this.spectrumTraces.forEach(spectrum => {
      let trace = {
        x: spectrum.spectrum.waveNumber,
        y: spectrum.spectrum.counts,
        mode: 'lines'
      };
      traces.push(trace);
    });
    let layout = {
      width: 400,
      height: 300,
      margin: {l: 0, r: 10, t: 0, b: 0},
      xaxis:{ title: 'Wavenumber', automargin: true},
      yaxis:{ title: 'Counts', automargin: true}
    };
    Plotly.newPlot(this.plotRef.nativeElement, traces, layout);
  }
}
