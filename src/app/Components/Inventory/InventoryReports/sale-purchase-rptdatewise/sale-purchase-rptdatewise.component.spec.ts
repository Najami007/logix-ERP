import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePurchaseRptdatewiseComponent } from './sale-purchase-rptdatewise.component';

describe('SalePurchaseRptdatewiseComponent', () => {
  let component: SalePurchaseRptdatewiseComponent;
  let fixture: ComponentFixture<SalePurchaseRptdatewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalePurchaseRptdatewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePurchaseRptdatewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
