import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialConsumptionRptComponent } from './material-consumption-rpt.component';

describe('MaterialConsumptionRptComponent', () => {
  let component: MaterialConsumptionRptComponent;
  let fixture: ComponentFixture<MaterialConsumptionRptComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialConsumptionRptComponent]
    });
    fixture = TestBed.createComponent(MaterialConsumptionRptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
