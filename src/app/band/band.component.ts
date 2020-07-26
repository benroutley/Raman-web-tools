import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {BandUpdate} from '../band-update';
@Component({
  selector: 'app-band',
  templateUrl: './band.component.html',
  styleUrls: ['./band.component.scss']
})
export class BandComponent implements OnInit {
  @Input() bandInfo: BandUpdate;
  @Input() index: number;
  @Output() bandUpdate = new EventEmitter<BandUpdate>();
  @Output() deleteBend = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {

  }
  sendUpDate(){
    this.bandUpdate.emit(this.bandInfo);
  }
  delete(){
    this.deleteBend.emit(this.index);
  }

}
