import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsumptionReportComponent } from './consumption-report.component';

describe('ConsumptionReportComponent', () => {
  let component: ConsumptionReportComponent;
  let fixture: ComponentFixture<ConsumptionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsumptionReportComponent]
    });
    fixture = TestBed.createComponent(ConsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
