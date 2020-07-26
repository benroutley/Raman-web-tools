import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTabsModule} from '@angular/material/tabs';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {PERFECT_SCROLLBAR_CONFIG} from 'ngx-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'ngx-perfect-scrollbar';

import {AppComponent} from './app.component';
import {BandComponent} from './band/band.component';
import {PlotMapComponent} from './plot-map/plot-map.component';
import {SpectrumPlotComponent} from './spectrum-plot/spectrum-plot.component';
import { MapToolsComponent } from './map-tools/map-tools.component';
import { BackgroundComponent } from './background/background.component';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};


@NgModule({
  declarations:
      [AppComponent, PlotMapComponent, SpectrumPlotComponent, BandComponent, MapToolsComponent, BackgroundComponent],
  imports: [
    BrowserModule, PerfectScrollbarModule, BrowserAnimationsModule,
    MatButtonModule, MatGridListModule, FormsModule, MatFormFieldModule,
    MatInputModule, MatTabsModule, MatDividerModule, MatSlideToggleModule,
    MatIconModule, MatSelectModule
  ],
  providers: [{
    provide: PERFECT_SCROLLBAR_CONFIG,
    useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
