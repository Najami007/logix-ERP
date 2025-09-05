import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionAuditInvPrintComponent } from './production-audit-inv-print.component';

describe('ProductionAuditInvPrintComponent', () => {
  let component: ProductionAuditInvPrintComponent;
  let fixture: ComponentFixture<ProductionAuditInvPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductionAuditInvPrintComponent]
    });
    fixture = TestBed.createComponent(ProductionAuditInvPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
