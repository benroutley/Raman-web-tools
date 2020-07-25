import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpectrumPlotComponent } from './spectrum-plot.component';

describe('SpectrumPlotComponent', () => {
  let component: SpectrumPlotComponent;
  let fixture: ComponentFixture<SpectrumPlotComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpectrumPlotComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpectrumPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
