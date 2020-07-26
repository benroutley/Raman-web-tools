import {Component, ElementRef, ViewChild} from '@angular/core';
import {NgxCsvParser} from 'ngx-csv-parser';
import {PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective} from 'ngx-perfect-scrollbar';
import * as Ploty from 'plotly.js-dist';

import {BandUpdate} from './band-update';
import {DisplayMap} from './display-map'
import {MapClickData} from './map-click-data';
import {MapData} from './map-data';
import {SpectrumTrace} from './spectrum';
import {ChangeBand} from './change-band';

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
    };
    this.spectrumTraces.push(trace);
    this.redrawPlots();
  }

 
  upDateBand(update: BandUpdate) {
    console.log(update.start);
    this.mapData.upDateBand(update.index, {
      start: update.start,
      center: update.center,
      end: update.end,
      name: update.name
    });
    console.log('start ' + this.mapData.pixels[1][1].bands[0].start);
    this.updateDisplayMaps(update.name);
  }
  redrawAllMaps() {
    this.reDrawMaps = !this.reDrawMaps;
  }
  redrawPlots() {
    this.reDrawPlot = !this.reDrawPlot;
  }
  deleteBand(index: number){
    this.mapData.deleteBand(index);
    this.redrawAllMaps();
  }
  deleteMap(index: number){
    this.displayMaps.splice(index,1);
    this.redrawAllMaps();
  }

  changeSelectedBand(selection: ChangeBand){
    this.displayMaps[selection.index].setBand(selection.band);
    this.updateDisplayMaps(selection.band);
  }  
  addBand(){
    this.mapData.addBand();
    this.redrawAllMaps();
  }
  updateDisplayMaps(band: string) {
    this.displayMaps.forEach(map => {
      let bandExists = false;
      this.mapData.pixels[1][1].bands.forEach(band2=>{
        if (map.band === band2.label){
          bandExists = true;
        }
      });
      if (!bandExists){
        map.band = this.mapData.pixels[1][1].bands[0].label;
      }
      if (map.band === band) {
        map.makeMapFromSums(this.mapData);
      }

    });
    this.redrawAllMaps();
  }
}



function loadMapDataMeta(data: string) {}