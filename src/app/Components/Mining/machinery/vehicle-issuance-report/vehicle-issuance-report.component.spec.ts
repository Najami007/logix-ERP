import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleIssuanceReportComponent } from './vehicle-issuance-report.component';

describe('VehicleIssuanceReportComponent', () => {
  let component: VehicleIssuanceReportComponent;
  let fixture: ComponentFixture<VehicleIssuanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehicleIssuanceReportComponent]
    });
    fixture = TestBed.createComponent(VehicleIssuanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
