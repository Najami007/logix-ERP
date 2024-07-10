import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPlotComponent } from './map-plot.component';

describe('MapPlotComponent', () => {
  let component: MapPlotComponent;
  let fixture: ComponentFixture<MapPlotComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapPlotComponent]
    });
    fixture = TestBed.createComponent(MapPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
