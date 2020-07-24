import {Component, ViewChild, ElementRef} from '@angular/core';
import {NgxCsvParser} from 'ngx-csv-parser';
import {MapData} from './map-data';
import {DisplayMap} from './display-map'
import * as Ploty from 'plotly.js-dist';
import {PerfectScrollbarComponent, PerfectScrollbarConfigInterface, PerfectScrollbarDirective} from 'ngx-perfect-scrollbar';


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
        });
  }
  addMap(bandName: string){
    let displayMap = new DisplayMap();
    displayMap.setBand(bandName);
    displayMap.makeMapFromSums(this.mapData);
    this.displayMaps.push(displayMap);
  }
}

function loadMapDataMeta(data: string) {}