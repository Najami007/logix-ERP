import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportSupplierwiseComponent } from './purchase-report-supplierwise.component';

describe('PurchaseReportSupplierwiseComponent', () => {
  let component: PurchaseReportSupplierwiseComponent;
  let fixture: ComponentFixture<PurchaseReportSupplierwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReportSupplierwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReportSupplierwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
