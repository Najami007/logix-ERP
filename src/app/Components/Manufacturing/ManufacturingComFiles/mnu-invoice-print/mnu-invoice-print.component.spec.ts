import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MnuInvoicePrintComponent } from './mnu-invoice-print.component';

describe('MnuInvoicePrintComponent', () => {
  let component: MnuInvoicePrintComponent;
  let fixture: ComponentFixture<MnuInvoicePrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MnuInvoicePrintComponent]
    });
    fixture = TestBed.createComponent(MnuInvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
