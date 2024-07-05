import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierBalanceReportComponent } from './supplier-balance-report.component';

describe('SupplierBalanceReportComponent', () => {
  let component: SupplierBalanceReportComponent;
  let fixture: ComponentFixture<SupplierBalanceReportComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierBalanceReportComponent]
    });
    fixture = TestBed.createComponent(SupplierBalanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
