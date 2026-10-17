import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningTransporterSaleReportComponent } from './mining-transporter-sale-report.component';

describe('MiningTransporterSaleReportComponent', () => {
  let component: MiningTransporterSaleReportComponent;
  let fixture: ComponentFixture<MiningTransporterSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningTransporterSaleReportComponent]
    });
    fixture = TestBed.createComponent(MiningTransporterSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
