import {NumberSymbol} from '@angular/common';
import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

import {MapClickData} from '../map-click-data';
import {MapData} from '../map-data';
import {Pixel} from '../pixel';

@Component({
  selector: 'app-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  threadsAvailable: number;
  completion: number;
  totalPixel: number;
  status: string;
  workers: Worker[];
  running: boolean;
  buttonText: string;

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    this.threadsAvailable = navigator.hardwareConcurrency || 4;
    this.completion = 0;
    this.totalPixel = 1;
    this.status = '';
    this.workers = [];
    this.running = false;
    this.buttonText = 'Fit All';
  }
  @Input() mapData: MapData;
  @Input() mapClickData: MapClickData;
  @Output() upDatePlot = new EventEmitter<boolean>();

  ngOnInit(): void {}

  fitWorker() {
    if (this.workers.length != 0) {
      this.cancelAllWorkers();
    }
    if (this.mapClickData != undefined) {
      let y = this.mapClickData.y;
      let x = this.mapClickData.x;
      let pixel = this.mapData.pixels[y][x];
      let worker = new Worker('../app.worker', {type: 'module'})
      worker.onmessage = ({data}) => {
        let returnPixel = data as Pixel;
        this.mapData.pixels[y][x].background = returnPixel.background;
        this.mapData.pixels[y][x].spectrum.backgroundRemoved =
            returnPixel.spectrum.backgroundRemoved;
        this.upDatePlot.emit(true);
        worker.terminate();
      };
      worker.postMessage(pixel);
    }
  }

  cancelAllWorkers() {
    this.workers.forEach(worker => {
      worker.terminate();
    });
    this.workers = [];
    this.status = '';
    this.running = false;
    this.buttonText = 'Fit All'
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
    if (this.workers.length != 0) {
      this.cancelAllWorkers();
    } else {
      this.buttonText = 'Stop';
      this.running = true;
      let totalPixels = this.mapData.width * this.mapData.height;
      this.totalPixel = totalPixels;
      this.completion = 0;
      let pixelPerThread = Math.floor(totalPixels / this.threadsAvailable);
      let lastLength =
          totalPixels - (pixelPerThread) * (this.threadsAvailable - 1)


      for (let index = 0; index < this.threadsAvailable; index++) {
        if (index < this.threadsAvailable - 1) {
          this.fitSingleWorker(pixelPerThread, index * pixelPerThread);
        } else {
          this.fitSingleWorker(lastLength, index * pixelPerThread);
        }
      }
    }
  }

  fitSingleWorker(totalPixels: number, offset: number) {
    if (true) {
      var worker = new Worker('../app.worker', {type: 'module'});
      this.workers.push(worker);
      var index = offset;
      var y = Math.floor(index / this.mapData.width);
      var x = index - y * this.mapData.width;
      var pixel = this.mapData.pixels[y][x];

      worker.onmessage = ({data}) => {
        let returnPixel = data as Pixel;
        this.mapData.pixels[y][x].background = returnPixel.background;
        this.mapData.pixels[y][x].spectrum.backgroundRemoved =
            returnPixel.spectrum.backgroundRemoved;
        this.completion = this.completion + 1;

        this.status =
            Math.round((this.completion / this.totalPixel) * 100) + '%';
        if ((this.completion / this.totalPixel) > 0.999999) {
          this.status = '';
          this.running = false;
          this.buttonText = 'Fit All'
        }
        this.changeDetectorRef.detectChanges();

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
