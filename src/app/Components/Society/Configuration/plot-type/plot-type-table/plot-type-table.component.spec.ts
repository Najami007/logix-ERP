import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlotTypeTableComponent } from './plot-type-table.component';

describe('PlotTypeTableComponent', () => {
  let component: PlotTypeTableComponent;
  let fixture: ComponentFixture<PlotTypeTableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlotTypeTableComponent]
    });
    fixture = TestBed.createComponent(PlotTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
