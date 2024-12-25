import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseBillPrintComponent } from './purchase-bill-print.component';

describe('PurchaseBillPrintComponent', () => {
  let component: PurchaseBillPrintComponent;
  let fixture: ComponentFixture<PurchaseBillPrintComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseBillPrintComponent]
    });
    fixture = TestBed.createComponent(PurchaseBillPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
