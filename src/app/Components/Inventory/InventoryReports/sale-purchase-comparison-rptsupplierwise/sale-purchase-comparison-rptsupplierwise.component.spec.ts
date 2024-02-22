import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalePurchaseComparisonRptsupplierwiseComponent } from './sale-purchase-comparison-rptsupplierwise.component';

describe('SalePurchaseComparisonRptsupplierwiseComponent', () => {
  let component: SalePurchaseComparisonRptsupplierwiseComponent;
  let fixture: ComponentFixture<SalePurchaseComparisonRptsupplierwiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalePurchaseComparisonRptsupplierwiseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalePurchaseComparisonRptsupplierwiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
