import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestConsumptionReportComponent } from './rest-consumption-report.component';

describe('RestConsumptionReportComponent', () => {
  let component: RestConsumptionReportComponent;
  let fixture: ComponentFixture<RestConsumptionReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RestConsumptionReportComponent]
    });
    fixture = TestBed.createComponent(RestConsumptionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
