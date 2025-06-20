import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditInvoicePrintComponent } from './audit-invoice-print.component';

describe('AuditInvoicePrintComponent', () => {
  let component: AuditInvoicePrintComponent;
  let fixture: ComponentFixture<AuditInvoicePrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuditInvoicePrintComponent]
    });
    fixture = TestBed.createComponent(AuditInvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
