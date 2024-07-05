import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBalanceReportComponent } from './customer-balance-report.component';

describe('CustomerBalanceReportComponent', () => {
  let component: CustomerBalanceReportComponent;
  let fixture: ComponentFixture<CustomerBalanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerBalanceReportComponent]
    });
    fixture = TestBed.createComponent(CustomerBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
