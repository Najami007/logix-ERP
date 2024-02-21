import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseReportProdSupplierwiseComponent } from './purchase-report-prod-supplierwise.component';

describe('PurchaseReportProdSupplierwiseComponent', () => {
  let component: PurchaseReportProdSupplierwiseComponent;
  let fixture: ComponentFixture<PurchaseReportProdSupplierwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseReportProdSupplierwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseReportProdSupplierwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
