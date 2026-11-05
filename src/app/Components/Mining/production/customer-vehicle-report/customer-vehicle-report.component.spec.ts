import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerVehicleReportComponent } from './customer-vehicle-report.component';

describe('CustomerVehicleReportComponent', () => {
  let component: CustomerVehicleReportComponent;
  let fixture: ComponentFixture<CustomerVehicleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerVehicleReportComponent]
    });
    fixture = TestBed.createComponent(CustomerVehicleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
