import {Injectable} from '@angular/core';
import {MapData} from './map-data';

export interface DisplayMap {
  data: number[][];
  band: string;
}

@Injectable({providedIn: 'root'})
export class DisplayMap implements DisplayMap {
  constructor() {
    this.data = [];
    this.band = 'none';
  }
  setBand(name: string){
    this.band = name;
  }
  makeMapFromSums(mapData: MapData) {
    this.data = [];
    let mapIndex = mapData.pixels[1][1].getBandIndex(this.band)
    for (let index = 0; index < mapData.height; index++) {
      let row = [];
      for (let index2 = 0; index2 < mapData.width; index2++) {
        let value = mapData.pixels[index][index2].bands[mapIndex].sum
        row.push(value);
      }
      this.data.push(row);
      
    }
    console.log(this.data[1][1])
  }
}
