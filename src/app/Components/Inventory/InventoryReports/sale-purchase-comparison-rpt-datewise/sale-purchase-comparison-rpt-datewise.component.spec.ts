import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePurchaseComparisonRptDatewiseComponent } from './sale-purchase-comparison-rpt-datewise.component';

describe('SalePurchaseComparisonRptDatewiseComponent', () => {
  let component: SalePurchaseComparisonRptDatewiseComponent;
  let fixture: ComponentFixture<SalePurchaseComparisonRptDatewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalePurchaseComparisonRptDatewiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePurchaseComparisonRptDatewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
