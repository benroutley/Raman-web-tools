import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js-dist';

import {DisplayMap} from '../display-map';
import {MapClickData} from '../map-click-data';

@Component({
  selector: 'app-plot-map',
  templateUrl: './plot-map.component.html',
  styleUrls: ['./plot-map.component.scss']
})
export class PlotMapComponent implements AfterViewInit, OnChanges {
  @Input() changed: Boolean;
  @Input() displayMap: DisplayMap;
  @Input() index: number;
  @Output() clicked = new EventEmitter<MapClickData>();
  @ViewChild('plot') plotRef: ElementRef;
  constructor() {}
  plot: any = null;
  newWidth: number = 0;
  init: boolean = false;

  ngOnChanges(changes: SimpleChanges) {
    if (this.newWidth != 0) {
      this.reDraw();
    } else if (this.init) {
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
  }

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
    this.init = true;
    this.bindClickListener();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newWidth = event.target.innerWidth;
    this.reDraw();
  }

  reDraw() {
    if (this.newWidth > 900) {
      let width = (this.newWidth - 400) / 2;
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
      let width = (this.newWidth - 400);
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

  bindClickListener() {
    this.plotRef.nativeElement.on('plotly_click', data => {
      let clickData: MapClickData = {
        mapIndex: this.index,
        x: data.points[0].x,
        y: data.points[0].y
      };
      this.clicked.emit(clickData);
    })
  }
}
