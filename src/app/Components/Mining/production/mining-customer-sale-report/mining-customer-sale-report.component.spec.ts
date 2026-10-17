import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningCustomerSaleReportComponent } from './mining-customer-sale-report.component';

describe('MiningCustomerSaleReportComponent', () => {
  let component: MiningCustomerSaleReportComponent;
  let fixture: ComponentFixture<MiningCustomerSaleReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MiningCustomerSaleReportComponent]
    });
    fixture = TestBed.createComponent(MiningCustomerSaleReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
