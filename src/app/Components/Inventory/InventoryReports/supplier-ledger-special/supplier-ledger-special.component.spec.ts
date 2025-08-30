import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierLedgerSpecialComponent } from './supplier-ledger-special.component';

describe('SupplierLedgerSpecialComponent', () => {
  let component: SupplierLedgerSpecialComponent;
  let fixture: ComponentFixture<SupplierLedgerSpecialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SupplierLedgerSpecialComponent]
    });
    fixture = TestBed.createComponent(SupplierLedgerSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
