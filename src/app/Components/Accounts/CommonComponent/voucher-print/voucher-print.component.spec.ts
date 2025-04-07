import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoucherPrintComponent } from './voucher-print.component';

describe('VoucherPrintComponent', () => {
  let component: VoucherPrintComponent;
  let fixture: ComponentFixture<VoucherPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VoucherPrintComponent]
    });
    fixture = TestBed.createComponent(VoucherPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
