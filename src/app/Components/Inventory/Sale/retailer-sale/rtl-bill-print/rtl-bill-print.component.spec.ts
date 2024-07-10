import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RtlBillPrintComponent } from './rtl-bill-print.component';

describe('RtlBillPrintComponent', () => {
  let component: RtlBillPrintComponent;
  let fixture: ComponentFixture<RtlBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RtlBillPrintComponent]
    });
    fixture = TestBed.createComponent(RtlBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
