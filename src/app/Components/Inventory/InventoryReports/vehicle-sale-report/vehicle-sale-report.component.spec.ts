import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSaleReportComponent } from './vehicle-sale-report.component';

describe('VehicleSaleReportComponent', () => {
  let component: VehicleSaleReportComponent;
  let fixture: ComponentFixture<VehicleSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleSaleReportComponent]
    });
    fixture = TestBed.createComponent(VehicleSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
