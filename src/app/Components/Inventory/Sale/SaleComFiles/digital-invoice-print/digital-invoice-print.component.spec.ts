import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalInvoicePrintComponent } from './digital-invoice-print.component';

describe('DigitalInvoicePrintComponent', () => {
  let component: DigitalInvoicePrintComponent;
  let fixture: ComponentFixture<DigitalInvoicePrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigitalInvoicePrintComponent]
    });
    fixture = TestBed.createComponent(DigitalInvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
