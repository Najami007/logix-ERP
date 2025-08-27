import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeReportInvoicewiseComponent } from './barcode-report-invoicewise.component';

describe('BarcodeReportInvoicewiseComponent', () => {
  let component: BarcodeReportInvoicewiseComponent;
  let fixture: ComponentFixture<BarcodeReportInvoicewiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarcodeReportInvoicewiseComponent]
    });
    fixture = TestBed.createComponent(BarcodeReportInvoicewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
