import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdjBillPrintComponent } from './adj-bill-print.component';

describe('AdjBillPrintComponent', () => {
  let component: AdjBillPrintComponent;
  let fixture: ComponentFixture<AdjBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdjBillPrintComponent]
    });
    fixture = TestBed.createComponent(AdjBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
