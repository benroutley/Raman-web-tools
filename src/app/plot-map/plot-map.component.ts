import {AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import * as Plotly from 'plotly.js-dist';

import {DisplayMap} from '../display-map';
import {MapClickData} from '../map-click-data';
import {MapData} from '../map-data';
import {ChangeBand} from '../change-band';

@Component({
  selector: 'app-plot-map',
  templateUrl: './plot-map.component.html',
  styleUrls: ['./plot-map.component.scss']
})
export class PlotMapComponent implements AfterViewInit, OnChanges {
  @Input() changed: Boolean;
  @Input() displayMap: DisplayMap;
  @Input() index: number;
  @Input() mapData: MapData;
  @Output() clicked = new EventEmitter<MapClickData>();
  @Output() selectionChanged = new EventEmitter<ChangeBand>();
  @Output() deleteMap = new EventEmitter<number>();

  @ViewChild('plot') plotRef: ElementRef;
  constructor() {}
  plot: any = null;
  newWidth: number = 0;
  init: boolean = false;
  bands: string[] = [];
  selectedBand: string = '';

  ngOnChanges(changes: SimpleChanges) {
    this.makeBandList();
    if (this.newWidth != 0) {
      this.reDraw();
    } else if (this.init) {
      let width = this.plotRef.nativeElement.offsetWidth;
      let plotData = [{z: this.displayMap.data, type: 'heatmap'}];
      var config = {responsive: true};
      let layout = {
        height: width,
        width: width,
        title: this.displayMap.band,
        margin: {l: 40, r: 40, t: 40, b: 40},
      };
      Plotly.newPlot(this.plotRef.nativeElement, plotData, layout, config);
      this.bindClickListener();
    }
  }

  bandChanged(){
    this.selectionChanged.emit({band: this.selectedBand, index: this.index});
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
    this.makeBandList();
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.newWidth = event.target.innerWidth;
    this.reDraw();
  }

  delete(){
    this.deleteMap.emit(this.index);
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
    this.makeBandList();
  }

  bindClickListener() {
    this.plotRef.nativeElement.on('plotly_click', data => {
      let clickData: MapClickData = {
        mapIndex: this.index,
        x: data.points[0].x,
        y: data.points[0].y
      };
      this.clicked.emit(clickData);
    });
  }
  makeBandList(){
    this.selectedBand = this.displayMap.band;
    this.bands = [];
    this.mapData.pixels[1][1].bands.forEach(band=>{
      this.bands.push(band.label);
    });
  }
}
