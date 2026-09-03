import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalInvoicesSaleComponent } from './digital-invoices-sale.component';

describe('DigitalInvoicesSaleComponent', () => {
  let component: DigitalInvoicesSaleComponent;
  let fixture: ComponentFixture<DigitalInvoicesSaleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalInvoicesSaleComponent]
    });
    fixture = TestBed.createComponent(DigitalInvoicesSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
