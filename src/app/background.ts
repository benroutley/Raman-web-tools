import { Injectable } from "@angular/core";

export interface Background {
    type: string;
    constants: number[];
    userPoints: number[];
}

Injectable({ providedIn: 'root' })
export class Background implements Background {
    constructor(){
        this.type = 'none';
        this.constants = [];
        this.userPoints =[];
    }
}