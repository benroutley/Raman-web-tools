import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgxCsvParser} from 'ngx-csv-parser';
import {PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective} from 'ngx-perfect-scrollbar';
import * as Ploty from 'plotly.js-dist';

import {DisplayMap} from './display-map'
import {MapClickData} from './map-click-data';
import {MapData} from './map-data';
import {SpectrumTrace} from './spectrum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'raman-app';
  fileToUpload: File = null;
  displayMaps: DisplayMap[] = [];
  mapData: MapData = null;
  reDrawMaps: boolean = false;
  reDrawPlot: boolean = false;
  spectrumTraces: SpectrumTrace[] = [];

  start: number = 1000;

  public config: PerfectScrollbarConfigInterface = {suppressScrollX: true};

  @ViewChild(PerfectScrollbarComponent)
  componentScroll: PerfectScrollbarComponent;
  @ViewChild(PerfectScrollbarDirective)
  directiveScroll: PerfectScrollbarDirective;

  constructor(private csv: NgxCsvParser) {}

  handleFileInput(files: FileList) {
    this.csv.parse(files.item(0), {delimiter: '\t'})
        .pipe()
        .subscribe((result: Array<any>) => {
          console.log(result[0]);
          this.mapData = new MapData(result);
          let displayMap = new DisplayMap();
          displayMap.setBand('Full');
          displayMap.makeMapFromSums(this.mapData);
          this.displayMaps.push(displayMap);
          console.log(this.mapData.pixels[0][0].spectrum.countsSampled)
        });
  }
  addMap(bandName: string) {
    let displayMap = new DisplayMap();
    displayMap.setBand(bandName);
    displayMap.makeMapFromSums(this.mapData);
    this.displayMaps.push(displayMap);
  }
  mapClicked(clickData: MapClickData) {
    this.spectrumTraces = [];
    let trace: SpectrumTrace = {
      name: '',
      spectrum: this.mapData.pixels[clickData.y][clickData.x].spectrum
    }
    this.spectrumTraces.push(trace);
    this.redrawPlots();
  }
  updateBandTemp(start: number) {
    this.mapData.upDateBand('Full', {start: start});
    console.log('new sum' + this.mapData.pixels[1][1].bands[0].sum);
    this.updateDisplayMaps('Full');
  }
  redrawAllMaps() {
    this.reDrawMaps = !this.reDrawMaps;
  }
  redrawPlots() {
    this.reDrawPlot = !this.reDrawPlot;
  }
  updateDisplayMaps(band: string) {
    this.displayMaps.forEach(map => {
      if (map.band === band) {
        console.log('new sum' + this.mapData.pixels[1][1].bands[0].sum)
        map.makeMapFromSums(this.mapData);
      }
    });
    this.redrawAllMaps();
  }
}



function loadMapDataMeta(data: string) {}