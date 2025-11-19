import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSummaryCategorywiseComponent } from './purchase-summary-categorywise.component';

describe('PurchaseSummaryCategorywiseComponent', () => {
  let component: PurchaseSummaryCategorywiseComponent;
  let fixture: ComponentFixture<PurchaseSummaryCategorywiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PurchaseSummaryCategorywiseComponent]
    });
    fixture = TestBed.createComponent(PurchaseSummaryCategorywiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
