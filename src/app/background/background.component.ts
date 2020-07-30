import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MapClickData} from '../map-click-data';
import {MapData} from '../map-data';
import {Pixel} from '../pixel';
import { NumberSymbol } from '@angular/common';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  threadsAvailable: number;
  completion: number;
  totalPixel:number;
  status: number;

  constructor() {
    this.threadsAvailable = navigator.hardwareConcurrency || 4;
    this.completion = 0;
    this.totalPixel = 1;
    this.status = 0;
  }
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
        let returnPixel = data as Pixel;
        this.mapData.pixels[y][x].background = returnPixel.background;
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
    let totalPixels = this.mapData.width * this.mapData.height;
    this.totalPixel = totalPixels;
    this.completion = 0;
    let pixelPerThread = Math.floor(totalPixels / this.threadsAvailable);
    let lastLength = totalPixels - (pixelPerThread) * (this.threadsAvailable-1)
    console.log('nt' + pixelPerThread + ' last ' + lastLength)

    for (let index = 0; index < this.threadsAvailable; index++) {
      if (index < this.threadsAvailable - 1) {
        this.fitSingleWorker(pixelPerThread, index * pixelPerThread);
      } else {
        this.fitSingleWorker(lastLength, index * pixelPerThread);
      }
    }
  }

  fitSingleWorker(totalPixels: number, offset: number) {
    if (this.mapClickData != undefined) {
      var worker = new Worker('../app.worker', {type: 'module'})
      var index = offset;
      var y = Math.floor(index / this.mapData.width);
      var x = index - y * this.mapData.width;
      var pixel = this.mapData.pixels[y][x];

      worker.onmessage = ({data}) => {
        let returnPixel = data as Pixel;
        this.mapData.pixels[y][x].background = returnPixel.background;
        this.completion = this.completion + 1;
       
        this.status = (this.completion/this.totalPixel)*100
        console.log(status);
        // this.upDatePlot.emit(true);

        if (index < totalPixels + offset) {
         
          y = Math.floor(index / this.mapData.width);
          x = index - y * this.mapData.width;
         
          let pixel = this.mapData.pixels[y][x];
          index++;
          worker.postMessage(pixel);
        } else {
          worker.terminate();
        }
      };
      worker.postMessage(pixel);
    }
  }
}
