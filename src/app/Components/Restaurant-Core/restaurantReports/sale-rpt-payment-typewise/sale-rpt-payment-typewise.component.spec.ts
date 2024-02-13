import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleRptPaymentTypewiseComponent } from './sale-rpt-payment-typewise.component';

describe('SaleRptPaymentTypewiseComponent', () => {
  let component: SaleRptPaymentTypewiseComponent;
  let fixture: ComponentFixture<SaleRptPaymentTypewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleRptPaymentTypewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleRptPaymentTypewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
