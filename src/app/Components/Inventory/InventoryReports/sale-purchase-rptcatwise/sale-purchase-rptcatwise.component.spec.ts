import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePurchaseRptcatwiseComponent } from './sale-purchase-rptcatwise.component';

describe('SalePurchaseRptcatwiseComponent', () => {
  let component: SalePurchaseRptcatwiseComponent;
  let fixture: ComponentFixture<SalePurchaseRptcatwiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalePurchaseRptcatwiseComponent]
    });
    fixture = TestBed.createComponent(SalePurchaseRptcatwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
