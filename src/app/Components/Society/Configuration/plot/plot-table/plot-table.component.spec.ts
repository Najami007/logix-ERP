import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotTableComponent } from './plot-table.component';

describe('PlotTableComponent', () => {
  let component: PlotTableComponent;
  let fixture: ComponentFixture<PlotTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotTableComponent]
    });
    fixture = TestBed.createComponent(PlotTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
