import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotNatureTableComponent } from './plot-nature-table.component';

describe('PlotNatureTableComponent', () => {
  let component: PlotNatureTableComponent;
  let fixture: ComponentFixture<PlotNatureTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotNatureTableComponent]
    });
    fixture = TestBed.createComponent(PlotNatureTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
