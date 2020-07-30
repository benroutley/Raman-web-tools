import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MapClickData} from '../map-click-data';
import {MapData} from '../map-data';
import {Pixel} from '../pixel';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  constructor() {}
  @Input() mapData: MapData;
  @Input() mapClickData: MapClickData;
  @Output() upDatePlot = new EventEmitter<boolean>();

  ngOnInit(): void {}

  fitWorker() {
    if (this.mapClickData != undefined) {
      let y = this.mapClickData.y;
      let x = this.mapClickData.x;
      let pixel = this.mapData.pixels[y][x];
      let worker = new Worker('../app.worker', {type: 'module'})
      worker.onmessage = ({data}) => {
        console.log('worker done');
        this.upDatePlot.emit(true);
      };
      worker.postMessage(pixel);
    }
  }

  fit() {
    if (this.mapClickData != undefined) {
      let y = this.mapClickData.y;
      let x = this.mapClickData.x;
      let pixel = this.mapData.pixels[y][x];
      pixel.background.makeFit(pixel.spectrum, pixel.bands);
      console.log('fit done');
      this.upDatePlot.emit(true);
    }
  }
  fitAll() {
    this.mapData.pixels.forEach(row => {
      console.log('line done')
      row.forEach(pixel => {
        pixel.background.makeFit(pixel.spectrum, pixel.bands);
      });
    });
  }
}
