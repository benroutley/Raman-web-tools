import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js-dist';

import {DisplayMap} from '../display-map';

@Component({
  selector: 'app-plot-map',
  templateUrl: './plot-map.component.html',
  styleUrls: ['./plot-map.component.scss']
})
export class PlotMapComponent implements AfterViewInit {
  @Input() displayMap: DisplayMap;
  @Input() index: number;
  @ViewChild('plot') plotRef: ElementRef;
  constructor() {}
  plot: any = null;

  ngAfterViewInit(): void {
    let width = this.plotRef.nativeElement.offsetWidth;
    let plotData = [{z: this.displayMap.data, type: 'heatmap'}];
    var config = {responsive: true};
    let layout = {
      height: width,
      width: width,
      margin: {l: 40, r: 40, t: 40, b: 40},
    };
    Plotly.newPlot(this.plotRef.nativeElement, plotData, layout, config);
    this.bindClickListener();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    let newWidth = event.target.innerWidth;
    if (newWidth > 900) {
      let width = (newWidth - 400) / 2;
      let plotData = [{z: this.displayMap.data, type: 'heatmap'}];
      let layout = {
        height: width,
        width: width,
        margin: {l: 40, r: 40, t: 40, b: 40},
      };
      var config = {responsive: true};
      Plotly.newPlot(this.plotRef.nativeElement, plotData, layout, config);
      this.bindClickListener();
    } else {
      let width = (newWidth - 400);
      let plotData = [{z: this.displayMap.data, type: 'heatmap'}];
      let layout = {
        height: width,
        width: width,
        margin: {l: 40, r: 40, t: 40, b: 40},
      };
      var config = {responsive: true};
      Plotly.newPlot(this.plotRef.nativeElement, plotData, layout, config);
      this.bindClickListener();
      
    }
  }
  bindClickListener(){
    this.plotRef.nativeElement.on('plotly_click', data=>{
      console.log(this.index)
    })
  }
 
}
