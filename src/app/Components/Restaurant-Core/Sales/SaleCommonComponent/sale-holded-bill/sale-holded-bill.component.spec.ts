import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleHoldedBillComponent } from './sale-holded-bill.component';

describe('SaleHoldedBillComponent', () => {
  let component: SaleHoldedBillComponent;
  let fixture: ComponentFixture<SaleHoldedBillComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SaleHoldedBillComponent]
    });
    fixture = TestBed.createComponent(SaleHoldedBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
